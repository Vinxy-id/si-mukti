import docx
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_COLOR_INDEX
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import os

def set_cell_border(cell, **kwargs):
    """
    Set cell borders
    kwargs: top, bottom, left, right
    values: dict(sz=12, val='single', color='000000')
    """
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(r'''
        <w:tcBorders {} >
            <w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:left w:val="none"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:right w:val="none"/>
        </w:tcBorders>
    '''.format(nsdecls('w')))
    tcPr.append(tcBorders)

def add_box_border(cell):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(r'''
        <w:tcBorders {} >
            <w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        </w:tcBorders>
    '''.format(nsdecls('w')))
    tcPr.append(tcBorders)

def build_paper(highlight=False, filename='MARBLECHAIN_KTI_LKTIN_UNIMED_2026_REVISI.docx'):
    doc = docx.Document()

    # Page Setup: A4, Margin Kiri 4cm, Kanan 3cm, Atas 3cm, Bawah 3cm
    section = doc.sections[0]
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(3.0)
    section.bottom_margin = Cm(3.0)
    section.left_margin = Cm(4.0)
    section.right_margin = Cm(3.0)

    # Base Style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(4)
    normal_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    def p(text="", align=WD_ALIGN_PARAGRAPH.JUSTIFY, bold=False, italic=False, space_before=0, space_after=4, hl=None):
        par = doc.add_paragraph()
        par.paragraph_format.alignment = align
        par.paragraph_format.line_spacing = 1.15
        par.paragraph_format.space_before = Pt(space_before)
        par.paragraph_format.space_after = Pt(space_after)
        if text:
            run = par.add_run(text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(12)
            run.bold = bold
            run.italic = italic
            if highlight and hl:
                run.font.highlight_color = hl
        return par

    # ==================== 1. COVER ====================
    p("[Logo Perguruan Tinggi]", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=20, space_after=30,
      hl=WD_COLOR_INDEX.YELLOW if highlight else None)
    
    p("KARYA TULIS ILMIAH", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=18)
    
    p("DIGITALISASI RANTAI PASOK MARMER TULUNGAGUNG:\nKETERTELUSURAN PRODUK DAN LIMBAH BERBASIS KODE QR\nUNTUK MEMPERKUAT IDENTITAS DAERAH",
      align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=24)
    
    p("SUBTEMA:\nDigitalisasi Ekonomi, UMKM, dan Pemberdayaan Daerah 3T untuk Ketahanan Ekonomi Nasional",
      align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=40)
    
    p("DIUSULKAN OLEH:", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=12)
    
    # Table for team members on cover
    t_cov = doc.add_table(rows=5, cols=2)
    t_cov.alignment = WD_TABLE_ALIGNMENT.CENTER
    members = [
        ("[Nama Lengkap Ketua Tim]", "[NIM]"),
        ("[Nama Lengkap Anggota 1]", "[NIM]"),
        ("[Nama Lengkap Anggota 2]", "[NIM]"),
        ("[Nama Lengkap Anggota 3 (jika ada)]", "[NIM]"),
        ("[Nama Lengkap Anggota 4 (jika ada)]", "[NIM]")
    ]
    for idx, (m_name, m_nim) in enumerate(members):
        r = t_cov.rows[idx]
        p1 = r.cells[0].paragraphs[0]
        p1.paragraph_format.line_spacing = 1.15
        p1.paragraph_format.space_after = Pt(2)
        rn1 = p1.add_run(m_name)
        rn1.font.name = 'Times New Roman'
        rn1.font.size = Pt(12)
        if highlight: rn1.font.highlight_color = WD_COLOR_INDEX.YELLOW
        
        p2 = r.cells[1].paragraphs[0]
        p2.paragraph_format.line_spacing = 1.15
        p2.paragraph_format.space_after = Pt(2)
        rn2 = p2.add_run(m_nim)
        rn2.font.name = 'Times New Roman'
        rn2.font.size = Pt(12)
        if highlight: rn2.font.highlight_color = WD_COLOR_INDEX.YELLOW

    p("[NAMA PERGURUAN TINGGI]\n[NAMA KOTA PERGURUAN TINGGI]\n2026",
      align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=50, space_after=0,
      hl=WD_COLOR_INDEX.YELLOW if highlight else None)

    # Page Break for Pengesahan
    doc.add_page_break()

    # ==================== 2. LEMBAR PENGESAHAN ====================
    p("PENGESAHAN KARYA TULIS ILMIAH", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=18)

    t_peng = doc.add_table(rows=7, cols=3)
    t_peng.alignment = WD_TABLE_ALIGNMENT.CENTER
    peng_data = [
        ("1.", "Judul Kegiatan", ": Digitalisasi Rantai Pasok Marmer Tulungagung: Ketertelusuran Produk dan Limbah Berbasis Kode QR untuk Memperkuat Identitas Daerah"),
        ("2.", "Bidang Kegiatan", ": Digitalisasi Ekonomi, UMKM, dan Pemberdayaan Daerah 3T untuk Ketahanan Ekonomi Nasional (DIGIEK-UMKM-3T)"),
        ("3.", "Ketua Pelaksana Kegiatan\na. Nama Lengkap\nb. NIM\nc. Jurusan/Program Studi\nd. Universitas\ne. Alamat Rumah dan No. Tel./HP\nf. Alamat email",
               ":\n: [Nama lengkap ketua]\n: [NIM]\n: [Program studi]\n: [Nama perguruan tinggi]\n: [Alamat dan nomor HP]\n: [Email]"),
        ("4.", "Jumlah Anggota Pelaksana", ": [..] orang"),
        ("5.", "Dosen Pembimbing\nNama Lengkap dan Gelar\nNIDN\nAlamat Rumah dan No. Tel./HP",
               ":\n: [Nama dan gelar]\n: [NIDN]\n: [Alamat dan nomor HP]"),
    ]
    row_idx = 0
    for item in peng_data:
        r = t_peng.rows[row_idx]
        r.cells[0].paragraphs[0].add_run(item[0]).font.name = 'Times New Roman'
        r.cells[1].paragraphs[0].add_run(item[1]).font.name = 'Times New Roman'
        r.cells[2].paragraphs[0].add_run(item[2]).font.name = 'Times New Roman'
        row_idx += 1

    p("", space_after=12)
    # Tanda tangan
    t_sig = doc.add_table(rows=2, cols=2)
    t_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_sig.rows[0].cells[0].paragraphs[0].add_run("Menyetujui,\nDosen Pembimbing LKTIN\n\n\n\n[Tanda tangan]\nNIDN. [NIDN]").font.name = 'Times New Roman'
    t_sig.rows[0].cells[1].paragraphs[0].add_run("[Kota], [tanggal bulan tahun]\nKetua Tim LKTIN\n\n\n\n[Tanda tangan]\nNIM. [NIM]").font.name = 'Times New Roman'

    p("Wakil Dekan Bidang Kemahasiswaan\n[Nama perguruan tinggi]\n\n\n\n[Tanda tangan dan nama]\nNIP. [NIP]",
      align=WD_ALIGN_PARAGRAPH.CENTER, space_before=18, space_after=0)

    # Page Break for Ringkasan
    doc.add_page_break()

    # ==================== 3. RINGKASAN ====================
    p("RINGKASAN", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=18)
    p("Tulungagung dikenal sebagai Kota Marmer, dan pengrajin marmer di Campurdarat menjadi salah satu UMKM andalannya. Kajian terdahulu menunjukkan pemasaran sebagai masalah utama usaha, sementara sekitar 30 persen bahan menjadi limbah yang belum dimanfaatkan optimal, padahal penelitian lain menunjukkan potensinya pada bahan bangunan dan produk dekorasi. Karya tulis ini mengusulkan MARBLECHAIN, prototipe sistem berbasis web yang menautkan pencatatan bahan baku, produksi, limbah, stok, dan pengiriman melalui identitas batch dan kode QR, serta mencocokkan limbah dengan calon pengguna. Pindai kode QR menampilkan riwayat batch bagi pemilik usaha dan halaman cerita produk bagi pembeli, sehingga asal-usul marmer Tulungagung dapat dikomunikasikan secara tepercaya, termasuk kepada pembeli di luar negeri. Gagasan dikembangkan melalui telaah pustaka, pemetaan proses bisnis, perancangan sistem, dan rencana validasi berupa uji fungsi, ketepatan pencatatan, waktu penelusuran, serta kemudahan penggunaan. Dugaan kendala di lapangan, termasuk pemanfaatan limbah dan praktik pemasaran, masih harus diverifikasi melalui wawancara dan observasi; karya ini tidak mengklaim hasil implementasi atau peningkatan efisiensi yang belum diuji.",
      space_after=12)
    
    par_kw = p()
    par_kw.add_run("Kata kunci: ").bold = True
    par_kw.add_run("rantai pasok, marmer, limbah, Tulungagung, kode QR, UMKM.")

    # Page Break for Daftar Isi
    doc.add_page_break()

    # ==================== 4. DAFTAR ISI ====================
    p("DAFTAR ISI", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=18)
    toc_items = [
        ("RINGKASAN", "ii"),
        ("DAFTAR ISI", "iii"),
        ("BAB 1 PENDAHULUAN", "1"),
        ("   1.1 Latar Belakang", "1"),
        ("   1.2 Gambaran Kondisi yang Diharapkan", "2"),
        ("   1.3 Rumusan Masalah", "2"),
        ("   1.4 Tujuan dan Manfaat", "2"),
        ("BAB 2 ISI GAGASAN", "3"),
        ("   2.1 Kondisi Terkini Permasalahan", "3"),
        ("   2.2 Solusi: Sistem MARBLECHAIN", "4"),
        ("   2.3 Pihak yang Dipertimbangkan dan Perannya", "7"),
        ("   2.4 Langkah Strategis Implementasi", "7"),
        ("BAB 3 PENUTUP", "8"),
        ("   3.1 Kesimpulan", "8"),
        ("   3.2 Saran", "8"),
        ("DAFTAR PUSTAKA", "8"),
        ("LAMPIRAN", "10")
    ]
    for title, pg in toc_items:
        ptoc = p()
        ptoc.paragraph_format.space_after = Pt(2)
        r_t = ptoc.add_run(title)
        if title.startswith("BAB") or title in ["RINGKASAN", "DAFTAR ISI", "DAFTAR PUSTAKA", "LAMPIRAN"]:
            r_t.bold = True
        ptoc.add_run(f" {'.....' * 10} {pg}")

    # Page Break for BAB 1
    doc.add_page_break()

    # ==================== BAB 1 PENDAHULUAN ====================
    p("BAB 1 PENDAHULUAN", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=6, space_after=12)
    p("1.1 Latar Belakang", bold=True, space_after=6)
    
    p("Disrupsi global mendorong generasi muda untuk merumuskan strategi inovatif melalui teknologi cerdas dan transformasi digital, termasuk bagi sektor yang menopang ekonomi daerah. UMKM berperan besar: sekitar 65,5 juta unit usaha menyumbang 61,9 persen produk domestik bruto dan menyerap lebih dari 119 juta tenaga kerja, sementara digitalisasi yang belum merata tetap menjadi tantangan (Antara, 2025, mengutip Kementerian UMKM dan BPS). Karena itu, digitalisasi yang realistis bagi UMKM adalah digitalisasi bertahap dengan perangkat yang terjangkau dan alur kerja yang ringkas, bukan penerapan sistem yang rumit sekaligus.")
    
    p("Tulungagung memiliki banyak UMKM, tercatat 129.173 usaha mikro pada 2021 (Wulandari dan Widhajati, 2021, mengutip Dinas Koperasi dan Usaha Mikro), dan salah satunya adalah pengrajin onyx dan marmer yang terpusat di Kecamatan Campurdarat (Suseno, 2022). Produknya beragam, mulai dari cenderamata hingga kursi ukir dan lantai marmer (Yunitasari, 2021). Kekuatan ini menjadikan Tulungagung dijuluki Kota Marmer, identitas yang oleh tim perencana dari Universitas Gadjah Mada didorong untuk diperkuat dalam penyusunan rancangan koridor kota (Universitas Gadjah Mada, 2026).")
    
    p("Namun, potensi tersebut belum dimanfaatkan sepenuhnya. Miranda dan Dwiputri (2021) melaporkan bahwa permintaan batu marmer turun 54 persen pada masa pandemi COVID-19 dan menempatkan pemasaran sebagai masalah utama pengembangan usaha, di samping bahan baku, teknologi, dan sumber daya manusia. Suseno (2022) menemukan pelaku usaha bertahan melalui modifikasi produk, pemasaran daring, dan perencanaan keuangan, sedangkan Yunitasari (2021) mencatat penjualan lewat showroom, media sosial, dan marketplace, sebagian hingga luar negeri tanpa data volume ekspor. Artinya pemasaran daring sudah dimulai, tetapi belum terlihat bukti bahwa informasi asal-usul dan proses produk dikelola secara sistematis untuk membangun citra marmer Tulungagung di pasar yang lebih luas.")
    
    p("Persoalan lain adalah limbah. Pengolahan marmer menghasilkan pecahan, menir, dan terutama serbuk; Prasetyo dan Nugraha (2024) memperkirakan sekitar 30 persen bahan menjadi limbah, dan menyatakan belum ada industri marmer di Tulungagung yang mengolahnya secara optimal menjadi produk bernilai tambah, meskipun sebagian serbuk sudah dijual sekitar Rp100.000 per bak pikap. Pembuangan yang tidak terkendali berisiko mencemari air dan merusak lahan (Prasetyo dan Nugraha, 2024). Di sisi lain, potensi limbah ini nyata: limbah marmer dapat menggantikan sebagian bahan pada bata beton yang memenuhi SNI mutu III (Aditya, Halim dan Silviana, 2016), dan campuran serbuk marmer dengan serbuk ubin sebesar 5 persen menaikkan kuat tekan beton sekitar 8,9 persen pada umur 28 hari (Bheel dkk., 2020). Pengamatan awal penulis juga menunjukkan limbah dipakai sebagai bahan perekat, misalnya pada batu nisan; hal ini akan dikonfirmasi di lapangan. Dalam kajian yang kami telaah, pencatatan limbah per batch bersama data bahan dan produksi belum dibahas. Kondisi pencatatan aktual di lapangan juga perlu diidentifikasi secara langsung sebelum sistem dirancang lebih jauh.")
    
    # Paragraf Rantai Pasok + JURNAL ACEH SELATAN
    p_sc = p()
    p_sc.add_run("Pada rantai pasok, informasi yang tersebar pada catatan terpisah berpotensi menyulitkan usaha menjawab pertanyaan dasar: batch bahan mana yang dipakai, pada tahap apa suatu pesanan, dan kapan produk dikirim. Kemampuan menjawab pertanyaan semacam itu disebut ketertelusuran, yaitu kemampuan mengidentifikasi asal dan perpindahan suatu produk atau batch (Olsen dan Borit, 2013). ")
    r_aceh = p_sc.add_run("Tantangan serupa juga terbukti secara empiris dalam studi Afdhal, Sastra dan Husni (2024) pada bengkel marmer Politeknik Aceh Selatan, di mana kelemahan rantai pasok pada tahap perencanaan (plan) dan pengadaan (source) serta ketiadaan kemitraan bahan baku dan pengemasan memicu lonjakan lead time hingga 15 bulan. ")
    if highlight: r_aceh.font.highlight_color = WD_COLOR_INDEX.BRIGHT_GREEN
    p_sc.add_run("Pendekatan inventori dan ketertelusuran berbasis web dengan kode QR juga telah dikaji pada UMKM lain (Handayani, Firmansyah dan Rusdianto, 2026), sehingga gagasan ini perlu diadaptasi, bukan disalin, ke karakteristik usaha marmer, termasuk pengelolaan limbah dan penceritaan asal-usul produk.")
    
    # Paragraf Solusi + PENEGASAN SUBTEMA 3
    p_sub = p()
    p_sub.add_run("Berdasarkan hal tersebut, karya ini mengusulkan MARBLECHAIN, sistem ketertelusuran rantai pasok marmer yang menghubungkan catatan stok, batch produksi, limbah, pesanan, dan distribusi. Kode QR berfungsi sebagai pintu masuk ke riwayat batch dan halaman cerita produk yang tersimpan dalam basis data, sehingga marmer Tulungagung dapat diperkenalkan dengan asal-usul yang jelas. ")
    r_sub = p_sub.add_run("Kaitannya dengan subtema difokuskan secara spesifik pada pilar digitalisasi UMKM dan penguatan ketahanan ekonomi daerah; penataan rantai pasok dan pemanfaatan limbah bernilai tambah (waste-to-value) ini ditujukan untuk meminimalkan kebocoran ekonomi lokal serta memperkuat daya saing komoditas marmer di pasar nasional maupun ekspor.")
    if highlight: r_sub.font.highlight_color = WD_COLOR_INDEX.YELLOW

    p("1.2 Gambaran Kondisi yang Diharapkan", bold=True, space_before=6, space_after=6)
    p("Kondisi ideal yang digagas ialah pelaku usaha marmer dapat menelusuri riwayat suatu batch dari penerimaan bahan hingga pengiriman melalui satu kali pemindaian kode QR. Stok bahan dan barang jadi tercatat teratur sehingga keputusan pemesanan bahan dan penjadwalan produksi lebih terinformasi. Informasi dibagikan sesuai peran: pelanggan melihat data produk yang layak dibagikan, sedangkan data pemasok dan biaya tetap internal. Limbah tercatat per batch sehingga peluang pemanfaatannya, misalnya sebagai bahan produk bernilai tambah, dapat dinilai. Pembeli, termasuk dari luar negeri, dapat melihat asal-usul produk sehingga marmer Tulungagung lebih dikenal sebagai identitas daerah. Dalam jangka panjang, catatan yang rapi menjadi dasar bagi pengrajin untuk bermitra dengan pembeli atau lembaga pendukung. Seluruh gambaran ini bersifat proyeksi dan baru dapat dinyatakan tercapai setelah diuji.")

    p("1.3 Rumusan Masalah", bold=True, space_before=6, space_after=6)
    p("1. Bagaimana merancang alur informasi rantai pasok marmer yang sesuai kebutuhan pelaku usaha di Tulungagung?\n2. Bagaimana mengintegrasikan data bahan baku, produksi, persediaan, limbah, dan pengiriman melalui identitas batch berbasis kode QR?\n3. Bagaimana informasi asal-usul produk dapat mendukung identitas dan pemasaran marmer Tulungagung?\n4. Bagaimana mengevaluasi kelayakan fungsi dan kemudahan penggunaan prototipe?")

    p("1.4 Tujuan dan Manfaat", bold=True, space_before=6, space_after=6)
    p("Tujuan gagasan ini ialah (1) merumuskan alur informasi dan kebutuhan data rantai pasok marmer, (2) merancang prototipe MARBLECHAIN yang menautkan bahan, produksi, limbah, dan distribusi melalui identitas batch serta mencocokkan limbah dengan calon pengguna, (3) merancang halaman cerita produk untuk memperkuat identitas marmer Tulungagung, dan (4) menyusun rencana evaluasi yang terukur. Manfaat yang diharapkan mencakup kemudahan penelusuran produk, keteraturan pencatatan termasuk limbah, dukungan pengambilan keputusan usaha, dan citra produk yang lebih dikenal bagi pelaku UMKM, serta rujukan awal bagi mahasiswa, peneliti, dan pemangku kepentingan daerah. Manfaat tersebut masih bersifat proyeksi sampai dibuktikan dalam pengujian.")

    # ==================== BAB 2 ISI GAGASAN ====================
    p("BAB 2 ISI GAGASAN", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=12, space_after=12)
    p("2.1 Kondisi Terkini Permasalahan", bold=True, space_after=6)
    p("Manajemen rantai pasok mengoordinasikan aliran produk, informasi, dan dana dari pemasok hingga pelanggan (Chopra dan Meindl, 2016). Pada usaha marmer, aliran tersebut mencakup bahan batu, proses pengerjaan, penyimpanan, pesanan, dan pengiriman. Penggunaan kode QR bukan inovasi baru; nilai tambah gagasan ini terletak pada rancangan integrasi lintas tahap, termasuk limbah, yang spesifik terhadap proses usaha marmer, serta pemanfaatannya untuk menceritakan asal-usul produk dan dapat disesuaikan dengan kapasitas UMKM.")
    p("Pada pemasaran daring seperti yang dilaporkan Suseno (2022), pembeli menilai produk tanpa melihat langsung proses pembuatannya, sehingga informasi asal dan riwayat produk berpotensi menambah kepercayaan; hal ini perlu diuji, bukan diasumsikan. Data primer tentang kondisi aktual belum dikumpulkan. Oleh sebab itu, tim tidak mengasumsikan bahwa seluruh usaha masih mencatat secara manual. Tim hanya merumuskan dugaan kendala sebagai hipotesis kerja, sebagian didukung literatur, yang akan diverifikasi melalui wawancara dan observasi (Tabel 1).")

    p("Tabel 1. Dugaan kendala, fitur yang dirancang, dan cara verifikasi", bold=True, space_before=6, space_after=4)
    t1 = doc.add_table(rows=7, cols=3)
    t1.alignment = WD_TABLE_ALIGNMENT.CENTER
    t1_data = [
        ("Dugaan kendala (hipotesis)", "Fitur MARBLECHAIN", "Cara verifikasi"),
        ("Catatan bahan, produksi, dan pengiriman tersimpan terpisah", "Identitas batch yang menautkan seluruh tahap", "Wawancara dan pemeriksaan catatan usaha"),
        ("Riwayat produk sulit ditelusuri ketika dibutuhkan", "Pindai QR untuk menampilkan riwayat batch", "Tugas pencarian riwayat pada alur awal"),
        ("Stok bahan dan barang jadi sulit dipantau", "Smart Inventory dan stok minimum", "Observasi stok dan pencocokan data"),
        ("Status pesanan sulit diketahui", "Pelacakan produksi dan pengiriman", "Wawancara pemilik dan operator"),
        ("Limbah (serbuk, menir, pecahan) belum tercatat dan belum dimanfaatkan optimal (didukung literatur)", "Waste Tracking dan Matching per batch", "Observasi volume limbah dan wawancara tujuan pemanfaatan"),
        ("Informasi asal-usul produk belum dikelola untuk membangun citra di pasar luas", "Halaman cerita produk lewat QR", "Wawancara pelaku dan calon pembeli tentang informasi yang dibutuhkan")
    ]
    for r_idx, row in enumerate(t1_data):
        for c_idx, val in enumerate(row):
            cell = t1.rows[r_idx].cells[c_idx]
            add_box_border(cell)
            cp = cell.paragraphs[0]
            cp.paragraph_format.line_spacing = 1.15
            cp.paragraph_format.space_after = Pt(2)
            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(10 if r_idx > 0 else 11)
            if r_idx == 0: cr.bold = True

    p("2.2 Solusi: Sistem MARBLECHAIN", bold=True, space_before=12, space_after=6)
    p("MARBLECHAIN dirancang sebagai aplikasi web responsif dengan lima modul. (1) Smart Inventory mencatat penerimaan bahan, pemakaian, stok minimum, dan barang jadi. (2) QR Traceability menghubungkan identitas batch dengan bahan, tanggal, status produksi, dan catatan distribusi, serta menampilkan halaman cerita produk (asal bahan, pengrajin, dan proses) yang dapat disajikan dalam bahasa Indonesia dan Inggris. (3) Production and Delivery Tracking menyajikan status pesanan yang diperbarui pengguna berwenang. (4) Waste Tracking dan Matching (Waste-to-Value) mencatat jenis dan volume limbah per batch beserta statusnya (dijual, diolah, atau belum dimanfaatkan), lalu menampilkan limbah yang tersedia, tanpa data sensitif usaha, kepada calon pengguna terdaftar. (5) Dashboard menampilkan ringkasan stok, produksi, limbah, dan pengiriman.")
    p("Akses dibatasi berdasarkan peran. Pelanggan hanya melihat halaman cerita dan data produk yang layak dibagikan, sedangkan data pemasok, biaya, limbah, dan pelanggan lain bersifat internal. Setiap perubahan status dilengkapi pencatat waktu dan akun pengubah agar riwayat dapat diaudit. Alur informasi dirangkum pada Tabel 2 dan Gambar 1.")
    
    p("Jalur pemanfaatan limbah dikelompokkan menurut kekuatan buktinya (Tabel 3). Dua jalur pertama sudah didukung penelitian terdahulu; jalur ketiga masih hipotesis. Pertanian, kehutanan, dan perikanan di Tulungagung tumbuh 6,71 persen pada 2025 (BPS dalam Databoks, 2026), sehingga kemungkinan serbuk marmer sebagai pembenah tanah layak dikaji. Namun penelitian yang ditemukan tim baru menguji marmer untuk perbaikan tanah dalam konteks rekayasa sipil (Ural, Karakurt dan Cömert, 2014), bukan pengapuran lahan. Karena itu efektivitas dan keamanannya perlu uji laboratorium sebelum dianjurkan kepada petani.")

    p("Tabel 3. Jalur pemanfaatan limbah dan kekuatan buktinya", bold=True, space_before=6, space_after=4)
    t3 = doc.add_table(rows=4, cols=3)
    t3.alignment = WD_TABLE_ALIGNMENT.CENTER
    t3_data = [
        ("Jalur", "Dasar", "Status bukti"),
        ("Bahan bangunan (bata beton, campuran beton)", "Aditya, Halim dan Silviana (2016); Bheel dkk. (2020)", "Didukung penelitian terdahulu"),
        ("Produk dekorasi (terrazzo)", "Prasetyo dan Nugraha (2024)", "Didukung penelitian terdahulu"),
        ("Pembenah tanah pertanian", "Pertumbuhan sektor pertanian; Ural, Karakurt dan Cömert (2014) hanya untuk tanah teknik sipil", "Hipotesis, perlu uji laboratorium")
    ]
    for r_idx, row in enumerate(t3_data):
        for c_idx, val in enumerate(row):
            cell = t3.rows[r_idx].cells[c_idx]
            add_box_border(cell)
            cp = cell.paragraphs[0]
            cp.paragraph_format.line_spacing = 1.15
            cp.paragraph_format.space_after = Pt(2)
            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(10 if r_idx > 0 else 11)
            if r_idx == 0: cr.bold = True

    p("Tabel 2. Alur informasi dan catatan yang dihasilkan", bold=True, space_before=10, space_after=4)
    t2 = doc.add_table(rows=7, cols=3)
    t2.alignment = WD_TABLE_ALIGNMENT.CENTER
    t2_data = [
        ("No.", "Tahap", "Catatan yang ditautkan ke identitas batch"),
        ("1", "Pemasok dan penerimaan bahan", "Jenis, jumlah, tanggal, dan sumber bahan"),
        ("2", "Pencatatan batch", "Identitas batch dan kode QR dibuat otomatis"),
        ("3", "Proses produksi dan limbah", "Tahap pengerjaan, jumlah produk jadi, serta jenis dan volume limbah"),
        ("4", "Stok produk jadi", "Jumlah tersedia dan peringatan stok minimum"),
        ("5", "Pesanan dan pengiriman", "Nomor pesanan, tanggal kirim, tujuan umum, status"),
        ("6", "Pemanfaatan limbah", "Status limbah dan kecocokannya dengan calon pengguna")
    ]
    for r_idx, row in enumerate(t2_data):
        for c_idx, val in enumerate(row):
            cell = t2.rows[r_idx].cells[c_idx]
            add_box_border(cell)
            cp = cell.paragraphs[0]
            cp.paragraph_format.line_spacing = 1.15
            cp.paragraph_format.space_after = Pt(2)
            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(10 if r_idx > 0 else 11)
            if r_idx == 0: cr.bold = True

    # Gambar 1
    img1_path = 'gambar1_alur.jpeg'
    if not os.path.exists(img1_path):
        candidate = os.path.join(os.path.dirname(__file__), '..', '04_Aset_Gambar', 'gambar1_alur.jpeg')
        if os.path.exists(candidate):
            img1_path = candidate
    if os.path.exists(img1_path):
        doc.add_paragraph().paragraph_format.space_before = Pt(8)
        p_img1 = doc.add_paragraph()
        p_img1.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img1.add_run().add_picture(img1_path, width=Inches(5.5))
        p("Gambar 1. Rancangan alur informasi MARBLECHAIN (kode QR adalah contoh ilustrasi)",
          align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=8)

    p("Skenario demonstrasi dimulai ketika pengrajin menerima satu batch bahan dan mengisi datanya. Sistem membuat identitas batch dan kode QR. Saat batch diproses, operator memperbarui tahap pengerjaan; saat pesanan dikirim, petugas mencatat tanggal dan status pengiriman. Pemilik usaha lalu memindai kode QR untuk menampilkan riwayat batch dari bahan hingga distribusi. Halaman prototipe meliputi Dashboard, Bahan Baku, Produksi, Limbah, Pindai QR, dan Distribusi.")

    # Gambar 2
    img2_path = 'gambar2_mockup.jpeg'
    if not os.path.exists(img2_path):
        candidate = os.path.join(os.path.dirname(__file__), '..', '04_Aset_Gambar', 'gambar2_mockup.jpeg')
        if os.path.exists(candidate):
            img2_path = candidate
    if os.path.exists(img2_path):
        p_img2 = doc.add_paragraph()
        p_img2.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img2.add_run().add_picture(img2_path, width=Inches(5.5))
        p("Gambar 2. Mockup antarmuka MARBLECHAIN: (a) Dashboard web dan (b) hasil pindai QR pada ponsel. Seluruh angka dan nama pada gambar adalah data ilustrasi",
          align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=8)

    # PARAGRAF PENERAPAN RUJUKAN JURNAL PADA DESAIN ANTARMUKA
    p_ui = p()
    r_ui = p_ui.add_run(
        "Perancangan tata letak dan hierarki antarmuka pada Gambar 2 mengadopsi standar ergonomi antarmuka pengguna ISO 9241-210 (2019) dan kaidah visualisasi informasi Stephen Few (2013). Indikator kunci kinerja operasional (KPI) disajikan secara at-a-glance pada kuadran atas dashboard (stok bahan, batch aktif, produk lolos QC, dan limbah tervalorisasi), dilengkapi kartu peringatan ambang batas minimum stok (safety stock threshold) untuk mitigasi keterlambatan pasokan. Pada sistem pelacakan, diterapkan arsitektur dual-view (Ahmad dan Zaidi, 2023; Barni dkk., 2021): antarmuka konsumen berfokus pada storytelling keaslian marmer Tulungagung, profil perajin, serta eco-badge nir-limbah guna mendongkrak kepercayaan pasar ekspor, sedangkan antarmuka internal memuat audit trail kronologis dan verifikasi identitas batch demi menjamin integritas data (Ahmad dan Zaidi, 2023). Sementara itu, modul Waste-to-Value dirancang berbasis kerangka ekonomi sirkular dan simbiosis industri (Ghisellini, Cialani dan Ulgiati, 2021; Kerdlap dkk., 2022) dengan memvisualisasikan neraca massa bahan dan katalog pencocokan limbah marmer ke industri mitra bata beton (Aditya, Halim dan Silviana, 2016) dan terrazzo (Prasetyo dan Nugraha, 2024)."
    )
    if highlight: r_ui.font.highlight_color = WD_COLOR_INDEX.TURQUOISE

    # PARAGRAF TEKNOLOGI + JALAN TENGAH IOT
    p_tech = p()
    p_tech.add_run("Untuk prototipe awal, teknologi yang dapat digunakan ialah HTML, CSS, JavaScript, PHP, MySQL, pustaka pembuat kode QR, dan Chart.js. ")
    r_iot = p_tech.add_run("Prototipe tahap awal (Fase 1) difokuskan pada aplikasi web responsif dan kode QR agar biaya serta kompleksitas tetap rendah bagi perajin mikro. Namun, arsitektur MARBLECHAIN dirancang modular dan terbuka untuk integrasi Internet of Things (IoT) pada peta jalan Fase 2, seperti timbangan digital cerdas berbasis mikrokontroler untuk pencatatan otomatis bobot limbah padat serta sensor lingkungan bengkel seiring peningkatan kapasitas usaha.")
    if highlight: r_iot.font.highlight_color = WD_COLOR_INDEX.TURQUOISE

    p("Kebaruan bersifat kontekstual dan metodologis: (1) penggabungan informasi material, proses, dan distribusi dalam satu riwayat batch marmer; (2) alur input ringkas bagi usaha skala kecil; dan (3) evaluasi ketertelusuran melalui tugas pencarian riwayat sebelum dan sesudah penggunaan prototipe. Klaim kebaruan perlu diuji kembali terhadap publikasi terdahulu dan hasil observasi.")
    p("Rancangan evaluasi disajikan pada Tabel 4. Hasil numerik, penghematan waktu, dan peningkatan efisiensi tidak dicantumkan sebelum uji dilaksanakan. Jika waktu tidak memungkinkan pengujian, karya tetap diposisikan sebagai gagasan inovatif dengan rencana validasi yang transparan.")

    p("Tabel 4. Rancangan evaluasi prototipe", bold=True, space_before=6, space_after=4)
    t4 = doc.add_table(rows=8, cols=2)
    t4.alignment = WD_TABLE_ALIGNMENT.CENTER
    t4_data = [
        ("Indikator", "Cara evaluasi"),
        ("Fungsi sistem", "Uji skenario penerimaan bahan, pembaruan produksi, QR, dan pengiriman"),
        ("Ketepatan stok", "Mencocokkan data sistem dengan catatan atau objek uji"),
        ("Waktu penelusuran", "Membandingkan durasi menemukan riwayat batch pada alur awal dan prototipe"),
        ("Kemudahan penggunaan", "Tugas pengguna, kuesioner singkat (misalnya System Usability Scale, Brooke, 1996), dan wawancara"),
        ("Kelengkapan riwayat", "Memeriksa keterisian atribut wajib setiap batch, termasuk data limbah"),
        ("Kejelasan halaman cerita produk", "Uji pemahaman singkat oleh calon pembeli atau responden umum"),
        ("Kecocokan limbah dan pengguna", "Uji skenario mencocokkan satu jenis limbah dengan calon pengguna, misalnya produsen paving")
    ]
    for r_idx, row in enumerate(t4_data):
        for c_idx, val in enumerate(row):
            cell = t4.rows[r_idx].cells[c_idx]
            add_box_border(cell)
            cp = cell.paragraphs[0]
            cp.paragraph_format.line_spacing = 1.15
            cp.paragraph_format.space_after = Pt(2)
            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(10 if r_idx > 0 else 11)
            if r_idx == 0: cr.bold = True

    p("2.3 Pihak yang Dipertimbangkan dan Perannya", bold=True, space_before=12, space_after=6)
    p("Pihak berikut dipertimbangkan dapat membantu implementasi. Keterlibatan tersebut masih berupa rencana, bukan kemitraan yang telah disepakati.")

    p("Tabel 5. Pihak yang terlibat dan peran", bold=True, space_before=6, space_after=4)
    t5 = doc.add_table(rows=9, cols=2)
    t5.alignment = WD_TABLE_ALIGNMENT.CENTER
    t5_data = [
        ("Pihak", "Peran atau kontribusi"),
        ("Pelaku usaha dan pengrajin marmer", "Sumber kebutuhan, informan wawancara, dan penguji prototipe"),
        ("Tim mahasiswa", "Menyusun kajian, merancang dan membangun prototipe, serta melaksanakan evaluasi"),
        ("Dosen pembimbing", "Meninjau ketepatan ilmiah dan metodologi"),
        ("Mitra usaha atau komunitas UMKM", "Mendukung akses lapangan dan uji coba terbatas"),
        ("Akademisi dan desainer", "Mengembangkan pemanfaatan limbah menjadi produk bernilai tambah, misalnya melalui riset seperti Prasetyo dan Nugraha (2024)"),
        ("Calon pengguna limbah", "Produsen bata beton atau paving dan desainer; pelaku pertanian hanya setelah uji laboratorium"),
        ("Kementerian Perdagangan", "Program UMKM BISA: kurasi produk, pelatihan desain dan kemasan, serta business matching ekspor (Rizky, 2025)"),
        ("Pemerintah daerah", "Mitra pendampingan UMKM dan penguatan citra Kota Marmer bila sesuai dengan program daerah")
    ]
    for r_idx, row in enumerate(t5_data):
        for c_idx, val in enumerate(row):
            cell = t5.rows[r_idx].cells[c_idx]
            add_box_border(cell)
            cp = cell.paragraphs[0]
            cp.paragraph_format.line_spacing = 1.15
            cp.paragraph_format.space_after = Pt(2)
            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(10 if r_idx > 0 else 11)
            if r_idx == 0: cr.bold = True

    p("2.4 Langkah Strategis Implementasi", bold=True, space_before=12, space_after=6)
    p("Tabel 6. Tahapan implementasi gagasan", bold=True, space_before=6, space_after=4)
    t6 = doc.add_table(rows=7, cols=3)
    t6.alignment = WD_TABLE_ALIGNMENT.CENTER
    t6_data = [
        ("Tahap", "Kegiatan", "Luaran"),
        ("1", "Telaah pustaka dan wawancara eksploratif kepada sekitar 3–5 pelaku usaha, termasuk soal limbah dan pemasaran", "Daftar kebutuhan awal"),
        ("2", "Pemetaan alur proses dan kebutuhan data", "Diagram alur dan atribut data"),
        ("3", "Rancangan antarmuka, basis data, dan hak akses", "Rancangan sistem"),
        ("4", "Pembangunan prototipe minimum dengan satu alur batch lengkap", "Prototipe MARBLECHAIN"),
        ("5", "Uji fungsi dan uji pengguna, termasuk skenario pencocokan limbah", "Data evaluasi"),
        ("6", "Perbaikan dan penyusunan rekomendasi penerapan bertahap", "Rekomendasi penerapan")
    ]
    for r_idx, row in enumerate(t6_data):
        for c_idx, val in enumerate(row):
            cell = t6.rows[r_idx].cells[c_idx]
            add_box_border(cell)
            cp = cell.paragraphs[0]
            cp.paragraph_format.line_spacing = 1.15
            cp.paragraph_format.space_after = Pt(2)
            cr = cp.add_run(val)
            cr.font.name = 'Times New Roman'
            cr.font.size = Pt(10 if r_idx > 0 else 11)
            if r_idx == 0: cr.bold = True

    p("Pengumpulan data lapangan dilakukan dengan persetujuan informan dan data usaha diperlakukan secara rahasia. Jumlah informan eksploratif tidak dimaksudkan mewakili seluruh industri marmer Tulungagung, sehingga temuan tidak digeneralisasi.",
      space_before=6)

    # ==================== BAB 3 PENUTUP ====================
    p("BAB 3 PENUTUP", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=12, space_after=12)
    p("3.1 Kesimpulan", bold=True, space_after=6)
    p("MARBLECHAIN merupakan gagasan digitalisasi rantai pasok marmer Tulungagung melalui pencatatan terpadu dan ketertelusuran batch berbasis kode QR. Alur informasi dirancang dari penerimaan bahan hingga pengiriman dan ditautkan pada identitas batch (rumusan masalah 1 dan 2), dengan limbah tercatat sebagai bagian rantai pasok dan dicocokkan dengan calon pengguna melalui jalur yang bukti pendukungnya dipilah dengan jelas. Halaman cerita produk dirancang untuk mendukung identitas dan pemasaran marmer Tulungagung (rumusan masalah 3). Kelayakan fungsi dan kemudahan penggunaan akan dievaluasi dengan indikator pada Tabel 4 (rumusan masalah 4). Dampak yang diprediksi adalah penelusuran riwayat produk yang lebih mudah, pencatatan yang lebih teratur termasuk limbah, dasar keputusan usaha yang lebih baik, dan citra marmer Tulungagung yang lebih dikenal; dampak ini masih berupa proyeksi yang perlu diverifikasi melalui studi kebutuhan dan pengujian terbatas.")

    p("3.2 Saran", bold=True, space_before=6, space_after=6)
    p("Tim perlu memprioritaskan observasi lapangan, membatasi fitur pada alur utama, dan menggunakan indikator evaluasi yang dapat direplikasi. Pengembangan lanjutan dapat mempertimbangkan integrasi mitra usaha setelah aspek kualitas data dan keamanan informasi terpenuhi.")

    # ==================== DAFTAR PUSTAKA ====================
    p("DAFTAR PUSTAKA", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=12, space_after=12)
    
    pustaka_list = [
        "Aditya, C., Halim, A. dan Silviana (2016) 'Pemanfaatan limbah marmer dan serbuk silika pada industri bata beton pejal dan berlubang', Prosiding SENIATI, 2(2).",
        ("Afdhal, Sastra, H.Y. dan Husni (2024) 'Value Chain Analysis in Marble Production Process at South Aceh Polytechnic', International Journal of Multidisciplinary Sciences and Arts, 3(4), hlm. 257-259. doi: 10.47709/ijmdsa.v3i4.5280.", True),
        ("Ahmad, R. dan Zaidi, M. (2023) 'Enhancing supply chain transparency through a QR-based monitoring dashboard: Governance and integrity implications for manufacturing SMEs', Journal of Governance and Integrity, 6(1), hlm. 112-125.", True),
        "Antara (2025) 'Kementerian UMKM sebut 65,5 juta UMKM serap 119 juta tenaga kerja', ANTARA News, 15 Juli. Tersedia pada: https://www.antaranews.com/berita/4968741/kementerian-umkm- (Diakses: 20 Oktober 2026).",
        ("Barni, A. et al. (2021) 'Traceability automation and storytelling in craft-to-manufacturing paradigms: A digital product passport approach', Procedia CIRP, 104, hlm. 552-557.", True),
        "Bheel, N. et al. (2020) 'Use of marble powder and tile powder as cementitious materials in concrete', Engineering, Technology & Applied Science Research, 10(2), hlm. 5448-5451. doi: 10.48084/etasr.3378.",
        "Brooke, J. (1996) 'SUS: a quick and dirty usability scale', dalam Jordan, P.W. et al. (eds.) Usability Evaluation in Industry. London: Taylor & Francis, hlm. 189-194.",
        "Chopra, S. dan Meindl, P. (2016) Supply Chain Management: Strategy, Planning, and Operation. Edisi ke-6. Boston: Pearson.",
        "Databoks (2026) 'Pertumbuhan ekonomi Kab. Tulungagung 2025, terkuat di sektor jasa perusahaan', Katadata, 22 September. Tersedia pada: https://databoks.katadata.co.id/datapublish/2026/09/22/pertumbuhan-ekonomi-kab-tulungagung-2025-terkuat-di-sektor-jasa-perusahaan (Diakses: 20 Oktober 2026).",
        ("Few, S. (2013) Information Dashboard Design: Displaying Data for At-a-Glance Monitoring. Edisi ke-2. Burlingame: Analytics Press.", True),
        ("Ghisellini, P., Cialani, C. dan Ulgiati, S. (2021) 'A review on circular economy: The expected transition to a balanced interplay of environmental and economic systems via digital dashboards', Journal of Cleaner Production, 114, hlm. 11-32.", True),
        "Handayani, N., Firmansyah, D. dan Rusdianto, H. (2026) 'Optimalisasi Sistem Inventory dan Traceability Produk Berbasis Web dengan Integrasi QR Code pada UMKM Dapoer Njowo', Jurnal Teknik, 15(1). doi: 10.31000/jt.v15i1.15811.",
        ("ISO (2019) ISO 9241-210:2019 Ergonomics of human-system interaction -- Part 210: Human-centred design for interactive systems. Geneva: International Organization for Standardization.", True),
        ("Kerdlap, P. et al. (2022) 'Industrial symbiosis platforms: Connecting waste generators and re-users through interactive matching dashboards', Resources, Conservation and Recycling, 180, hlm. 106173.", True),
        "Miranda, R.P.R. dan Dwiputri, I.N. (2021) 'Problematika usaha dan kondisi permintaan penawaran industri kecil menengah batu marmer di Kecamatan Campurdarat Kabupaten Tulungagung', Jurnal Ekonomi, Bisnis dan Pendidikan, 1(11), hlm. 1110-1124. doi: 10.17977/um066v1i112021p1110-1124.",
        "Olsen, P. dan Borit, M. (2013) 'How to define traceability', Trends in Food Science & Technology, 29(2), hlm. 142-150. doi: 10.1016/j.tifs.2012.10.003.",
        "Prasetyo, Y.D. dan Nugraha, A. (2024) 'Eksplorasi limbah marmer Tulungagung sebagai bahan baku produk dekorasi interior', NARADA: Jurnal Desain & Seni, 11(1), hlm. 107-124.",
        "Rizky, M. (2025) 'Mendag bongkar jurus UMKM tembus ekspor, transaksi sudah capai Rp 1 T', CNBC Indonesia, 25 Juni. Tersedia pada: https://www.cnbcindonesia.com/news/20250625101907-4-643737/mendag-bongkar-jurus-umkm-tembus-ekspor-transaksi-sudah-capai-rp-1-t (Diakses: 20 Oktober 2026).",
        "Suseno, W.R.A. (2022) 'Upaya pertahanan keberlangsungan industri kerajinan onix dan marmer Kabupaten Tulungagung', Jurnal Ekonomi dan Pendidikan, 18(2), hlm. 192-206. doi: 10.21831/jep.v18i2.40652.",
        "Ural, N., Karakurt, C. dan Comert, A.T. (2014) 'Influence of marble wastes on soil improvement and concrete production', Journal of Material Cycles and Waste Management, 16(3), hlm. 500-508. doi: 10.1007/s10163-013-0200-3.",
        "Universitas Gadjah Mada (2026) 'Strengthening city identity: UGM urban planning experts provide strategic inputs for Tulungagung urban corridor grand design', Portal MPWK UGM, 29 April. Tersedia pada: https://mpwk.ugm.ac.id/en/2026/04/29/strengthening-city-identity-ugm-urban-planning-experts-provide-strategic-inputs-for-tulungagung-urban-corridor-grand-design/ (Diakses: 20 Oktober 2026).",
        "Wulandari, E.P. dan Widhajati, E. (2021) 'Strategi pemulihan ekonomi melalui sinergi pemasaran digital LapakUMKM.Com', JANITA (Jurnal Pengabdian Masyarakat Universitas Tulungagung), 1(2).",
        "Yunitasari, V. (2021) 'Analisis upaya dalam mempertahankan keberlangsungan industri kerajinan marmer dan onix di Kecamatan Campurdarat Kabupaten Tulungagung', Prosiding Seminar Nasional Ekonomi Pembangunan, 1(2), hlm. 498-506."
    ]

    for item in pustaka_list:
        p_ref = p(space_after=4)
        p_ref.paragraph_format.line_spacing = 1.0 # 1 spasi untuk pustaka
        if isinstance(item, tuple):
            text, is_hl = item
            r = p_ref.add_run(text)
            if highlight and is_hl:
                r.font.highlight_color = WD_COLOR_INDEX.BRIGHT_GREEN
        else:
            p_ref.add_run(item)

    # Page Break for Lampiran
    doc.add_page_break()

    # ==================== LAMPIRAN 1 ====================
    p("LAMPIRAN 1. BIODATA KETUA TIM, ANGGOTA TIM, DAN DOSEN PENDAMPING", bold=True, space_after=12)

    def add_bio_section(role_title):
        p(role_title, bold=True, space_after=4)
        p("A. Identitas Diri", bold=True, space_after=2)
        t_id = doc.add_table(rows=7, cols=2)
        t_id.alignment = WD_TABLE_ALIGNMENT.CENTER
        id_data = [
            ("Nama Lengkap", ": [isi]"),
            ("Jenis Kelamin", ": Laki-laki/Perempuan"),
            ("Program Studi", ": [isi]"),
            ("NIM", ": [isi]"),
            ("Tempat, Tanggal Lahir", ": [isi]"),
            ("E-mail", ": [isi]"),
            ("Nomor Telepon / HP", ": [isi]")
        ]
        for idx, (lbl, val) in enumerate(id_data):
            cell0 = t_id.rows[idx].cells[0]
            cell1 = t_id.rows[idx].cells[1]
            add_box_border(cell0)
            add_box_border(cell1)
            cell0.paragraphs[0].add_run(lbl).font.name = 'Times New Roman'
            cell1.paragraphs[0].add_run(val).font.name = 'Times New Roman'

        p("B. Kegiatan Kemahasiswaan yang Sedang Diikuti/Pernah Diikuti", bold=True, space_before=4, space_after=2)
        t_act = doc.add_table(rows=3, cols=4)
        t_act.alignment = WD_TABLE_ALIGNMENT.CENTER
        act_headers = ["No.", "Jenis Kegiatan", "Status dalam Kegiatan", "Waktu, Tempat"]
        for idx, h in enumerate(act_headers):
            c = t_act.rows[0].cells[idx]
            add_box_border(c)
            r = c.paragraphs[0].add_run(h)
            r.bold = True
            r.font.name = 'Times New Roman'
        for r_i in range(1, 3):
            for c_i in range(4):
                c = t_act.rows[r_i].cells[c_i]
                add_box_border(c)
                if c_i == 0:
                    c.paragraphs[0].add_run(f"{r_i}.").font.name = 'Times New Roman'

        p("C. Penghargaan yang Pernah Diterima", bold=True, space_before=4, space_after=2)
        t_awd = doc.add_table(rows=3, cols=4)
        t_awd.alignment = WD_TABLE_ALIGNMENT.CENTER
        awd_headers = ["No.", "Jenis Penghargaan", "Institusi Pemberi Penghargaan", "Tahun"]
        for idx, h in enumerate(awd_headers):
            c = t_awd.rows[0].cells[idx]
            add_box_border(c)
            r = c.paragraphs[0].add_run(h)
            r.bold = True
            r.font.name = 'Times New Roman'
        for r_i in range(1, 3):
            for c_i in range(4):
                c = t_awd.rows[r_i].cells[c_i]
                add_box_border(c)
                if c_i == 0:
                    c.paragraphs[0].add_run(f"{r_i}.").font.name = 'Times New Roman'

        p("Semua data yang saya isikan dan tercantum dalam biodata ini adalah benar dan dapat dipertanggungjawabkan secara hukum. Apabila di kemudian hari ternyata dijumpai ketidaksesuaian dengan kenyataan, saya sanggup menerima sanksi. Demikian biodata ini saya buat dengan sebenarnya untuk memenuhi salah satu persyaratan dalam Lomba Karya Tulis Ilmiah Nasional (LKTIN) Universitas Negeri Medan 2026.",
          space_before=4, space_after=6)
        
        p("[Kota], [tanggal bulan tahun]\nPengusul,\n\n\n\n[Tanda tangan basah]\n[Nama Lengkap]",
          align=WD_ALIGN_PARAGRAPH.RIGHT, space_after=12)

    add_bio_section("Biodata Ketua Tim")
    doc.add_page_break()
    add_bio_section("Biodata Anggota 1")
    doc.add_page_break()
    add_bio_section("Biodata Anggota 2")
    doc.add_page_break()

    # Biodata Dosen Pendamping
    p("Biodata Dosen Pendamping", bold=True, space_after=4)
    p("A. Identitas Diri", bold=True, space_after=2)
    t_idd = doc.add_table(rows=7, cols=2)
    t_idd.alignment = WD_TABLE_ALIGNMENT.CENTER
    idd_data = [
        ("Nama Lengkap", ": [isi]"),
        ("Jenis Kelamin", ": Laki-laki/Perempuan"),
        ("Program Studi", ": [isi]"),
        ("NIP/NIDN", ": [isi]"),
        ("Tempat, Tanggal Lahir", ": [isi]"),
        ("E-mail", ": [isi]"),
        ("Nomor Telepon / HP", ": [isi]")
    ]
    for idx, (lbl, val) in enumerate(idd_data):
        c0, c1 = t_idd.rows[idx].cells[0], t_idd.rows[idx].cells[1]
        add_box_border(c0)
        add_box_border(c1)
        c0.paragraphs[0].add_run(lbl).font.name = 'Times New Roman'
        c1.paragraphs[0].add_run(val).font.name = 'Times New Roman'

    p("B. Riwayat Pendidikan", bold=True, space_before=4, space_after=2)
    t_edu = doc.add_table(rows=4, cols=4)
    t_edu.alignment = WD_TABLE_ALIGNMENT.CENTER
    edu_headers = ["Jenjang", "Bidang Ilmu", "Institusi", "Tahun Lulus"]
    for idx, h in enumerate(edu_headers):
        c = t_edu.rows[0].cells[idx]
        add_box_border(c)
        r = c.paragraphs[0].add_run(h)
        r.bold = True
        r.font.name = 'Times New Roman'
    levels = ["Sarjana (S1)", "Magister (S2)", "Doktoral (S3)"]
    for idx, l in enumerate(levels, 1):
        for ci in range(4):
            c = t_edu.rows[idx].cells[ci]
            add_box_border(c)
            if ci == 0: c.paragraphs[0].add_run(l).font.name = 'Times New Roman'

    p("C. Rekam Jejak Tri Dharma Perguruan Tinggi", bold=True, space_before=4, space_after=2)
    p("Pendidikan/Pengajaran", bold=True, space_after=2)
    t_teach = doc.add_table(rows=3, cols=4)
    t_teach.alignment = WD_TABLE_ALIGNMENT.CENTER
    for idx, h in enumerate(["No.", "Nama Mata Kuliah", "Wajib/Pilihan", "SKS"]):
        c = t_teach.rows[0].cells[idx]
        add_box_border(c)
        r = c.paragraphs[0].add_run(h)
        r.bold = True
        r.font.name = 'Times New Roman'
    for ri in range(1, 3):
        for ci in range(4):
            c = t_teach.rows[ri].cells[ci]
            add_box_border(c)
            if ci == 0: c.paragraphs[0].add_run(f"{ri}.").font.name = 'Times New Roman'

    p("Semua data yang saya isikan dan tercantum dalam biodata ini adalah benar dan dapat dipertanggungjawabkan secara hukum. Apabila di kemudian hari ternyata dijumpai ketidaksesuaian dengan kenyataan, saya sanggup menerima sanksi. Demikian biodata ini saya buat dengan sebenarnya untuk memenuhi salah satu persyaratan dalam Lomba Karya Tulis Ilmiah Nasional (LKTIN) Universitas Negeri Medan 2026.",
      space_before=4, space_after=6)
    p("[Kota], [tanggal bulan tahun]\nPengusul,\n\n\n\n[Tanda tangan basah]\n[Nama Lengkap]",
      align=WD_ALIGN_PARAGRAPH.RIGHT, space_after=12)

    # Page Break for Lampiran 2
    doc.add_page_break()

    # ==================== LAMPIRAN 2 ====================
    p("LAMPIRAN 2. SURAT PERNYATAAN ORISINALITAS DAN BUKTI CEK TURNITIN", bold=True, space_after=12)
    p("SURAT PERNYATAAN KETUA TIM PELAKSANA", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=8)
    
    p("Yang bertandatangan di bawah ini:")
    t_per = doc.add_table(rows=5, cols=2)
    t_per.alignment = WD_TABLE_ALIGNMENT.CENTER
    per_data = [
        ("Nama Lengkap", ": [isi]"),
        ("NIM", ": [isi]"),
        ("Program Studi", ": [isi]"),
        ("Fakultas", ": [isi]"),
        ("Perguruan Tinggi", ": [isi]")
    ]
    for idx, (k, v) in enumerate(per_data):
        c0, c1 = t_per.rows[idx].cells[0], t_per.rows[idx].cells[1]
        c0.paragraphs[0].add_run(k).font.name = 'Times New Roman'
        c1.paragraphs[0].add_run(v).font.name = 'Times New Roman'

    p("Dengan ini menyatakan bahwa karya tulis ilmiah saya dengan judul “Digitalisasi Rantai Pasok Marmer Tulungagung: Ketertelusuran Produk dan Limbah Berbasis Kode QR untuk Memperkuat Identitas Daerah” yang diusulkan dengan subtema “Digitalisasi Ekonomi, UMKM, dan Pemberdayaan Daerah 3T untuk Ketahanan Ekonomi Nasional” adalah asli karya kami dan belum pernah diperlombakan pada ajang lain. Bilamana di kemudian hari ditemukan ketidaksesuaian dengan pernyataan ini, maka saya bersedia dituntut dan diproses sesuai dengan ketentuan yang berlaku.",
      space_before=6, space_after=6)
    p("Demikian pernyataan ini dibuat dengan sesungguhnya dan dengan sebenar-benarnya.", space_after=12)

    p("[Kota], [Tanggal Bulan Tahun]\nYang menyatakan,\n\n[Meterai Rp10.000 dan tanda tangan asli/basah]\n\n\n\n[Nama Lengkap]\nNIM. [NIM]",
      align=WD_ALIGN_PARAGRAPH.RIGHT, space_after=18)

    # Page Break for Turnitin
    doc.add_page_break()

    p("BUKTI HASIL CEK TURNITIN", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=18)
    p("[Tempelkan tangkapan layar laporan Turnitin dari naskah final di sini. Kesamaan maksimal 25%.]",
      align=WD_ALIGN_PARAGRAPH.CENTER, italic=True, space_after=12,
      hl=WD_COLOR_INDEX.YELLOW if highlight else None)

    try:
        doc.save(filename)
        print(f"Document saved: {filename}")
    except PermissionError:
        alt_filename = filename.replace('.docx', '_TERBARU.docx')
        doc.save(alt_filename)
        print(f"File {filename} sedang dibuka di Word. Berhasil disimpan sebagai: {alt_filename}")

if __name__ == '__main__':
    build_paper(highlight=False, filename='MARBLECHAIN_KTI_LKTIN_UNIMED_2026_REVISI.docx')
    build_paper(highlight=True, filename='MARBLECHAIN_KTI_LKTIN_UNIMED_2026_REVISI_HIGHLIGHT.docx')
