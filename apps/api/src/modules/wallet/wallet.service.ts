import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { eq, desc } from 'drizzle-orm';
import { WithdrawDto } from './dto/withdraw.dto';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Ambil data dompet MUKTI-Pay pengrajin
   */
  async getWallet(workshopId: string) {
    const { db, schema } = this.databaseService;

    let wallet = await db.query.wallets.findFirst({
      where: eq(schema.wallets.workshopId, workshopId),
      with: {
        transactions: {
          orderBy: [desc(schema.walletTransactions.createdAt)],
          limit: 10,
        },
      },
    });

    if (!wallet) {
      // Buat dompet jika belum terdaftar
      const workshop = await db.query.workshops.findFirst({
        where: eq(schema.workshops.id, workshopId),
      });

      if (!workshop) {
        throw new NotFoundException(`Bengkel ID ${workshopId} tidak ditemukan.`);
      }

      const [newWallet] = await db
        .insert(schema.wallets)
        .values({
          workshopId,
          currentBalance: '0.00',
          totalEarned: '0.00',
          totalWithdrawn: '0.00',
          bankName: 'Bank Jatim',
          bankAccountNumber: '018' + Math.floor(1000000 + Math.random() * 9000000),
          bankAccountHolder: workshop.ownerName.toUpperCase(),
        })
        .returning();

      wallet = {
        ...newWallet,
        transactions: [],
      };
    }

    return wallet;
  }

  /**
   * Ajukan pencairan dana valorisasi ke rekening Bank Jatim / BRI
   */
  async requestWithdrawal(workshopId: string, dto: WithdrawDto) {
    const { db, schema } = this.databaseService;

    const wallet = await this.getWallet(workshopId);
    const currentBalance = Number(wallet.currentBalance);

    if (currentBalance < dto.amount) {
      throw new BadRequestException(
        `Saldo tidak mencukupi. Saldo aktif Anda saat ini: Rp ${currentBalance.toLocaleString('id-ID')}`
      );
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const payoutCode = `WD-MKT-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;

    const bankTarget = dto.bankTarget || wallet.bankName;
    const accountTarget = dto.accountTarget || wallet.bankAccountNumber;

    // 1. Buat catatan pengajuan pencairan (payout_withdrawals)
    const [payout] = await db
      .insert(schema.payoutWithdrawals)
      .values({
        walletId: wallet.id,
        payoutCode,
        amount: dto.amount.toFixed(2),
        bankTarget,
        accountTarget,
        status: 'pending',
      })
      .returning();

    // 2. Kurangi saldo dompet
    const balanceBefore = currentBalance;
    const balanceAfter = balanceBefore - dto.amount;
    const totalWithdrawn = Number(wallet.totalWithdrawn) + dto.amount;

    await db
      .update(schema.wallets)
      .set({
        currentBalance: balanceAfter.toFixed(2),
        totalWithdrawn: totalWithdrawn.toFixed(2),
        updatedAt: now,
      })
      .where(eq(schema.wallets.id, wallet.id));

    // 3. Catat di mutasi transaksi
    const txCode = `TX-WD-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;
    await db.insert(schema.walletTransactions).values({
      walletId: wallet.id,
      transactionCode: txCode,
      transactionType: 'penarikan_dana',
      amount: dto.amount.toFixed(2),
      balanceBefore: balanceBefore.toFixed(2),
      balanceAfter: balanceAfter.toFixed(2),
      description: `Pencairan dana MUKTI-Pay ke rekening ${bankTarget} (${accountTarget})`,
    });

    this.logger.log(
      `[MUKTI-Pay] Pengajuan pencairan dana Rp ${dto.amount.toLocaleString('id-ID')} ke ${bankTarget} (${accountTarget})`
    );

    return {
      payout,
      remainingBalanceIdr: balanceAfter,
      message: `Pengajuan pencairan dana Rp ${dto.amount.toLocaleString('id-ID')} berhasil diproses ke rekening ${bankTarget}.`,
    };
  }

  /**
   * Ambil seluruh riwayat transaksi mutasi buku besar
   */
  async getTransactions(workshopId: string) {
    const { db, schema } = this.databaseService;

    const wallet = await db.query.wallets.findFirst({
      where: eq(schema.wallets.workshopId, workshopId),
    });

    if (!wallet) {
      return [];
    }

    return db.query.walletTransactions.findMany({
      where: eq(schema.walletTransactions.walletId, wallet.id),
      orderBy: [desc(schema.walletTransactions.createdAt)],
    });
  }
}
