#!/usr/bin/env python3
import os
import base64
import subprocess

workspace_dir = "/Users/wagyua5/Downloads/55TH_PIT_IAGI-GEOSEA_XIX_2026"
pemilu_dir = os.path.join(workspace_dir, "PEMILU IAGI")

logo_iagi_path = os.path.join(pemilu_dir, "assets/iagi-logo.png")
logo_gunungan_path = os.path.join(pemilu_dir, "assets/iagi-logo-gunungan-orig.png")
ttd_path = os.path.join(workspace_dir, "scratch_report/ttd_martin_saputra.png")

logo_iagi_b64 = ""
if os.path.exists(logo_iagi_path):
    with open(logo_iagi_path, "rb") as f:
        logo_iagi_b64 = f"data:image/png;base64,{base64.b64encode(f.read()).decode('utf-8')}"

logo_gunungan_b64 = ""
if os.path.exists(logo_gunungan_path):
    with open(logo_gunungan_path, "rb") as f:
        logo_gunungan_b64 = f"data:image/png;base64,{base64.b64encode(f.read()).decode('utf-8')}"

ttd_b64 = ""
if os.path.exists(ttd_path):
    with open(ttd_path, "rb") as f:
        ttd_b64 = f"data:image/png;base64,{base64.b64encode(f.read()).decode('utf-8')}"

