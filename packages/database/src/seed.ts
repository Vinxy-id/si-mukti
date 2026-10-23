import { getDb, closeDbPool } from './client';
import * as schema from './schema/index';
import { sql } from 'drizzle-orm';
import { generatePassportHash, signPassportHash } from './helpers/crypto';

const HMAC_SECRET = process.env.PASSPORT_HMAC_SECRET || 'mukti_tulungagung_hmac_secret_super_secure_key_2026';

export async function seedDatabase() {
  const db = getDb();
  console.log('🌱 [SI-MUKTI DB] Memulai proses seeding data riil Tulungagung...');

  // 1. Bersihkan tabel (urutan terbalik relasi / CASCADE)
  console.log('🧹 Membersihkan tabel lama...');
  await db.execute(sql`
    TRUNCATE TABLE 
      traceability_events,
      product_passports,
      quarry_blocks,
      payout_withdrawals,
      wallet_transactions,
      wallets,
      pickup_stops,
      pickup_orders,
      vehicles,
      lab_test_reports,
      waste_logs,
      offtakers,
      workshops,
      users,
      regional_environmental_metrics
    CASCADE;
  `);

  // 2. SEED USERS (Pentahelix)
  console.log('👤 Menanamkan pengguna Pentahelix...');
  const seededUsers = await db
    .insert(schema.users)
    .values([
      {
        id: '11111111-1111-1111-1111-111111111111',
        phoneNumber: '081234567801',
        fullName: 'Pak Supardi',
        role: 'pengrajin',
        status: 'active',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        phoneNumber: '081234567802',
        fullName: 'Pak Slamet Riyadi',
        role: 'pengrajin',
        status: 'active',
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        phoneNumber: '081234567803',
        fullName: 'Ibu Nurul Hidayati',
        role: 'pengrajin',
        status: 'active',
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        phoneNumber: '081298765401',
        fullName: 'Hendra Wijaya',
        role: 'offtaker',
        status: 'active',
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        phoneNumber: '081133445501',
        fullName: 'Ir. Bambang Sulistyo',
        role: 'regulator_pemkab',
        status: 'active',
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        phoneNumber: '081211223344',
        fullName: 'Dr. Aris Munandar, S.T., M.Sc.',
        role: 'laboratorium',
        status: 'active',
      },
      {
        id: '77777777-7777-7777-7777-777777777777',
        phoneNumber: '081355667788',
        fullName: 'Maya Arisanti, IAI',
        role: 'konsumen',
        status: 'active',
      },
    ])
    .returning();

  // 3. SEED WORKSHOPS
  console.log('🏛️ Menanamkan bengkel marmer rakyat Campurdarat & Besole...');
  await db.insert(schema.workshops).values([
    {
      id: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      userId: '11111111-1111-1111-1111-111111111111',
      name: 'Bengkel Marmer Al-Barokah',
      ownerName: 'Pak Supardi',
      paguyubanId: 'PGY-CD-001',
      subdistrict: 'Campurdarat',
      village: 'Desa Gamping',
      addressDetail: 'Jl. Raya Popoh No. 45, Sentra Bubut Karst',
      latitude: '-8.16330000',
      longitude: '111.85940000',
      geom: { lng: 111.8594, lat: -8.1633 },
      isVerified: true,
      activeWorkers: 4,
    },
    {
      id: 'a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      userId: '22222222-2222-2222-2222-222222222222',
      name: 'Bengkel Marmer & Granit Mulia',
      ownerName: 'Pak Slamet Riyadi',
      paguyubanId: 'PGY-BSL-014',
      subdistrict: 'Besole',
      village: 'Desa Besole',
      addressDetail: 'Jl. Pertambangan Marmer Besole Km 2',
      latitude: '-8.18820000',
      longitude: '111.87010000',
      geom: { lng: 111.8701, lat: -8.1882 },
      isVerified: true,
      activeWorkers: 6,
    },
    {
      id: 'a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      userId: '33333333-3333-3333-3333-333333333333',
      name: 'Kerajinan Onyx Indah Lestari',
      ownerName: 'Ibu Nurul Hidayati',
      paguyubanId: 'PGY-CD-028',
      subdistrict: 'Campurdarat',
      village: 'Desa Sawo',
      addressDetail: 'Dusun Krajan RT 02/RW 01',
      latitude: '-8.15500000',
      longitude: '111.86500000',
      geom: { lng: 111.865, lat: -8.155 },
      isVerified: true,
      activeWorkers: 3,
    },
  ]);

  // 4. SEED OFFTAKERS
  console.log('🏭 Menanamkan fasilitas industri offtaker...');
  await db.insert(schema.offtakers).values([
    {
      id: 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      userId: '44444444-4444-4444-4444-444444444444',
      companyName: 'PT Sentosa Teraso & Paving Tulungagung',
      picName: 'Hendra Wijaya',
      phone: '081298765401',
      subdistrict: 'Boyolangu',
      addressDetail: 'Kawasan Industri Tanggung Campurdarat Km 3',
      latitude: '-8.14020000',
      longitude: '111.87500000',
      geom: { lng: 111.875, lat: -8.1402 },
      absorptionCapacityMonthlyTon: '250.00',
      minCaco3Required: '95.00',
      maxMoistureAllowed: '18.00',
    },
    {
      id: 'b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      userId: null,
      companyName: 'CV Tulungagung Agro Kalsium Mandiri',
      picName: 'Bambang Irawan',
      phone: '081399887766',
      subdistrict: 'Besole',
      addressDetail: 'Jl. Lintas Selatan Koridor Popoh',
      latitude: '-8.19200000',
      longitude: '111.86200000',
      geom: { lng: 111.862, lat: -8.192 },
      absorptionCapacityMonthlyTon: '120.00',
      minCaco3Required: '92.00',
      maxMoistureAllowed: '25.00',
    },
  ]);

  // 5. SEED VEHICLES
  console.log('🚛 Menanamkan armada truk penjemput...');
  await db.insert(schema.vehicles).values([
    {
      id: 'c1111111-cccc-cccc-cccc-cccccccccccc',
      offtakerId: 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      plateNumber: 'AG 8492 UT',
      vehicleType: 'Dump Truck Colt Diesel FE 74 HD',
      tonnageCapacity: '6.50',
      driverName: 'Budi Santoso',
      driverPhone: '082143219876',
      isAvailable: true,
    },
    {
      id: 'c2222222-cccc-cccc-cccc-cccccccccccc',
      offtakerId: 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      plateNumber: 'AG 9012 UP',
      vehicleType: 'Dump Truck Isuzu Elf NMR 71',
      tonnageCapacity: '5.50',
      driverName: 'Eko Prasetyo',
      driverPhone: '082156781234',
      isAvailable: true,
    },
  ]);

  // 6. SEED WASTE LOGS
  console.log('📦 Menanamkan pencatatan residu limbah (sludge & afur)...');
  await db.insert(schema.wasteLogs).values([
    {
      id: 'd1111111-dddd-dddd-dddd-dddddddddddd',
      workshopId: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      wasteType: 'sludge_lumpur',
      estimatedVolumeM3: '2.150',
      estimatedTonnage: '3.50',
      ratePerTon: '150000.00',
      totalValue: '525000.00',
      photoUrl: 'https://cdn.si-mukti.tulungagung.go.id/evidence/sludge_barokah_01.jpg',
      aiConfidenceScore: '0.965',
      status: 'tersedia',
      latitude: '-8.16330000',
      longitude: '111.85940000',
      geom: { lng: 111.8594, lat: -8.1633 },
      notes: 'Sludge basah hasil pembubutan guci marmer putih, diendapkan 24 jam dalam bak terpal',
    },
    {
      id: 'd2222222-dddd-dddd-dddd-dddddddddddd',
      workshopId: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      wasteType: 'afur_kasar',
      estimatedVolumeM3: '2.600',
      estimatedTonnage: '4.20',
      ratePerTon: '120000.00',
      totalValue: '504000.00',
      photoUrl: 'https://cdn.si-mukti.tulungagung.go.id/evidence/afur_barokah_01.jpg',
      aiConfidenceScore: '0.940',
      status: 'tersedia',
      latitude: '-8.16330000',
      longitude: '111.85940000',
      geom: { lng: 111.8594, lat: -8.1633 },
      notes: 'Pecahan batu marmer slab trosobo ukuran 5-15 cm cocok untuk agregat teraso kasar',
    },
    {
      id: 'd3333333-dddd-dddd-dddd-dddddddddddd',
      workshopId: 'a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      wasteType: 'sludge_lumpur',
      estimatedVolumeM3: '3.200',
      estimatedTonnage: '5.20',
      ratePerTon: '150000.00',
      totalValue: '780000.00',
      photoUrl: 'https://cdn.si-mukti.tulungagung.go.id/evidence/sludge_mulia_01.jpg',
      aiConfidenceScore: '0.972',
      status: 'dijadwalkan',
      latitude: '-8.18820000',
      longitude: '111.87010000',
      geom: { lng: 111.8701, lat: -8.1882 },
      notes: 'Lumpur serbuk gergaji gangsaw marmer abu-abu',
    },
    {
      id: 'd4444444-dddd-dddd-dddd-dddddddddddd',
      workshopId: 'a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      wasteType: 'afur_kasar',
      estimatedVolumeM3: '1.800',
      estimatedTonnage: '2.80',
      actualWeighedTonnage: '2.85',
      ratePerTon: '160000.00',
      totalValue: '456000.00',
      photoUrl: 'https://cdn.si-mukti.tulungagung.go.id/evidence/afur_onyx_01.jpg',
      aiConfidenceScore: '0.981',
      status: 'terangkut',
      latitude: '-8.15500000',
      longitude: '111.86500000',
      geom: { lng: 111.865, lat: -8.155 },
      notes: 'Afur pecahan onyx tembus cahaya grade A',
    },
  ]);

  // 7. SEED LAB TEST REPORTS (SNI 03-0394)
  console.log('🔬 Menanamkan hasil sertifikasi laboratorium SNI 03-0394...');
  await db.insert(schema.labTestReports).values([
    {
      id: 'e1111111-eeee-eeee-eeee-eeeeeeeeeeee',
      workshopId: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      wasteLogId: 'd1111111-dddd-dddd-dddd-dddddddddddd',
      certificateNumber: 'LAB-SNI-2026/0394-081',
      testingInstitution: 'Balai Standardisasi dan Pengujian Mutu Batuan Jawa Timur',
      testDate: '2026-10-15',
      caco3ContentPercentage: '98.40',
      moistureContentPercentage: '14.20',
      phLevel: '8.10',
      purityGrade: 'Grade A Super Kalsit',
      spectrometryPdfUrl: 'https://cdn.si-mukti.tulungagung.go.id/certs/sni_081_barokah.pdf',
      isPassed: true,
    },
    {
      id: 'e2222222-eeee-eeee-eeee-eeeeeeeeeeee',
      workshopId: 'a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      wasteLogId: 'd3333333-dddd-dddd-dddd-dddddddddddd',
      certificateNumber: 'LAB-SNI-2026/0394-082',
      testingInstitution: 'Balai Standardisasi dan Pengujian Mutu Batuan Jawa Timur',
      testDate: '2026-10-18',
      caco3ContentPercentage: '97.60',
      moistureContentPercentage: '16.50',
      phLevel: '7.95',
      purityGrade: 'Grade A Kalsit Industri',
      spectrometryPdfUrl: 'https://cdn.si-mukti.tulungagung.go.id/certs/sni_082_mulia.pdf',
      isPassed: true,
    },
  ]);

  // 8. SEED WALLETS & TRANSACTIONS (MUKTI-Pay)
  console.log('💳 Menanamkan dompet MUKTI-Pay & mutasi Bank Jatim...');
  await db.insert(schema.wallets).values([
    {
      id: 'f1111111-ffff-ffff-ffff-ffffffffffff',
      workshopId: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      currentBalance: '1250000.00',
      totalEarned: '2750000.00',
      totalWithdrawn: '1500000.00',
      bankName: 'Bank Jatim Cabang Tulungagung',
      bankAccountNumber: '0182390123',
      bankAccountHolder: 'SUPARDI',
    },
    {
      id: 'f2222222-ffff-ffff-ffff-ffffffffffff',
      workshopId: 'a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      currentBalance: '850000.00',
      totalEarned: '1850000.00',
      totalWithdrawn: '1000000.00',
      bankName: 'Bank BRI Unit Campurdarat',
      bankAccountNumber: '654301009876532',
      bankAccountHolder: 'SLAMET RIYADI',
    },
    {
      id: 'f3333333-ffff-ffff-ffff-ffffffffffff',
      workshopId: 'a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      currentBalance: '456000.00',
      totalEarned: '456000.00',
      totalWithdrawn: '0.00',
      bankName: 'Bank Jatim Cabang Tulungagung',
      bankAccountNumber: '0189876543',
      bankAccountHolder: 'NURUL HIDAYATI',
    },
  ]);

  await db.insert(schema.walletTransactions).values([
    {
      id: 't1111111-tttt-tttt-tttt-tttttttttttt',
      walletId: 'f1111111-ffff-ffff-ffff-ffffffffffff',
      transactionCode: 'TX-MKT-20261010-0012',
      transactionType: 'kredit_valorisasi',
      amount: '450000.00',
      balanceBefore: '800000.00',
      balanceAfter: '1250000.00',
      description: 'Insentif valorisasi 3.0 ton sludge marmer Al-Barokah',
    },
    {
      id: 't2222222-tttt-tttt-tttt-tttttttttttt',
      walletId: 'f3333333-ffff-ffff-ffff-ffffffffffff',
      transactionCode: 'TX-MKT-20261021-0038',
      transactionType: 'kredit_valorisasi',
      amount: '456000.00',
      balanceBefore: '0.00',
      balanceAfter: '456000.00',
      description: 'Insentif penyaluran 2.85 ton afur onyx ke PT Sentosa Teraso',
    },
  ]);

  // 9. SEED QUARRY BLOCKS
  console.log('⛏️ Menanamkan blok tambang kuari marmer...');
  await db.insert(schema.quarryBlocks).values([
    {
      id: 'q1111111-qqqq-qqqq-qqqq-qqqqqqqqqqqq',
      batchCode: 'QRY-BSL-2026-X8',
      quarryLocationName: 'Kuari Marmer Selatan Besole Blok 4',
      geologicalFormation: 'Formasi Wonosari Karst Tulungagung',
      stoneVariety: 'Kalsit Onyx Tembus Cahaya / Java Cream',
      extractionDate: '2026-08-12',
      caco3BaselinePct: '98.70',
      snMiningPermit: '540/328/IUP-OP/ESDM-JTM/2024',
    },
    {
      id: 'q2222222-qqqq-qqqq-qqqq-qqqqqqqqqqqq',
      batchCode: 'QRY-CD-2026-A2',
      quarryLocationName: 'Kuari Gamping Campurdarat Sektor Barat',
      geologicalFormation: 'Formasi Karst Campurdarat Selatan',
      stoneVariety: 'Marmer Bintik Trosobo Natural',
      extractionDate: '2026-09-05',
      caco3BaselinePct: '97.90',
      snMiningPermit: '540/112/SIPB/ESDM-JTM/2025',
    },
  ]);

  // 10. SEED PRODUCT PASSPORTS & TRACEABILITY
  console.log('🛡️ Menanamkan Paspor Digital MUKTI-Trace & Segel Kriptografis...');
  const hash1 = generatePassportHash({
    serialNumber: 'REG-PEMKAB-TA/2026/09841',
    quarryBatchCode: 'QRY-BSL-2026-X8',
    labCertificateNo: 'LAB-SNI-2026/0394-081',
    workshopId: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  });
  const sig1 = signPassportHash(hash1, HMAC_SECRET);

  const hash2 = generatePassportHash({
    serialNumber: 'REG-PEMKAB-TA/2026/09842',
    quarryBatchCode: 'QRY-CD-2026-A2',
    labCertificateNo: 'LAB-SNI-2026/0394-081',
    workshopId: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  });
  const sig2 = signPassportHash(hash2, HMAC_SECRET);

  await db.insert(schema.productPassports).values([
    {
      id: 'p1111111-pppp-pppp-pppp-pppppppppppp',
      passportUuid: '09841-f8a4e32d-98bc-4122-8d99-7f32a00192ea',
      workshopId: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      quarryBlockId: 'q1111111-qqqq-qqqq-qqqq-qqqqqqqqqqqq',
      labTestReportId: 'e1111111-eeee-eeee-eeee-eeeeeeeeeeee',
      productName: 'Meja Bundar Solid Onyx Tulungagung',
      productCategory: 'Furniture & Dekorasi Interior',
      dimensions: 'D: 120cm x T: 75cm, Tebal Slab: 4cm',
      weightKg: '185.00',
      finishedPhotoUrl: 'https://cdn.si-mukti.tulungagung.go.id/products/meja_onyx_supardi.jpg',
      circularWasteRecoveredPct: '100.00',
      authenticitySealNumber: 'REG-PEMKAB-TA/2026/09841',
      qrCodeUrl: 'https://cdn.si-mukti.tulungagung.go.id/qr/qr_09841.png',
      cryptographicSignature: sig1,
      status: 'terverifikasi',
      viewCount: 142,
    },
    {
      id: 'p2222222-pppp-pppp-pppp-pppppppppppp',
      passportUuid: '09842-c12e87ab-43dd-4519-91aa-5b23d90211fc',
      workshopId: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      quarryBlockId: 'q2222222-qqqq-qqqq-qqqq-qqqqqqqqqqqq',
      labTestReportId: 'e1111111-eeee-eeee-eeee-eeeeeeeeeeee',
      productName: 'Wastafel Marmer Trosobo Natural Edge',
      productCategory: 'Sanitari & Perlengkapan Kamar Mandi',
      dimensions: 'P: 55cm x L: 45cm x T: 15cm',
      weightKg: '42.00',
      finishedPhotoUrl: 'https://cdn.si-mukti.tulungagung.go.id/products/wastafel_trosobo_01.jpg',
      circularWasteRecoveredPct: '100.00',
      authenticitySealNumber: 'REG-PEMKAB-TA/2026/09842',
      qrCodeUrl: 'https://cdn.si-mukti.tulungagung.go.id/qr/qr_09842.png',
      cryptographicSignature: sig2,
      status: 'aktif',
      viewCount: 67,
    },
  ]);

  // Traceability events for Passport 1 (Meja Onyx Pak Supardi)
  await db.insert(schema.traceabilityEvents).values([
    {
      id: 'v1111111-vvvv-vvvv-vvvv-vvvvvvvvvvvv',
      productPassportId: 'p1111111-pppp-pppp-pppp-pppppppppppp',
      stage: 'kuari_tambang',
      eventTitle: 'Ekstraksi Bongkahan Marmer Asli',
      eventDescription: 'Bongkahan batuan kalsit diekstraksi dari Kuari Marmer Besole Blok 4 berizin resmi ESDM Jatim.',
      locationName: 'Kuari Selatan Besole, Tulungagung',
      eventTimestamp: new Date('2026-08-12T08:30:00+07:00'),
      evidencePhotoUrl: 'https://cdn.si-mukti.tulungagung.go.id/timeline/kuari_besole.jpg',
      verifiedBy: 'Inspektur ESDM Cabang Tulungagung',
    },
    {
      id: 'v2222222-vvvv-vvvv-vvvv-vvvvvvvvvvvv',
      productPassportId: 'p1111111-pppp-pppp-pppp-pppppppppppp',
      stage: 'bengkel_bubut',
      eventTitle: 'Pembubutan & Pemahatan Kerajinan',
      eventDescription: 'Dikerjakan secara presisi oleh Pak Supardi (pengalaman 28 tahun) menggunakan mesin bubut air dingin.',
      locationName: 'Bengkel Al-Barokah, Campurdarat',
      eventTimestamp: new Date('2026-09-20T13:00:00+07:00'),
      evidencePhotoUrl: 'https://cdn.si-mukti.tulungagung.go.id/timeline/bubut_supardi.jpg',
      verifiedBy: 'Paguyuban Marmer Campurdarat',
    },
    {
      id: 'v3333333-vvvv-vvvv-vvvv-vvvvvvvvvvvv',
      productPassportId: 'p1111111-pppp-pppp-pppp-pppppppppppp',
      stage: 'uji_mutu_lab',
      eventTitle: 'Pengujian Spektrometri SNI 03-0394',
      eventDescription: 'Lolos uji spektrometri kemurnian kalsit CaCO3 98.40%, struktur kristal tembus pandang tanpa resin sintetis.',
      locationName: 'Balai Standardisasi Mutu Jatim',
      eventTimestamp: new Date('2026-10-15T11:00:00+07:00'),
      evidencePhotoUrl: 'https://cdn.si-mukti.tulungagung.go.id/timeline/lab_spektro.jpg',
      verifiedBy: 'Dr. Aris Munandar, S.T., M.Sc.',
    },
    {
      id: 'v4444444-vvvv-vvvv-vvvv-vvvvvvvvvvvv',
      productPassportId: 'p1111111-pppp-pppp-pppp-pppppppppppp',
      stage: 'residu_terserap',
      eventTitle: 'Valorisasi 100% Residu Sirkular',
      eventDescription: 'Seluruh residu lumpur pemotongan (3.5 ton) telah diserap oleh PT Sentosa Teraso menjadi produk paving ramah lingkungan.',
      locationName: 'Fasilitas Paving Boyolangu',
      eventTimestamp: new Date('2026-10-16T09:30:00+07:00'),
      evidencePhotoUrl: 'https://cdn.si-mukti.tulungagung.go.id/timeline/teraso_paving.jpg',
      verifiedBy: 'Manajer Operasional PT Sentosa',
    },
  ]);

  // 11. SEED PICKUP ORDERS & STOPS
  console.log('📍 Menanamkan pesanan penjemputan armada multi-stop...');
  await db.insert(schema.pickupOrders).values([
    {
      id: 'o1111111-oooo-oooo-oooo-oooooooooooo',
      orderCode: 'TRK-20261022-001',
      offtakerId: 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      vehicleId: 'c1111111-cccc-cccc-cccc-cccccccccccc',
      scheduledPickupDate: new Date('2026-10-22T08:00:00+07:00'),
      status: 'dalam_perjalanan',
      totalTargetTonnage: '6.00',
      totalRealizedTonnage: '2.85',
      totalDistanceKm: '12.40',
      co2EmissionSavedKg: '47.30',
      eManifestNumber: 'MNF-TA-20261022-0089',
    },
  ]);

  await db.insert(schema.pickupStops).values([
    {
      id: 's1111111-ssss-ssss-ssss-ssssssssssss',
      pickupOrderId: 'o1111111-oooo-oooo-oooo-oooooooooooo',
      wasteLogId: 'd4444444-dddd-dddd-dddd-dddddddddddd',
      stopSequence: 1,
      status: 'selesai_muat',
      arrivedAt: new Date('2026-10-22T09:15:00+07:00'),
      weighedAt: new Date('2026-10-22T09:40:00+07:00'),
      measuredWeightKg: '2850.00',
      weighingSlipPhotoUrl: 'https://cdn.si-mukti.tulungagung.go.id/slip/weigh_slip_0089_1.jpg',
      driverNotes: 'Muatan afur batu onyx kering, akses jalan lancar',
    },
    {
      id: 's2222222-ssss-ssss-ssss-ssssssssssss',
      pickupOrderId: 'o1111111-oooo-oooo-oooo-oooooooooooo',
      wasteLogId: 'd3333333-dddd-dddd-dddd-dddddddddddd',
      stopSequence: 2,
      status: 'menunggu',
      driverNotes: 'Target penjemputan kedua di Bengkel Mulia Besole',
    },
  ]);

  // 12. SEED REGIONAL METRICS
  console.log('📊 Menanamkan metrik lingkungan regional (Bab 7 PRD)...');
  await db.insert(schema.regionalEnvironmentalMetrics).values([
    {
      id: 'm1111111-mmmm-mmmm-mmmm-mmmmmmmmmmmm',
      periodMonth: '2026-10-01',
      subdistrict: 'Campurdarat',
      totalWasteGeneratedTons: '68.50',
      totalWasteAbsorbedTons: '62.00',
      riverDumpingPreventedTons: '62.00',
      carbonEmissionsReducedKg: '2368.40',
      economicSurplusGeneratedIdr: '15500000.00',
      activeParticipatingWorkshops: 31,
    },
    {
      id: 'm2222222-mmmm-mmmm-mmmm-mmmmmmmmmmmm',
      periodMonth: '2026-10-01',
      subdistrict: 'Besole',
      totalWasteGeneratedTons: '45.00',
      totalWasteAbsorbedTons: '41.50',
      riverDumpingPreventedTons: '41.50',
      carbonEmissionsReducedKg: '1585.30',
      economicSurplusGeneratedIdr: '10375000.00',
      activeParticipatingWorkshops: 22,
    },
  ]);

  console.log('✅ [SI-MUKTI DB] Seeding berhasil 100%! Seluruh entitas terisi dengan relasi valid.');
  await closeDbPool();
}

// Eksekusi jika dijalankan secara langsung via CLI
if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase().catch((err) => {
    console.error('❌ Gagal menjalankan seed:', err);
    process.exit(1);
  });
}
