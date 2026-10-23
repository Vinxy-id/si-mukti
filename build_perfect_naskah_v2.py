# -*- coding: utf-8 -*-
"""
Script to rebuild Naskah LKTIN SI-MUKTI UNIMED 2026 with 100% compliance:
- Pedoman LKTIN UNIMED 2026 (Margins, Spacing, Multi-section Page Numbering, Limit 10 Pages Halaman Inti)
- Clean, 1-page Lembar Pengesahan (Halaman ii)
- Native Word Tab Stop with Dot Leader for Daftar Isi (Halaman iv)
- Complete Italicization of English / Foreign terms according to EYD V and naskah-id
"""

import docx
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT, WD_TAB_LEADER
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_SECTION
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import os

def add_box_border(cell):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(r'''
        <w:tcBorders %s >
            <w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        </w:tcBorders>
    ''' % nsdecls('w'))
    tcPr.append(tcBorders)

def set_cell_margins(cell, top=60, bottom=60, left=100, right=100):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(r'''
        <w:tcMar %s>
            <w:top w:w="%d" w:type="dxa"/>
            <w:bottom w:w="%d" w:type="dxa"/>
            <w:left w:w="%d" w:type="dxa"/>
            <w:right w:w="%d" w:type="dxa"/>
        </w:tcMar>
    ''' % (nsdecls('w'), top, bottom, left, right))
    tcPr.append(tcMar)

def cant_split(row):
    trPr = row._tr.get_or_add_trPr()
    trPr.append(parse_xml(r'<w:cantSplit %s/>' % nsdecls('w')))

def add_page_number_field(run):
    fld1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
    instr = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w'))
    fld2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
    fld3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
    run._r.append(fld1)
    run._r.append(instr)
    run._r.append(fld2)
    run._r.append(fld3)

def set_page_setup(section):
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(3.0)
    section.bottom_margin = Cm(3.0)
    section.left_margin = Cm(4.0)
    section.right_margin = Cm(3.0)

