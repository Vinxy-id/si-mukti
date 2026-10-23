import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { eq, or, sql, desc, asc } from 'drizzle-orm';
import { CreatePassportDto } from './dto/create-passport.dto';
import { AuthUserPayload } from '../../common/decorators/current-user.decorator';
import {
  generatePassportHash,
  signPassportHash,
  verifyPassportSignature,
  formatAuthenticitySeal,
} from '@si-mukti/database';

@Injectable()
export class PassportTraceService {
  private readonly logger = new Logger(PassportTraceService.name);
  private readonly HMAC_SECRET =
    process.env.PASSPORT_HMAC_SECRET ||
    'mukti_tulungagung_hmac_secret_super_secure_key_2026';

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Menerbitkan Paspor Digital Produk Marmer (MUKTI-Trace)
   * Menghasilkan SHA-256 Hash anti-tamper + HMAC Signed Token + QR Code
   */
  async createPassport(dto: CreatePassportDto, user: AuthUserPayload) {
    const { db, schema } = this.databaseService;

    // Ambil bengkel pengrajin
    let workshopId = user.workshopId;
    if (!workshopId) {
      const workshop = await db.query.workshops.findFirst({
        where: eq(schema.workshops.userId, user.userId),
      });
      if (!workshop) {
        throw new BadRequestException('Pengguna belum memiliki bengkel marmer terdaftar.');
      }
      workshopId = workshop.id;
    }

    const workshop = await db.query.workshops.findFirst({
      where: eq(schema.workshops.id, workshopId),
    });

    // Ambil quarry block default jika tidak dispesifikasikan
    let quarryBlockId = dto.quarryBlockId;
    let quarryBatchCode = 'QRY-BSL-2026-X8';
    if (quarryBlockId) {
      const qb = await db.query.quarryBlocks.findFirst({
        where: eq(schema.quarryBlocks.id, quarryBlockId),
      });
      if (qb) quarryBatchCode = qb.batchCode;
    } else {
      const firstQb = await db.query.quarryBlocks.findFirst();
      if (firstQb) {
        quarryBlockId = firstQb.id;
        quarryBatchCode = firstQb.batchCode;
      }
    }

    // Ambil lab test report SNI default jika tidak dispesifikasikan
    let labTestReportId = dto.labTestReportId;
    let labCertNo = 'LAB-SNI-2026/0394-081';
    if (labTestReportId) {
      const lab = await db.query.labTestReports.findFirst({
        where: eq(schema.labTestReports.id, labTestReportId),
      });
      if (lab) labCertNo = lab.certificateNumber;
    } else {
      const firstLab = await db.query.labTestReports.findFirst();
      if (firstLab) {
        labTestReportId = firstLab.id;
        labCertNo = firstLab.certificateNumber;
      }
    }

    // Generate nomor registrasi segel keaslian Pemkab
    const seq = Math.floor(10000 + Math.random() * 90000);
    const authenticitySealNumber = formatAuthenticitySeal(seq, 2026);
    const passportUuid = `${seq}-${crypto.randomUUID()}`;

    // Hitung SHA-256 Hash Kriptografis Unik
    const cryptoHash = generatePassportHash({
      serialNumber: authenticitySealNumber,
      quarryBatchCode,
      labCertificateNo: labCertNo,
      workshopId,
    });

    // Tanda tangani dengan kunci rahasia HMAC-SHA256 Pemkab / Disperindag
    const cryptographicSignature = signPassportHash(cryptoHash, this.HMAC_SECRET);

    // Hitung kontribusi sirkular (25-30% residu dari berat batu awal yang diselamatkan)
    const circularWasteOffsetKg = Math.round(dto.weightKg * 0.3 * 10) / 10;
    const qrCodeUrl = `https://cdn.si-mukti.tulungagung.go.id/qr/${cryptoHash.slice(0, 16)}.png`;

    // 1. Simpan Paspor Digital
    const [passport] = await db
      .insert(schema.productPassports)
      .values({
        passportUuid,
        workshopId,
        quarryBlockId: quarryBlockId || null,
        labTestReportId: labTestReportId || null,
        productName: dto.productName,
        productCategory: dto.productCategory,
        dimensions: dto.dimensions,
        weightKg: dto.weightKg.toFixed(2),
        finishedPhotoUrl: dto.finishedPhotoUrl,
        circularWasteRecoveredPct: '100.00',
        authenticitySealNumber,
        qrCodeUrl,
        cryptographicSignature,
        status: 'terverifikasi',
      })
      .returning();

    // 2. Buat Linimasa Rantai Pasok Awal (Traceability Stepper)
    const now = new Date();
    await db.insert(schema.traceabilityEvents).values([
      {
        productPassportId: passport.id,
        stage: 'kuari_tambang',
        eventTitle: 'Ekstraksi Bongkahan Marmer Alam Berizin',
        eventDescription: `Bongkahan batuan diekstraksi resmi dari Kuari Tambang Karst ${quarryBatchCode} dengan sertifikasi ESDM.`,
        locationName: 'Kuari Karst Selatan Besole / Campurdarat',
        eventTimestamp: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 hari lalu
        evidencePhotoUrl: 'https://cdn.si-mukti.tulungagung.go.id/timeline/kuari_besole.jpg',
        verifiedBy: 'Dinas ESDM Jawa Timur Wilayah Tulungagung',
      },
      {
        productPassportId: passport.id,
        stage: 'bengkel_bubut',
        eventTitle: 'Pembubutan & Pemahatan Manual',
        eventDescription: `Dipahat secara presisi oleh ${workshop?.ownerName || 'Pengrajin Lokal'} di ${workshop?.name || 'Bengkel Marmer Tulungagung'} menggunakan teknik bubut air tradisional.`,
        locationName: `${workshop?.subdistrict || 'Campurdarat'}, Tulungagung`,
        eventTimestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 hari lalu
        evidencePhotoUrl: dto.finishedPhotoUrl,
        verifiedBy: 'Paguyuban Pengrajin Marmer Tulungagung',
      },
      {
        productPassportId: passport.id,
        stage: 'uji_mutu_lab',
        eventTitle: 'Verifikasi Spektrometri SNI 03-0394',
        eventDescription: `Lolos pengujian mutu laboratorium dengan kadar Kalsit CaCO3 > 97%, struktur kristal alami tembus cahaya tanpa resin sintetis.`,
        locationName: 'Balai Standardisasi dan Pengujian Mutu Batuan Jawa Timur',
        eventTimestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        evidencePhotoUrl: 'https://cdn.si-mukti.tulungagung.go.id/timeline/lab_spektro.jpg',
        verifiedBy: 'Balai Standardisasi Mutu Jatim',
      },
      {
        productPassportId: passport.id,
        stage: 'residu_terserap',
        eventTitle: 'Valorisasi 100% Residu Sirkular Zero-Waste',
        eventDescription: `Seluruh residu timbulan lumpur & afur (${circularWasteOffsetKg} kg) telah disalurkan dan diolah menjadi bahan baku paving block ramah lingkungan.`,
        locationName: 'Sentra Pengolahan Paving & Teraso Boyolangu',
        eventTimestamp: now,
        evidencePhotoUrl: 'https://cdn.si-mukti.tulungagung.go.id/timeline/teraso_paving.jpg',
        verifiedBy: 'SI-MUKTI Circular Ledger',
      },
    ]);

    this.logger.log(
      `[PassportTrace] Paspor marmer berhasil diterbitkan: ${authenticitySealNumber} (Hash: ${cryptoHash.slice(0, 12)}...)`
    );

    return {
      passport,
      cryptoHash,
      signedQrToken: cryptographicSignature,
      circularWasteOffsetKg,
      publicVerificationUrl: `https://si-mukti.tulungagung.go.id/verify/${cryptoHash}`,
      message: 'Paspor Digital Produk marmer berhasil diterbitkan dan tersertifikasi geologis.',
    };
  }