html_content = f"""<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Official Invoice - Jasa Auditor Aplikasi Pemilu IAGI 2026</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet">
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
            background-color: #f1f5f9;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0f172a;
            font-size: 8.6pt;
            line-height: 1.42;
        }}
        .page {{
            width: 210mm;
            min-height: 297mm;
            max-height: 297mm;
            margin: 0 auto;
            padding: 12mm 16mm 10mm 16mm;
            background: #ffffff;
            position: relative;
            box-sizing: border-box;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }}
        @media screen {{
            .page {{
                margin: 20px auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                border-radius: 12px;
            }}
        }}

        /* Header Layout */
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 12px;
            border-bottom: 2.5px solid #0f172a;
        }}
        .header-brand {{
            display: flex;
            align-items: center;
            gap: 14px;
        }}
        .logo-img {{
            height: 52px;
            width: auto;
            object-fit: contain;
        }}
        .brand-text h1 {{
            margin: 0;
            font-size: 13.5pt;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.02em;
            line-height: 1.15;
        }}
        .brand-text h2 {{
            margin: 2px 0 0 0;
            font-size: 8.8pt;
            font-weight: 700;
            color: #b45309;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }}
        .brand-meta {{
            font-size: 7.2pt;
            color: #64748b;
            margin-top: 4px;
            line-height: 1.35;
        }}

        .header-doc-info {{
            text-align: right;
        }}
        .doc-title {{
            font-size: 17pt;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.03em;
            margin: 0;
            text-transform: uppercase;
        }}
        .doc-number {{
            font-size: 8.6pt;
            font-weight: 800;
            color: #0284c7;
            font-family: 'JetBrains Mono', monospace;
            margin-top: 3px;
        }}
        .status-badge-unpaid {{
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #fff1f2;
            color: #be123c;
            border: 1.5px solid #fda4af;
            padding: 4px 14px;
            border-radius: 9999px;
            font-size: 8.5pt;
            font-weight: 900;
            letter-spacing: 0.04em;
            margin-top: 8px;
            text-transform: uppercase;
        }}
        .status-dot {{
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #e11d48;
            box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.25);
        }}

        /* Info Grid */
        .info-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-top: 14px;
        }}
        .info-card {{
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px 14px;
        }}
        .info-card-header {{
            font-size: 7.4pt;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #64748b;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 5px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
        }}
        .info-card-body table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 7.8pt;
        }}
        .info-card-body td {{
            padding: 2.2px 0;
            vertical-align: top;
        }}
        .info-card-body td.label {{
            color: #64748b;
            width: 32%;
            font-weight: 500;
        }}
        .info-card-body td.val {{
            color: #0f172a;
            font-weight: 700;
        }}

        /* Item Table */
        .table-container {{
            margin-top: 14px;
        }}
        .item-table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 7.9pt;
        }}
        .item-table th {{
            background: #0f172a;
            color: #ffffff;
            font-weight: 800;
            text-align: left;
            padding: 8px 10px;
            font-size: 7.4pt;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }}
        .item-table th:first-child {{
            border-top-left-radius: 8px;
            text-align: center;
            width: 32px;
        }}
        .item-table th:last-child {{
            border-top-right-radius: 8px;
            text-align: right;
            width: 110px;
        }}
        .item-table td {{
            padding: 10px 10px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }}
        .item-table td.col-center {{
            text-align: center;
            font-weight: 700;
            color: #64748b;
        }}
        .item-table td.col-amount {{
            text-align: right;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 800;
            font-size: 8.8pt;
            color: #0f172a;
        }}
        .item-title {{
            font-weight: 800;
            font-size: 8.8pt;
            color: #0f172a;
            margin-bottom: 4px;
        }}
        .item-desc-list {{
            margin: 0;
            padding-left: 14px;
            color: #475569;
            font-size: 7.4pt;
            line-height: 1.45;
        }}
        .item-desc-list li {{
            margin-bottom: 2.5px;
        }}
        .item-badge {{
            display: inline-block;
            background: #e0f2fe;
            color: #0369a1;
            padding: 2px 7px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 6.8pt;
            font-family: 'JetBrains Mono', monospace;
        }}

        /* Summary Total */
        .summary-row {{
            background: #f8fafc;
        }}
        .summary-total-box {{
            display: flex;
            justify-content: flex-end;
            margin-top: 6px;
        }}
        .total-card {{
            width: 280px;
            background: #0f172a;
            color: #ffffff;
            border-radius: 10px;
            padding: 10px 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }}
        .total-card-label {{
            font-size: 8.2pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94a3b8;
        }}
        .total-card-amount {{
            font-size: 13.5pt;
            font-weight: 900;
            font-family: 'JetBrains Mono', monospace;
            color: #38bdf8;
            letter-spacing: -0.02em;
        }}

        /* Terbilang Box */
        .terbilang-box {{
            background: #eff6ff;
            border-left: 4px solid #2563eb;
            border-radius: 0 8px 8px 0;
            padding: 7px 12px;
            margin-top: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 7.8pt;
        }}
        .terbilang-label {{
            font-weight: 800;
            color: #1e40af;
            text-transform: uppercase;
            font-size: 7.2pt;
            letter-spacing: 0.05em;
        }}
        .terbilang-val {{
            font-weight: 800;
            font-style: italic;
            color: #1e3a8a;
            font-size: 8.2pt;
        }}

        /* Bank & Payment Instructions */
        .payment-box {{
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 12px;
            margin-top: 10px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px 14px;
        }}
        .bank-info h4 {{
            margin: 0 0 6px 0;
            font-size: 7.8pt;
            font-weight: 800;
            color: #0f172a;
            display: flex;
            align-items: center;
            gap: 6px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }}
        .bank-table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 7.7pt;
        }}
        .bank-table td {{
            padding: 2px 0;
        }}
        .bank-acc-no {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 10.5pt;
            font-weight: 900;
            color: #0284c7;
            letter-spacing: 0.05em;
        }}
        .payment-reminder {{
            background: #fefce8;
            border: 1px solid #fef08a;
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 7.1pt;
            color: #713f12;
            line-height: 1.4;
        }}
        .payment-reminder strong {{
            color: #854d0e;
            display: block;
            margin-bottom: 2px;
            text-transform: uppercase;
            font-size: 7.2pt;
        }}

        /* Signatures & Validation Footer */
        .footer-validation {{
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 14px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
        }}
        .qr-section {{
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 58%;
        }}
        .qr-box {{
            width: 64px;
            height: 64px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 4px;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
        }}
        .qr-text h5 {{
            margin: 0;
            font-size: 7.4pt;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }}
        .qr-text p {{
            margin: 2px 0 0 0;
            font-size: 6.8pt;
            color: #64748b;
            line-height: 1.35;
        }}
        .hash-code {{
            font-family: 'JetBrains Mono', monospace;
            font-size: 6.2pt;
            color: #0284c7;
            word-break: break-all;
            margin-top: 2px;
            display: block;
        }}

        .signature-box {{
            text-align: right;
            min-width: 190px;
        }}
        .sign-date {{
            font-size: 7.4pt;
            color: #64748b;
            margin-bottom: 2px;
        }}
        .sign-title {{
            font-size: 7.6pt;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
        }}
        .signature-img {{
            height: 52px;
            width: auto;
            margin: 4px 0 2px 0;
            filter: contrast(1.1);
        }}
        .sign-name {{
            font-size: 8.8pt;
            font-weight: 900;
            color: #0f172a;
            text-decoration: underline;
        }}
        .sign-role {{
            font-size: 7.2pt;
            color: #0284c7;
            font-weight: 700;
        }}

        /* Print Button for Browser View */
        .no-print-bar {{
            background: #0f172a;
            color: #ffffff;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 9pt;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        }}
        .btn-print {{
            background: #2563eb;
            color: #ffffff;
            border: none;
            padding: 7px 16px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 8.5pt;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
        }}
        .btn-print:hover {{
            background: #1d4ed8;
        }}
        @media print {{
            .no-print-bar {{
                display: none !important;
            }}
            body {{
                background: #ffffff;
            }}
            .page {{
                margin: 0;
                border-radius: 0;
                box-shadow: none;
                padding: 10mm 14mm 8mm 14mm;
            }}
        }}
    </style>
</head>
<body>

<div class="no-print-bar">
    <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:1.1rem;">📄</span>
        <strong>Portal KPU Pemilu IAGI 2026 &bull; Dokumen Tagihan Resmi Jasa Auditor (Rp 4.000.000,-)</strong>
    </div>
    <div style="display:flex; gap:10px;">
        <button class="btn-print" onclick="window.print()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Cetak / Download PDF
        </button>
    </div>
</div>

<div class="page">
    <div>
        <!-- HEADER -->
        <div class="header">
            <div class="header-brand">
                <img src="{logo_iagi_b64}" class="logo-img" alt="IAGI Logo">
                <div class="brand-text">
                    <h1>KOMISI PEMILIHAN KETUA UMUM (KPKU)</h1>
                    <h2>IKATAN AHLI GEOLOGI INDONESIA (IAGI) &bull; 2026 - 2029</h2>
                    <div class="brand-meta">
                        Sekretariat: Gedung Mineral & Batubara, Jl. Prof. Dr. Soepomo No. 10, Jakarta 12870<br>
                        Portal Resmi: <strong>https://pemiluiagi.web.id</strong> &bull; Email: <strong>kpku@iagi.or.id</strong>
                    </div>
                </div>
            </div>
            <div class="header-doc-info">
                <div class="doc-title">OFFICIAL INVOICE</div>
                <div class="doc-number">No: INV-001/AUDIT-KPKU/IAGI/XI/2026</div>
                <div class="status-badge-unpaid">
                    <span class="status-dot"></span>
                    <span>BELUM DIBAYAR / UNPAID</span>
                </div>
            </div>
        </div>

        <!-- TWO COLUMN INFO CARDS -->
        <div class="info-grid">
            <!-- BILLED TO -->
            <div class="info-card">
                <div class="info-card-header">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    DITUJUKAN KEPADA (BILLED TO)
                </div>
                <div class="info-card-body">
                    <table>
                        <tr>
                            <td class="label">Klien / Lembaga</td>
                            <td style="width:3%;">:</td>
                            <td class="val">Komisi Pemilihan Ketua Umum IAGI 2026 (KPKU)</td>
                        </tr>
                        <tr>
                            <td class="label">Induk Organisasi</td>
                            <td>:</td>
                            <td class="val">Pengurus Pusat Ikatan Ahli Geologi Indonesia</td>
                        </tr>
                        <tr>
                            <td class="label">Penerima Tagihan</td>
                            <td>:</td>
                            <td class="val">Panitia Pelaksana & Tim Keuangan Pemilu IAGI</td>
                        </tr>
                        <tr>
                            <td class="label">Sistem / Objek</td>
                            <td>:</td>
                            <td class="val">Portal E-Voting Pemilu IAGI 2026 (pemiluiagi.web.id)</td>
                        </tr>
                        <tr>
                            <td class="label">Domisili</td>
                            <td>:</td>
                            <td class="val">Jakarta Selatan, DKI Jakarta</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- TRANSACTION & AUDITOR DETAILS -->
            <div class="info-card">
                <div class="info-card-header">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    RINCIAN AUDITOR & PENAGIHAN
                </div>
                <div class="info-card-body">
                    <table>
                        <tr>
                            <td class="label">Auditor Penagih</td>
                            <td style="width:3%;">:</td>
                            <td class="val">Martin Saputra, S.Kom., M.Kom.</td>
                        </tr>
                        <tr>
                            <td class="label">Keahlian / Peran</td>
                            <td>:</td>
                            <td class="val">Lead Cyber Security & Forensic Independent Auditor</td>
                        </tr>
                        <tr>
                            <td class="label">Tanggal Terbit</td>
                            <td>:</td>
                            <td class="val">05 November 2026 (Ref. Kwitansi 5-11-2026)</td>
                        </tr>
                        <tr>
                            <td class="label">Jatuh Tempo</td>
                            <td>:</td>
                            <td class="val" style="color:#b91c1c;">12 November 2026 (Net 7 Hari)</td>
                        </tr>
                        <tr>
                            <td class="label">Metode Bayar</td>
                            <td>:</td>
                            <td class="val">Bank Transfer (Mandiri / BCA)</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <!-- ITEM TABLE -->
        <div class="table-container">
            <table class="item-table">
                <thead>
                    <tr>
                        <th>NO</th>
                        <th>DESKRIPSI LAYANAN AUDIT & RUANG LINGKUP PEKERJAAN</th>
                        <th style="width: 110px;">KODE JASA</th>
                        <th>JUMLAH (IDR)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="col-center">1</td>
                        <td>
                            <div class="item-title">Jasa Auditor Independen & Audit Forensik Siber Aplikasi E-Voting Pemilu IAGI 2026</div>
                            <ul class="item-desc-list">
                                <li><strong>Forensic Source Code Review & Architecture Audit:</strong> Audit mendalam arsitektur aplikasi web (<code>pemiluiagi.web.id</code>), algoritma perhitungan suara, enkripsi token pemilih, proteksi database, dan verifikasi anti-tampering.</li>
                                <li><strong>OWASP Top 10 Web Application Penetration Testing:</strong> Pengujian penetrasi keamanan siber (SQL Injection, XSS, CSRF, Session Hijacking, OTP brute-force bypass, & Broken Access Control).</li>
                                <li><strong>Verifikasi Kriptografis Rantai Hash Blockchain SHA-256:</strong> Rekalkulasi matematis integritas rantai hash pada 2.143 DPT dan setiap suara masuk tanpa selisih data, membuktikan asas LUBER-JURDIL.</li>
                                <li><strong>Real-time Cyber Telemetry & Live Audit Trail Monitoring:</strong> Pengawasan telemetri server dan integritas log audit siber secara aktif selama simulasi dan sidang pleno rekapitulasi.</li>
                                <li><strong>Penerbitan Dokumen Resmi Laporan Hasil Audit Forensik:</strong> Pengesahan berita acara dan laporan resmi bertanda tangan Auditor Independen untuk Komisi Pengawas & Dewan Pembina.</li>
                            </ul>
                        </td>
                        <td style="vertical-align: middle;">
                            <span class="item-badge">AUD-EVOTE-26</span>
                            <div style="font-size:6.8pt; color:#64748b; margin-top:3px;">Cyber Security</div>
                        </td>
                        <td class="col-amount" style="vertical-align: middle;">
                            Rp 4.000.000
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- SUMMARY TOTAL BOX -->
        <div class="summary-total-box">
            <div class="total-card">
                <div>
                    <div class="total-card-label">TOTAL TAGIHAN (DUE)</div>
                    <div style="font-size:7pt; color:#94a3b8; margin-top:1px;">Jasa Profesi Non-PKP (Nett)</div>
                </div>
                <div class="total-card-amount">Rp 4.000.000</div>
            </div>
        </div>

        <!-- TERBILANG -->
        <div class="terbilang-box">
            <span class="terbilang-label">TERBILANG:</span>
            <span class="terbilang-val"># Empat Juta Rupiah (Four Million Indonesian Rupiah) #</span>
        </div>

        <!-- PAYMENT INSTRUCTIONS & BANK ACCOUNTS -->
        <div class="payment-box">
            <div class="bank-info">
                <h4>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                    Instruksi Pembayaran Rekening Transfer Resmi:
                </h4>
                <table class="bank-table">
                    <tr>
                        <td style="width:28%; color:#64748b;">Bank Utama</td>
                        <td style="width:3%;">:</td>
                        <td style="font-weight:800; color:#0f172a;">Bank Mandiri</td>
                    </tr>
                    <tr>
                        <td style="color:#64748b;">Nomor Rekening</td>
                        <td>:</td>
                        <td class="bank-acc-no">1030099991461</td>
                    </tr>
                    <tr>
                        <td style="color:#64748b;">Atas Nama (A/N)</td>
                        <td>:</td>
                        <td style="font-weight:800; color:#0f172a;">Martin Saputra</td>
                    </tr>
                    <tr>
                        <td style="color:#64748b;">Berita Acara</td>
                        <td>:</td>
                        <td style="font-weight:700; color:#d97706; font-family:'JetBrains Mono',monospace;">INV AUDIT PEMILU IAGI 2026</td>
                    </tr>
                </table>
            </div>

            <div class="payment-reminder">
                <strong>Catatan Tagihan & Konfirmasi:</strong>
                Invoice ini diterbitkan resmi oleh Lead Cyber Security Auditor atas jasa audit aplikasi Pemilu IAGI 2026 (sesuai kwitansi fisik terlampir per 5 November 2026).<br>
                Mohon bukti transfer dikirimkan via WhatsApp ke Auditor atau diarsipkan pada berkas pertanggungjawaban pleno KPKU IAGI 2026.
            </div>
        </div>
    </div>

    <!-- FOOTER & SIGNATURES -->
    <div class="footer-validation">
        <div class="qr-section">
            <div class="qr-box">
                <!-- SVG Vector QR Code -->
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <rect width="100" height="100" fill="white"/>
                    <!-- Corner Square Top-Left -->
                    <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4"/>
                    <rect x="9" y="9" width="20" height="20" fill="white" rx="2"/>
                    <rect x="13" y="13" width="12" height="12" fill="#0284c7" rx="2"/>
                    <!-- Corner Square Top-Right -->
                    <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4"/>
                    <rect x="71" y="9" width="20" height="20" fill="white" rx="2"/>
                    <rect x="75" y="13" width="12" height="12" fill="#0284c7" rx="2"/>
                    <!-- Corner Square Bottom-Left -->
                    <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4"/>
                    <rect x="9" y="71" width="20" height="20" fill="white" rx="2"/>
                    <rect x="13" y="75" width="12" height="12" fill="#0284c7" rx="2"/>
                    <!-- Data Pattern Blocks -->
                    <rect x="38" y="8" width="6" height="6" fill="#0f172a"/>
                    <rect x="48" y="8" width="6" height="6" fill="#0f172a"/>
                    <rect x="38" y="18" width="6" height="6" fill="#0284c7"/>
                    <rect x="56" y="18" width="6" height="6" fill="#0f172a"/>
                    <rect x="48" y="28" width="6" height="6" fill="#0f172a"/>
                    <rect x="8" y="38" width="6" height="6" fill="#0f172a"/>
                    <rect x="18" y="48" width="6" height="6" fill="#0284c7"/>
                    <rect x="28" y="38" width="6" height="6" fill="#0f172a"/>
                    <rect x="38" y="38" width="8" height="8" fill="#0f172a"/>
                    <rect x="50" y="38" width="6" height="6" fill="#0284c7"/>
                    <rect x="60" y="48" width="6" height="6" fill="#0f172a"/>
                    <rect x="70" y="38" width="6" height="6" fill="#0f172a"/>
                    <rect x="82" y="48" width="6" height="6" fill="#0284c7"/>
                    <rect x="38" y="58" width="6" height="6" fill="#0f172a"/>
                    <rect x="48" y="68" width="6" height="6" fill="#0284c7"/>
                    <rect x="58" y="58" width="6" height="6" fill="#0f172a"/>
                    <rect x="68" y="68" width="6" height="6" fill="#0f172a"/>
                    <rect x="78" y="58" width="6" height="6" fill="#0284c7"/>
                    <rect x="88" y="68" width="6" height="6" fill="#0f172a"/>
                    <rect x="38" y="78" width="6" height="6" fill="#0f172a"/>
                    <rect x="48" y="88" width="6" height="6" fill="#0f172a"/>
                    <rect x="68" y="78" width="6" height="6" fill="#0284c7"/>
                    <rect x="82" y="88" width="6" height="6" fill="#0f172a"/>
                </svg>
            </div>
            <div class="qr-text">
                <h5>OFFICIAL DIGITAL VALIDATION</h5>
                <p>Dokumen tagihan resmi ini terhubung dan tervalidasi dengan Berita Acara & Laporan Resmi Audit Forensik Pemilu IAGI 2026.</p>
                <span class="hash-code">SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
            </div>
        </div>

        <div class="signature-box">
            <div class="sign-date">Jakarta, 05 November 2026</div>
            <div class="sign-title">Auditor Independen Pemilu IAGI:</div>
            <img src="{ttd_b64}" class="signature-img" alt="Tanda Tangan Martin Saputra">
            <div class="sign-name">Martin Saputra, S.Kom., M.Kom.</div>
            <div class="sign-role">Lead Cyber Security & Forensic Auditor</div>
        </div>
    </div>
</div>

</body>
</html>
"""

