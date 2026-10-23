import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { eq, inArray, desc } from 'drizzle-orm';
import { DispatchOrderDto } from './dto/dispatch-order.dto';
import { CompleteStopDto } from './dto/complete-stop.dto';
import { AuthUserPayload } from '../../common/decorators/current-user.decorator';

@Injectable()
export class LogisticsService {
  private readonly logger = new Logger(LogisticsService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Buat penugasan penjemputan armada dump truck multi-stop
   */
  async dispatchOrder(dto: DispatchOrderDto, user: AuthUserPayload) {
    const { db, schema } = this.databaseService;

    // Ambil offtakerId
    let offtakerId = user.offtakerId;
    if (!offtakerId) {
      const offtaker = await db.query.offtakers.findFirst({
        where: eq(schema.offtakers.userId, user.userId),
      });
      offtakerId = offtaker?.id || null;
    }

    if (!offtakerId) {
      // Fallback jika ditugaskan oleh admin Pemkab/Disperindag
      const firstOfftaker = await db.query.offtakers.findFirst();
      if (!firstOfftaker) {
        throw new BadRequestException('Fasilitas offtaker tidak ditemukan dalam sistem.');
      }
      offtakerId = firstOfftaker.id;
    }

    // Ambil data kendaraan
    const vehicle = await db.query.vehicles.findFirst({
      where: eq(schema.vehicles.id, dto.vehicleId),
    });

    if (!vehicle) {
      throw new NotFoundException(`Kendaraan ID ${dto.vehicleId} tidak ditemukan.`);
    }

    // Validasi & hitung total tonase yang akan dijemput
    const wasteItems = await db.query.wasteLogs.findMany({
      where: inArray(schema.wasteLogs.id, dto.wasteLogIds),
    });

    if (wasteItems.length !== dto.wasteLogIds.length) {
      throw new BadRequestException('Satu atau lebih residu limbah yang dipilih tidak valid.');
    }

    const totalTargetTonnage = wasteItems.reduce(
      (sum, item) => sum + Number(item.estimatedTonnage),
      0
    );

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(100 + Math.random() * 900);
    const orderCode = `TRK-${dateStr}-${randSuffix}`;
    const eManifestNumber = `MNF-TA-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Simpan order penjemputan
    const [order] = await db
      .insert(schema.pickupOrders)
      .values({
        orderCode,
        offtakerId,
        vehicleId: dto.vehicleId,
        scheduledPickupDate: new Date(dto.scheduledPickupDate),
        status: 'dalam_perjalanan',
        totalTargetTonnage: totalTargetTonnage.toFixed(2),
        totalRealizedTonnage: '0.00',
        eManifestNumber,
      })
      .returning();

    // 2. Buat titik-titik singgah (Stops) berurutan
    const stopValues = dto.wasteLogIds.map((wasteLogId, index) => ({
      pickupOrderId: order.id,
      wasteLogId,
      stopSequence: index + 1,
      status: index === 0 ? 'tiba' : 'menunggu',
    }));

    await db.insert(schema.pickupStops).values(stopValues);

    // 3. Perbarui status residu limbah menjadi 'dijadwalkan'
    await db
      .update(schema.wasteLogs)
      .set({ status: 'dijadwalkan', updatedAt: new Date() })
      .where(inArray(schema.wasteLogs.id, dto.wasteLogIds));

    this.logger.log(
      `[Logistics] Order penjemputan berhasil dibuat: ${orderCode} (${dto.wasteLogIds.length} stops, ${totalTargetTonnage.toFixed(2)} Ton)`
    );

    return {
      order,
      totalStops: dto.wasteLogIds.length,
      eManifestNumber,
      message: 'Armada penjemput berhasil ditugaskan dan surat e-Manifest telah diterbitkan.',
    };
  }

  /**
   * Selesaikan timbang muat pada satu titik stop
   * OTOMATIS MEMICU MUKTI-PAY UNTUK MENGKREDIT SALDO PENGRAJIN (BOBOT X TARIF)
   */
  async completeStop(stopId: string, dto: CompleteStopDto) {
    const { db, schema } = this.databaseService;

    // 1. Ambil data stop beserta relasi order, wasteLog, workshop, dan vehicle
    const stop = await db.query.pickupStops.findFirst({
      where: eq(schema.pickupStops.id, stopId),
      with: {
        pickupOrder: {
          with: {
            vehicle: true,
          },
        },
        wasteLog: {
          with: {
            workshop: {
              with: {
                wallet: true,
              },
            },
          },
        },
      },
    });

    if (!stop) {
      throw new NotFoundException(`Titik stop ID ${stopId} tidak ditemukan.`);
    }

    if (stop.status === 'selesai_muat') {
      throw new BadRequestException('Titik stop ini telah diselesaikan sebelumnya.');
    }

    const wasteLog = stop.wasteLog;
    const workshop = wasteLog.workshop;
    const now = new Date();

    const actualWeightTon = dto.measuredWeightKg / 1000.0;
    const ratePerTon = Number(wasteLog.ratePerTon) || 150000;
    const creditAmount = Math.round(actualWeightTon * ratePerTon);

    // 2. Perbarui status pickup stop
    await db
      .update(schema.pickupStops)
      .set({
        status: 'selesai_muat',
        measuredWeightKg: dto.measuredWeightKg.toFixed(2),
        weighedAt: now,
        arrivedAt: stop.arrivedAt || now,
        weighingSlipPhotoUrl: dto.weighingSlipPhotoUrl || null,
        driverNotes: dto.driverNotes || null,
      })
      .where(eq(schema.pickupStops.id, stopId));

    // 3. Perbarui status waste log menjadi 'terangkut'
    await db
      .update(schema.wasteLogs)
      .set({
        status: 'terangkut',
        actualWeighedTonnage: actualWeightTon.toFixed(2),
        updatedAt: now,
      })
      .where(eq(schema.wasteLogs.id, wasteLog.id));

    // 4. OTOMATISASI MUKTI-PAY: Kreditkan Saldo ke Dompet Pengrajin
    let wallet = workshop.wallet;
    if (!wallet) {
      // Buat wallet jika belum ada
      const [newWallet] = await db
        .insert(schema.wallets)
        .values({
          workshopId: workshop.id,
          currentBalance: '0.00',
          totalEarned: '0.00',
          totalWithdrawn: '0.00',
          bankName: 'Bank Jatim',
          bankAccountNumber: '018' + Math.floor(1000000 + Math.random() * 9000000),
          bankAccountHolder: workshop.ownerName.toUpperCase(),
        })
        .returning();
      wallet = newWallet;
    }

    const balanceBefore = Number(wallet.currentBalance);
    const balanceAfter = balanceBefore + creditAmount;
    const newTotalEarned = Number(wallet.totalEarned) + creditAmount;

    // Perbarui saldo wallet
    await db
      .update(schema.wallets)
      .set({
        currentBalance: balanceAfter.toFixed(2),
        totalEarned: newTotalEarned.toFixed(2),
        updatedAt: now,
      })
      .where(eq(schema.wallets.id, wallet.id));

    // Catat mutasi di wallet_transactions
    const txCode = `TX-MKT-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const [transaction] = await db
      .insert(schema.walletTransactions)
      .values({
        walletId: wallet.id,
        referencePickupStopId: stop.id,
        transactionCode: txCode,
        transactionType: 'kredit_valorisasi',
        amount: creditAmount.toFixed(2),
        balanceBefore: balanceBefore.toFixed(2),
        balanceAfter: balanceAfter.toFixed(2),
        description: `Insentif valorisasi ${actualWeightTon.toFixed(2)} Ton ${wasteLog.wasteType.replace('_', ' ')} (${workshop.name})`,
      })
      .returning();

    // 5. Cek apakah seluruh stops pada order ini sudah selesai
    const allStops = await db.query.pickupStops.findMany({
      where: eq(schema.pickupStops.pickupOrderId, stop.pickupOrderId),
    });

    const isAllCompleted = allStops.every(
      (s) => s.id === stopId || s.status === 'selesai_muat'
    );

    if (isAllCompleted) {
      const totalRealizedTon = allStops.reduce((sum, s) => {
        const wt = s.id === stopId ? actualWeightTon : Number(s.measuredWeightKg || 0) / 1000.0;
        return sum + wt;
      }, 0);

      await db
        .update(schema.pickupOrders)
        .set({
          status: 'selesai',
          actualPickupDate: now,
          totalRealizedTonnage: totalRealizedTon.toFixed(2),
          updatedAt: now,
        })
        .where(eq(schema.pickupOrders.id, stop.pickupOrderId));
    }

    this.logger.log(
      `[Logistics -> MUKTI-Pay] Sukses kredit Rp ${creditAmount.toLocaleString('id-ID')} ke dompet bengkel ${workshop.name}`
    );

    return {
      message: 'Timbang muat selesai. Saldo insentif MUKTI-Pay otomatis dikreditkan ke pengrajin.',
      creditedAmountIdr: creditAmount,
      balanceAfterIdr: balanceAfter,
      actualWeightTon,
      transactionCode: txCode,
    };
  }

  async getOrders() {
    const { db, schema } = this.databaseService;

    return db.query.pickupOrders.findMany({
      orderBy: [desc(schema.pickupOrders.createdAt)],
      with: {
        offtaker: true,
        vehicle: true,
        stops: {
          with: {
            wasteLog: {
              with: {
                workshop: true,
              },
            },
          },
        },
      },
    });
  }

  async getOrderById(id: string) {
    const { db, schema } = this.databaseService;

    const order = await db.query.pickupOrders.findFirst({
      where: eq(schema.pickupOrders.id, id),
      with: {
        offtaker: true,
        vehicle: true,
        stops: {
          with: {
            wasteLog: {
              with: {
                workshop: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order penjemputan ID ${id} tidak ditemukan.`);
    }

    return order;
  }
}
