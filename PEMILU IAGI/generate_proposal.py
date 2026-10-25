#!/usr/bin/env python3
import os
import base64
import subprocess

workspace_dir = "/Users/wagyua5/Downloads/55TH_PIT_IAGI-GEOSEA_XIX_2026"
pemilu_dir = os.path.join(workspace_dir, "PEMILU IAGI")
logo_path = os.path.join(workspace_dir, "public/WhatsApp_Image_2025-12-29_at_19.37.46-removebg-preview.png")

with open(logo_path, "rb") as f:
    logo_b64 = base64.b64encode(f.read()).decode("utf-8")

html_content = f"""<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Proposal Arsitektur, Desain & Biaya Sistem E-Voting Pemilu IAGI 2026</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page {{
            size: A4 portrait;
            margin: 0;
        }}
        * {{
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }}
        body {{
            margin: 0;
            padding: 0;
            background-color: #0b0f17;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #1e293b;
            font-size: 8.5pt;
            line-height: 1.48;
        }}
        .page-container {{
            display: flex;
            flex-direction: column;
            align-items: center;
        }}
        .page {{
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            padding: 16mm 20mm 15mm 20mm;
            background: #ffffff;
            position: relative;
            page-break-after: always;
            page-break-inside: avoid;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }}
        
        /* Running Header & Footer */
        .page-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 7px;
            margin-bottom: 11px;
        }}
        .header-left {{
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        .header-logo-mini {{
            height: 22px;
            width: auto;
            object-fit: contain;
        }}
        .header-title-text {{
            font-size: 7.2pt;
            font-weight: 700;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }}
        .header-badge {{
            font-size: 6.5pt;
            font-weight: 700;
            color: #b45309;
            background: #fef3c7;
            padding: 2.5px 8px;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            border: 1px solid #fde68a;
        }}
        .page-footer {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 7px;
            margin-top: auto;
            font-size: 6.8pt;
            color: #64748b;
        }}
        .page-footer .footer-left {{
            font-weight: 500;
        }}
        .page-footer .footer-right {{
            font-weight: 700;
            color: #0f172a;
            font-family: 'JetBrains Mono', monospace;
        }}

        /* Typography & Styles */
        h1, h2, h3, h4 {{
            margin: 0;
            color: #090d16;
            letter-spacing: -0.01em;
        }}
        h2.section-heading {{
            font-size: 13pt;
            font-weight: 800;
            color: #0f172a;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 3px;
        }}
        h2.section-heading::before {{
            content: '';
            display: inline-block;
            width: 4px;
            height: 16px;
            background: linear-gradient(180deg, #c5a059 0%, #0f766e 100%);
            border-radius: 2px;
        }}
        .section-desc {{
            font-size: 7.9pt;
            color: #64748b;
            margin-bottom: 10px;
            margin-top: 2px;
            line-height: 1.38;
        }}
        .content-body {{
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 8.5px;
        }}

        /* Luxury Cards & Grids */
        .card {{
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 13px;
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
        }}
        .card-dark {{
            background: #090d16;
            border: 1px solid #1e293b;
            color: #f8fafc;
            border-radius: 8px;
            padding: 11px 14px;
        }}
        .grid-2 {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }}
        .grid-3 {{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
        }}
        .grid-4 {{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 8px;
        }}

        /* Highlights & Badges */
        .badge {{
            display: inline-block;
            font-size: 6.2pt;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }}
        .badge-gold {{
            background: #fffbeb;
            color: #b45309;
            border: 1px solid #fde68a;
        }}
        .badge-emerald {{
            background: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
        }}
        .badge-slate {{
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #cbd5e1;
        }}
        .badge-blue {{
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
        }}

        /* Cover Page Specific */
        .cover-page {{
            padding: 0;
            background: #090d16;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }}
        .cover-top {{
            padding: 24mm 22mm 15mm 22mm;
            position: relative;
        }}
        .cover-accent-line {{
            height: 4px;
            width: 100%;
            background: linear-gradient(90deg, #c5a059 0%, #0f766e 60%, #1e293b 100%);
            position: absolute;
            top: 0;
            left: 0;
        }}
        .cover-logo-wrapper {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 22mm;
        }}
        .cover-logo {{
            height: 56px;
            width: auto;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
        }}
        .cover-tag {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 7.2pt;
            font-weight: 600;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #c5a059;
            border: 1px solid rgba(197, 160, 89, 0.4);
            padding: 4px 12px;
            border-radius: 9999px;
            background: rgba(197, 160, 89, 0.08);
        }}
        .cover-title-group {{
            margin-bottom: 16mm;
        }}
        .cover-eyebrow {{
            font-size: 8.5pt;
            font-weight: 700;
            color: #0f766e;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-bottom: 10px;
            display: block;
        }}
        .cover-title {{
            font-size: 26pt;
            font-weight: 800;
            color: #ffffff;
            line-height: 1.18;
            letter-spacing: -0.02em;
            margin-bottom: 12px;
        }}
        .cover-title span {{
            color: #c5a059;
        }}
        .cover-subtitle {{
            font-size: 10pt;
            color: #94a3b8;
            line-height: 1.55;
            max-width: 580px;
            font-weight: 400;
        }}
        .cover-badges-row {{
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 16px;
        }}
        .cover-badge-item {{
            font-size: 7.5pt;
            padding: 5px 12px;
            background: #141b27;
            border: 1px solid #1e293b;
            color: #e2e8f0;
            border-radius: 6px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }}
        .cover-badge-item span.dot {{
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #c5a059;
        }}
        .cover-bottom {{
            background: #0f1522;
            border-top: 1px solid #1e293b;
            padding: 16mm 22mm 18mm 22mm;
        }}
        .cover-meta-grid {{
            display: grid;
            grid-template-columns: 1.2fr 1.2fr 0.8fr 0.8fr;
            gap: 15px;
        }}
        .cover-meta-item strong {{
            display: block;
            font-size: 6.8pt;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 4px;
            font-family: 'JetBrains Mono', monospace;
        }}
        .cover-meta-item span {{
            font-size: 8.5pt;
            color: #f1f5f9;
            font-weight: 600;
        }}

        /* Tables */
        table.custom-table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 7.4pt;
        }}
        table.custom-table th {{
            background: #f8fafc;
            color: #0f172a;
            font-weight: 700;
            text-align: left;
            padding: 6px 8px;
            border-bottom: 1.5px solid #cbd5e1;
            font-size: 7pt;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }}
        table.custom-table td {{
            padding: 5.5px 8px;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
            vertical-align: top;
        }}
        table.custom-table tr:nth-child(even) td {{
            background: #fafbfc;
        }}

        /* Code / Token Callouts */
        .token-preview {{
            font-family: 'JetBrains Mono', monospace;
            background: #0b1120;
            color: #38bdf8;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 7.2pt;
            border: 1px solid #1e293b;
            display: inline-block;
        }}

        /* Step Timeline */
        .workflow-step {{
            display: flex;
            gap: 10px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 7px 11px;
            align-items: flex-start;
        }}
        .step-num {{
            background: #0f172a;
            color: #c5a059;
            font-family: 'JetBrains Mono', monospace;
            font-size: 8pt;
            font-weight: 700;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 1px;
        }}
        .step-content {{
            flex: 1;
        }}
        .step-content > .step-title {{
            font-size: 8.2pt;
            color: #0f172a;
            font-weight: 700;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2px;
        }}
        .step-content p {{
            margin: 0;
            font-size: 7.4pt;
            color: #475569;
            line-height: 1.4;
        }}

        /* Taste-Skill Dials Display */
        .dial-box {{
            background: #090d16;
            border: 1px solid #1e293b;
            border-radius: 6px;
            padding: 8px 10px;
            color: #fff;
        }}
        .dial-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3px;
        }}
        .dial-name {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 7pt;
            color: #94a3b8;
            text-transform: uppercase;
        }}
        .dial-val {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 9pt;
            font-weight: 800;
            color: #c5a059;
        }}
        .dial-bar {{
            height: 4px;
            background: #1e293b;
            border-radius: 2px;
            overflow: hidden;
            margin-top: 3px;
        }}
        .dial-fill {{
            height: 100%;
            background: linear-gradient(90deg, #c5a059, #0f766e);
            border-radius: 2px;
        }}
        .dial-desc {{
            font-size: 6.8pt;
            color: #64748b;
            margin-top: 4px;
            line-height: 1.25;
        }}

        /* Palette Swatches */
        .swatch-group {{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 7px;
        }}
        .swatch-item {{
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }}
        .swatch-color {{
            height: 22px;
            width: 100%;
        }}
        .swatch-info {{
            padding: 4px 6px;
            background: #fff;
        }}
        .swatch-name {{
            font-size: 6.8pt;
            font-weight: 700;
            color: #0f172a;
            display: block;
        }}
        .swatch-hex {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 6.2pt;
            color: #64748b;
        }}

        /* Callout Boxes */
        .callout-gold {{
            background: #fffdf5;
            border-left: 3px solid #c5a059;
            border-top: 1px solid #fef3c7;
            border-right: 1px solid #fef3c7;
            border-bottom: 1px solid #fef3c7;
            padding: 7px 11px;
            border-radius: 0 6px 6px 0;
            font-size: 7.6pt;
            color: #78350f;
            line-height: 1.45;
        }}
        .callout-teal {{
            background: #f0fdfa;
            border-left: 3px solid #0f766e;
            border-top: 1px solid #ccfbf1;
            border-right: 1px solid #ccfbf1;
            border-bottom: 1px solid #ccfbf1;
            padding: 7px 11px;
            border-radius: 0 6px 6px 0;
            font-size: 7.6pt;
            color: #115e59;
            line-height: 1.45;
        }}

        /* Mockup Bilik Suara */
        .ballot-mockup {{
            background: #0f1522;
            border: 1px solid #1e293b;
            border-radius: 6px;
            padding: 9px;
            color: #fff;
        }}
        .ballot-header {{
            text-align: center;
            border-bottom: 1px solid #1e293b;
            padding-bottom: 5px;
            margin-bottom: 8px;
        }}
        .ballot-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 7px;
        }}
        .candidate-card {{
            background: #141b27;
            border: 1px solid #2d3748;
            border-radius: 5px;
            padding: 7px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }}
        .candidate-num {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 11pt;
            font-weight: 800;
            color: #c5a059;
            background: #090d16;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 5px;
            border: 1px solid #c5a059;
        }}
        .candidate-photo-placeholder {{
            width: 100%;
            height: 52px;
            background: #1a2234;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 6.5pt;
            color: #94a3b8;
            margin-bottom: 5px;
            border: 1px dashed #334155;
        }}
        .candidate-name {{
            font-size: 7pt;
            font-weight: 700;
            color: #f8fafc;
            line-height: 1.2;
            margin-bottom: 5px;
        }}
        .btn-vote-mock {{
            background: #0f766e;
            color: #fff;
            border: none;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 6.2pt;
            font-weight: 700;
            width: 100%;
            text-transform: uppercase;
        }}

        /* Pricing Table Specific */
        .price-col {{
            text-align: right;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            color: #0f172a;
            white-space: nowrap;
        }}
        .rab-total-row td {{
            background: #f1f5f9 !important;
            font-weight: 700;
            border-top: 1.5px solid #cbd5e1;
            font-size: 7.5pt;
            color: #64748b;
        }}
        
        /* BLUE HIGHLIGHT ROW FOR 4.500.000 */
        .rab-blue-row td {{
            background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%) !important;
            color: #ffffff !important;
            font-weight: 800;
            border-top: 2px solid #1e40af;
            border-bottom: 2px solid #1e40af;
            font-size: 8.3pt;
        }}
        .rab-blue-row .price-col {{
            color: #ffffff !important;
            font-size: 11pt;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }}

        /* HOSTING & DOMAIN ROW */
        .rab-hosting-row td {{
            background: #eff6ff !important;
            color: #1e3a8a !important;
            border-bottom: 1.5px solid #bfdbfe;
            font-size: 7.8pt;
            font-weight: 700;
        }}
        .rab-hosting-row .price-col {{
            color: #1d4ed8 !important;
            font-size: 9.5pt;
        }}

        /* GRAND TOTAL ROW */
        .rab-grand-total td {{
            background: #090d16 !important;
            color: #ffffff !important;
            font-weight: 800;
            border-top: 2px solid #c5a059;
            font-size: 8.8pt;
        }}
        .rab-grand-total .price-col {{
            color: #c5a059 !important;
            font-size: 11.5pt;
            font-family: 'JetBrains Mono', monospace;
        }}

        /* Signature block */
        .sign-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-top: 10px;
        }}
        .sign-box {{
            border: 1px dashed #cbd5e1;
            border-radius: 6px;
            padding: 10px 12px;
            background: #f8fafc;
        }}
        .sign-title {{
            font-size: 7.2pt;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 32px;
        }}
        .sign-name {{
            font-size: 8.2pt;
            font-weight: 700;
            color: #0f172a;
            border-top: 1px solid #cbd5e1;
            padding-top: 4px;
        }}
        .sign-role {{
            font-size: 7pt;
            color: #64748b;
        }}
    </style>
</head>
<body>

<div class="page-container">

    <!-- ================= PAGE 1: COVER PAGE ================= -->
    <div class="page cover-page">
        <div class="cover-top">
            <div class="cover-accent-line"></div>
            <div class="cover-logo-wrapper">
                <img src="data:image/png;base64,{logo_b64}" class="cover-logo" alt="Logo IAGI">
                <div class="cover-tag">OFFICIAL ARCHITECTURAL PROPOSAL</div>
            </div>
            
            <div class="cover-title-group">
                <span class="cover-eyebrow">Sistem Informasi Pemilihan Umum Ketua Umum IAGI 2026</span>
                <h1 class="cover-title">
                    PLATFORM E-VOTING<br>
                    <span>PEMILU IAGI 2026</span>
                </h1>
                <p class="cover-subtitle">
                    Proposal Perancangan & Pembangunan Platform Pemungutan Suara Digital Berbasis <strong>Sovereign Luxury Interface</strong>, Integritas Kriptografis <strong>LUBER-JURDIL</strong>, dan Standar Desain Anti-Slop.
                </p>
                
                <div class="cover-badges-row">
                    <div class="cover-badge-item"><span class="dot"></span> Domain Independen Terpisah</div>
                    <div class="cover-badge-item"><span class="dot"></span> Standar Kepatuhan ISO/IEC 27002 · 27017 · 27018</div>
                    <div class="cover-badge-item"><span class="dot"></span> Anonymized Cryptographic Ballot (LUBER)</div>
                    <div class="cover-badge-item"><span class="dot"></span> Zero Double-Voting & Anti Brute-Force</div>
                    <div class="cover-badge-item"><span class="dot"></span> Dual-Channel Dispatcher (Email & WhatsApp)</div>
                </div>
            </div>
        </div>

        <div class="cover-bottom">
            <div class="cover-meta-grid">
                <div class="cover-meta-item">
                    <strong>Ditujukan Kepada</strong>
                    <span>Komite Pemilihan Ketua Umum (KPKU) & DPP IAGI</span>
                </div>
                <div class="cover-meta-item">
                    <strong>Disiapkan Oleh</strong>
                    <span>Digital Architecture & Engineering Lead</span>
                </div>
                <div class="cover-meta-item">
                    <strong>Dokumen Acuan</strong>
                    <span>Mekanisme KPKU (14 Sept 2026)</span>
                </div>
                <div class="cover-meta-item">
                    <strong>Status & Versi</strong>
                    <span>v2.0 (Security Hardened & Enterprise Edition)</span>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= PAGE 2: EXECUTIVE SUMMARY & INDEPENDENT DOMAIN ================= -->
    <div class="page">
        <div class="page-header">
            <div class="header-left">
                <img src="data:image/png;base64,{logo_b64}" class="header-logo-mini" alt="IAGI">
                <span class="header-title-text">Proposal Teknis E-Voting Pemilu IAGI 2026</span>
            </div>
            <span class="header-badge">Bab 1 : Ringkasan Eksekutif</span>
        </div>

        <div class="content-body">
            <div>
                <h2 class="section-heading">1. Ringkasan Eksekutif & Urgensi Domain Terpisah</h2>
                <p class="section-desc">Pondasi strategis pengembangan platform pemungutan suara mandiri untuk menjamin netralitas, ketahanan server, dan martabat organisasi Ikatan Ahli Geologi Indonesia.</p>
            </div>

            <div class="callout-gold">
                <strong>Pernyataan Nilai (Value Proposition):</strong> Pemilu IAGI 2026 bukan sekadar formulir voting biasa, melainkan representasi marwah dan kedaulatan demokrasi ribuan ahli geologi Indonesia. Sistem dirancang dengan tampilan berkelas internasional (high prestige), bebas dari kesan template murahan buatan AI, serta dipagari arsitektur kriptografi yang tidak dapat dimanipulasi oleh siapa pun.
            </div>

            <div class="grid-2">
                <div class="card">
                    <h3 style="font-size: 8.6pt; color: #0f172a; margin-bottom: 5px; display: flex; align-items: center; gap: 6px;">
                        <span class="badge badge-gold">URGENSI</span> Mengapa Harus Domain Terpisah?
                    </h3>
                    <ul style="margin: 0; padding-left: 14px; font-size: 7.5pt; color: #475569; line-height: 1.45;">
                        <li><strong>Isolasi Beban Trafik Puncak:</strong> Pada hari pemungutan suara, ribuan anggota IAGI mengakses serentak. Domain terpisah (misal: <code>pemilu.iagi.or.id</code>) menjamin server konferensi tahunan PIT IAGI - GEOSEA tetap lancar tanpa risiko down saling tarik sumber daya.</li>
                        <li><strong>Integritas & Netralitas Kelembagaan:</strong> Pemilu memerlukan lingkungan digital independen yang diawasi langsung oleh KPKU IAGI, terpisah dari operasional tiket dan registrasi acara ilmiah.</li>
                        <li><strong>Keamanan Database Terisolasi:</strong> Data Daftar Pemilih Tetap (DPT) dan kotak suara digital berada pada database mandiri dengan proteksi enkripsi khusus yang tidak tercampur dengan transaksi tiket publik.</li>
                    </ul>
                </div>

                <div class="card">
                    <h3 style="font-size: 8.6pt; color: #0f172a; margin-bottom: 5px; display: flex; align-items: center; gap: 6px;">
                        <span class="badge badge-emerald">STANDAR</span> Target & KPI Keandalan Sistem
                    </h3>
                    <ul style="margin: 0; padding-left: 14px; font-size: 7.5pt; color: #475569; line-height: 1.45;">
                        <li><strong>Uptime 99.99%:</strong> Didukung CDN global (Cloudflare) dan multi-region caching untuk memitigasi latensi pemilih dari seluruh penjuru Indonesia dan luar negeri.</li>
                        <li><strong>Delivery Rate Email &gt;99.5%:</strong> Integrasi transactional mail service bersertifikasi DKIM/SPF/DMARC agar kode unik dipastikan masuk ke Inbox utama, bukan folder Spam/Promosi.</li>
                        <li><strong>Zero Data Breach:</strong> Penerapan asas LUBER di mana identitas pemilih diputus hubungannya dari pilihan kandidat di level database.</li>
                    </ul>
                </div>
            </div>

            <div class="card" style="padding: 0; overflow: hidden;">
                <div style="background: #f8fafc; padding: 7px 11px; border-bottom: 1px solid #e2e8f0; font-weight: 700; font-size: 7.8pt; color: #0f172a;">
                    Perbandingan: Sistem Pemilu Biasa vs. Standar Arsitektur E-Voting IAGI 2026
                </div>
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th style="width: 25%;">Parameter Evaluasi</th>
                            <th style="width: 37%;">Solusi Konvensional / Template Biasa</th>
                            <th style="width: 38%; color: #0f766e;">Standar Platform Pemilu IAGI 2026 (Usulan)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Estetika & Kesan Visual</strong></td>
                            <td>Template AI generik, warna ungu/biru neon klise, kartu melayang seragam, terkesan murah & main-main.</td>
                            <td><strong>Sovereign Luxury & Geological Prestige</strong>. Palet Obsidian, Bronze, Emerald IAGI, tipografi display berwibawa, anti-slop.</td>
                        </tr>
                        <tr>
                            <td><strong>Mekanisme Kerahasiaan</strong></td>
                            <td>ID voter disimpan sebaris dengan pilihan calon (rawan disalahgunakan admin/bocor siapa memilih siapa).</td>
                            <td><strong>Anonymized Cryptographic Ballot</strong>. Status hak suara dan kotak suara dipisah mutlak secara kriptografis (Asas Rahasia).</td>
                        </tr>
                        <tr>
                            <td><strong>Verifikasi Hak Suara</strong></td>
                            <td>Login akun biasa (rentan peretasan sandi atau phishing).</td>
                            <td><strong>Triple Verification</strong>: Nama Lengkap + NPA + One-Time Token Kriptografis sekali pakai via Email resmi.</td>
                        </tr>
                        <tr>
                            <td><strong>Pencegahan Double Vote</strong></td>
                            <td>Validasi frontend sederhana (mudah di-bypass melalui klik berulang atau request paralel).</td>
                            <td><strong>Database Row-Locking & Atomic Transactions</strong>: Token langsung hangus dalam milidetik pertama eksekusi.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="callout-teal">
                <strong>Catatan Kepatuhan Regulasi:</strong> Dokumen ini mengadopsi 100% regulasi resmi KPKU tertanggal 14 September 2026, mencakup reaktivasi keanggotaan per 24 September 2026, rilis DPS/DPT per 25 September 2026, mekanisme Claim Surat Suara, distribusi link dan kode unik via email, hingga kertas suara 3 Caketum.
            </div>
        </div>

        <div class="page-footer">
            <span class="footer-left">Dokumen Usulan Teknis KPKU & DPP IAGI — Rahasia & Terbatas</span>
            <span class="footer-right">Halaman 2 dari 8</span>
        </div>
    </div>

    <!-- ================= PAGE 3: TASTE-SKILL PHILOSOPHY ================= -->
    <div class="page">
        <div class="page-header">
            <div class="header-left">
                <img src="data:image/png;base64,{logo_b64}" class="header-logo-mini" alt="IAGI">
                <span class="header-title-text">Proposal Teknis E-Voting Pemilu IAGI 2026</span>
            </div>
            <span class="header-badge">Bab 2 : Standar Desain Taste-Skill</span>
        </div>

        <div class="content-body">
            <div>
                <h2 class="section-heading">2. Filosofi Desain & Standar Antarmuka "Taste-Skill"</h2>
                <p class="section-desc">Penerapan framework anti-slop frontend (<a href="https://github.com/Leonxlnx/taste-skill" style="color: #0f766e; text-decoration: none; font-weight: 600;">taste-skill</a>) untuk menghadirkan visual mewah, kokoh, berwibawa, dan bebas dari stereotip template kecerdasan buatan.</p>
            </div>

            <div class="card-dark">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 7.2pt; color: #c5a059; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">
                        Brief Inference & Design Read
                    </span>
                    <span class="badge" style="background: rgba(197, 160, 89, 0.2); color: #fde68a; border: 1px solid #c5a059;">Taste-Skill Compliance</span>
                </div>
                <p style="font-size: 8pt; line-height: 1.45; color: #e2e8f0; margin: 0; font-style: italic;">
                    "Reading this as: Digital Democratic Sovereign Platform for IAGI (Ikatan Ahli Geologi Indonesia), with a Prestigious Institutional / Sovereign Modern Luxury language, leaning toward Obsidian Slate + Brushed Champagne Gold + Deep Emerald Earth Accent, with Cabinet Grotesk / Outfit Display + JetBrains Mono typography, asymmetric high-end composition, and strict anti-slop rules."
                </p>
            </div>

            <div class="grid-3">
                <div class="dial-box">
                    <div class="dial-header">
                        <span class="dial-name">DESIGN_VARIANCE</span>
                        <span class="dial-val">8 / 10</span>
                    </div>
                    <div class="dial-bar"><div class="dial-fill" style="width: 80%;"></div></div>
                    <div class="dial-desc">Layout asimetris berirama, memecah stereotip 3 kartu sejajar AI yang membosankan. Memberikan gravitasi visual kuat pada bilik suara.</div>
                </div>

                <div class="dial-box">
                    <div class="dial-header">
                        <span class="dial-name">MOTION_INTENSITY</span>
                        <span class="dial-val">6 / 10</span>
                    </div>
                    <div class="dial-bar"><div class="dial-fill" style="width: 60%;"></div></div>
                    <div class="dial-desc">Animasi taktil fisik: transisi halus, micro-haptics saat mencoblos, dialog konfirmasi berbobot tanpa kedipan neon yang mengganggu.</div>
                </div>

                <div class="dial-box">
                    <div class="dial-header">
                        <span class="dial-name">VISUAL_DENSITY</span>
                        <span class="dial-val">4 / 10</span>
                    </div>
                    <div class="dial-bar"><div class="dial-fill" style="width: 40%;"></div></div>
                    <div class="dial-desc">Komposisi lega (airy & prestigious). Memberikan fokus penuh pada profil dan foto resmi kandidat Ketua Umum tanpa distraksi.</div>
                </div>
            </div>

            <div class="grid-2">
                <div class="card">
                    <h3 style="font-size: 8.3pt; color: #0f172a; margin-bottom: 5px; font-weight: 700;">
                        Aturan Anti-Template AI (Anti-Default Discipline)
                    </h3>
                    <ul style="margin: 0; padding-left: 14px; font-size: 7.3pt; color: #475569; line-height: 1.42;">
                        <li><strong>Dilarang Gradient Ungu/Biru Klise:</strong> Mengharamkan glow mesh gradient ungu khas template AI murahan. Menggunakan latar belakang mineral murni yang teduh.</li>
                        <li><strong>Dilarang Tiga Kartu Simetris Monoton:</strong> Struktur bilik suara dirancang proporsional seperti kertas suara fisik premium dengan framing emas-bronze dan kontras tinggi.</li>
                        <li><strong>Dilarang Fake Screenshots / Div Dummy:</strong> Semua aset kandidat menggunakan foto studio resolusi tinggi dengan latar belakang senada dan tipografi resmi.</li>
                        <li><strong>Micro-Interaksi Fisik Nyata:</strong> Tombol interaktif memiliki tactile feedback saat ditekan (<code>:active -translate-y-[1px]</code>) memberikan sensasi memilih yang meyakinkan.</li>
                    </ul>
                </div>

                <div class="card">
                    <h3 style="font-size: 8.3pt; color: #0f172a; margin-bottom: 5px; font-weight: 700;">
                        Kurasi Palet Warna "Geological Sovereign"
                    </h3>
                    <div class="swatch-group">
                        <div class="swatch-item">
                            <div class="swatch-color" style="background: #090d16;"></div>
                            <div class="swatch-info">
                                <span class="swatch-name">Obsidian Deep</span>
                                <span class="swatch-hex">#090D16</span>
                            </div>
                        </div>
                        <div class="swatch-item">
                            <div class="swatch-color" style="background: #c5a059;"></div>
                            <div class="swatch-info">
                                <span class="swatch-name">Brushed Gold</span>
                                <span class="swatch-hex">#C5A059</span>
                            </div>
                        </div>
                        <div class="swatch-item">
                            <div class="swatch-color" style="background: #0f766e;"></div>
                            <div class="swatch-info">
                                <span class="swatch-name">Earth Emerald</span>
                                <span class="swatch-hex">#0F766E</span>
                            </div>
                        </div>
                        <div class="swatch-item">
                            <div class="swatch-color" style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;"></div>
                            <div class="swatch-info">
                                <span class="swatch-name">Pure Alabaster</span>
                                <span class="swatch-hex">#F8FAFC</span>
                            </div>
                        </div>
                    </div>
                    <p style="font-size: 7pt; color: #64748b; margin-top: 6px; margin-bottom: 0; line-height: 1.35;">
                        Harmonisasi palet terinspirasi dari batuan obsidian bumi pertiwi, kemilau mineral mulia (gold), serta identitas geologi hijau zamrud IAGI. Memenuhi standar kontras aksesibilitas WCAG AAA.
                    </p>
                </div>
            </div>

            <div class="card">
                <h3 style="font-size: 8.3pt; color: #0f172a; margin-bottom: 5px; font-weight: 700;">
                    Tipografi & Hirarki Informasi Berbobot
                </h3>
                <div class="grid-2">
                    <div style="font-size: 7.4pt; color: #475569; line-height: 1.4;">
                        <strong style="color: #0f172a;">Display Typeface:</strong> <em>Plus Jakarta Sans / Outfit Display</em><br>
                        Gaya sans-serif modern dengan tarikan geometris tegas, memberikan wibawa kenegaraan dan institusional tanpa terasa kaku.
                    </div>
                    <div style="font-size: 7.4pt; color: #475569; line-height: 1.4;">
                        <strong style="color: #0f172a;">Data & Token Typeface:</strong> <em>JetBrains Mono</em><br>
                        Digunakan untuk NPA, kode token unik, timestamp voting, dan hash verifikasi guna menegaskan aspek audit forensik dan presisi teknis.
                    </div>
                </div>
            </div>
        </div>

        <div class="page-footer">
            <span class="footer-left">Dokumen Usulan Teknis KPKU & DPP IAGI — Rahasia & Terbatas</span>
            <span class="footer-right">Halaman 3 dari 8</span>
        </div>
    </div>

    <!-- ================= PAGE 4: DETAILED WORKFLOW & KPKU MECHANISM ================= -->
    <div class="page">
        <div class="page-header">
            <div class="header-left">
                <img src="data:image/png;base64,{logo_b64}" class="header-logo-mini" alt="IAGI">
                <span class="header-title-text">Proposal Teknis E-Voting Pemilu IAGI 2026</span>
            </div>
            <span class="header-badge">Bab 3 : Alur Mekanisme KPKU</span>
        </div>

        <div class="content-body">
            <div>
                <h2 class="section-heading">3. Alur Mekanisme Pemilu Sesuai Regulasi KPKU</h2>
                <p class="section-desc">Implementasi teknis end-to-end merujuk pada Dokumen Resmi Rancangan Mekanisme KPKU IAGI tertanggal 14 September 2026.</p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 5.5px;">
                <div class="workflow-step">
                    <div class="step-num">01</div>
                    <div class="step-content">
                        <div class="step-title">
                            <span>Reaktivasi Keanggotaan & Pemutakhiran DPT (Maks. 24 September 2026)</span>
                            <span class="badge badge-slate">Fase 1</span>
                        </div>
                        <p>Anggota IAGI melakukan reaktivasi keanggotaan tahun 2026 maksimal tanggal 24 September 2026 untuk masuk ke dalam Daftar Pemilih Sementara (DPS) yang dirilis resmi oleh KPKU IAGI pada 25 September 2026. Data diverifikasi mencakup Nama Lengkap, NPA, dan Email aktif.</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="step-num">02</div>
                    <div class="step-content">
                        <div class="step-title">
                            <span>Modul Cek DPT Online Mandiri di Web Pemilu</span>
                            <span class="badge badge-blue">Mandiri</span>
                        </div>
                        <p>Platform menyediakan fitur pencarian cepat DPT. Anggota cukup mengetikkan NPA atau Nama Lengkap untuk memverifikasi apakah status hak suara mereka aktif dan memeriksa alamat email terdaftar sebelum masa klaim surat suara dibuka.</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="step-num">03</div>
                    <div class="step-content">
                        <div class="step-title">
                            <span>Klaim Surat Suara (Menu "Claim Surat Suara")</span>
                            <span class="badge badge-gold">Verifikasi</span>
                        </div>
                        <p>Anggota mengakses menu Claim Surat Suara pada web platform Pemilu IAGI dengan memasukkan: <strong>Nama Lengkap</strong>, <strong>NPA</strong>, dan <strong>Alamat Email Aktif</strong>. Sistem mencocokkan data secara instan dengan basis data DPT yang telah disahkan KPKU.</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="step-num">04</div>
                    <div class="step-content">
                        <div class="step-title">
                            <span>Pengiriman Magic Link & Kode Unik Otomatis via Email Terdaftar</span>
                            <span class="badge badge-emerald">Otomatis</span>
                        </div>
                        <p>Sistem men-generate token kriptografis sekali pakai yang unik. Surat suara dikirimkan ke email anggota berupa <strong>Link Akses Khusus</strong> dan <strong>Kode Unik</strong> (contoh: <span class="token-preview">IAGI-2026-X9K2-7LM4</span>). Setiap anggota menerima kode unik berbeda yang belum terikat pada calon mana pun.</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="step-num">05</div>
                    <div class="step-content">
                        <div class="step-title">
                            <span>Bilik Suara Digital (Menu "Vote Now") & Kertas Suara Digital</span>
                            <span class="badge badge-gold">Bilik Suara</span>
                        </div>
                        <p>Ketika link di email diklik, anggota diarahkan ke menu Vote Now dengan data Nama, NPA, dan Kode Unik otomatis terisi. Kertas suara digital menampilkan <strong>Nomor Urut</strong>, <strong>Foto Resmi</strong>, dan <strong>Nama Lengkap dari 3 Calon Ketua Umum (Caketum) IAGI</strong>.</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="step-num">06</div>
                    <div class="step-content">
                        <div class="step-title">
                            <span>Pilihan Kandidat & Konfirmasi Ganda (Dual-Confirmation Pop-up)</span>
                            <span class="badge badge-blue">Safety Dialog</span>
                        </div>
                        <p>Anggota mengklik salah satu Caketum pilihan lalu klik tombol <strong>Submit</strong>. Muncul pop-up window: <em>"Apakah Anda yakin untuk submit pilihan ini?"</em>. Jika memilih <strong>TIDAK</strong>, kembali ke kertas suara. Jika memilih <strong>YA</strong>, pilihan resmi direkam secara permanen.</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="step-num">07</div>
                    <div class="step-content">
                        <div class="step-title">
                            <span>Penyimpanan Suara Aman & Pengalihan ke Beranda (Home)</span>
                            <span class="badge badge-emerald">Final</span>
                        </div>
                        <p>Setelah suara berhasil direkam ke kotak suara terenkripsi, kode unik langsung dihanguskan (status diubah menjadi <strong>VOTED</strong>). Sistem menampilkan tanda terima digital (Digital Receipt), lalu mengarahkan anggota kembali ke Beranda (Home) platform.</p>
                    </div>
                </div>
            </div>

            <!-- Wireframe Mini Mockup Kertas Suara -->
            <div class="ballot-mockup">
                <div class="ballot-header">
                    <span style="font-size: 7.2pt; font-weight: 700; color: #c5a059; text-transform: uppercase; letter-spacing: 0.08em;">
                        Ilustrasi Tata Letak Kertas Suara Digital (Vote Now Interface)
                    </span>
                </div>
                <div class="ballot-grid">
                    <div class="candidate-card">
                        <div class="candidate-num">01</div>
                        <div class="candidate-photo-placeholder">FOTO RESMI CAKETUM 1</div>
                        <div class="candidate-name">Nama Lengkap Caketum 1, M.Sc., IPU</div>
                        <div class="btn-vote-mock">PILIH CALON 01</div>
                    </div>
                    <div class="candidate-card" style="border-color: #c5a059; background: #1a2234;">
                        <div class="candidate-num" style="background: #c5a059; color: #090d16;">02</div>
                        <div class="candidate-photo-placeholder" style="border-color: #c5a059;">FOTO RESMI CAKETUM 2</div>
                        <div class="candidate-name">Nama Lengkap Caketum 2, Ph.D.</div>
                        <div class="btn-vote-mock" style="background: #c5a059; color: #090d16;">PILIH CALON 02</div>
                    </div>
                    <div class="candidate-card">
                        <div class="candidate-num">03</div>
                        <div class="candidate-photo-placeholder">FOTO RESMI CAKETUM 3</div>
                        <div class="candidate-name">Nama Lengkap Caketum 3, S.T., M.T.</div>
                        <div class="btn-vote-mock">PILIH CALON 03</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-footer">
            <span class="footer-left">Dokumen Usulan Teknis KPKU & DPP IAGI — Rahasia & Terbatas</span>
            <span class="footer-right">Halaman 4 dari 8</span>
        </div>
    </div>

    <!-- ================= PAGE 5: CRYPTOGRAPHIC SECURITY & LUBER-JURDIL ================= -->
    <div class="page">
        <div class="page-header">
            <div class="header-left">
                <img src="data:image/png;base64,{logo_b64}" class="header-logo-mini" alt="IAGI">
                <span class="header-title-text">Proposal Teknis E-Voting Pemilu IAGI 2026</span>
            </div>
            <span class="header-badge">Bab 4 : Keamanan & Kriptografi</span>
        </div>

        <div class="content-body">
            <div>
                <h2 class="section-heading">4. Arsitektur Keamanan Kriptografi & Integritas LUBER</h2>
                <p class="section-desc">Penerapan standar Zero-Knowledge Ballot Box untuk menjamin asas Langsung, Umum, Bebas, Rahasia, Jujur, dan Adil.</p>
            </div>

            <div class="card" style="background: #090d16; border-color: #1e293b; color: #fff;">
                <h3 style="color: #c5a059; font-size: 8.8pt; margin-bottom: 5px; font-weight: 700;">
                    Prinsip Anonymized Ballot Box (Pemisahan Identitas Pemilih & Suara)
                </h3>
                <p style="font-size: 7.5pt; color: #94a3b8; line-height: 1.45; margin: 0;">
                    Tantangan terbesar e-voting adalah menjaga kerahasiaan: panitia harus bisa memastikan anggota hanya memilih 1 kali, tetapi <strong>tidak boleh ada seorang pun yang bisa melihat siapa memilih siapa</strong>. Sistem kami memisahkan struktur basis data menjadi 2 entitas yang terputus secara kriptografis:
                </p>
                <div class="grid-2" style="margin-top: 8px;">
                    <div style="background: #141b27; border: 1px solid #1e293b; padding: 8px 10px; border-radius: 6px;">
                        <span style="font-family: 'JetBrains Mono', monospace; font-size: 7.2pt; color: #38bdf8; font-weight: 700;">Tabel 1: Voter Identity Registry</span>
                        <p style="font-size: 7.1pt; color: #94a3b8; margin: 4px 0 0 0; line-height: 1.35;">
                            Mencatat data anggota: <code>NPA</code>, <code>Nama</code>, <code>Email</code>, <code>has_claimed=true</code>, <code>has_voted=true</code>, dan <code>voted_at=timestamp</code>.<br>
                            <span style="color: #ef4444; font-weight: 600;">TIDAK menyimpan ID calon yang dipilih!</span>
                        </p>
                    </div>
                    <div style="background: #141b27; border: 1px solid #1e293b; padding: 8px 10px; border-radius: 6px;">
                        <span style="font-family: 'JetBrains Mono', monospace; font-size: 7.2pt; color: #4ade80; font-weight: 700;">Tabel 2: Anonymous Digital Ballot Box</span>
                        <p style="font-size: 7.1pt; color: #94a3b8; margin: 4px 0 0 0; line-height: 1.35;">
                            Menyimpan surat suara murni: <code>candidate_id</code>, <code>ballot_hash</code>, dan <code>cast_timestamp</code> secara acak.<br>
                            <span style="color: #4ade80; font-weight: 600;">Tidak ada foreign key ke identitas pemilih!</span>
                        </p>
                    </div>
                </div>
            </div>

            <div class="grid-2">
                <div class="card">
                    <h3 style="font-size: 8.3pt; color: #0f172a; margin-bottom: 5px; font-weight: 700;">
                        Atomic Transactions & Anti-Race Condition
                    </h3>
                    <p style="font-size: 7.4pt; color: #475569; line-height: 1.42; margin: 0;">
                        Saat ribuan anggota memilih bersamaan, ada potensi eksploitasi pengiriman vote ganda via multi-tab atau bot. Sistem menerapkan <strong>Database Row-Level Locking (SELECT ... FOR UPDATE)</strong> dalam satu blok transaksi atomik. Jika token sudah terkunci, request kedua otomatis ditolak seketika pada milidetik yang sama.
                    </p>
                </div>

                <div class="card">
                    <h3 style="font-size: 8.3pt; color: #0f172a; margin-bottom: 5px; font-weight: 700;">
                        Kriptografi Token Sekali Pakai (One-Time Token)
                    </h3>
                    <p style="font-size: 7.4pt; color: #475569; line-height: 1.42; margin: 0;">
                        Kode unik di-generate menggunakan algoritma random cryptographically secure (CSPRNG) 128-bit yang di-hash dengan salt server. Kode unik memiliki masa berlaku terbatas (time-to-live) dan langsung berstatus <em>EXPIRED</em> begitu tombol konfirmasi "YA" diklik oleh pemilih.
                    </p>
                </div>
            </div>

            <div class="card">
                <h3 style="font-size: 8.3pt; color: #0f172a; margin-bottom: 6px; font-weight: 700;">
                    Lapisan Pertahanan Siber & Kepatuhan Standar Internasional ISO/IEC
                </h3>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 8px; border-radius: 5px;">
                        <strong style="font-size: 7.2pt; color: #b45309; display: block; margin-bottom: 2px;">ISO/IEC 27018</strong>
                        <span style="font-size: 6.7pt; color: #64748b; line-height: 1.25; display: block;">Proteksi PII & masked email pemilih, data 2.144 anggota terenkripsi di database mandiri.</span>
                    </div>
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 8px; border-radius: 5px;">
                        <strong style="font-size: 7.2pt; color: #047857; display: block; margin-bottom: 2px;">ISO/IEC 27017</strong>
                        <span style="font-size: 6.7pt; color: #64748b; line-height: 1.25; display: block;">Server hardening .htaccess Require all denied, proteksi direktori suara dari akses browser.</span>
                    </div>
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 8px; border-radius: 5px;">
                        <strong style="font-size: 7.2pt; color: #dc2626; display: block; margin-bottom: 2px;">Anti Brute-Force</strong>
                        <span style="font-size: 6.7pt; color: #64748b; line-height: 1.25; display: block;">Kunci IP otomatis 15 menit jika 5x gagal, plus jebakan bot invisible honeypot.</span>
                    </div>
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 8px; border-radius: 5px;">
                        <strong style="font-size: 7.2pt; color: #1d4ed8; display: block; margin-bottom: 2px;">ISO/IEC 27002</strong>
                        <span style="font-size: 6.7pt; color: #64748b; line-height: 1.25; display: block;">Multi-Admin 2FA (WhatsApp/Email), Master Key Pleno 6-digit & audit trail kriptografis SHA-256.</span>
                    </div>
                </div>
            </div>

            <div class="callout-gold">
                <strong>Jaminan Integritas KPKU:</strong> Hasil suara tersimpan dalam bentuk agregat yang dapat diverifikasi oleh saksi ketiga Caketum pada saat rapat pleno penghitungan suara, tanpa melanggar kerahasiaan pilihan individu pemilih.
            </div>
        </div>

        <div class="page-footer">
            <span class="footer-left">Dokumen Usulan Teknis KPKU & DPP IAGI — Rahasia & Terbatas</span>
            <span class="footer-right">Halaman 5 dari 8</span>
        </div>
    </div>

    <!-- ================= PAGE 6: ADMIN KPKU COMMAND CENTER ================= -->
    <div class="page">
        <div class="page-header">
            <div class="header-left">
                <img src="data:image/png;base64,{logo_b64}" class="header-logo-mini" alt="IAGI">
                <span class="header-title-text">Proposal Teknis E-Voting Pemilu IAGI 2026</span>
            </div>
            <span class="header-badge">Bab 5 : KPKU Command Center</span>
        </div>

        <div class="content-body">
            <div>
                <h2 class="section-heading">5. Fitur Dashboard Admin & Panitia (KPKU Center)</h2>
                <p class="section-desc">Pusat kendali komprehensif bagi Panitia Pemilihan (KPKU) untuk memantau, mengelola, dan mengaudit jalannya pemilu secara transparan dan akuntabel.</p>
            </div>

            <div class="grid-2">
                <div class="card">
                    <h3 style="font-size: 8.3pt; color: #0f172a; margin-bottom: 4px; font-weight: 700;">
                        1. Manajemen DPT & Import Excel
                    </h3>
                    <p style="font-size: 7.4pt; color: #475569; line-height: 1.38; margin: 0 0 5px 0;">
                        Fitur upload DPT resmi format <code>.xlsx</code> / <code>.csv</code> berisi ribuan anggota. Dilengkapi validator otomatis untuk mendeteksi duplikasi NPA, email tidak valid, atau inkonsistensi nama.
                    </p>
                    <ul style="margin: 0; padding-left: 14px; font-size: 7.1pt; color: #64748b; line-height: 1.32;">
                        <li>Filter status instan: <em>Belum Klaim</em>, <em>Sudah Klaim (Token Terkirim)</em>, <em>Sudah Memilih</em>.</li>
                        <li>Export laporan partisipasi pemilih real-time per Pengda (Pengurus Daerah).</li>
                    </ul>
                </div>

                <div class="card">
                    <h3 style="font-size: 8.3pt; color: #0f172a; margin-bottom: 4px; font-weight: 700;">
                        2. Manajemen Profil 3 Caketum
                    </h3>
                    <p style="font-size: 7.4pt; color: #475569; line-height: 1.38; margin: 0 0 5px 0;">
                        Pengaturan identitas resmi Calon Ketua Umum IAGI:
                    </p>
                    <ul style="margin: 0; padding-left: 14px; font-size: 7.1pt; color: #64748b; line-height: 1.32;">
                        <li>Nomor urut calon (Kandidat 1, 2, dan 3).</li>
                        <li>Upload foto resmi jas/batik resolusi tinggi dengan cropping otomatis berstandar kertas suara.</li>
                        <li>Nama lengkap beserta gelar akademis/profesional.</li>
                        <li>Visi, misi, dan profil ringkas untuk informasi pemilih.</li>
                    </ul>
                </div>
            </div>

            <div class="grid-2">
                <div class="card">
                    <h3 style="font-size: 8.3pt; color: #0f172a; margin-bottom: 4px; font-weight: 700;">
                        3. Master Timer & Otomasi Gerbang Pemilu
                    </h3>
                    <p style="font-size: 7.4pt; color: #475569; line-height: 1.38; margin: 0 0 5px 0;">
                        Pengendali waktu pembukaan dan penutupan tahapan pemilu dengan sinkronisasi waktu jaringan presisi (NTP Server):
                    </p>
                    <ul style="margin: 0; padding-left: 14px; font-size: 7.1pt; color: #64748b; line-height: 1.32;">
                        <li>Jadwal pembukaan dan penutupan masa <em>Klaim Surat Suara</em>.</li>
                        <li>Jadwal pembukaan dan penutupan bilik suara <em>Vote Now</em>.</li>
                        <li>Otomatis mengunci formulir begitu detik penutupan berakhir.</li>
                    </ul>
                </div>

                <div class="card">
                    <h3 style="font-size: 8.3pt; color: #0f172a; margin-bottom: 4px; font-weight: 700;">
                        4. Quick Count & Tabulasi Suara Bersegel
                    </h3>
                    <p style="font-size: 7.4pt; color: #475569; line-height: 1.38; margin: 0 0 5px 0;">
                        Fitur penghitungan suara digital dengan proteksi ganda:
                    </p>
                    <ul style="margin: 0; padding-left: 14px; font-size: 7.1pt; color: #64748b; line-height: 1.32;">
                        <li><strong>Mode Tersegel (Sealed):</strong> Selama pemilihan berlangsung, perolehan suara disembunyikan untuk menjaga objektivitas dan mencegah opini menggiring.</li>
                        <li><strong>Mode Pembukaan Pleno (Unseal):</strong> Dibuka serentak dengan otorisasi kunci ketua KPKU saat sidang pleno penghitungan suara resmi.</li>
                    </ul>
                </div>
            </div>

            <div class="card" style="background: #f8fafc; border: 1px solid #e2e8f0;">
                <h3 style="font-size: 8.3pt; color: #0f172a; margin-bottom: 5px; font-weight: 700;">
                    5. Pusat Bantuan & Resend Token Log (Helpdesk Anggota)
                </h3>
                <p style="font-size: 7.4pt; color: #475569; line-height: 1.38; margin: 0 0 5px 0;">
                    Untuk melayani anggota yang mengalami kendala teknis (misal: email salah ketik saat reaktivasi, storage email penuh, atau link terhapus), panitia memiliki konsol helpdesk dengan wewenang khusus:
                </p>
                <div class="grid-3">
                    <div style="background: #fff; border: 1px solid #cbd5e1; padding: 6px 8px; border-radius: 4px;">
                        <strong style="font-size: 7.2pt; color: #0f172a; display: block;">Log Status Pengiriman</strong>
                        <span style="font-size: 6.8pt; color: #64748b;">Melihat apakah email kode unik telah <em>Delivered</em>, <em>Bounced</em>, atau <em>Opened</em>.</span>
                    </div>
                    <div style="background: #fff; border: 1px solid #cbd5e1; padding: 6px 8px; border-radius: 4px;">
                        <strong style="font-size: 7.2pt; color: #0f172a; display: block;">Resend Token Resmi</strong>
                        <span style="font-size: 6.8pt; color: #64748b;">Kirim ulang token ke alamat email yang diverifikasi identitasnya oleh panitia.</span>
                    </div>
                    <div style="background: #fff; border: 1px solid #cbd5e1; padding: 6px 8px; border-radius: 4px;">
                        <strong style="font-size: 7.2pt; color: #0f172a; display: block;">Audit Trail Tindakan</strong>
                        <span style="font-size: 6.8pt; color: #64748b;">Setiap klik resend oleh panitia dicatat lengkap dengan nama admin & alasan.</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-footer">
            <span class="footer-left">Dokumen Usulan Teknis KPKU & DPP IAGI — Rahasia & Terbatas</span>
            <span class="footer-right">Halaman 6 dari 8</span>
        </div>
    </div>

    <!-- ================= PAGE 7: RENCANA ANGGARAN BIAYA (RAB) ================= -->
    <div class="page">
        <div class="page-header">
            <div class="header-left">
                <img src="data:image/png;base64,{logo_b64}" class="header-logo-mini" alt="IAGI">
                <span class="header-title-text">Proposal Teknis E-Voting Pemilu IAGI 2026</span>
            </div>
            <span class="header-badge">Bab 6 : Rencana Anggaran Biaya</span>
        </div>

        <div class="content-body">
            <div>
                <h2 class="section-heading">6. Rencana Anggaran Biaya (RAB) & Investasi Jasa</h2>
                <p class="section-desc">Rincian transparan biaya rekayasa perangkat lunak, infrastruktur server independen, dan layanan pendampingan penuh pemilu.</p>
            </div>

            <div class="card" style="padding: 0; overflow: hidden;">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th style="width: 5%; text-align: center;">No</th>
                            <th style="width: 44%;">Rincian Komponen & Modul Sistem</th>
                            <th style="width: 27%;">Spesifikasi & Cakupan Kerja</th>
                            <th style="width: 24%; text-align: right;">Investasi (IDR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="text-align: center; font-weight: 700;">1</td>
                            <td>
                                <strong style="color: #0f172a;">Frontend Architecture & Sovereign UI System</strong><br>
                                <span style="font-size: 6.8pt; color: #64748b;">Desain mewah modern non-template AI, palet Geological Sovereign, responsive mobile-first PWA, tactile micro-interaction bilik suara.</span>
                            </td>
                            <td>Layout asimetris, Typography Plus Jakarta Sans + Mono, CSS Tokens.</td>
                            <td class="price-col">Rp 1.500.000</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; font-weight: 700;">2</td>
                            <td>
                                <strong style="color: #0f172a;">Modul Pemilih & DPT Mandiri (Kepatuhan Privasi ISO 27018)</strong><br>
                                <span style="font-size: 6.8pt; color: #64748b;">Pencarian mandiri 2.144 DPT resmi, validasi triple-check KPKU, masked email & perlindungan data pribadi anggota (PII).</span>
                            </td>
                            <td>Real-time query index, token engine CSPRNG 128-bit, audit trail.</td>
                            <td class="price-col">Rp 1.250.000</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; font-weight: 700;">3</td>
                            <td>
                                <strong style="color: #0f172a;">Dual-Channel Dispatcher (Email DKIM/SPF & WhatsApp Gateway)</strong><br>
                                <span style="font-size: 6.8pt; color: #64748b;">Sistem blast otomatis link pemilu & kode unik via Email resmi transaksi dan integrasi WhatsApp Fonnte OTP Gateway untuk 2FA instan.</span>
                            </td>
                            <td>Worker queue, dual-channel fallback, delivery status tracker.</td>
                            <td class="price-col">Rp 1.500.000</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; font-weight: 700;">4</td>
                            <td>
                                <strong style="color: #0f172a;">Bilik Suara Kriptografis & Zero-Knowledge Ballot Box (Asas LUBER)</strong><br>
                                <span style="font-size: 6.8pt; color: #64748b;">Pemisahan mutlak identitas pemilih dari surat suara (SHA-256), atomic server-side lock (anti double-vote), token auto-burn saat submit.</span>
                            </td>
                            <td>Asas LUBER murni, server locking (flock), bukti tanda terima digital.</td>
                            <td class="price-col">Rp 2.000.000</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; font-weight: 700;">5</td>
                            <td>
                                <strong style="color: #0f172a;">KPKU Command Center & Quick Count Bersegel (6-Digit Pleno Key)</strong><br>
                                <span style="font-size: 6.8pt; color: #64748b;">Import DPT, manajemen Caketum, live tabulasi suara bersegel rapat pleno, visualizer panggung proyektor, helpdesk anggota.</span>
                            </td>
                            <td>Admin dashboard lengkap, multi-role 2FA, master timer, visualizer.</td>
                            <td class="price-col">Rp 1.750.000</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; font-weight: 700;">6</td>
                            <td>
                                <strong style="color: #0f172a;">Enterprise Cybersecurity Hardening & Kepatuhan ISO/IEC 27002, 27017</strong><br>
                                <span style="font-size: 6.8pt; color: #64748b;">Anti Brute-Force Guardian (auto lockout 15 menit), anti-bot honeypot, server hardening (.htaccess isolasi database), pendampingan pleno Hari-H.</span>
                            </td>
                            <td>Security headers WAF, server tuning, rate-limiting, audit log SHA-256.</td>
                            <td class="price-col">Rp 2.000.000</td>
                        </tr>
                        
                        <!-- TOTAL STANDAR ROW -->
                        <tr class="rab-total-row">
                            <td colspan="3" style="text-align: right; padding-right: 10px;">TOTAL NILAI STANDAR SISTEM ENTERPRISE E-VOTING (6 MODUL LENGKAP):</td>
                            <td class="price-col" style="color: #64748b; text-decoration: line-through;">Rp 10.000.000</td>
                        </tr>

                        <!-- BLUE HIGHLIGHTED BLOCK ROW: JASA KEMITRAAN 7.000.000 -->
                        <tr class="rab-blue-row">
                            <td colspan="3" style="text-align: right; padding-right: 10px;">
                                <strong style="color: #ffffff; font-size: 8.5pt;">PENAWARAN KHUSUS KEMITRAAN IAGI (INVESTASI SISTEM & KEAMANAN LUBER):</strong><br>
                                <span style="font-size: 6.7pt; font-weight: 500; color: #dbeafe;">Paket All-in 6 modul lengkap platform e-voting mandiri, arsitektur Taste-Skill, Kriptografi LUBER & Keamanan Siber ISO/IEC</span>
                            </td>
                            <td class="price-col">Rp 7.000.000</td>
                        </tr>

                        <!-- HOSTING & DOMAIN ROW: INCLUDED / MANAGED -->
                        <tr class="rab-hosting-row">
                            <td colspan="3" style="text-align: right; padding-right: 10px;">
                                <strong style="color: #1e3a8a;">INFRASTRUKTUR CLOUD & DOMAIN MANDIRI:</strong><br>
                                <span style="font-size: 6.7pt; font-weight: 500; color: #3b82f6;">Domain resmi pemiluiagi.web.id + Cloud Hosting Server Mandiri KPKU + SSL/TLS + Cloudflare WAF (Managed Setup)</span>
                            </td>
                            <td class="price-col" style="font-size: 8pt; color: #16a34a;">TERMASUK (ALL-IN)</td>
                        </tr>

                        <!-- GRAND TOTAL ROW: 7.000.000 -->
                        <tr class="rab-grand-total">
                            <td colspan="3" style="text-align: right; padding-right: 10px;">
                                <strong style="letter-spacing: 0.04em; color: #ffffff;">TOTAL KESELURUHAN (ALL-IN JASA SISTEM & KEAMANAN SIBER):</strong><br>
                                <span style="font-size: 6.8pt; font-weight: 500; color: #c5a059; font-style: italic;"># Tujuh Juta Rupiah #</span>
                            </td>
                            <td class="price-col">Rp 7.000.000</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="grid-2">
                <div class="card" style="background: #f8fafc;">
                    <h3 style="font-size: 8.2pt; color: #0f172a; margin-bottom: 4px; font-weight: 700;">
                        Ketentuan Pembayaran (Payment Terms)
                    </h3>
                    <ul style="margin: 0; padding-left: 14px; font-size: 7.1pt; color: #475569; line-height: 1.45;">
                        <li><strong>Termin 1 (Uang Muka / DP - Telah Diterima): Rp 3.978.054,-</strong><br>
                            Mencakup aktivasi repositori mandiri, domain & cloud hosting, setup awal arsitektur sistem, dan konfigurasi modul DPT resmi.
                        </li>
                        <li><strong>Termin 2 (Pelunasan Akhir saat Pleno): Rp 3.021.946,-</strong><br>
                            Pelunasan sisa biaya jasa & implementasi keamanan siber dibayarkan setelah gladi bersih sistem bersama Panitia KPKU selesai dan sistem dinyatakan siap tayang (*Go-Live Ready*).
                        </li>
                    </ul>
                </div>

                <div class="card" style="background: #f0fdf4; border-color: #bbf7d0;">
                    <h3 style="font-size: 8.2pt; color: #166534; margin-bottom: 4px; font-weight: 700;">
                        Jaminan Layanan & Garansi Teknis
                    </h3>
                    <ul style="margin: 0; padding-left: 14px; font-size: 7.1pt; color: #15803d; line-height: 1.45;">
                        <li><strong>Jaminan Kriptografis & Asas LUBER:</strong> Garansi mutlak kerahasiaan pilihan pemilih, kebal suara ganda, dan kepatuhan standar ISO/IEC 27002, 27017, & 27018.</li>
                        <li><strong>Pendampingan Langsung Saat Hari-H:</strong> Tim teknis standby mengawal jendela voting 24 jam penuh hingga ketukan palu sidang pleno penutupan.</li>
                        <li><strong>Audit Trail Forensik & Realtime Backup:</strong> Log aktivitas append-only SHA-256 dan pencadangan basis data realtime terenkripsi setiap jam.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="page-footer">
            <span class="footer-left">Dokumen Usulan Teknis KPKU & DPP IAGI — Rahasia & Terbatas</span>
            <span class="footer-right">Halaman 7 dari 8</span>
        </div>
    </div>

    <!-- ================= PAGE 8: ROADMAP, TECH SPECS, & APPROVAL ================= -->
    <div class="page">
        <div class="page-header">
            <div class="header-left">
                <img src="data:image/png;base64,{logo_b64}" class="header-logo-mini" alt="IAGI">
                <span class="header-title-text">Proposal Teknis E-Voting Pemilu IAGI 2026</span>
            </div>
            <span class="header-badge">Bab 7 : Roadmap & Pengesahan</span>
        </div>

        <div class="content-body">
            <div>
                <h2 class="section-heading">7. Spesifikasi Teknologi, Jadwal Kerja, & Pengesahan</h2>
                <p class="section-desc">Pilihan arsitektur teknologi performa tinggi dan tahapan eksekusi menuju suksesnya Pemilu IAGI 2026.</p>
            </div>

            <div class="grid-2">
                <div class="card">
                    <h3 style="font-size: 8.3pt; color: #0f172a; margin-bottom: 5px; font-weight: 700;">
                        Stack Teknologi Rekomendasi
                    </h3>
                    <table class="custom-table">
                        <tr>
                            <td style="width: 35%; font-weight: 600;">Frontend UI</td>
                            <td><strong>React 19 + Tailwind v4 + Motion</strong> (Performa kilat, render taktil, responsif mobile sempurna).</td>
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">Backend Engine</td>
                            <td><strong>Laravel 11 REST API / Inertia</strong> (Kematangan keamanan enterprise, atomic DB transaction, queue system).</td>
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">Database</td>
                            <td><strong>PostgreSQL / MySQL 8.0 Enterprise</strong> (ACID compliant, row-locking untuk anti race condition).</td>
                        </tr>
                        <tr>
                            <td style="font-weight: 600;">Email Gateway</td>
                            <td><strong>Resend / Mailgun Dedicated IP</strong> (Pengiriman ribuan token serentak dengan deliverability 99.8%).</td>
                        </tr>
                    </table>
                </div>

                <div class="card">
                    <h3 style="font-size: 8.3pt; color: #0f172a; margin-bottom: 5px; font-weight: 700;">
                        Jadwal Implementasi (Timeline)
                    </h3>
                    <ul style="margin: 0; padding-left: 14px; font-size: 7.2pt; color: #475569; line-height: 1.42;">
                        <li><strong>Fase 1 (Minggu 1):</strong> Setup arsitektur domain terpisah, database anonymized ballot box, dan design system Taste-Skill.</li>
                        <li><strong>Fase 2 (Minggu 2):</strong> Pembangunan bilik suara digital, kertas suara 3 Caketum, dan modul klaim token otomatis.</li>
                        <li><strong>Fase 3 (Minggu 3):</strong> Dashboard Admin KPKU, modul import DPT, integrasi email dispatch queue engine.</li>
                        <li><strong>Fase 4 (Minggu 4):</strong> Uji beban trafik (Stress Testing 10.000 request), audit penetrasi keamanan, dan simulasi gladi bersih pemilu.</li>
                        <li><strong>Fase 5 (Hari-H):</strong> Go-Live & pengawalan teknis standby 24 jam hingga pleno penetapan Ketua Umum terpilih.</li>
                    </ul>
                </div>
            </div>

            <div class="card" style="background: #fffdf5; border: 1px solid #fef3c7;">
                <h3 style="font-size: 8.3pt; color: #b45309; margin-bottom: 3px; font-weight: 700;">
                    Paket Deliverables (Hasil Serah Terima)
                </h3>
                <div class="grid-4" style="margin-top: 3px;">
                    <div style="font-size: 7.1pt; color: #78350f;">
                        <strong>1. Source Code Penuh</strong><br>Aset source code lengkap repository mandiri tanpa lisensi berkala.
                    </div>
                    <div style="font-size: 7.1pt; color: #78350f;">
                        <strong>2. Deployment Server</strong><br>Server terkonfigurasi domain independen siap produksi dengan SSL & Cloudflare.
                    </div>
                    <div style="font-size: 7.1pt; color: #78350f;">
                        <strong>3. Buku Panduan (SOP)</strong><br>Manual book operasional KPKU & panduan tata cara voting bagi anggota.
                    </div>
                    <div style="font-size: 7.1pt; color: #78350f;">
                        <strong>4. Pendampingan Teknis</strong><br>Dukungan teknisi standby saat hari pencoblosan & penghitungan suara.
                    </div>
                </div>
            </div>

            <div class="sign-grid">
                <div class="sign-box">
                    <div class="sign-title">Diajukan & Disusun Oleh:</div>
                    <div class="sign-name">Wahyu Utomo</div>
                    <div class="sign-role">Lead Fullstack Architect & Digital Solutions Specialist</div>
                </div>

                <div class="sign-box">
                    <div class="sign-title">Disetujui Oleh:</div>
                    <div class="sign-name">Komite Pemilihan Ketua Umum (KPKU)</div>
                    <div class="sign-role">Ikatan Ahli Geologi Indonesia (IAGI)</div>
                </div>
            </div>
        </div>

        <div class="page-footer">
            <span class="footer-left">Dokumen Usulan Teknis KPKU & DPP IAGI — Rahasia & Terbatas</span>
            <span class="footer-right">Halaman 8 dari 8</span>
        </div>
    </div>

</div>

</body>
</html>
"""

html_file_path = os.path.join(pemilu_dir, "Proposal_Web_Pemilu_IAGI_2026.html")
pdf_file_path = os.path.join(pemilu_dir, "Proposal_Web_Pemilu_IAGI_2026.pdf")

with open(html_file_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML proposal saved to {html_file_path}")

cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_file_path}",
    html_file_path
]

print("Rendering PDF via Google Chrome headless...")
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode == 0:
    print(f"PDF proposal successfully generated: {pdf_file_path}")
    print(f"PDF size: {os.path.getsize(pdf_file_path)} bytes")
else:
    print(f"Error generating PDF: {res.stderr}")