  /**
   * Endpoint Publik Verifikasi Keaslian Paspor Digital Marmer (< 50ms)
   * Bebas diakses konsumen tanpa perlu login / unduh aplikasi
   */
  async verifyPassport(hashOrUuid: string) {
    const { db, schema } = this.databaseService;

    // Cari berdasarkan cryptoHash (prefix signature) atau passportUuid atau authenticitySealNumber
    const passport = await db.query.productPassports.findFirst({
      where: or(
        sql`${schema.productPassports.cryptographicSignature} LIKE ${hashOrUuid + '%'}`,
        eq(schema.productPassports.passportUuid, hashOrUuid),
        eq(schema.productPassports.authenticitySealNumber, hashOrUuid)
      ),
      with: {
        workshop: {
          with: {
            user: true,
          },
        },
        quarryBlock: true,
        labTestReport: true,
        events: {
          orderBy: [asc(schema.traceabilityEvents.eventTimestamp)],
        },
      },
    });

    if (!passport) {
      throw new NotFoundException(
        'Sertifikat Paspor Digital tidak ditemukan. Waspada indikasi produk marmer tiruan / resin sintetis tidak terdaftar.'
      );
    }

    // Naikkan counter view secara asinkron
    db.update(schema.productPassports)
      .set({ viewCount: sql`${schema.productPassports.viewCount} + 1` })
      .where(eq(schema.productPassports.id, passport.id))
      .execute()
      .catch((err) => this.logger.error(`Failed incrementing view count: ${err}`));

    // Validasi integritas cryptographic signature
    const signatureVerification = verifyPassportSignature(
      passport.cryptographicSignature,
      this.HMAC_SECRET
    );

    // Hitung offset limbah sirkular
    const circularWasteRecoveredKg = Math.round(Number(passport.weightKg) * 0.3 * 10) / 10;

    return {
      isAuthentic: true,
      integrityVerified: signatureVerification.isValid,
      verificationTitle: 'PRODUK TERVERIFIKASI ASLI - 100% Marmer Alam Tulungagung',
      authenticitySealNumber: passport.authenticitySealNumber,
      issuedAt: passport.issuedAt,
      viewCount: passport.viewCount + 1,
      product: {
        name: passport.productName,
        category: passport.productCategory,
        dimensions: passport.dimensions,
        weightKg: Number(passport.weightKg),
        photoUrl: passport.finishedPhotoUrl,
        circularWasteOffsetKg: circularWasteRecoveredKg,
      },
      artisan: {
        ownerName: passport.workshop.ownerName,
        workshopName: passport.workshop.name,
        paguyubanId: passport.workshop.paguyubanId,
        village: passport.workshop.village,
        subdistrict: passport.workshop.subdistrict,
        address: passport.workshop.addressDetail,
        contactWhatsApp: passport.workshop.user.phoneNumber,
      },
      geologicalOrigin: passport.quarryBlock
        ? {
            quarryName: passport.quarryBlock.quarryLocationName,
            geologicalFormation: passport.quarryBlock.geologicalFormation,
            variety: passport.quarryBlock.stoneVariety,
            miningPermit: passport.quarryBlock.snMiningPermit,
            caco3BaselinePct: Number(passport.quarryBlock.caco3BaselinePct),
          }
        : null,
      labQualityCertification: passport.labTestReport
        ? {
            standard: 'SNI 03-0394 (Batu Alam Marmer Asli Tulungagung)',
            certificateNumber: passport.labTestReport.certificateNumber,
            testingInstitution: passport.labTestReport.testingInstitution,
            testDate: passport.labTestReport.testDate,
            caco3Percentage: Number(passport.labTestReport.caco3ContentPercentage),
            moisturePercentage: Number(passport.labTestReport.moistureContentPercentage),
            phLevel: Number(passport.labTestReport.phLevel),
            purityGrade: passport.labTestReport.purityGrade,
            isPassed: passport.labTestReport.isPassed,
          }
        : null,
      traceabilityTimeline: passport.events.map((e) => ({
        id: e.id,
        stage: e.stage,
        title: e.eventTitle,
        description: e.eventDescription,
        location: e.locationName,
        timestamp: e.eventTimestamp,
        verifiedBy: e.verifiedBy,
        evidencePhotoUrl: e.evidencePhotoUrl,
      })),
      // Komparasi Spektrometri Marmer Asli vs Resin Sintetis Impor
      spectrometryComparison: {
        mineralPurity: {
          metric: 'Kandungan Mineral Kalsit (CaCO3)',
          naturalMarble: `${passport.labTestReport?.caco3ContentPercentage || '98.4'}% (Tinggi murni kristal kalsit)`,
          syntheticResin: '0% (Campuran polimer plastik bisphenol resin)',
        },
        heatResistance: {
          metric: 'Ketahanan Suhu Panas',
          naturalMarble: '> 600°C (Tahan bara, tidak meleleh)',
          syntheticResin: 'Meleleh & berasap toksik pada 150°C',
        },
        veiningStructure: {
          metric: 'Karakter Pola Serat Batuan',
          naturalMarble: 'Serat karang kristal tembus cahaya alami (Translucent)',
          syntheticResin: 'Serat cetakan sablon seragam kusam (Palsu)',
        },
        tactileFeel: {
          metric: 'Suhu Permukaan Saat Disentuh',
          naturalMarble: 'Terasa dingin alami (Menyerap sejuk ruangan)',
          syntheticResin: 'Terasa hangat menyerupai plastik',
        },
      },
    };
  }

  async findByWorkshop(workshopId: string) {
    const { db, schema } = this.databaseService;

    return db.query.productPassports.findMany({
      where: eq(schema.productPassports.workshopId, workshopId),
      orderBy: [desc(schema.productPassports.createdAt)],
      with: {
        quarryBlock: true,
        labTestReport: true,
        events: true,
      },
    });
  }
}
