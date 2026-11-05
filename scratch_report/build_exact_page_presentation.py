import sys
import os

sys.path.append('/Users/wagyua5/Library/Python/3.9/lib/python/site-packages')

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION

def create_exact_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Colors
    C_BG = RGBColor(248, 250, 252)         # #F8FAFC
    C_WHITE = RGBColor(255, 255, 255)
    C_BORDER = RGBColor(226, 232, 240)      # #E2E8F0
    C_TEXT = RGBColor(15, 23, 42)           # #0F172A
    C_MUTED = RGBColor(100, 116, 139)       # #64748B
    C_NAVY = RGBColor(11, 19, 43)           # #0B132B
    C_BLUE = RGBColor(37, 99, 235)          # #2563EB
    C_EMERALD = RGBColor(16, 185, 129)      # #10B981
    C_PURPLE = RGBColor(139, 92, 246)       # #8B5CF6
    C_AMBER = RGBColor(245, 158, 11)        # #F59E0B
    C_ORANGE = RGBColor(234, 88, 12)        # #EA580C
    C_TEAL = RGBColor(13, 148, 136)         # #0D9488

    def add_card(slide, left, top, width, height, bg=C_WHITE, border=C_BORDER):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg
        if border:
            shape.line.color.rgb = border
            shape.line.width = Pt(1)
        else:
            shape.line.fill.background()
        return shape

    def add_header(slide, title, subtitle):
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.85))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p1 = tf.paragraphs[0]
        p1.text = "55TH PIT IAGI • GEOSEA XIX 2026 | EXECUTIVE EVENT ANALYTICS"
        p1.font.size = Pt(9)
        p1.font.bold = True
        p1.font.color.rgb = C_BLUE
        
        p2 = tf.add_paragraph()
        p2.text = title
        p2.font.size = Pt(18)
        p2.font.bold = True
        p2.font.color.rgb = C_TEXT
        
        p3 = tf.add_paragraph()
        p3.text = subtitle
        p3.font.size = Pt(9)
        p3.font.color.rgb = C_MUTED

    # =========================================================================
    # SLIDE 1: FULL PAGE DASHBOARD MASTER VIEW (Exact Screenshot Presentation)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = RGBColor(15, 23, 42)  # Dark executive
    bg1.line.fill.background()

    # Left: High-Res Embedded Crop of the Full Dashboard Page
    crop_path = 'scratch_report/dashboard_main_cropped.png'
    # Aspect ratio: w=510, h=1024 (approx 1 : 2)
    s1.shapes.add_picture(crop_path, Inches(0.8), Inches(0.5), Inches(3.45), Inches(6.5))

    # Right: Executive Overview & Navigation
    tb1_r = s1.shapes.add_textbox(Inches(4.6), Inches(0.6), Inches(7.9), Inches(6.3))
    tf1_r = tb1_r.text_frame
    tf1_r.word_wrap = True

    p = tf1_r.paragraphs[0]
    p.text = "★ EXECUTIVE DASHBOARD OVERVIEW"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_AMBER
    p.space_after = Pt(8)

    p = tf1_r.add_paragraph()
    p.text = "Executive Event Analytics"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p = tf1_r.add_paragraph()
    p.text = "55th PIT IAGI • GEOSEA XIX 2026 | Grand Ballroom Hotel Tentrem Yogyakarta"
    p.font.size = Pt(13)
    p.font.color.rgb = RGBColor(148, 163, 184)
    p.space_after = Pt(20)

    # 4 Quick Stat Highlights
    stats_hl = [
        ("1.351 Delegasi", "Total Registrasi (135,1% Target Kuota 1.000)", C_BLUE),
        ("Rp 389 Juta", "Realisasi Kas Masuk (97,3% Target Anggaran)", C_EMERALD),
        ("720 Pax", "Hadir di Venue (Gate Turnstile Check-In)", C_PURPLE),
        ("Rp 190 Juta", "Piutang Tagihan Korporat BUMN Berdokumen Resmi", C_AMBER),
    ]

    for val, desc, col in stats_hl:
        p = tf1_r.add_paragraph()
        p.text = f"● {val} — {desc}"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = col
        p.space_after = Pt(6)

    p = tf1_r.add_paragraph()
    p.text = "\nSlide berikutnya membedah baris demi baris rincian data resmi yang tampil pada halaman dashboard di sebelah kiri:"
    p.font.size = Pt(10)
    p.font.color.rgb = RGBColor(203, 213, 225)
    p.space_after = Pt(6)

    sections_list = [
        "Slide 2: Header & Filter & Search Analytics (Preset Semua, Lunas, Debt, Checked In)",
        "Slide 3: Baris 1 — 4 Kartu Metrik Utama (Live Overview, Kas Masuk, Turnstile, E-Badge)",
        "Slide 4: Baris 2 — Arus Kedatangan Gate per Hari (Tgl 1 — 5) & Target Benchmarks",
        "Slide 5: Baris 3 — Komposisi Seluruh Kategori Tiket & Top 5 Delegasi Instansi",
        "Slide 6: Baris 4 — Funnel Konversi Registrasi (5 Tahap) & Sektor Industri / Regional",
        "Slide 7: Baris 5 — Matriks Rekapitulasi Tagihan Delegasi Korporat & Status Piutang"
    ]
    for sec in sections_list:
        p = tf1_r.add_paragraph()
        p.text = f"  • {sec}"
        p.font.size = Pt(9)
        p.font.color.rgb = RGBColor(148, 163, 184)

    # =========================================================================
    # SLIDE 2: HEADER & FILTER BAR SECTION
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    bg2 = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg2.fill.solid()
    bg2.fill.fore_color.rgb = C_BG
    bg2.line.fill.background()

    add_header(s2, "Header & Filter & Search Analytics", "Bagian paling atas halaman dashboard untuk filtering data kepesertaan")

    # Embed Row 0 Crop
    s2.shapes.add_picture('scratch_report/row0_header_filters.png', Inches(0.8), Inches(1.4), Inches(11.733), Inches(2.2))

    # Analytical Explanations Below Crop
    add_card(s2, Inches(0.8), Inches(3.8), Inches(5.7), Inches(3.2))
    tb2_l = s2.shapes.add_textbox(Inches(1.0), Inches(3.95), Inches(5.3), Inches(2.9))
    tf2_l = tb2_l.text_frame
    tf2_l.word_wrap = True

    p = tf2_l.paragraphs[0]
    p.text = "🔍 KONTROL FILTER & PENCARIAN"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.space_after = Pt(8)

    filters_detail = [
        "Input Pencarian: Pencarian instan nama, institusi, NPA, atau kode tiket.",
        "Dropdown Kategori: 4 Grup Registrasi (Participant, Technical, Visitor, Roles).",
        "Tipe Tiket: 20+ jenis kepesertaan (Presenter, Pro Member, Visitor Pass, VIP).",
        "Status Verifikasi: Filter Lunas (1.351), Debt (0), Pending (0).",
        "Gate Pass: Filter peserta yang sudah hadir vs belum hadir di venue."
    ]
    for fd in filters_detail:
        p = tf2_l.add_paragraph()
        p.text = f"• {fd}"
        p.font.size = Pt(9)
        p.font.color.rgb = C_TEXT
        p.space_after = Pt(4)

    add_card(s2, Inches(6.8), Inches(3.8), Inches(5.733), Inches(3.2))
    tb2_r = s2.shapes.add_textbox(Inches(7.0), Inches(3.95), Inches(5.3), Inches(2.9))
    tf2_r = tb2_r.text_frame
    tf2_r.word_wrap = True

    p = tf2_r.paragraphs[0]
    p.text = "⚡ PRESET CEPAT (QUICK PRESETS)"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD
    p.space_after = Pt(8)

    presets_detail = [
        "🌟 Semua (1.351): Menampilkan seluruh delegasi terdaftar konvensi.",
        "✅ Lunas (1.351): 100% peserta terdaftar tervalidasi lunas.",
        "⚠️ Debt (0) & ⏳ Pending (0): Seluruh antrean verifikasi selesai 100%.",
        "🚪 Checked In (720): 720 delegasi terkonfirmasi hadir di venue.",
        "🏢 Group Delegation (0): Delegasi kolektif terdistribusi per akun instansi.",
        "🎓 Presenter (178): Filter cepat pemakalah ilmiah sesi paralel."
    ]
    for pd in presets_detail:
        p = tf2_r.add_paragraph()
        p.text = f"• {pd}"
        p.font.size = Pt(9)
        p.font.color.rgb = C_TEXT
        p.space_after = Pt(4)

    # =========================================================================
    # SLIDE 3: BARIS 1 — 4 KARTU METRIK UTAMA (ROW 1)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    bg3 = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg3.fill.solid()
    bg3.fill.fore_color.rgb = C_BG
    bg3.line.fill.background()

    add_header(s3, "Baris 1 — 4 Kartu Metrik Utama Konvensi", "Ringkasan metrik eksekutif kehadiran, kas masuk, dan fulfillment badge")

    # Embed Row 1 Crop
    s3.shapes.add_picture('scratch_report/row1_kpi_cards.png', Inches(0.8), Inches(1.35), Inches(11.733), Inches(1.8))

    # 4 Detailed Cards Replicating the Visuals Below
    cards_row1 = [
        {
            "tag": "LIVE OVERVIEW",
            "title": "Total Registrasi Delegasi",
            "val": "1.351 Delegasi",
            "target": "Target: 1.000 Delegasi • 135,1% Target",
            "sub": "● 1.351 Lunas • 0 Pending • 0 Debt",
            "col": C_BLUE
        },
        {
            "tag": "REALISASI KAS MASUK",
            "title": "Kas Masuk Operasional",
            "val": "Rp 389 JT (Nett)",
            "target": "Target: Rp 400 Jt • 97,3% Capaian",
            "sub": "● Piutang Terikat: Rp 190 Jt",
            "col": C_EMERALD
        },
        {
            "tag": "ARUS TURNSTILE",
            "title": "Gate Turnstile Hadir",
            "val": "720 / 1.351 (53,3%)",
            "target": "Hadir di Venue (Hari Puncak)",
            "sub": "● 631 Belum Hadir / Sesi Lanjutan",
            "col": C_PURPLE
        },
        {
            "tag": "FULFILLMENT & BADGE",
            "title": "E-Badge Fisik Tercetak",
            "val": "818 / 1.351 (60,5%)",
            "target": "818 ID Card Fisik On-Site",
            "sub": "● 533 Belum Badge / Delegasi Digital",
            "col": C_AMBER
        }
    ]

    for idx, c in enumerate(cards_row1):
        cx = Inches(0.8 + idx * 3.0)
        cy = Inches(3.35)
        add_card(s3, cx, cy, Inches(2.78), Inches(3.6), bg=C_WHITE, border=c["col"])

        tb = s3.shapes.add_textbox(cx + Inches(0.15), cy + Inches(0.15), Inches(2.48), Inches(3.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = c["tag"]
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = c["col"]
        p.space_after = Pt(2)

        p = tf.add_paragraph()
        p.text = c["title"]
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_MUTED
        p.space_after = Pt(6)

        p = tf.add_paragraph()
        p.text = c["val"]
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = c["col"]
        p.space_after = Pt(8)

        p = tf.add_paragraph()
        p.text = c["target"]
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = C_TEXT
        p.space_after = Pt(6)

        p = tf.add_paragraph()
        p.text = c["sub"]
        p.font.size = Pt(8.5)
        p.font.color.rgb = C_MUTED

    # =========================================================================
    # SLIDE 4: BARIS 2 — ARUS KEDATANGAN & TARGET BENCHMARKS
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    bg4 = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg4.fill.solid()
    bg4.fill.fore_color.rgb = C_BG
    bg4.line.fill.background()

    add_header(s4, "Baris 2 — Arus Kedatangan Gate Turnstile per Hari (Tgl 1 — 5) & Target Benchmarks", "Monitoring flow delegasi harian (01 — 05 Nov 2026) per kategori registrasi & radial gauge KPI")

    # Embed Row 2 Crop
    s4.shapes.add_picture('scratch_report/row2_hourly_benchmarks.png', Inches(0.8), Inches(1.35), Inches(11.733), Inches(2.6))

    # Analytical Breakdowns Below
    add_card(s4, Inches(0.8), Inches(4.15), Inches(6.8), Inches(2.9))
    tb4_l = s4.shapes.add_textbox(Inches(1.0), Inches(4.25), Inches(6.4), Inches(2.6))
    tf4_l = tb4_l.text_frame
    tf4_l.word_wrap = True

    p = tf4_l.paragraphs[0]
    p.text = "📅 ARUS KEDATANGAN GATE TURNSTILE PER HARI (TGL 1 — 5 NOVEMBER 2026)"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.space_after = Pt(3)

    p = tf4_l.add_paragraph()
    p.text = "• Tgl 1 (01 Nov): 86 Pax (11,9%) — Pra-Event & Workshop, Panitia & Early Badge Staging."
    p.font.size = Pt(8.2)
    p.font.color.rgb = C_TEXT

    p = tf4_l.add_paragraph()
    p.text = "• Tgl 2 (02 Nov) [HARI PUNCAK]: 389 Pax (54,0%) — Grand Opening Ceremony, VIP Keynotes & Plenary Session Puncak."
    p.font.size = Pt(8.2)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    p = tf4_l.add_paragraph()
    p.text = "• Tgl 3 (03 Nov): 144 Pax (20,0%) — Sesi Ilmiah di 8 Breakout Rooms & Pameran Teknis Geologi."
    p.font.size = Pt(8.2)
    p.font.color.rgb = C_TEXT

    p = tf4_l.add_paragraph()
    p.text = "• Tgl 4 (04 Nov): 66 Pax (9,2%) — Interactive Poster Sessions & Forum Temu Bisnis Korporat."
    p.font.size = Pt(8.2)
    p.font.color.rgb = C_TEXT

    p = tf4_l.add_paragraph()
    p.text = "• Tgl 5 (05 Nov): 35 Pax (4,9%) — Closing Ceremony, Awarding Night & Persiapan Field Trip."
    p.font.size = Pt(8.2)
    p.font.color.rgb = C_TEXT

    p = tf4_l.add_paragraph()
    p.text = "★ Filter Kategori: Mendukung filtering per kategori tiket (Professional, Presenter, Student, VIP, Expo, Panitia) & mode Per Hari / Akumulasi."
    p.font.size = Pt(8.0)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    add_card(s4, Inches(7.8), Inches(4.15), Inches(4.733), Inches(2.9))
    tb4_r = s4.shapes.add_textbox(Inches(8.0), Inches(4.25), Inches(4.333), Inches(2.6))
    tf4_r = tb4_r.text_frame
    tf4_r.word_wrap = True

    p = tf4_r.paragraphs[0]
    p.text = "🎯 CONVENTION TARGET BENCHMARKS"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD
    p.space_after = Pt(6)

    p = tf4_r.add_paragraph()
    p.text = "1. Target Kas Anggaran (Rp 400 Jt): 97,3% Realisasi Kas"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    p = tf4_r.add_paragraph()
    p.text = "   Realisasi Kas: Rp 389.000.000 / Target: Rp 400.000.000 (Sisa gap Rp 11 Jt tercover penuh piutang Rp 190 Jt)."
    p.font.size = Pt(8.5)
    p.font.color.rgb = C_MUTED
    p.space_after = Pt(6)

    p = tf4_r.add_paragraph()
    p.text = "2. Target Kuota Partisipasi (1.000 Pax): 100% Kapasitas Ruang"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    p = tf4_r.add_paragraph()
    p.text = "   Terdaftar: 1.351 Orang / Kuota 1.000 Pax (Surplus kuota +351 Pax / +35,1% dari target awal)."
    p.font.size = Pt(8.5)
    p.font.color.rgb = C_MUTED

    # =========================================================================
    # SLIDE 5: BARIS 3 — KOMPOSISI KATEGORI TIKET & TOP INSTANSI
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    bg5 = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg5.fill.solid()
    bg5.fill.fore_color.rgb = C_BG
    bg5.line.fill.background()

    add_header(s5, "Baris 3 — Komposisi Kategori Tiket & Bi-Color per Kategori Registrasi", "Donut chart (Gambar 1) dan visualisasi Bi-Color status pembayaran berdasarkan Kategori Registrasi (Gambar 2)")

    # Embed Row 3 Crop
    s5.shapes.add_picture('scratch_report/row3_pie_instansi.png', Inches(0.8), Inches(1.35), Inches(11.733), Inches(3.2))

    # Analytical Details Below
    add_card(s5, Inches(0.8), Inches(4.7), Inches(5.7), Inches(2.4))
    tb5_l = s5.shapes.add_textbox(Inches(1.0), Inches(4.8), Inches(5.3), Inches(2.1))
    tf5_l = tb5_l.text_frame
    tf5_l.word_wrap = True

    p = tf5_l.paragraphs[0]
    p.text = "🏷️ GAMBAR 1: KOMPOSISI SELURUH KATEGORI TIKET"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.space_after = Pt(4)

    p = tf5_l.add_paragraph()
    p.text = "• 💼 Professional (Member): 79 Pax (45%) • Kas: Rp 228 JT"
    p.font.size = Pt(8.5)
    p.font.color.rgb = C_TEXT

    p = tf5_l.add_paragraph()
    p.text = "• 💼 Professional (Non-Member): 76 Pax (43%) • Kas: Rp 292 JT"
    p.font.size = Pt(8.5)
    p.font.color.rgb = C_TEXT

    p = tf5_l.add_paragraph()
    p.text = "• 🎓 Student Undergrad (8 Pax - Rp 8 JT) | 🌍 Expatriate (6 Pax - Rp 35 JT)"
    p.font.size = Pt(8.5)
    p.font.color.rgb = C_TEXT

    p = tf5_l.add_paragraph()
    p.text = "• 💼 Professional Rp 1.5JT (6 Pax - Rp 9 JT) | 📚 Dosen (2 Pax - Rp 3 JT)"
    p.font.size = Pt(8.5)
    p.font.color.rgb = C_MUTED

    add_card(s5, Inches(6.8), Inches(4.7), Inches(5.733), Inches(2.4))
    tb5_r = s5.shapes.add_textbox(Inches(7.0), Inches(4.8), Inches(5.3), Inches(2.1))
    tf5_r = tb5_r.text_frame
    tf5_r.word_wrap = True

    p = tf5_r.paragraphs[0]
    p.text = "📊 GAMBAR 2: BI-COLOR STATUS PEMBAYARAN PER KATEGORI"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD
    p.space_after = Pt(4)

    cat_ranks = [
        "1. 🎟️ Visitor Pass (Free): 720 Pax (100% Free Pass)",
        "2. 🎓 Presenter: 178 Pax (100% Free Pass Paper)",
        "3. 🎓 Student Crowd: 100 Pax (100% Sah)",
        "4. 💼 Professional (Member): 79 Pax (75 Lunas • 4 Piutang)",
        "5. 💼 Professional (Non-Member): 76 Pax (71 Lunas • 5 Piutang)",
        "6. 🏛️ Exhibition (72 Pax) | ⭐ VIP (65 Pax) | 👔 Committee (55 Pax)"
    ]
    for cr in cat_ranks:
        p = tf5_r.add_paragraph()
        p.text = f"• {cr}"
        p.font.size = Pt(8.5)
        p.font.color.rgb = C_TEXT

    # =========================================================================
    # SLIDE 6: BARIS 4 — FUNNEL REGISTRASI & SEKTOR REGIONAL
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    bg6 = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg6.fill.solid()
    bg6.fill.fore_color.rgb = C_BG
    bg6.line.fill.background()

    add_header(s6, "Baris 4 — Funnel Registrasi & Sektor / Demografi", "Funnel konversi 5 tahap registrasi menuju venue dan sebaran sektor industri")

    # Embed Row 4 Crop
    s6.shapes.add_picture('scratch_report/row4_funnel_sektor.png', Inches(0.8), Inches(1.35), Inches(11.733), Inches(2.8))

    # Analytical Details Below
    add_card(s6, Inches(0.8), Inches(4.35), Inches(5.7), Inches(2.7))
    tb6_l = s6.shapes.add_textbox(Inches(1.0), Inches(4.45), Inches(5.3), Inches(2.4))
    tf6_l = tb6_l.text_frame
    tf6_l.word_wrap = True

    p = tf6_l.paragraphs[0]
    p.text = "🔻 FUNNEL KONVERSI REGISTRASI (5 TAHAP)"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.space_after = Pt(4)

    funnel_pts = [
        "1. Total Terdaftar: 1.351 Delegasi (100%)",
        "2. Verifikasi Lunas: 1.351 Delegasi (100% Sah)",
        "3. E-Tiket Terkirim: 818 Delegasi (60,5%)",
        "4. Hadir di Venue: 720 Delegasi (53,3% Gate Scan)",
        "5. Lanyard / Badge Dicetak: 818 Delegasi (60,5%)"
    ]
    for fp in funnel_pts:
        p = tf6_l.add_paragraph()
        p.text = f"• {fp}"
        p.font.size = Pt(8.5)
        p.font.color.rgb = C_TEXT

    add_card(s6, Inches(6.8), Inches(4.35), Inches(5.733), Inches(2.7))
    tb6_r = s6.shapes.add_textbox(Inches(7.0), Inches(4.45), Inches(5.3), Inches(2.4))
    tf6_r = tb6_r.text_frame
    tf6_r.word_wrap = True

    p = tf6_r.paragraphs[0]
    p.text = "🏢 6 SEKTOR INDUSTRI & DEMOGRAFI REGIONAL"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_PURPLE
    p.space_after = Pt(4)

    p = tf6_r.add_paragraph()
    p.text = "• Independent & Konsultan: 601 Pax (44%) | Universitas & Riset: 462 Pax (34%)"
    p.font.size = Pt(8.5)
    p.font.color.rgb = C_TEXT

    p = tf6_r.add_paragraph()
    p.text = "• Minyak & Gas / KKKS: 155 Pax (11%) | Pertambangan: 47 Pax (3%)"
    p.font.size = Pt(8.5)
    p.font.color.rgb = C_TEXT

    p = tf6_r.add_paragraph()
    p.text = "• Pemerintah & Regulator: 35 Pax (3%) | Geoscience Service: 8 Pax (1%)"
    p.font.size = Pt(8.5)
    p.font.color.rgb = C_TEXT

    p = tf6_r.add_paragraph()
    p.text = "🌏 Demografi Regional GEOSEA XIX: Domestik 98% (1.324 Pax) vs Internasional ASEAN 2% (27 Pax - Filipina, Malaysia, Thailand, SG, Vietnam)."
    p.font.size = Pt(8.5)
    p.font.bold = True
    p.font.color.rgb = C_PURPLE

    # =========================================================================
    # SLIDE 7: BARIS 5 — MATRIKS TAGIHAN KORPORAT & PIUTANG
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    bg7 = s7.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg7.fill.solid()
    bg7.fill.fore_color.rgb = C_BG
    bg7.line.fill.background()

    add_header(s7, "Baris 5 — Matriks Tagihan Delegasi Korporat & Status Piutang", "Tabel rekapitulasi penagihan invoice resmi delegasi korporat BUMN dan institusi")

    # Embed Row 5 Crop
    s7.shapes.add_picture('scratch_report/row5_matriks_tagihan.png', Inches(0.8), Inches(1.35), Inches(11.733), Inches(4.3))

    # Bottom Summary Box
    add_card(s7, Inches(0.8), Inches(5.8), Inches(11.733), Inches(1.2), bg=C_WHITE, border=C_AMBER)
    tb7_b = s7.shapes.add_textbox(Inches(1.0), Inches(5.9), Inches(11.3), Inches(1.0))
    tf7_b = tb7_b.text_frame
    tf7_b.word_wrap = True

    p = tf7_b.paragraphs[0]
    p.text = "💰 RINGKASAN STATUS TAGIHAN KORPORAT (TOTAL PIUTANG: RP 190.000.000)"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = C_AMBER
    p.space_after = Pt(2)

    p = tf7_b.add_paragraph()
    p.text = "• Kas Lunas: PT Medco E&P Indonesia (14 Pax - Rp 42 Jt) & Geological Society of the Philippines (6 Pax - Rp 36 Jt) telah lunas dengan kwitansi sah."
    p.font.size = Pt(8.5)
    p.font.color.rgb = C_EMERALD

    p = tf7_b.add_paragraph()
    p.text = "• Piutang Terikat PO/SPK BUMN: LEMIGAS ESDM (Rp 30 Jt), PT Bumi Siak Pusako (Rp 18 Jt), Pertamina Training & Consulting (Rp 12 Jt), Pertamina EP Cepu (Rp 12 Jt), Head of PTG (Rp 6 Jt) — seluruh dokumen penagihan resmi telah diterima instansi dan siap cair."
    p.font.size = Pt(8.5)
    p.font.color.rgb = C_ORANGE

    # Save Output
    output_path = "/Users/wagyua5/Downloads/55TH_PIT_IAGI-GEOSEA_XIX_2026/LAPORAN_EKSEKUTIF_ANALYTICS_PIT_IAGI_GEOSEA_2026.pptx"
    prs.save(output_path)
    print("SUCCESS_SAVED:", output_path)

    artifact_path = "/Users/wagyua5/.gemini/antigravity/brain/3e5a6fab-1ee2-4d7c-b6e7-31aabf60c3b8/LAPORAN_EKSEKUTIF_ANALYTICS_PIT_IAGI_GEOSEA_2026.pptx"
    prs.save(artifact_path)
    print("SUCCESS_ARTIFACT_SAVED:", artifact_path)

if __name__ == '__main__':
    create_exact_presentation()
