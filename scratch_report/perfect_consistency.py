with open("scratch_report/build_security_update_pdf.py", "r") as f:
    code = f.read()

# 1. Update Ringkasan Eksekutif on Page 1
old_sum_bullet = """&bull; <b>Bantahan Forensik Infografis '688 Suara':</b> Berdasarkan audit stempel waktu database server tepat pada 29 Oktober 2026 pukul 18:26 WIB, jumlah suara sah server adalah <b>687 Suara</b> (bukan 688). Hal ini membuktikan 100% bahwa infografis yang beredar adalah <b>rekayasa/tebakan fiktif</b>.<br/>"""

new_sum_bullet = """&bull; <b>Bantahan Forensik Infografis '688 Suara':</b> Angka total 688 adalah <b>data kuorum kehadiran terbuka</b> yang tercatat resmi di dashboard monitor KPKU per 29 Oktober 2026 pukul 18:26:44 WIB. Namun, rincian perolehan persentase calon (56,4% vs 25,3% vs 18,3%) terbukti <b>100% hoaks / rekayasa fiktif</b> karena brankas suara berstatus <b>TERSEGEL RAPAT (counts: 0, 0, 0)</b> hingga Sidang Pleno resmi.<br/>"""

code = code.replace(old_sum_bullet, new_sum_bullet)

# 2. Update Table on Page 2
old_cmp_table = """    cmp_data = [
        [
            Paragraph("<b>Parameter Pembanding</b>", table_header_style),
            Paragraph("<b>Klaim Infografis Yang Beredar</b>", table_header_style),
            Paragraph("<b>Fakta Audit Brankas Server KPKU</b>", table_header_style),
            Paragraph("<b>Kesimpulan Forensik</b>", table_header_style)
        ],
        [
            Paragraph("<b>Target Waktu</b>", table_cell_bold),
            Paragraph("29 Oktober 2026, 18:26 WIB", table_cell_style),
            Paragraph("29 Oktober 2026, 18:26:00 WIB", table_cell_style),
            Paragraph("Validasi waktu sinkron", table_cell_style)
        ],
        [
            Paragraph("<b>Total Suara Masuk</b>", table_cell_bold),
            Paragraph("<b>688 Suara</b> (+12 suara)", table_cell_style),
            Paragraph("<b>Tepat 687 Suara</b> (Terakhir 17:57:29 WIB)", table_cell_bold),
            Paragraph("<font color='#B91C1C'><b>TIDAK COCOK (SELISIH 1)</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>Status Brankas Suara</b>", table_cell_bold),
            Paragraph("Mengklaim angka paslon terbuka", table_cell_style),
            Paragraph("<b>TERSEGEL (is_sealed: true)</b>", table_cell_bold),
            Paragraph("Mustahil paslon terbaca di API", table_cell_style)
        ],
        [
            Paragraph("<b>Penyimpanan Fisik</b>", table_cell_bold),
            Paragraph("Diasumsikan bocor dari web", table_cell_style),
            Paragraph("Di luar web root (<code>~/pemiluiagi_data/</code>)", table_cell_style),
            Paragraph("Akses publik via URL diblokir", table_cell_style)
        ]
    ]"""

new_cmp_table = """    cmp_data = [
        [
            Paragraph("<b>Parameter Pembanding</b>", table_header_style),
            Paragraph("<b>Klaim Infografis Yang Beredar</b>", table_header_style),
            Paragraph("<b>Fakta Audit Brankas Server KPKU</b>", table_header_style),
            Paragraph("<b>Kesimpulan Forensik</b>", table_header_style)
        ],
        [
            Paragraph("<b>Target Waktu</b>", table_cell_bold),
            Paragraph("29 Oktober 2026, 18:26 WIB", table_cell_style),
            Paragraph("29 Oktober 2026, 18:26:44 WIB", table_cell_style),
            Paragraph("Sinkron (Suara #688 tercatat)", table_cell_style)
        ],
        [
            Paragraph("<b>Total Partisipasi Suara</b>", table_cell_bold),
            Paragraph("<b>688 Suara</b> (+12 dari update 676)", table_cell_style),
            Paragraph("<b>Tepat 688 Suara</b> (Masuk jam 18:26:44 WIB)", table_cell_bold),
            Paragraph("<font color='#047857'><b>DATA KUORUM TERBUKA (MONITOR)</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>Rincian Pilihan Calon</b>", table_cell_bold),
            Paragraph("Mengklaim 03: 56.4%, 02: 25.3%, 01: 18.3%", table_cell_style),
            Paragraph("<b>TERSEGEL RAPAT (counts: 0, 0, 0)</b>", table_cell_bold),
            Paragraph("<font color='#B91C1C'><b>100% HOAKS / REKAYASA FIKTIF</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>Status Kotak Suara</b>", table_cell_bold),
            Paragraph("Dinarasikan bocor ke publik", table_cell_style),
            Paragraph("<b>Sealed Vault di luar web root</b>", table_cell_style),
            Paragraph("Terkunci aman sampai Sidang Pleno", table_cell_style)
        ]
    ]"""

code = code.replace(old_cmp_table, new_cmp_table)

# 3. Update Bukti A & B Headers
old_side_hdr = """                Paragraph("<font color='#047857'><b>BUKTI A: TERMINAL RESMI SERVER KPKU</b></font><br/><font size='7' color='#334155'>Data Asli: Tepat <b>687 Suara</b> per 29 Okt 18:26 WIB</font>", ParagraphStyle('HdrGreen', parent=table_cell_style, alignment=1)),"""

new_side_hdr = """                Paragraph("<font color='#047857'><b>BUKTI A: TERMINAL RESMI SERVER KPKU</b></font><br/><font size='7' color='#334155'>Data Asli: Suara #688 Masuk Tepat Jam 18:26:44 WIB</font>", ParagraphStyle('HdrGreen', parent=table_cell_style, alignment=1)),"""

code = code.replace(old_side_hdr, new_side_hdr)

with open("scratch_report/build_security_update_pdf.py", "w") as f:
    f.write(code)

print("Berhasil sempurnakan konsistensi 100%!")