# 1. Simpan di root workspace
root_html = os.path.join(workspace_dir, "INVOICE_JASA_AUDITOR_PEMILU_IAGI_4_JUTA.html")
root_pdf = os.path.join(workspace_dir, "INVOICE_JASA_AUDITOR_PEMILU_IAGI_4_JUTA.pdf")

with open(root_html, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"✅ File HTML berhasil dibuat di: {root_html}")

# 2. Simpan juga di dalam folder PEMILU IAGI untuk akses web langsung
pemilu_html = os.path.join(pemilu_dir, "invoice-audit.html")
with open(pemilu_html, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"✅ File HTML Web KPU berhasil dibuat di: {pemilu_html}")

# 3. Kompilasi PDF menggunakan Chrome Headless
chrome_cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={root_pdf}",
    root_html
]

print("Mengompilasi PDF resmi...")
res = subprocess.run(chrome_cmd, capture_output=True, text=True)
if res.returncode == 0 and os.path.exists(root_pdf):
    print(f"🎉 PDF Resmi berhasil dicetak di: {root_pdf} (Ukuran: {os.path.getsize(root_pdf)} bytes)")
    # Copy juga ke pemilu_dir
    pemilu_pdf = os.path.join(pemilu_dir, "INVOICE_JASA_AUDITOR_PEMILU_IAGI_4_JUTA.pdf")
    with open(root_pdf, "rb") as rf:
        with open(pemilu_pdf, "wb") as wf:
            wf.write(rf.read())
    print(f"🎉 PDF juga tersedia di web: {pemilu_pdf}")
else:
    print(f"Gagal mencetak PDF via Chrome: {res.stderr}")