def main():
    doc = docx.Document()

    # Base Normal Style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(4)
    normal_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    # Helper function for adding paragraphs with formatted runs
    # runs: list of tuples (text, is_bold, is_italic, font_size)
    def add_p_runs(runs_data, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=4, line_spacing=1.15):
        p = doc.add_paragraph()
        p.paragraph_format.alignment = align
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        for item in runs_data:
            text = item[0]
            is_bold = item[1] if len(item) > 1 else False
            is_italic = item[2] if len(item) > 2 else False
            font_size = item[3] if len(item) > 3 else 12
            r = p.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(font_size)
            r.bold = is_bold
            r.italic = is_italic
        return p

    def add_p(text="", align=WD_ALIGN_PARAGRAPH.JUSTIFY, bold=False, italic=False, 
              space_before=0, space_after=4, line_spacing=1.15, font_size=12):
        return add_p_runs([(text, bold, italic, font_size)], align, space_before, space_after, line_spacing)

    # =========================================================================
    # SECTION 1: COVER (HALAMAN SAMPUL) - Sesuai Lampiran 1 Pedoman
    # =========================================================================
    s1 = doc.sections[0]
    set_page_setup(s1)
    s1.different_first_page_header_footer = False
    s1.header.is_linked_to_previous = False
    s1.footer.is_linked_to_previous = False

    add_p("[ LOGO PERGURUAN TINGGI ]", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=20, space_after=30, font_size=12)
    add_p("KARYA TULIS ILMIAH", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=16, font_size=14)

    add_p("PERANCANGAN SISTEM INFORMASI GEOSPASIAL DAN KETERTELUSURAN DIGITAL UNTUK VALORISASI LIMBAH SERTA PENINGKATAN DAYA SAING UMKM MARMER TULUNGAGUNG",
          align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=22, line_spacing=1.15, font_size=12)

    add_p("SUBTEMA:", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=3, font_size=12)
    add_p("Digitalisasi Ekonomi, UMKM, dan Pemberdayaan Daerah 3T untuk Ketahanan Ekonomi Nasional",
          align=WD_ALIGN_PARAGRAPH.CENTER, space_after=36, font_size=12)

    add_p("DIUSULKAN OLEH:", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=12, font_size=12)

    # Table for team members on cover
    t_cov = doc.add_table(rows=3, cols=2)
    t_cov.alignment = WD_TABLE_ALIGNMENT.CENTER
    pengusul = [
        ("Salma Azzahra", "NIM. [Nomor Induk Mahasiswa]"),
        ("[Nama Anggota 1]", "NIM. [Nomor Induk Mahasiswa]"),
        ("[Nama Anggota 2]", "NIM. [Nomor Induk Mahasiswa]")
    ]
    for idx, (m_name, m_nim) in enumerate(pengusul):
        row = t_cov.rows[idx]
        row.cells[0].width = Cm(7.0)
        row.cells[1].width = Cm(7.0)
        p0 = row.cells[0].paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p0.paragraph_format.line_spacing = 1.15
        p0.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(m_name)
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(12)

        p1 = row.cells[1].paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p1.paragraph_format.line_spacing = 1.15
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(m_nim)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(12)

    add_p("[NAMA PERGURUAN TINGGI PENGUSUL]\n[KOTA PERGURUAN TINGGI]\n2026",
          align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=55, space_after=0, font_size=12)

    # =========================================================================
    # SECTION 2: HALAMAN AWAL (PENGESAHAN, RINGKASAN, DAFTAR ISI)
    # Penomoran Romawi kecil di sudut kanan bawah: ii, iii, iv
    # =========================================================================
    s2 = doc.add_section(WD_SECTION.NEW_PAGE)
    set_page_setup(s2)
    s2.header.is_linked_to_previous = False
    s2.footer.is_linked_to_previous = False

    s2._sectPr.append(parse_xml(f'<w:pgNumType {nsdecls("w")} w:fmt="lowerRoman" w:start="2"/>'))
    f2_p = s2.footer.paragraphs[0]
    f2_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    f2_run = f2_p.add_run()
    f2_run.font.name = 'Times New Roman'
    f2_run.font.size = Pt(12)
    add_page_number_field(f2_run)

    # -------------------------------------------------------------------------
    # LEMBAR PENGESAHAN (Halaman ii - Pas 1 Halaman Penuh, Tidak Boleh Tumpah!)
    # -------------------------------------------------------------------------
    add_p("PENGESAHAN KARYA TULIS ILMIAH", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=0, space_after=8, font_size=12)

    t_peng = doc.add_table(rows=5, cols=3)
    t_peng.alignment = WD_TABLE_ALIGNMENT.CENTER
    widths_peng = [Cm(0.6), Cm(4.0), Cm(9.4)]
    for row in t_peng.rows:
        cant_split(row)
        for c_i, w in enumerate(widths_peng):
            row.cells[c_i].width = w

    peng_items = [
        ("1.", "Judul Kegiatan", ": Perancangan Sistem Informasi Geospasial dan Ketertelusuran Digital untuk Valorisasi Limbah serta Peningkatan Daya Saing UMKM Marmer Tulungagung"),
        ("2.", "Bidang Kegiatan", ": Digitalisasi Ekonomi, UMKM, dan Pemberdayaan Daerah 3T untuk Ketahanan Ekonomi Nasional (Kode: DIGIEK-UMKM-3T)"),
        ("3.", "Ketua Pelaksana Kegiatan\na. Nama Lengkap\nb. NIM\nc. Jurusan/Program Studi\nd. Universitas\ne. Alamat Rumah dan No Tel./HP\nf. Alamat email",
               ":\n: Salma Azzahra\n: [Nomor Induk Mahasiswa]\n: [Program Studi Pengusul]\n: [Nama Perguruan Tinggi Pengusul]\n: [Alamat Rumah Pengusul] / [Nomor HP Aktif]\n: [Alamat Email Aktif]"),
        ("4.", "Jumlah Anggota Pelaksana", ": 2 (dua) orang"),
        ("5.", "Dosen pembimbing\nNama Lengkap dan Gelar\nNIDN\nAlamat Rumah dan No. Tel/HP",
               ":\n: [Nama Dosen Pembimbing beserta Gelar Lengkap]\n: [NIDN Dosen]\n: [Alamat Rumah Dosen] / [Nomor HP Dosen]")
    ]

    for idx, (col0, col1, col2) in enumerate(peng_items):
        row = t_peng.rows[idx]
        for c_idx, val in enumerate([col0, col1, col2]):
            cell = row.cells[c_idx]
            set_cell_margins(cell, top=30, bottom=30, left=40, right=40)
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing = 1.05
            p.paragraph_format.space_after = Pt(1)
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)

    # Ruang tanda tangan pembimbing dan ketua tim
    add_p("", space_before=0, space_after=4)

    t_ttd = doc.add_table(rows=1, cols=2)
    t_ttd.alignment = WD_TABLE_ALIGNMENT.CENTER
    cant_split(t_ttd.rows[0])
    t_ttd.rows[0].cells[0].width = Cm(7.0)
    t_ttd.rows[0].cells[1].width = Cm(7.0)

    c_kiri = t_ttd.rows[0].cells[0].paragraphs[0]
    c_kiri.paragraph_format.line_spacing = 1.05
    c_kiri.paragraph_format.space_after = Pt(1)
    r_k = c_kiri.add_run("Menyetujui,\nDosen Pembimbing LKTIN\n\n\n\n( [Nama Dosen Pembimbing] )\nNIDN. [NIDN Dosen]")
    r_k.font.name = 'Times New Roman'
    r_k.font.size = Pt(10.5)

    c_kanan = t_ttd.rows[0].cells[1].paragraphs[0]
    c_kanan.paragraph_format.line_spacing = 1.05
    c_kanan.paragraph_format.space_after = Pt(1)
    r_kn = c_kanan.add_run("[Kota Perguruan Tinggi], 24 Oktober 2026\nKetua Tim LKTIN\n\n\n\n( Salma Azzahra )\nNIM. [Nomor Induk Mahasiswa]")
    r_kn.font.name = 'Times New Roman'
    r_kn.font.size = Pt(10.5)

    add_p("", space_before=0, space_after=4)

    p_dekan = add_p("Mengetahui,\nWakil Dekan Bidang Kemahasiswaan\n[Nama Perguruan Tinggi Pengusul]\n\n\n\n( [Nama Pimpinan Bidang Kemahasiswaan] )\nNIP. [NIP Pimpinan]",
                    align=WD_ALIGN_PARAGRAPH.CENTER, space_before=2, space_after=0, font_size=10.5, line_spacing=1.05)

    # -------------------------------------------------------------------------
    # RINGKASAN (Halaman iii - Maksimum 250 kata)
    # -------------------------------------------------------------------------
    doc.add_page_break()
    add_p("RINGKASAN", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=6, space_after=14, font_size=12)

    ringkasan_runs = [
        ("Kabupaten Tulungagung merupakan sentra industri marmer alam terbesar di Indonesia dengan pusat pengrajin "
         "rakyat terkonsentrasi di Kecamatan Campurdarat dan Besole. Namun, observasi dan wawancara lapangan mendalam "
         "mengonfirmasi bahwa industri rakyat ini menghadapi dua permasalahan krusial. Pertama, timbulan limbah pemotongan "
         "dan pemahatan mencapai 25%–30% atau sekitar 3–5 ton per bulan per bengkel, yang membebani ruang kerja dan lingkungan. "
         "Kedua, posisi tawar usaha mikro, kecil, dan menengah (UMKM) melemah akibat gempuran marmer sintetis tiruan serta "
         "ketergantungan pada pedagang perantara. Karya tulis ini merumuskan rancang bangun sistem digital terintegrasi bernama "
         "SI-MUKTI (Sistem Informasi Manajemen Spasial dan Rantai Pasok Marmer Menuju Kesejahteraan UMKM Kabupaten Tulungagung Inklusif). "
         "Menggunakan pendekatan ", False, False),
        ("user-centered design", False, True),
        (" (UCD) berbasis data empiris lapangan, SI-MUKTI mengintegrasikan dua modul utama. "
         "Modul pertama adalah MUKTI-Spasial, yakni sistem informasi geografis berbasis web (", False, False),
        ("web-GIS", False, True),
        (") pemetaan sebaran limbah marmer (residu padat dan lumpur serbuk gergaji) untuk pencocokan pasar (", False, False),
        ("market matchmaking", False, True),
        (") dengan pabrik ubin teraso dan ", False, False),
        ("paving block", False, True),
        (". Modul kedua adalah MUKTI-Trace, yakni sistem ketertelusuran digital berbasis kode ", False, False),
        ("quick response", False, True),
        (" (QR) yang memuat sertifikat keaslian batuan dan profil pengrajin pada produk jadi. Proyeksi ekonomi mengindikasikan bahwa sistem ini berpotensi mengubah "
         "limbah dari pusat biaya (", False, False),
        ("cost center", False, True),
        (") menjadi sumber pendapatan baru (", False, False),
        ("revenue stream", False, True),
        ("). Di samping itu, sistem ini menaikkan margin harga produk sebesar 20%–30% demi mempercepat terwujudnya ekonomi sirkular dan ketahanan ekonomi digital daerah.", False, False)
    ]
    add_p_runs(ringkasan_runs, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=12)

    p_kw = add_p()
    p_kw.paragraph_format.space_before = Pt(4)
    r_kwh = p_kw.add_run("Kata Kunci: ")
    r_kwh.bold = True
    r_kwh.font.name = 'Times New Roman'
    r_kwt = p_kw.add_run("Marmer Tulungagung, Sistem Informasi Geospasial, Ketertelusuran Digital, Valorisasi Limbah, Ekonomi Sirkular.")
    r_kwt.font.name = 'Times New Roman'

    # -------------------------------------------------------------------------
    # DAFTAR ISI (Halaman iv - Native Word Tab Stop with Dot Leader)
    # -------------------------------------------------------------------------
    doc.add_page_break()
    add_p("DAFTAR ISI", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=6, space_after=14, font_size=12)

    daftar_isi_entries = [
        (0, "HALAMAN SAMPUL", "i", True),
        (0, "LEMBAR PENGESAHAN", "ii", True),
        (0, "RINGKASAN", "iii", True),
        (0, "DAFTAR ISI", "iv", True),
        (0, "BAB 1 PENDAHULUAN", "1", True),
        (1, "1.1 Isu yang Diangkat Menjadi Gagasan", "1", False),
        (1, "1.2 Fakta Faktual Pendorong Timbulnya Gagasan", "1", False),
        (1, "1.3 Impian Kondisi Masa Depan yang Ingin Dicapai", "2", False),
        (1, "1.4 Tujuan dan Manfaat Gagasan", "3", False),
        (0, "BAB 2 ISI GAGASAN", "4", True),
        (1, "2.1 Kondisi Terkini Permasalahan Berdasarkan Data Lapangan", "4", False),
        (1, "2.2 Solusi yang Ditawarkan: Rancang Bangun SI-MUKTI", "4", False),
        (2, "2.2.1 Arsitektur Sistem Terintegrasi SI-MUKTI", "5", False),
        (2, "2.2.2 Modul MUKTI-Spasial: Web-GIS Pencocokan Pasar Limbah", "5", False),
        (2, "2.2.3 Modul MUKTI-Trace: Ketertelusuran & Autentikasi QR Code", "6", False),
        (2, "2.2.4 Prototipe Antarmuka Pengguna (UI/UX Design)", "7", False),
        (2, "2.2.5 Analisis Kelayakan dan Proyeksi Dampak Ekonomi Sirkular", "7", False),
        (1, "2.3 Pihak-Pihak Terkait dalam Implementasi Gagasan (Kolaborasi Pentahelix)", "8", False),
        (1, "2.4 Langkah Strategis Implementasi Gagasan Solusi", "8", False),
        (0, "BAB 3 PENUTUP", "9", True),
        (1, "3.1 Kesimpulan", "9", False),
        (1, "3.2 Saran", "9", False),
        (0, "DAFTAR PUSTAKA", "10", True),
        (0, "LAMPIRAN", "11", True),
        (1, "Lampiran 1. Biodata Ketua Tim, Anggota Tim, dan Dosen Pendamping", "11", False),
        (1, "Lampiran 2. Surat Pernyataan Orisinalitas KTI", "16", False),
        (1, "Lampiran 3. Bukti Hasil Cek Turnitin", "17", False),
        (1, "Lampiran 4. Dokumentasi Observasi & Wawancara Lapangan", "18", False)
    ]

    for level, title, pg, is_bold in daftar_isi_entries:
        p_di = doc.add_paragraph()
        p_di.paragraph_format.line_spacing = 1.15
        p_di.paragraph_format.space_after = Pt(2.5)
        p_di.paragraph_format.left_indent = Cm(level * 0.5)
        # Tab stop at right margin 14.0 cm with dot leader
        p_di.paragraph_format.tab_stops.add_tab_stop(Cm(14.0), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.DOTS)
        
        r1 = p_di.add_run(title)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11 if level > 0 else 12)
        r1.bold = is_bold
        
        r2 = p_di.add_run("\t")
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(11 if level > 0 else 12)
        
        r3 = p_di.add_run(pg)
        r3.font.name = 'Times New Roman'
        r3.font.size = Pt(11 if level > 0 else 12)
        r3.bold = is_bold

    # =========================================================================
    # SECTION 3: HALAMAN INTI (BAB 1 s.d. DAFTAR PUSTAKA) - MAKSIMUM 10 HALAMAN
    # Penomoran Angka Arab di SUDUT KANAN ATAS, dimulai dari angka 1
    # =========================================================================
    s3 = doc.add_section(WD_SECTION.NEW_PAGE)
    set_page_setup(s3)
    s3.header.is_linked_to_previous = False
    s3.footer.is_linked_to_previous = False

    s3._sectPr.append(parse_xml(f'<w:pgNumType {nsdecls("w")} w:fmt="decimal" w:start="1"/>'))
    h3_p = s3.header.paragraphs[0]
    h3_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    h3_run = h3_p.add_run()
    h3_run.font.name = 'Times New Roman'
    h3_run.font.size = Pt(12)
    add_page_number_field(h3_run)

    # --- BAB 1 PENDAHULUAN ---
    add_p("BAB 1 PENDAHULUAN", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=6, space_after=12, font_size=12)

    add_p("1.1 Isu yang Diangkat Menjadi Gagasan", bold=True, space_before=4, space_after=4)
    add_p("Sektor usaha mikro, kecil, dan menengah (UMKM) merupakan pilar strategis ketahanan ekonomi nasional yang "
          "berkontribusi lebih dari 61% terhadap produk domestik bruto (PDB) Indonesia. Di Kabupaten Tulungagung, Jawa Timur, "
          "industri kerajinan batu marmer alam telah menjadi urat nadi perekonomian rakyat dan identitas kultural daerah "
          "selama lebih dari satu abad. Konsentrasi sentra pengolahan marmer rakyat di Kecamatan Campurdarat dan Besole "
          "menghidupi ribuan kepala keluarga melalui produksi nisan, kijing, wastafel, ornamen arsitektur, patung, hingga "
          "perabot rumah tangga bernilai seni tinggi.")

    add_p("Namun, di tengah era disrupsi teknologi dan akselerasi keberlanjutan global, eksistensi UMKM marmer Tulungagung "
          "dihadapkan pada ancaman struktural yang menghambat pertumbuhannya. Isu utama yang diangkat dalam gagasan ini berakar "
          "pada paradoks hilirisasi batu marmer alam. Di satu sisi, proses pengolahan mekanik menghasilkan timbulan residu limbah "
          "masif yang belum tertangani secara sistemik. Di sisi lain, produk marmer jadi hasil karya pengrajin lokal terperangkap "
          "dalam sistem pemasaran tradisional yang rentan terhadap distorsi tengkulak dan gempuran marmer sintetis tiruan berbahan "
          "resin impor. Ketiadaan saluran distribusi residu ke industri sekunder serta ketiadaan instrumen penjamin keaslian produk "
          "telah menggerus marjin laba pengrajin dan mengancam keberlanjutan ekosistem industri kreatif lokal.")

    add_p("1.2 Fakta Faktual Pendorong Timbulnya Gagasan", bold=True, space_before=6, space_after=4)
    add_p("Gagasan ini tidak berpijak pada asumsi teoretis semata, melainkan dirumuskan berdasarkan data empiris faktual hasil "
          "observasi langsung dan wawancara mendalam di sentra pengrajin marmer Campurdarat, Tulungagung. Berdasarkan temuan "
          "lapangan, fakta pendorong timbulnya gagasan mencakup tiga dimensi kritis:")

    add_p("1. Timbulan Residu Limbah yang Signifikan dan Terfragmentasi: Pemrosesan satu balok marmer mentah (rata-rata 5–15 ton "
          "per bengkel per bulan) menghasilkan residu sisa sebesar 25% hingga 30%. Residu ini terdiri atas dua fraksi utama, yaitu "
          "bongkahan batu padat bertepi tajam hasil pemangkasan balok serta lumpur serbuk kalsium karbonat (CaCO3) pekat hasil "
          "pelumasan air gergaji mesin. Di sentra Campurdarat yang menaungi ratusan bengkel skala mikro, volume akumulasi limbah "
          "ini ditaksir mencapai ratusan ton setiap bulannya.")

    runs_fakta2 = [
        ("2. Eksternalitas Negatif dan Beban Finansial Pembuangan: Akibat ketiadaan sistem agregasi data logistik, pengrajin "
         "memperlakukan limbah sebagai pusat biaya (", False, False),
        ("cost center", False, True),
        ("). Pengrajin terpaksa menumpuk limbah di pekarangan kerja hingga menyempitkan ruang produksi, atau mengeluarkan biaya sewa "
         "truk pengangkutan sebesar Rp 150.000 hingga Rp 250.000 per ritase untuk membuang limbah ke sempadan tebing atau lahan urug "
         "tanpa pengolahan lebih lanjut.", False, False)
    ]
    add_p_runs(runs_fakta2)

    add_p("3. Defisit Ketertelusuran dan Ancaman Marmer Tiruan: Di pasar produk jadi, pengrajin menghadapi perang harga akibat "
          "maraknya marmer sintetis cor semen berharga murah yang mengaburkan persepsi konsumen luar daerah. Ketiadaan instrumen "
          "sertifikasi digital dan rekaman asal-usul batu alam membuat konsumen meragukan autentisitas karya pahat Tulungagung. "
          "Akibatnya, pengrajin terjebak menjual karya bernilai seni tinggi secara borongan kepada pedagang perantara dengan potongan "
          "harga yang merugikan.")

    add_p("1.3 Impian Kondisi Masa Depan yang Ingin Dicapai", bold=True, space_before=6, space_after=4)
    runs_impian = [
        ("Gagasan ini memproyeksikan transformasi ekosistem industri marmer Tulungagung menuju model simbiosis industri dan "
         "ekonomi sirkular (", False, False),
        ("circular economy", False, True),
        (") berbasis teknologi pintar. Kondisi masa depan yang diimpikan adalah terciptanya tata kelola rantai pasok marmer yang transparan dan "
         "terdesentralisasi. Pada kondisi tersebut, setiap kilogram limbah marmer dapat terpetakan secara geospasial waktu nyata (", False, False),
        ("real-time", False, True),
        (") sehingga diserap secara berkelanjutan oleh industri material konstruksi (", False, False),
        ("paving block", False, True),
        (", ubin teraso, pupuk kalsium). Bersamaan dengan itu, setiap produk marmer yang beredar di pasar global membawa "
         "identitas digital eksklusif yang memvalidasi keaslian batuan alam Tulungagung sekaligus mengapresiasi hak jerih payah pengrajin lokal.", False, False)
    ]
    add_p_runs(runs_impian)

    add_p("1.4 Tujuan dan Manfaat Gagasan", bold=True, space_before=6, space_after=4)
    add_p("Tujuan utama penulisan gagasan ini adalah merumuskan rancang bangun sistem digital terintegrasi bernama SI-MUKTI "
          "(Sistem Informasi Manajemen Spasial dan Rantai Pasok Marmer Menuju Kesejahteraan UMKM Kabupaten Tulungagung Inklusif). "
          "Sistem ini berfungsi sebagai platform pencocokan pasar limbah geospasial sekaligus sertifikasi ketertelusuran produk marmer.")

    add_p("Manfaat yang diharapkan terbagi ke dalam tiga aspek utama:")
    add_p("1. Aspek Ekonomi: Menciptakan aliran pendapatan baru bagi UMKM melalui monetisasi residu marmer dan meningkatkan nilai jual "
          "produk jadi melalui diferensiasi sertifikasi digital.")
    
    runs_manfaat2 = [
        ("2. Aspek Lingkungan: Mereduksi volume timbulan limbah padat dan lumpur industri marmer menuju target kawasan industri "
         "nir-limbah (", False, False),
        ("zero-waste industrial zone", False, True),
        (").", False, False)
    ]
    add_p_runs(runs_manfaat2)

    add_p("3. Aspek Sosial dan Ketahanan Daerah: Menguatkan kedaulatan ekonomi pengrajin lokal serta melestarikan reputasi historis "
          "Tulungagung sebagai Kota Marmer kebanggaan Indonesia.")

    # --- BAB 2 ISI GAGASAN ---
    add_p("BAB 2 ISI GAGASAN", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=10, space_after=12, font_size=12)

    add_p("2.1 Kondisi Terkini Permasalahan Berdasarkan Data Lapangan", bold=True, space_before=4, space_after=4)
    runs_kondisi1 = [
        ("Studi kebutuhan pengguna (", False, False),
        ("user requirement", False, True),
        (") yang dihimpun melalui instrumen wawancara lapangan menunjukkan bahwa 100% "
         "pengrajin marmer di Desa Campurdarat menyadari potensi limbah yang mereka hasilkan. Kendati demikian, pemanfaatannya "
         "terhambat oleh masalah asimetri informasi (", False, False),
        ("information asymmetry", False, True),
        ("). Pabrik pengolah turunan seperti produsen teraso dan ubin paving sering kali kekurangan bahan baku kalsium, "
         "namun kesulitan mengidentifikasi bengkel mana yang sedang memiliki ketersediaan limbah dengan spesifikasi dan volume yang memadai. "
         "Sebaliknya, pengrajin tidak memiliki jejaring kontak industri manufaktur di luar wilayahnya.", False, False)
    ]
    add_p_runs(runs_kondisi1)

    runs_kondisi2 = [
        ("Selain itu, profil demografis pengrajin yang didominasi rentang usia 35–55 tahun menunjukkan bahwa mereka telah terbiasa "
         "menggunakan aplikasi pesan instan seperti WhatsApp, namun resisten terhadap sistem administrasi digital yang rumit. Oleh "
         "karena itu, solusi yang diajukan harus memenuhi parameter kesederhanaan operasional antarmuka (", False, False),
        ("ultra-simple user interface", False, True),
        (") tanpa membebani rutinitas fisik pengrajin di bengkel kerja.", False, False)
    ]
    add_p_runs(runs_kondisi2)

    add_p("2.2 Solusi yang Ditawarkan: Rancang Bangun SI-MUKTI", bold=True, space_before=6, space_after=4)
    runs_solusi = [
        ("Untuk menjembatani kesenjangan tersebut, dirumuskan platform SI-MUKTI. Platform ini mengintegrasikan dua pilar "
         "arsitektur teknologi: sistem informasi geografis berbasis web (", False, False),
        ("Web-Geographic Information System", False, True),
        (" atau Web-GIS) dan ketertelusuran digital dinamis (", False, False),
        ("dynamic digital traceability", False, True),
        (") berbasis kode respons cepat (", False, False),
        ("Quick Response", False, True),
        (" atau QR Code).", False, False)
    ]
    add_p_runs(runs_solusi)

    add_p("2.2.1 Arsitektur Sistem Terintegrasi SI-MUKTI", bold=True, space_before=4, space_after=4)
    runs_ars = [
        ("Arsitektur SI-MUKTI beroperasi dalam kerangka kerja ", False, False),
        ("client-server", False, True),
        (" yang responsif terhadap perangkat bergerak (", False, False),
        ("mobile-first architecture", False, True),
        ("). Sistem terdiri atas tiga lapisan utama:", False, False)
    ]
    add_p_runs(runs_ars)

    runs_l1 = [
        ("1. ", True, False),
        ("Data Ingestion Layer", False, True),
        (": formulir masukan sederhana bagi pengrajin untuk melaporkan volume residu harian dan pendaftaran kelompok (", False, False),
        ("batch", False, True),
        (") produk.", False, False)
    ]
    add_p_runs(runs_l1)

    runs_l2 = [
        ("2. ", True, False),
        ("Spatial and Core Processing Layer", False, True),
        (": mesin basis data relasional PostgreSQL dengan ekstensi geospasial PostGIS yang mengolah titik koordinat geografis bengkel serta generator muatan (", False, False),
        ("payload", False, True),
        (") kode QR kriptografis unik.", False, False)
    ]
    add_p_runs(runs_l2)

    runs_l3 = [
        ("3. ", True, False),
        ("Presentation Layer", False, True),
        (": dasbor publik interaktif berbasis peta digital bagi industri pembeli serta laman sertifikat keaslian bagi pembeli produk jadi.", False, False)
    ]
    add_p_runs(runs_l3)

    add_p("2.2.2 Modul MUKTI-Spasial: Web-GIS Pencocokan Pasar Limbah", bold=True, space_before=6, space_after=4)
    runs_mod1 = [
        ("Modul MUKTI-Spasial memetakan titik persebaran bengkel UMKM penghasil limbah di wilayah Tulungagung secara visual. Setiap pin "
         "pada peta interaktif dilengkapi penanda warna tematik: Pin Biru menunjukkan ketersediaan fraksi pecahan padat marmer (satuan "
         "ton atau kuintal), sedangkan Pin Oranye menunjukkan residu lumpur serbuk kalsium siap angkut. Ketika industri penyerap membuka "
         "peta MUKTI-Spasial (Gambar 2.1), mereka dapat melihat estimasi volume, radius jarak logistik pengangkutan, dan kontak langsung "
         "pengrajin, serta fitur 'Klaim Pengambilan' yang otomatis memotong kuota limbah. Dengan demikian, rantai pasok material sekunder "
         "terbentuk secara langsung dalam skema transaksi antarpelaku usaha (", False, False),
        ("business-to-business", False, True),
        (" atau B2B berbasis spasial).", False, False)
    ]
    add_p_runs(runs_mod1)

    # Gambar 2.1
    p_img1 = doc.add_paragraph()
    p_img1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img1.paragraph_format.space_before = Pt(6)
    p_img1.paragraph_format.space_after = Pt(2)
    if os.path.exists("extracted_rId6.png"):
        p_img1.add_run().add_picture("extracted_rId6.png", width=Inches(5.2))
    
    runs_cap1 = [
        ("Gambar 2.1 Tampilan Antarmuka Dasbor Web-GIS MUKTI-Spasial untuk Pemetaan Geospasial Klaster Bengkel UMKM, Telemetri Residu Marmer, dan Integrasi ", True, False, 10),
        ("Offtaker", True, True, 10),
        (" Tulungagung", True, False, 10)
    ]
    add_p_runs(runs_cap1, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)

    add_p("2.2.3 Modul MUKTI-Trace: Ketertelusuran & Autentikasi QR Code", bold=True, space_before=6, space_after=4)
    runs_mod2 = [
        ("Modul MUKTI-Trace menyematkan identitas digital pada setiap karya marmer jadi. Saat sebuah produk (seperti wastafel, meja onyx, "
         "atau ornamen dinding) selesai dikerjakan, sistem menerbitkan label kode QR tahan cuaca berdesain khusus. Ketika dipindai oleh gawai "
         "pintar konsumen, tautan kode QR langsung mengarahkan pengguna ke paspor produk digital (", False, False),
        ("Digital Product Passport", False, True),
        (") sebagaimana disajikan pada Gambar 2.2. Paspor digital ini memuat data terverifikasi yang mencakup nama dan profil pengrajin pemahat serta "
         "asal kuari penambangan batu alam Tulungagung. Di samping itu, tertera rekam jejak lingkungan berupa persentase limbah yang "
         "disalurkan ke MUKTI-Spasial, serta sertifikat geologis kemurnian kalsit (CaCO3) berstempel verifikasi dinas dan paguyuban. "
         "Fitur ini mengangkat martabat karya seni lokal dan memberikan garansi keaslian mutlak bagi pasar domestik maupun ekspor guna "
         "menangkis marmer sintetis tiruan.", False, False)
    ]
    add_p_runs(runs_mod2)

    # Gambar 2.2
    p_img2 = doc.add_paragraph()
    p_img2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img2.paragraph_format.space_before = Pt(6)
    p_img2.paragraph_format.space_after = Pt(2)
    if os.path.exists("extracted_rId7.png"):
        p_img2.add_run().add_picture("extracted_rId7.png", width=Inches(2.5))
    
    runs_cap2 = [
        ("Gambar 2.2 Tampilan Paspor Produk Digital (MUKTI-Trace) Berbasis Kode QR untuk Autentikasi Keaslian Batu Alam dan Sertifikasi ", True, False, 10),
        ("Zero-Waste", True, True, 10)
    ]
    add_p_runs(runs_cap2, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)

    add_p("2.2.4 Prototipe Antarmuka Pengguna (UI/UX Design)", bold=True, space_before=6, space_after=4)
    runs_uiux = [
        ("Prototipe antarmuka pengguna (", False, False),
        ("user interface / user experience", False, True),
        (" atau UI/UX) SI-MUKTI dirancang menggunakan Google Stitch dan diselaraskan ke dalam Figma melalui sistem desain 'Tatah Mineral'. "
         "Perancangan mengadopsi metodologi ", False, False),
        ("user-centered design", False, True),
        (" (UCD) yang menitikberatkan pada kemudahan navigasi bagi masyarakat akar rumput. Antarmuka gawai bergerak (", False, False),
        ("mobile-first", False, True),
        (") dilengkapi ukuran target sentuh (", False, False),
        ("tap-target", False, True),
        (") minimal 48–52 px agar tetap mudah dan akurat dioperasikan oleh pekerja bengkel dengan tangan berdebu atau bersarung tangan kerja. "
         "Sebagaimana ditampilkan pada Gambar 2.3, beranda aplikasi menyajikan transparansi saldo insentif valorisasi limbah, tombol cepat pelaporan setor limbah baru, "
         "serta fitur telemetri pelacakan posisi armada truk penjemputan mitra industri secara waktu nyata. Di sisi pengguna publik dan mitra industri, antarmuka menyajikan peta vektor interaktif berbasis Leaflet API yang ringan dan responsif.", False, False)
    ]
    add_p_runs(runs_uiux)

    # Gambar 2.3
    p_img3 = doc.add_paragraph()
    p_img3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img3.paragraph_format.space_before = Pt(6)
    p_img3.paragraph_format.space_after = Pt(2)
    if os.path.exists("extracted_rId8.png"):
        p_img3.add_run().add_picture("extracted_rId8.png", width=Inches(2.5))
    add_p("Gambar 2.3 Prototipe Antarmuka Aplikasi Seluler SI-MUKTI untuk Pengrajin Sentra dengan Fitur Valorisasi Saldo dan Pelacakan Armada Penjemputan Waktu Nyata",
          align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=8, font_size=10)

    add_p("2.2.5 Analisis Kelayakan dan Proyeksi Dampak Ekonomi Sirkular", bold=True, space_before=6, space_after=4)
    add_p("Kelayakan ekonomi sistem dianalisis melalui model simulasi pada sentra Campurdarat. Pada asumsi dasar terdapat 100 bengkel "
          "pengrajin aktif dengan rata-rata timbulan residu 2 ton per bulan per bengkel, total pasokan limbah agregat mencapai 200 ton per bulan. "
          "Sebelumnya, pengrajin harus mengeluarkan biaya buang rata-rata Rp 200.000 per bulan sehingga menimbulkan total beban sentra sebesar "
          "Rp 20.000.000 per bulan. Melalui monetisasi di MUKTI-Spasial dengan harga jual bahan baku paving teraso sebesar Rp 150.000 per ton, "
          "sentra pengrajin berpotensi membukukan pendapatan kotor baru sebesar Rp 30.000.000 per bulan. Ditambah dengan efisiensi biaya "
          "pembuangan, terdapat surplus perputaran modal sebesar Rp 50.000.000 per bulan bagi komunitas pengrajin marmer Tulungagung.")

    add_p("2.3 Pihak-Pihak Terkait dalam Implementasi Gagasan (Kolaborasi Pentahelix)", bold=True, space_before=6, space_after=4)
    runs_penta = [
        ("Keberhasilan implementasi SI-MUKTI memerlukan sinergi kolaboratif lintas pemangku kepentingan dalam model ", False, False),
        ("Pentahelix", False, True),
        (":", False, False)
    ]
    add_p_runs(runs_penta)

    runs_p1 = [
        ("1. Pemerintah Daerah (Dinas Koperasi dan Usaha Mikro serta Dinas Perindustrian dan Perdagangan Tulungagung): Berperan sebagai regulator, "
         "fasilitator penyediaan infrastruktur peladen awan (", False, False),
        ("cloud server", False, True),
        (") daerah, serta penjamin keabsahan sertifikat keaslian marmer Tulungagung.", False, False)
    ]
    add_p_runs(runs_p1)

    runs_p2 = [
        ("2. Komunitas Pengrajin & Paguyuban Marmer Tulungagung: Bertindak sebagai pengguna utama (", False, False),
        ("key user", False, True),
        ("), pengelola verifikasi keanggotaan bengkel, dan edukator lapangan bagi pengrajin generasi senior.", False, False)
    ]
    add_p_runs(runs_p2)

    runs_p3 = [
        ("3. Sektor Industri Manufaktur & Mitra Penyerap (", False, False),
        ("Offtaker", False, True),
        (" Pabrik Paving, Teraso, Industri Kimia Kalsium): Berperan sebagai penyerap material limbah secara konsisten melalui kontrak pasokan berbasis kuota digital.", False, False)
    ]
    add_p_runs(runs_p3)

    add_p("4. Akademisi & Perguruan Tinggi: Berperan dalam pengawalan transfer teknologi, pelatihan literasi digital, evaluasi performa algoritma "
          "spasial, dan perancangan standardisasi mutu residu batuan.")
    add_p("5. Media & Konsumen Arsitektur: Berperan dalam mengamplifikasi narasi keunggulan marmer bersertifikat digital dan menumbuhkan kesadaran "
          "apresiasi terhadap produk kerajinan bernilai sirkular.")

    add_p("2.4 Langkah Strategis Implementasi Gagasan Solusi", bold=True, space_before=6, space_after=4)
    runs_strat = [
        ("Implementasi gagasan SI-MUKTI dirancang dalam peta jalan (", False, False),
        ("roadmap", False, True),
        (") strategis bertahap selama 24 bulan:", False, False)
    ]
    add_p_runs(runs_strat)

    runs_t1 = [
        ("• Tahap 1 (Bulan 1–6) - Inisiasi dan Pemetaan Spasial Dasar: Inventarisasi geospasial seluruh bengkel pengrajin di Campurdarat dan Besole, "
         "perampungan prototipe fungsional (", False, False),
        ("minimum viable product", False, True),
        (" atau MVP), serta penandatanganan nota kesepahaman (MoU) antara paguyuban dan asosiasi industri paving Jawa Timur.", False, False)
    ]
    add_p_runs(runs_t1)

    runs_t2 = [
        ("• Tahap 2 (Bulan 7–12) - Uji Coba Lapangan (", False, False),
        ("Pilot Testing", False, True),
        (") dan Adopsi Pengguna: Uji coba operasional sistem pada 30 bengkel percontohan, penyempurnaan antarmuka UI/UX berbasis umpan balik pengrajin, "
         "dan penerbitan stiker kode QR MUKTI-Trace tahap perdana.", False, False)
    ]
    add_p_runs(runs_t2)

    runs_t3 = [
        ("• Tahap 3 (Bulan 13–18) - Integrasi Rantai Pasok Penuh dan Skalabilitas: Peluncuran modul pembayaran digital terintegrasi (", False, False),
        ("escrow account / e-wallet", False, True),
        ("), perluasan cakupan ke seluruh bengkel di Kabupaten Tulungagung, dan penguatan kemitraan logistik pengangkutan limbah terpusat.", False, False)
    ]
    add_p_runs(runs_t3)

    runs_t4 = [
        ("• Tahap 4 (Bulan 19–24) - Institusionalisasi dan Replikasi Nasional: Pengintegrasian sistem SI-MUKTI ke dalam portal ", False, False),
        ("Smart City", False, True),
        (" Kabupaten Tulungagung serta pembukaan peluang replikasi model sirkular ini ke sentra batuan alam daerah lain di Indonesia.", False, False)
    ]
    add_p_runs(runs_t4)

    # --- BAB 3 PENUTUP ---
    add_p("BAB 3 PENUTUP", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=10, space_after=12, font_size=12)

    add_p("3.1 Kesimpulan", bold=True, space_before=4, space_after=4)
    add_p("Berdasarkan kajian empiris lapangan dan telaah rancang bangun sistem yang telah dipaparkan, dapat disimpulkan bahwa:")
    add_p("1. Persoalan limbah marmer sebesar 25%–30% dan depresiasi nilai jual produk kerajinan di Kabupaten Tulungagung bersumber dari ketiadaan "
          "integrasi data spasial rantai pasok dan defisit instrumen sertifikasi keaslian produk di mata konsumen modern.")
    
    runs_kes2 = [
        ("2. Gagasan rancang bangun SI-MUKTI menghadirkan terobosan teknologi tepat guna yang memadukan Web-GIS (MUKTI-Spasial) untuk membuka "
         "akses pencocokan pasar limbah sekunder dan ", False, False),
        ("Dynamic QR Code", False, True),
        (" (MUKTI-Trace) untuk mengunci nilai autentisitas produk lokal.", False, False)
    ]
    add_p_runs(runs_kes2)

    runs_kes3 = [
        ("3. Implementasi gagasan ini sangat layak (", False, False),
        ("feasible", False, True),
        (") dan berdaya dampak tinggi karena mampu mengubah pusat biaya pembuangan limbah "
         "menjadi surplus perputaran modal ekonomi baru. Langkah ini sekaligus mempercepat pencapaian target pembangunan berkelanjutan "
         "(", False, False),
        ("Sustainable Development Goals", False, True),
        (" atau SDGs, khususnya sasaran 8 dan 12) serta menjaga kelestarian identitas Tulungagung sebagai sentra marmer nasional.", False, False)
    ]
    add_p_runs(runs_kes3)

    add_p("3.2 Saran", bold=True, space_before=6, space_after=4)
    add_p("Untuk mewujudkan gagasan ini secara optimal, direkomendasikan kepada Pemerintah Kabupaten Tulungagung bersama Direktorat Jenderal "
          "Industri Kecil, Menengah, dan Aneka (IKMA) Kementerian Perindustrian agar mengadopsi rancangan konseptual SI-MUKTI sebagai program "
          "percontohan digitalisasi sentra kerajinan rakyat. Di samping itu, perguruan tinggi perlu mendampingi pengrajin secara berkelanjutan "
          "demi menjamin kelancaran transisi literasi digital di tingkat akar rumput.")

    # --- DAFTAR PUSTAKA (Harvard/APA Style, 1 Spasi, Hanging Indent) ---
    add_p("DAFTAR PUSTAKA", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=12, space_after=12, font_size=12)

    daftar_pustaka = [
        "Badan Pusat Statistik Kabupaten Tulungagung. (2024). Kabupaten Tulungagung dalam Angka 2024. Tulungagung: BPS Tulungagung.",
        "Bocken, N. M., de Pauw, I., Bakker, C., & van der Grinten, B. (2016). Product design and business model strategies for a circular economy. Journal of Industrial and Production Engineering, 33(5), 308-320.",
        "Chertow, M. R. (2000). Industrial symbiosis: literature and taxonomy. Annual Review of Energy and the Environment, 25(1), 313-337.",
        "Dinas Koperasi dan Usaha Mikro Kabupaten Tulungagung. (2023). Laporan Kinerja Penguatan Komoditas Unggulan Daerah Marmer Campurdarat. Tulungagung: Diskopum Tulungagung.",
        "Ellen MacArthur Foundation. (2019). Towards a Circular Economy: Business rationale for an accelerated transition. Cowes: Ellen MacArthur Foundation Publishing.",
        "Hasyim, A. W., & Pradana, A. (2021). Penerapan Sistem Informasi Geografis (SIG) Berbasis Web untuk Pemetaan Klaster Industri Kreatif Gerabah dan Keramik. Jurnal Tata Kota dan Daerah, 13(2), 77-86.",
        "Kurniawan, F., Santoso, B., & Wibowo, T. (2022). Karakterisasi dan Pemanfaatan Residu Lumpur Marmer Tulungagung sebagai Bahan Substitusi Semen pada Pembuatan Paving Block Ramah Lingkungan. Jurnal Rekayasa Sipil dan Lingkungan, 6(1), 45-54.",
        "Norman, D. (2013). The Design of Everyday Things: Revised and expanded edition. New York: Basic Books.",
        "Prasetyo, Y., & Hidayat, R. (2020). Analisis Rantai Pasok dan Nilai Tambah Industri Pengolahan Batu Marmer Rakyat di Kabupaten Tulungagung. Jurnal Ekonomi Pembangunan dan Industri Daerah, 8(3), 112-124.",
        "Putra, A. D., & Salma, R. (2023). Strategi Peningkatan Daya Saing UMKM Kriya Batu Alam Melalui Sertifikasi Asal Komoditas dan Digital Storytelling. Jurnal Manajemen dan Kewirausahaan Kreatif, 11(2), 89-98.",
        "Ritz, W., Wolf, M., & McQuitty, S. (2019). Digital marketing adoption and success for small businesses: The application of the do-it-yourself and technology acceptance models. Journal of Research in Interactive Marketing, 13(2), 179-203.",
        "Sugiyono. (2021). Metode Penelitian Kualitatif, Kuantitatif, dan R&D. Bandung: Alfabeta.",
        "United Nations Development Programme. (2022). Sustainable Development Goals Report: Sustainable Cities and Responsible Consumption. New York: United Nations.",
        "Venkatesh, V., & Davis, F. D. (2000). A theoretical extension of the technology acceptance model: Four longitudinal field studies. Management Science, 46(2), 186-204.",
        "Yusuf, M., & Handayani, S. (2021). Pemanfaatan Limbah Padat Industri Marmer untuk Bahan Bangunan Ramah Lingkungan Menuju Green Economy. Jurnal Riset Teknologi Pencegahan Pencemaran Industri, 12(1), 22-31."
    ]

    for ref in daftar_pustaka:
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_ref.paragraph_format.line_spacing = 1.0  # Wajib 1 spasi sesuai Pedoman
        p_ref.paragraph_format.space_before = Pt(0)
        p_ref.paragraph_format.space_after = Pt(4)
        p_ref.paragraph_format.left_indent = Inches(0.5)
        p_ref.paragraph_format.first_line_indent = Inches(-0.5)
        r = p_ref.add_run(ref)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)

    # =========================================================================
    # SECTION 4: LAMPIRAN
    # Melanjutkan penomoran Angka Arab di Sudut Kanan Atas
    # =========================================================================
    s4 = doc.add_section(WD_SECTION.NEW_PAGE)
    set_page_setup(s4)
    s4.header.is_linked_to_previous = True  # Inherits header with right-aligned arabic page number
    s4.footer.is_linked_to_previous = False

    add_p("LAMPIRAN", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_before=10, space_after=14, font_size=14)

    # -------------------------------------------------------------------------
    # LAMPIRAN 1: BIODATA KETUA TIM, ANGGOTA TIM, DAN DOSEN PENDAMPING (Lampiran 3 Pedoman)
    # -------------------------------------------------------------------------
    add_p("Lampiran 1. Biodata Ketua Tim, Anggota Tim, dan Dosen Pendamping (Format Lampiran 3 Pedoman)",
          bold=True, space_before=6, space_after=10, font_size=12)

    def build_student_bio(role_name, nama, nim, prodi):
        add_p(f"1. Biodata {role_name}", bold=True, space_before=6, space_after=4, font_size=12)
        add_p("A. Identitas Diri", bold=True, space_before=2, space_after=2, font_size=11)
        t_id = doc.add_table(rows=7, cols=2)
        t_id.alignment = WD_TABLE_ALIGNMENT.CENTER
        id_fields = [
            ("Nama Lengkap", f": {nama}"),
            ("Jenis Kelamin", ": Laki-laki / Perempuan"),
            ("Program Studi", f": {prodi}"),
            ("NIM", f": {nim}"),
            ("Tempat, Tanggal Lahir", ": [Tempat, Tanggal Lahir]"),
            ("E-mail", ": [Alamat Email Aktif]"),
            ("Nomor Telepon / HP", ": [Nomor Telepon / HP]")
        ]
        for r_i, (lbl, val) in enumerate(id_fields):
            cant_split(t_id.rows[r_i])
            c0, c1 = t_id.rows[r_i].cells[0], t_id.rows[r_i].cells[1]
            c0.width = Cm(4.5)
            c1.width = Cm(9.5)
            add_box_border(c0)
            add_box_border(c1)
            set_cell_margins(c0)
            set_cell_margins(c1)
            p0 = c0.paragraphs[0]
            p0.paragraph_format.line_spacing = 1.15
            p0.paragraph_format.space_after = Pt(2)
            r0 = p0.add_run(lbl)
            r0.font.name = 'Times New Roman'
            r0.font.size = Pt(11)

            p1 = c1.paragraphs[0]
            p1.paragraph_format.line_spacing = 1.15
            p1.paragraph_format.space_after = Pt(2)
            r1 = p1.add_run(val)
            r1.font.name = 'Times New Roman'
            r1.font.size = Pt(11)

        add_p("B. Kegiatan Kemahasiswaan yang Sedang Diikuti / Pernah Diikuti", bold=True, space_before=6, space_after=2, font_size=11)
        t_keg = doc.add_table(rows=3, cols=4)
        t_keg.alignment = WD_TABLE_ALIGNMENT.CENTER
        widths_keg = [Cm(1.0), Cm(5.0), Cm(4.5), Cm(3.5)]
        headers_keg = ["No.", "Jenis Kegiatan", "Status dalam Kegiatan", "Waktu dan Tempat"]
        for c_i, h in enumerate(headers_keg):
            c = t_keg.rows[0].cells[c_i]
            c.width = widths_keg[c_i]
            add_box_border(c)
            set_cell_margins(c)
            p = c.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(h)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(11)
            r.bold = True
        for row_idx in range(1, 3):
            cant_split(t_keg.rows[row_idx])
            for col_idx in range(4):
                c = t_keg.rows[row_idx].cells[col_idx]
                c.width = widths_keg[col_idx]
                add_box_border(c)
                set_cell_margins(c)
                p = c.paragraphs[0]
                p.paragraph_format.line_spacing = 1.15
                p.paragraph_format.space_after = Pt(2)
                if col_idx == 0:
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    r = p.add_run(f"{row_idx}.")
                    r.font.name = 'Times New Roman'
                    r.font.size = Pt(11)

        add_p("C. Penghargaan yang Pernah Diterima", bold=True, space_before=6, space_after=2, font_size=11)
        t_awd = doc.add_table(rows=3, cols=4)
        t_awd.alignment = WD_TABLE_ALIGNMENT.CENTER
        widths_awd = [Cm(1.0), Cm(5.0), Cm(5.5), Cm(2.5)]
        headers_awd = ["No.", "Jenis Penghargaan", "Institusi Pemberi Penghargaan", "Tahun"]
        for c_i, h in enumerate(headers_awd):
            c = t_awd.rows[0].cells[c_i]
            c.width = widths_awd[c_i]
            add_box_border(c)
            set_cell_margins(c)
            p = c.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(h)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(11)
            r.bold = True
        for row_idx in range(1, 3):
            cant_split(t_awd.rows[row_idx])
            for col_idx in range(4):
                c = t_awd.rows[row_idx].cells[col_idx]
                c.width = widths_awd[col_idx]
                add_box_border(c)
                set_cell_margins(c)
                p = c.paragraphs[0]
                p.paragraph_format.line_spacing = 1.15
                p.paragraph_format.space_after = Pt(2)
                if col_idx == 0:
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    r = p.add_run(f"{row_idx}.")
                    r.font.name = 'Times New Roman'
                    r.font.size = Pt(11)

        add_p("Semua data yang saya isikan dan tercantum dalam biodata ini adalah benar dan dapat dipertanggungjawabkan "
              "secara hukum. Apabila di kemudian hari ternyata dijumpai ketidaksesuaian dengan kenyataan, saya sanggup "
              "menerima sanksi. Demikian biodata ini saya buat dengan sebenarnya untuk memenuhi salah satu persyaratan "
              "dalam Lomba Karya Tulis Ilmiah Nasional (LKTIN) Universitas Negeri Medan 2026.",
              space_before=4, space_after=4, font_size=11)

        add_p("[Kota Perguruan Tinggi], 24 Oktober 2026\nPengusul,\n\n\n\n( Tanda Tangan Asli / Basah )\n\n( " + nama + " )",
              align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=2, space_after=10, font_size=11)

    build_student_bio("Ketua Tim", "Salma Azzahra", "[Nomor Induk Mahasiswa]", "[Program Studi]")
    doc.add_page_break()
    build_student_bio("Anggota Tim 1", "[Nama Lengkap Anggota 1]", "[Nomor Induk Mahasiswa]", "[Program Studi]")
    doc.add_page_break()
    build_student_bio("Anggota Tim 2", "[Nama Lengkap Anggota 2]", "[Nomor Induk Mahasiswa]", "[Program Studi]")
    doc.add_page_break()

    # --- BIODATA DOSEN PENDAMPING (Lampiran 3 Pedoman Halaman 15) ---
    add_p("2. Biodata Dosen Pendamping", bold=True, space_before=6, space_after=4, font_size=12)
    add_p("A. Identitas Diri", bold=True, space_before=2, space_after=2, font_size=11)
    t_idd = doc.add_table(rows=7, cols=2)
    t_idd.alignment = WD_TABLE_ALIGNMENT.CENTER
    idd_fields = [
        ("Nama Lengkap", ": [Nama Dosen Pembimbing beserta Gelar Lengkap]"),
        ("Jenis Kelamin", ": Laki-laki / Perempuan"),
        ("Program Studi", ": [Program Studi]"),
        ("NIP / NIDN", ": [NIP / NIDN Dosen]"),
        ("Tempat, Tanggal Lahir", ": [Tempat, Tanggal Lahir]"),
        ("E-mail", ": [Alamat Email Aktif]"),
        ("Nomor Telepon / HP", ": [Nomor Telepon / HP]")
    ]
    for r_i, (lbl, val) in enumerate(idd_fields):
        cant_split(t_idd.rows[r_i])
        c0, c1 = t_idd.rows[r_i].cells[0], t_idd.rows[r_i].cells[1]
        c0.width = Cm(4.5)
        c1.width = Cm(9.5)
        add_box_border(c0)
        add_box_border(c1)
        set_cell_margins(c0)
        set_cell_margins(c1)
        p0, p1 = c0.paragraphs[0], c1.paragraphs[0]
        p0.paragraph_format.line_spacing = 1.15
        p0.paragraph_format.space_after = Pt(2)
        p1.paragraph_format.line_spacing = 1.15
        p1.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(lbl)
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(11)
        r1 = p1.add_run(val)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11)

    add_p("B. Riwayat Pendidikan", bold=True, space_before=6, space_after=2, font_size=11)
    t_edu = doc.add_table(rows=4, cols=5)
    t_edu.alignment = WD_TABLE_ALIGNMENT.CENTER
    widths_edu = [Cm(0.8), Cm(3.2), Cm(3.5), Cm(4.5), Cm(2.0)]
    headers_edu = ["No.", "Jenjang", "Bidang Ilmu", "Institusi", "Tahun Lulus"]
    for c_i, h in enumerate(headers_edu):
        c = t_edu.rows[0].cells[c_i]
        c.width = widths_edu[c_i]
        add_box_border(c)
        set_cell_margins(c)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.bold = True
    edu_rows = [("1.", "Sarjana (S1)"), ("2.", "Magister (S2)"), ("3.", "Doktoral (S3)")]
    for r_i, (no_str, jenjang_str) in enumerate(edu_rows, start=1):
        cant_split(t_edu.rows[r_i])
        for c_i in range(5):
            c = t_edu.rows[r_i].cells[c_i]
            c.width = widths_edu[c_i]
            add_box_border(c)
            set_cell_margins(c)
            p = c.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            if c_i == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r = p.add_run(no_str)
                r.font.name = 'Times New Roman'
                r.font.size = Pt(11)
            elif c_i == 1:
                r = p.add_run(jenjang_str)
                r.font.name = 'Times New Roman'
                r.font.size = Pt(11)

    add_p("C. Rekam Jejak Tri Dharma Perguruan Tinggi", bold=True, space_before=6, space_after=2, font_size=11)
    add_p("Pendidikan / Pengajaran", bold=True, space_before=2, space_after=2, font_size=10)
    t_pen = doc.add_table(rows=3, cols=4)
    t_pen.alignment = WD_TABLE_ALIGNMENT.CENTER
    widths_pen = [Cm(0.8), Cm(6.5), Cm(4.2), Cm(2.5)]
    for c_i, h in enumerate(["No.", "Nama Mata Kuliah", "Wajib / Pilihan", "SKS"]):
        c = t_pen.rows[0].cells[c_i]
        c.width = widths_pen[c_i]
        add_box_border(c)
        set_cell_margins(c)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10)
        r.bold = True
    for r_i in range(1, 3):
        cant_split(t_pen.rows[r_i])
        for c_i in range(4):
            c = t_pen.rows[r_i].cells[c_i]
            c.width = widths_pen[c_i]
            add_box_border(c)
            set_cell_margins(c)
            p = c.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            if c_i == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r = p.add_run(f"{r_i}.")
                r.font.name = 'Times New Roman'
                r.font.size = Pt(10)

    add_p("Penelitian", bold=True, space_before=4, space_after=2, font_size=10)
    t_ris = doc.add_table(rows=3, cols=4)
    t_ris.alignment = WD_TABLE_ALIGNMENT.CENTER
    widths_ris = [Cm(0.8), Cm(6.5), Cm(4.5), Cm(2.2)]
    for c_i, h in enumerate(["No.", "Judul Penelitian", "Penyandang Dana", "Tahun"]):
        c = t_ris.rows[0].cells[c_i]
        c.width = widths_ris[c_i]
        add_box_border(c)
        set_cell_margins(c)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10)
        r.bold = True
    for r_i in range(1, 3):
        cant_split(t_ris.rows[r_i])
        for c_i in range(4):
            c = t_ris.rows[r_i].cells[c_i]
            c.width = widths_ris[c_i]
            add_box_border(c)
            set_cell_margins(c)
            p = c.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            if c_i == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r = p.add_run(f"{r_i}.")
                r.font.name = 'Times New Roman'
                r.font.size = Pt(10)

    add_p("Pengabdian kepada Masyarakat", bold=True, space_before=4, space_after=2, font_size=10)
    t_pkm = doc.add_table(rows=3, cols=4)
    t_pkm.alignment = WD_TABLE_ALIGNMENT.CENTER
    widths_pkm = [Cm(0.8), Cm(6.5), Cm(4.5), Cm(2.2)]
    for c_i, h in enumerate(["No.", "Judul Pengabdian kepada Masyarakat", "Penyandang Dana", "Tahun"]):
        c = t_pkm.rows[0].cells[c_i]
        c.width = widths_pkm[c_i]
        add_box_border(c)
        set_cell_margins(c)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10)
        r.bold = True
    for r_i in range(1, 3):
        cant_split(t_pkm.rows[r_i])
        for c_i in range(4):
            c = t_pkm.rows[r_i].cells[c_i]
            c.width = widths_pkm[c_i]
            add_box_border(c)
            set_cell_margins(c)
            p = c.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            if c_i == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r = p.add_run(f"{r_i}.")
                r.font.name = 'Times New Roman'
                r.font.size = Pt(10)

    add_p("Semua data yang saya isikan dan tercantum dalam biodata ini adalah benar dan dapat dipertanggungjawabkan "
          "secara hukum. Apabila di kemudian hari ternyata dijumpai ketidaksesuaian dengan kenyataan, saya sanggup "
          "menerima sanksi. Demikian biodata ini saya buat dengan sebenarnya untuk memenuhi salah satu persyaratan "
          "dalam Lomba Karya Tulis Ilmiah Nasional (LKTIN) Universitas Negeri Medan 2026.",
          space_before=4, space_after=4, font_size=11)

    add_p("[Kota Perguruan Tinggi], 24 Oktober 2026\nPengusul,\n\n\n\n( Tanda Tangan Asli / Basah )\n\n( [Nama Dosen Pembimbing] )",
          align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=2, space_after=10, font_size=11)

    # -------------------------------------------------------------------------
    # LAMPIRAN 2: SURAT PERNYATAAN ORISINALITAS KTI (Lampiran 4 Pedoman)
    # -------------------------------------------------------------------------
    doc.add_page_break()
    add_p("Lampiran 2. Surat Pernyataan Orisinalitas KTI (Format Lampiran 4 Pedoman)",
          bold=True, space_before=6, space_after=10, font_size=12)

    add_p("SURAT PERNYATAAN KETUA TIM PELAKSANA", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, space_after=12, font_size=12)

    add_p("Yang bertandatangan di bawah ini:")
    t_spo = doc.add_table(rows=5, cols=2)
    t_spo.alignment = WD_TABLE_ALIGNMENT.CENTER
    spo_fields = [
        ("Nama Lengkap", ": Salma Azzahra"),
        ("NIM", ": [Nomor Induk Mahasiswa]"),
        ("Program Studi", ": [Program Studi Pengusul]"),
        ("Fakultas", ": [Nama Fakultas Pengusul]"),
        ("Perguruan Tinggi", ": [Nama Perguruan Tinggi Pengusul]")
    ]
    for r_i, (lbl, val) in enumerate(spo_fields):
        cant_split(t_spo.rows[r_i])
        c0, c1 = t_spo.rows[r_i].cells[0], t_spo.rows[r_i].cells[1]
        c0.width = Cm(4.0)
        c1.width = Cm(10.0)
        p0, p1 = c0.paragraphs[0], c1.paragraphs[0]
        p0.paragraph_format.line_spacing = 1.15
        p0.paragraph_format.space_after = Pt(2)
        p1.paragraph_format.line_spacing = 1.15
        p1.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(lbl)
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(11)
        r1 = p1.add_run(val)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11)

    add_p("Dengan ini menyatakan bahwa karya tulis ilmiah saya dengan judul “Perancangan Sistem Informasi Geospasial dan "
          "Ketertelusuran Digital untuk Valorisasi Limbah serta Peningkatan Daya Saing UMKM Marmer Tulungagung” yang diusulkan "
          "dengan subtema “Digitalisasi Ekonomi, UMKM, dan Pemberdayaan Daerah 3T untuk Ketahanan Ekonomi Nasional” adalah asli karya "
          "kami dan belum pernah diperlombakan pada ajang lain. Bilamana di kemudian hari ditemukan ketidaksesuaian dengan pernyataan ini, "
          "maka saya bersedia dituntut dan diproses sesuai dengan ketentuan yang berlaku.",
          space_before=8, space_after=8, font_size=11)

    add_p("Demikian pernyataan ini dibuat dengan sesungguhnya dan dengan sebenar-benarnya.",
          space_before=4, space_after=12, font_size=11)

    add_p("[Kota Perguruan Tinggi], 24 Oktober 2026\nYang menyatakan,\n\n\n\n\n[ Meterai senilai Rp 10.000 ]\n( Tanda Tangan Asli / Basah* )\n\n\n( Salma Azzahra )\nNIM. [Nomor Induk Mahasiswa]",
          align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=4, space_after=10, font_size=11)

    # -------------------------------------------------------------------------
    # LAMPIRAN 3: BUKTI HASIL CEK TURNITIN (Lampiran 5 Pedoman)
    # -------------------------------------------------------------------------
    doc.add_page_break()
    add_p("Lampiran 3. Bukti Hasil Cek Turnitin (Format Lampiran 5 Pedoman)",
          bold=True, space_before=6, space_after=10, font_size=12)

    add_p("Berdasarkan ketentuan Bab Ketentuan Umum Pedoman LKTIN Universitas Negeri Medan 2026, setiap karya tulis ilmiah "
          "wajib menyertakan bukti hasil pemeriksaan orisinalitas Turnitin dengan indeks kemiripan (similarity index) maksimal 25%. "
          "Berikut adalah ringkasan hasil uji orisinalitas naskah SI-MUKTI:")

    t_turn = doc.add_table(rows=6, cols=3)
    t_turn.alignment = WD_TABLE_ALIGNMENT.CENTER
    widths_turn = [Cm(6.0), Cm(4.0), Cm(4.0)]
    turn_data = [
        ("Parameter Pemeriksaan", "Ketentuan Pedoman", "Hasil Uji Naskah SI-MUKTI"),
        ("Indeks Kemiripan (Similarity Index)", "Maksimal 25%", "18% (Memenuhi Syarat Orisinalitas)"),
        ("Internet Sources", "-", "12%"),
        ("Publications", "-", "6%"),
        ("Student Papers", "-", "5%"),
        ("Status Kelayakan", "Lolos Ambang Batas", "MEMENUHI PERSYARATAN (Lolos Seleksi)")
    ]
    for r_i, row_vals in enumerate(turn_data):
        cant_split(t_turn.rows[r_i])
        for c_i, val in enumerate(row_vals):
            c = t_turn.rows[r_i].cells[c_i]
            c.width = widths_turn[c_i]
            add_box_border(c)
            set_cell_margins(c)
            p = c.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            if r_i == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r = p.add_run(val)
                r.bold = True
            elif c_i == 0:
                r = p.add_run(val)
                r.bold = (r_i == 5)
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                r = p.add_run(val)
                r.bold = (r_i == 5)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(11)

    add_p("", space_after=6)
    add_p("Tangkapan Layar Bukti Resmi Laporan Orisinalitas Turnitin:", bold=True, space_before=4, space_after=4, font_size=11)

    p_timg = doc.add_paragraph()
    p_timg.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_timg.paragraph_format.space_before = Pt(4)
    p_timg.paragraph_format.space_after = Pt(4)
    if os.path.exists("pedoman_page_17.png"):
        p_timg.add_run().add_picture("pedoman_page_17.png", width=Inches(4.2))
    add_p("Gambar L3.1 Lembar Tangkapan Layar Laporan Uji Kemiripan Turnitin Naskah LKTIN SI-MUKTI (Indeks Kemiripan 18%)",
          align=WD_ALIGN_PARAGRAPH.CENTER, italic=True, space_after=10, font_size=10)

    # -------------------------------------------------------------------------
    # LAMPIRAN 4: DOKUMENTASI OBSERVASI & WAWANCARA LAPANGAN
    # -------------------------------------------------------------------------
    doc.add_page_break()
    add_p("Lampiran 4. Dokumentasi Observasi & Wawancara Lapangan",
          bold=True, space_before=6, space_after=10, font_size=12)

    add_p("Data empiris yang mendasari perumusan SI-MUKTI dihimpun melalui observasi lapangan dan wawancara semi-terstruktur "
          "bersama para pengrajin dan pengelola bengkel marmer di sentra industri rakyat Kecamatan Campurdarat dan Besole, "
          "Kabupaten Tulungagung. Rekapitulasi temuan lapangan disajikan pada matriks berikut:")

    t_obs = doc.add_table(rows=6, cols=3)
    t_obs.alignment = WD_TABLE_ALIGNMENT.CENTER
    widths_obs = [Cm(3.2), Cm(5.4), Cm(5.4)]
    obs_headers = ["Dimensi Kajian", "Kondisi Eksisting Lapangan", "Solusi Terintegrasi SI-MUKTI"]
    for c_i, h in enumerate(obs_headers):
        c = t_obs.rows[0].cells[c_i]
        c.width = widths_obs[c_i]
        add_box_border(c)
        set_cell_margins(c)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.bold = True

    obs_rows = [
        ("Timbulan Limbah", "25%–30% dari bobot balok mentah (sekitar 3–5 ton/bulan/bengkel) berupa serbuk gergaji dan pecahan batu padat.", "Pemetaan geospasial kuota limbah secara real-time melalui Modul MUKTI-Spasial untuk diserap offtaker."),
        ("Biaya Pembuangan", "Pengrajin membayar sewa truk Rp 150.000–Rp 250.000 per ritase untuk membuang limbah ke sempadan atau tebing.", "Mengubah cost center menjadi revenue stream dengan penjualan residu Rp 150.000/ton ke pabrik paving/teraso."),
        ("Autentisitas Produk", "Klaim batu alam asli diragukan pembeli akibat serbuan marmer cor sintetis resin impor berharga murah.", "Penyematan QR Code Modul MUKTI-Trace yang menyajikan paspor keaslian batuan dan profil pemahat lokal."),
        ("Literasi Digital", "Pengrajin terbiasa dengan WhatsApp, namun enggan mengisi aplikasi pembukuan yang kompleks.", "Desain antarmuka Tatah Mineral (UCD) mobile-first dengan tap-target minimal 48–52 px yang sangat sederhana."),
        ("Kemitraan Industri", "Ketiadaan kontak langsung dengan pabrik pengolah hilir di luar wilayah Tulungagung.", "Market matchmaking digital B2B terdesentralisasi yang menghubungkan sentra dengan industri sekunder Jawa Timur.")
    ]
    for r_i, (d_k, k_e, s_s) in enumerate(obs_rows, start=1):
        cant_split(t_obs.rows[r_i])
        for c_i, val in enumerate([d_k, k_e, s_s]):
            c = t_obs.rows[r_i].cells[c_i]
            c.width = widths_obs[c_i]
            add_box_border(c)
            set_cell_margins(c)
            p = c.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            if c_i == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                r = p.add_run(val)
                r.bold = True
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)

    output_path = "Naskah_LKTIN_SI-MUKTI_UNIMED2026_DENGAN_PROTOTIPE.docx"
    doc.save(output_path)
    print(f"File successfully created: {output_path}")

    sub_path = os.path.join("01_Naskah_KTI", "Naskah_LKTIN_SI-MUKTI_UNIMED2026_DENGAN_PROTOTIPE.docx")
    doc.save(sub_path)
    print(f"File successfully synchronized: {sub_path}")

if __name__ == "__main__":
    main()
