import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { eq, desc } from 'drizzle-orm';
import { CreateWasteLogDto } from './dto/create-waste-log.dto';
import { VolumetricAuditDto } from './dto/volumetric-audit.dto';
import { AuthUserPayload } from '../../common/decorators/current-user.decorator';

@Injectable()
export class WasteLogService {
  private readonly logger = new Logger(WasteLogService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Catat timbulan residu limbah baru dari bengkel pengrajin
   */
  async create(dto: CreateWasteLogDto, user: AuthUserPayload) {
    const { db, schema } = this.databaseService;

    // Pastikan user memiliki workshop
    let workshopId = user.workshopId;
    if (!workshopId) {
      const workshop = await db.query.workshops.findFirst({
        where: eq(schema.workshops.userId, user.userId),
      });

      if (!workshop) {
        throw new BadRequestException(
          'Akun Anda belum terdaftar memiliki bengkel marmer. Daftarkan profil bengkel terlebih dahulu.'
        );
      }
      workshopId = workshop.id;
    }

    // Tarif acuan resmi Disperindag Tulungagung
    // Sludge basah CaCO3 > 95%: Rp 150.000 / ton
    // Afur bongkahan kasar: Rp 120.000 / ton
    const ratePerTon = dto.wasteType === 'sludge_lumpur' ? 150000 : 120000;
    const totalValue = Math.round(dto.estimatedTonnage * ratePerTon);

    const [newLog] = await db
      .insert(schema.wasteLogs)
      .values({
        workshopId,
        wasteType: dto.wasteType,
        estimatedVolumeM3: dto.estimatedVolumeM3.toFixed(3),
        estimatedTonnage: dto.estimatedTonnage.toFixed(2),
        ratePerTon: ratePerTon.toFixed(2),
        totalValue: totalValue.toFixed(2),
        photoUrl: dto.photoUrl,
        aiConfidenceScore: '0.965',
        status: 'tersedia',
        latitude: dto.latitude.toFixed(8),
        longitude: dto.longitude.toFixed(8),
        geom: { lng: dto.longitude, lat: dto.latitude },
        notes: dto.notes || null,
      })
      .returning();

    this.logger.log(
      `[WasteLog] Residu baru tercatat: ID ${newLog.id} (${newLog.estimatedTonnage} Ton) di bengkel ${workshopId}`
    );

    return {
      wasteLog: newLog,
      message: 'Residu limbah berhasil dicatat dan siap dijadwalkan oleh armada offtaker.',
    };
  }

  /**
   * Mock AI Volumetric Calculation (Computer Vision Audit)
   * Menganalisis citra penampung limbah, mengestimasi volume m3 dan konversi tonase basah
   */
  async volumetricAudit(dto: VolumetricAuditDto) {
    const isSludge = dto.wasteType === 'sludge_lumpur';

    // Densitas bulk material batuan marmer Tulungagung:
    // - Sludge lumpur basah kalsit padat: ~1.62 - 1.65 ton/m3
    // - Afur bongkahan batu lepas berongga: ~1.50 - 1.58 ton/m3
    const bulkDensityTonM3 = isSludge ? 1.628 : 1.545;

    // Estimasi volume berbasis wadah (default bak 1.5m x 1.2m x 1.2m = ~2.15 m3)
    const baseVolumeM3 = isSludge ? 2.15 : 2.60;
    const jitter = (Math.sin(dto.photoUrl.length) * 0.15); // Variasi realistis
    const estimatedVolumeM3 = Math.max(0.5, Math.round((baseVolumeM3 + jitter) * 1000) / 1000);

    const estimatedTonnage = Math.round(estimatedVolumeM3 * bulkDensityTonM3 * 100) / 100;
    const ratePerTon = isSludge ? 150000 : 120000;
    const estimatedValueIdr = Math.round(estimatedTonnage * ratePerTon);

    // Mock bounding polygon untuk visualisasi deteksi AI pada kamera pengrajin
    const aiBoundingPolygon = {
      type: 'Polygon',
      coordinates: [
        [
          [120, 180],
          [520, 195],
          [580, 480],
          [80, 460],
          [120, 180],
        ],
      ],
      detectedContainer: dto.containerType || 'Bak Terpal Penampungan Endapan',
      surfaceAreaM2: (estimatedVolumeM3 / 0.8).toFixed(2),
      estimatedDepthMeters: 0.8,
    };

    return {
      wasteType: dto.wasteType,
      estimatedVolumeM3,
      estimatedTonnage,
      bulkDensityTonM3,
      aiConfidenceScore: 0.968,
      ratePerTonIdr: ratePerTon,
      estimatedValueIdr,
      aiBoundingPolygon,
      recommendation: isSludge
        ? 'Kandungan air diperkirakan ~16%. Memenuhi syarat penyerapan SNI pabrik paving.'
        : 'Fraksi ukuran batu 5-15 cm seragam. Ideal untuk agregat teraso cor.',
    };
  }

  async findByWorkshop(workshopId: string) {
    const { db, schema } = this.databaseService;

    return db.query.wasteLogs.findMany({
      where: eq(schema.wasteLogs.workshopId, workshopId),
      orderBy: [desc(schema.wasteLogs.createdAt)],
      with: {
        labTestReport: true,
      },
    });
  }

  async findOne(id: string) {
    const { db, schema } = this.databaseService;

    const log = await db.query.wasteLogs.findFirst({
      where: eq(schema.wasteLogs.id, id),
      with: {
        workshop: {
          with: {
            user: true,
          },
        },
        labTestReport: true,
      },
    });

    if (!log) {
      throw new NotFoundException(`Data residu limbah ID ${id} tidak ditemukan.`);
    }

    return log;
  }
}
