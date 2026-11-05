<?php

namespace App\Services;

use ZipArchive;
use Illuminate\Support\Collection;

class PaymentExcelService
{
    /**
     * Generate an Excel .xlsx workbook containing:
     * Sheet 1: 📊 REKAP & PIVOT EXECUTIVE (Executive financial summary, categories, monthly run-rate, gateway reconciliation)
     * Sheet 2: 📋 DATA TRANSAKSI LENGKAP (Complete payment transaction rows with SUM totals at bottom)
     *
     * @param Collection $payments
     * @param array $options
     * @return string Temporary path of the generated .xlsx file
     */
    public function generateWorkbook(Collection $payments, array $options = []): string
    {
        $tempPath = tempnam(sys_get_temp_dir(), 'pay_xlsx_') . '.xlsx';
        $zip = new ZipArchive();

        if ($zip->open($tempPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \RuntimeException("Gagal membuat file Excel di: {$tempPath}");
        }

        // 1. Root & Content Types
        $zip->addFromString('_rels/.rels', $this->getRelsXml());
        $zip->addFromString('[Content_Types].xml', $this->getContentTypesXml());

        // 2. Workbook & Relationships
        $zip->addFromString('xl/_rels/workbook.xml.rels', $this->getWorkbookRelsXml());
        $zip->addFromString('xl/workbook.xml', $this->getWorkbookXml());
        $zip->addFromString('xl/styles.xml', $this->getStylesXml());

        // 3. Worksheets
        $zip->addFromString('xl/worksheets/sheet1.xml', $this->buildPivotSheetXml($payments, $options));
        $zip->addFromString('xl/worksheets/sheet2.xml', $this->buildDataSheetXml($payments, $options));

        $zip->close();

        return $tempPath;
    }

    private function xmlEscape(?string $str): string
    {
        if ($str === null || $str === '') return '';
        return htmlspecialchars($str, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }

    private function getColLetter(int $col): string
    {
        $letter = '';
        while ($col > 0) {
            $mod = ($col - 1) % 26;
            $letter = chr(65 + $mod) . $letter;
            $col = (int)(($col - $mod) / 26);
        }
        return $letter;
    }

    private function getRelsXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' .
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' .
            '</Relationships>';
    }

    private function getContentTypesXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' .
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' .
            '<Default Extension="xml" ContentType="application/xml"/>' .
            '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' .
            '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' .
            '<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' .
            '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' .
            '</Types>';
    }

    private function getWorkbookRelsXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' .
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' .
            '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>' .
            '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' .
            '</Relationships>';
    }

    private function getWorkbookXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' .
            '<bookViews><workbookView xWindow="0" yWindow="0" windowWidth="24000" windowHeight="14000"/></bookViews>' .
            '<sheets>' .
            '<sheet name="📊 REKAP &amp; PIVOT EXECUTIVE" sheetId="1" r:id="rId1"/>' .
            '<sheet name="📋 DATA TRANSAKSI LENGKAP" sheetId="2" r:id="rId2"/>' .
            '</sheets>' .
            '</workbook>';
    }

    private function getStylesXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
            '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' .
            '<numFmts count="2">' .
            '<numFmt numFmtId="164" formatCode="#,##0"/>' .
            '<numFmt numFmtId="165" formatCode="0.0%"/>' .
            '</numFmts>' .
            '<fonts count="9">' .
            '<!-- 0: Regular 10pt -->' .
            '<font><sz val="10"/><name val="Calibri"/><color rgb="FF1E293B"/></font>' .
            '<!-- 1: Bold White 10pt (Table Headers) -->' .
            '<font><b/><sz val="10"/><name val="Calibri"/><color rgb="FFFFFFFF"/></font>' .
            '<!-- 2: Bold 14pt (Page Title) -->' .
            '<font><b/><sz val="14"/><name val="Calibri"/><color rgb="FF094D42"/></font>' .
            '<!-- 3: Bold 11pt (Section Title) -->' .
            '<font><b/><sz val="11"/><name val="Calibri"/><color rgb="FF065F46"/></font>' .
            '<!-- 4: Bold 10pt Green (Subtotals/Totals) -->' .
            '<font><b/><sz val="10"/><name val="Calibri"/><color rgb="FF065F46"/></font>' .
            '<!-- 5: Bold 13pt Dark Green (KPI values) -->' .
            '<font><b/><sz val="13"/><name val="Calibri"/><color rgb="FF094D42"/></font>' .
            '<!-- 6: Italic Gray 9pt -->' .
            '<font><i/><sz val="9"/><name val="Calibri"/><color rgb="FF64748B"/></font>' .
            '<!-- 7: Bold 10pt Dark -->' .
            '<font><b/><sz val="10"/><name val="Calibri"/><color rgb="FF0F172A"/></font>' .
            '<!-- 8: Bold 13pt Amber (KPI values) -->' .
            '<font><b/><sz val="13"/><name val="Calibri"/><color rgb="FFB45309"/></font>' .
            '</fonts>' .
            '<fills count="9">' .
            '<fill><patternFill patternType="none"/></fill>' .
            '<fill><patternFill patternType="gray125"/></fill>' .
            '<!-- 2: Emerald Green Header #094D42 -->' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FF094D42"/></patternFill></fill>' .
            '<!-- 3: Teal Subheader #0D9488 -->' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FF0D9488"/></patternFill></fill>' .
            '<!-- 4: Light Emerald Total #DCFCE7 -->' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FFDCFCE7"/></patternFill></fill>' .
            '<!-- 5: Light Amber / Yellow #FEF3C7 -->' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FFFEF3C7"/></patternFill></fill>' .
            '<!-- 6: Light Gray #F8FAFC -->' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FFF8FAFC"/></patternFill></fill>' .
            '<!-- 7: Light Blue #E0F2FE -->' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FFE0F2FE"/></patternFill></fill>' .
            '<!-- 8: Light Purple #EDE9FE -->' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FFEDE9FE"/></patternFill></fill>' .
            '</fills>' .
            '<borders count="4">' .
            '<!-- 0: None -->' .
            '<border><left/><right/><top/><bottom/><diagonal/></border>' .
            '<!-- 1: Thin Gray border #CBD5E1 -->' .
            '<border><left style="thin"><color rgb="FFCBD5E1"/></left><right style="thin"><color rgb="FFCBD5E1"/></right><top style="thin"><color rgb="FFCBD5E1"/></top><bottom style="thin"><color rgb="FFCBD5E1"/></bottom></border>' .
            '<!-- 2: Top thin, bottom double (Grand Total Green) -->' .
            '<border><left style="thin"><color rgb="FF059669"/></left><right style="thin"><color rgb="FF059669"/></right><top style="thin"><color rgb="FF059669"/></top><bottom style="double"><color rgb="FF059669"/></bottom></border>' .
            '<!-- 3: KPI border -->' .
            '<border><left style="thin"><color rgb="FF94A3B8"/></left><right style="thin"><color rgb="FF94A3B8"/></right><top style="thin"><color rgb="FF94A3B8"/></top><bottom style="thin"><color rgb="FF94A3B8"/></bottom></border>' .
            '</borders>' .
            '<cellXfs count="18">' .
            '<!-- 0: Default Left Text -->' .
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyBorder="1"><alignment horizontal="left" vertical="center"/></xf>' .
            '<!-- 1: Title (Bold 14pt) -->' .
            '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1"><alignment vertical="center"/></xf>' .
            '<!-- 2: Section Title (Bold 11pt) -->' .
            '<xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1"><alignment vertical="center"/></xf>' .
            '<!-- 3: Table Header Emerald (Center, White, Bold) -->' .
            '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' .
            '<!-- 4: Table Header Teal (Center, White, Bold) -->' .
            '<xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' .
            '<!-- 5: Data Text Left -->' .
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyBorder="1"><alignment horizontal="left" vertical="center"/></xf>' .
            '<!-- 6: Data Text Center -->' .
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>' .
            '<!-- 7: Data Currency (#,##0 Right) -->' .
            '<xf numFmtId="164" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyFont="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>' .
            '<!-- 8: Data Integer (#,##0 Right) -->' .
            '<xf numFmtId="164" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyFont="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>' .
            '<!-- 9: Total Row Text (Bold Green, Light Green Fill, Double Bottom) -->' .
            '<xf numFmtId="0" fontId="4" fillId="4" borderId="2" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="left" vertical="center"/></xf>' .
            '<!-- 10: Total Row Currency (Bold Green, Light Green Fill, Double Bottom, Right) -->' .
            '<xf numFmtId="164" fontId="4" fillId="4" borderId="2" applyNumberFormat="1" applyFont="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>' .
            '<!-- 11: Total Row Integer (Bold Green, Light Green Fill, Double Bottom, Right) -->' .
            '<xf numFmtId="164" fontId="4" fillId="4" borderId="2" applyNumberFormat="1" applyFont="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>' .
            '<!-- 12: KPI Label (Gray 9pt, Light Green Fill) -->' .
            '<xf numFmtId="0" fontId="6" fillId="4" borderId="3" applyFont="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>' .
            '<!-- 13: KPI Value Green (Bold 13pt, Light Green Fill) -->' .
            '<xf numFmtId="164" fontId="5" fillId="4" borderId="3" applyNumberFormat="1" applyFont="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>' .
            '<!-- 14: KPI Label Amber (Gray 9pt, Light Amber Fill) -->' .
            '<xf numFmtId="0" fontId="6" fillId="5" borderId="3" applyFont="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>' .
            '<!-- 15: KPI Value Amber (Bold 13pt, Light Amber Fill) -->' .
            '<xf numFmtId="164" fontId="8" fillId="5" borderId="3" applyNumberFormat="1" applyFont="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>' .
            '<!-- 16: Subtitle / Timestamp -->' .
            '<xf numFmtId="0" fontId="6" fillId="0" borderId="0" applyFont="1"><alignment vertical="center"/></xf>' .
            '<!-- 17: Percentage Format (0.0% Right) -->' .
            '<xf numFmtId="165" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyFont="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>' .
            '</cellXfs>' .
            '</styleSheet>';
    }

    /**
     * Build Sheet 1: 📊 REKAP & PIVOT EXECUTIVE
     */
    private function buildPivotSheetXml(Collection $payments, array $options): string
    {
        $totalCount = $payments->count();
        $totalNominal = 0.0;
        $totalPaidRevenue = 0.0;
        $paidCount = 0;
        $pendingCount = 0;
        $failedCount = 0;

        $monthNames = [
            '01' => 'Jan', '02' => 'Feb', '03' => 'Mar', '04' => 'Apr',
            '05' => 'Mei', '06' => 'Jun', '07' => 'Jul', '08' => 'Agu',
            '09' => 'Sep', '10' => 'Okt', '11' => 'Nov', '12' => 'Des'
        ];

        // 1. Category Buckets
        $catBuckets = [
            'Professional' => ['count' => 0, 'revenue' => 0.0],
            'Student' => ['count' => 0, 'revenue' => 0.0],
            'International Delegate' => ['count' => 0, 'revenue' => 0.0],
            'Other' => ['count' => 0, 'revenue' => 0.0],
        ];

        // 2. Monthly Buckets
        $monthlyBuckets = [];

        // 3. Gateway & Status Buckets
        $methodBuckets = [];

        foreach ($payments as $p) {
            $amt = (float) ($p->amount ?? 0);
            $totalNominal += $amt;

            $isPaid = ($p->status === 'paid' || (bool)$p->verified);
            $isPending = (!$isPaid && !in_array($p->status, ['failed', 'expired', 'refunded']));
            $isFailed = in_array($p->status, ['failed', 'expired', 'refunded']);

            if ($isPaid) {
                $paidCount++;
                $totalPaidRevenue += $amt;
            } elseif ($isPending) {
                $pendingCount++;
            } elseif ($isFailed) {
                $failedCount++;
            }

            // Normalise Category
            $userCat = $p->user ? (string)$p->user->category : 'Other';
            $matchedKey = 'Other';
            if ($userCat && str_contains(strtolower($userCat), 'student')) {
                $matchedKey = 'Student';
            } elseif ($userCat && (str_contains(strtolower($userCat), 'international') || str_contains(strtolower($userCat), 'intl') || str_contains(strtolower($userCat), 'expatriate'))) {
                $matchedKey = 'International Delegate';
            } elseif ($userCat && str_contains(strtolower($userCat), 'prof')) {
                $matchedKey = 'Professional';
            } elseif (isset($catBuckets[$userCat])) {
                $matchedKey = $userCat;
            }

            if (!isset($catBuckets[$matchedKey])) {
                $catBuckets[$matchedKey] = ['count' => 0, 'revenue' => 0.0];
            }
            if ($isPaid) {
                $catBuckets[$matchedKey]['count']++;
                $catBuckets[$matchedKey]['revenue'] += $amt;
            }

            // Monthly aggregation (Paid only)
            if ($isPaid) {
                $dt = $p->paid_at ? \Carbon\Carbon::parse($p->paid_at) : ($p->created_at ? \Carbon\Carbon::parse($p->created_at) : null);
                if ($dt) {
                    $mKey = $dt->format('Y-m');
                    $mLabel = ($monthNames[$dt->format('m')] ?? $dt->format('M')) . ' ' . $dt->format('Y');
                    if (!isset($monthlyBuckets[$mKey])) {
                        $monthlyBuckets[$mKey] = [
                            'label' => $mLabel,
                            'count' => 0,
                            'revenue' => 0.0,
                        ];
                    }
                    $monthlyBuckets[$mKey]['count']++;
                    $monthlyBuckets[$mKey]['revenue'] += $amt;
                }
            }

            // Method & Status Breakdown
            $methodName = 'Manual Bank Transfer';
            if ($p->gateway === 'midtrans' || !empty($p->order_id)) {
                $methodName = 'Midtrans (' . strtoupper($p->payment_type ?? 'ONLINE') . ')';
            }
            $statLabel = $isPaid ? 'PAID / LUNAS' : ($isPending ? 'PENDING VERIFIKASI' : strtoupper($p->status ?? 'FAILED'));

            $combKey = $methodName . ' | ' . $statLabel;
            if (!isset($methodBuckets[$combKey])) {
                $methodBuckets[$combKey] = [
                    'method' => $methodName,
                    'status' => $statLabel,
                    'count' => 0,
                    'revenue' => 0.0,
                ];
            }
            $methodBuckets[$combKey]['count']++;
            $methodBuckets[$combKey]['revenue'] += $amt;
        }

        ksort($monthlyBuckets);
        $avgTicket = $paidCount > 0 ? round($totalPaidRevenue / $paidCount) : 0;
        $solvencyRate = $totalCount > 0 ? ($paidCount / $totalCount) : 0;

        // XML setup
        $xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' .
            '<cols>' .
            '<col min="1" max="1" width="6" customWidth="1"/>' .
            '<col min="2" max="2" width="36" customWidth="1"/>' .
            '<col min="3" max="3" width="22" customWidth="1"/>' .
            '<col min="4" max="4" width="28" customWidth="1"/>' .
            '<col min="5" max="5" width="26" customWidth="1"/>' .
            '<col min="6" max="6" width="22" customWidth="1"/>' .
            '<col min="7" max="7" width="22" customWidth="1"/>' .
            '</cols>' .
            '<sheetData>';

        $rowIdx = 1;

        // Title
        $xml .= '<row r="' . $rowIdx . '" ht="26" customHeight="1">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="1"><is><t>55TH PIT IAGI &amp; GEOSEA XIX 2026 - REKAPITULASI PEMBAYARAN &amp; PIVOT EKSEKUTIF</t></is></c>' .
            '</row>';
        $rowIdx++;

        // Subtitle
        $nowStr = date('d F Y - H:i:s') . ' WIB';
        $xml .= '<row r="' . $rowIdx . '">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="16"><is><t>Dicetak pada: ' . $this->xmlEscape($nowStr) . ' | Total Sample Transaksi: ' . number_format($totalCount) . ' Data</t></is></c>' .
            '</row>';
        $rowIdx += 2;

        // KPI CARDS
        $xml .= '<row r="' . $rowIdx . '">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="2"><is><t>📌 INDIKATOR KEUANGAN UTAMA (KEY FINANCIAL INDICATORS)</t></is></c>' .
            '</row>';
        $rowIdx++;

        $xml .= '<row r="' . $rowIdx . '" ht="20" customHeight="1">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="12"><is><t>TOTAL TRANSAKSI</t></is></c>' .
            '<c r="C' . $rowIdx . '" t="inlineStr" s="12"><is><t>TOTAL REVENUE VERIFIED</t></is></c>' .
            '<c r="D' . $rowIdx . '" t="inlineStr" s="12"><is><t>TRANSAKSI LUNAS</t></is></c>' .
            '<c r="E' . $rowIdx . '" t="inlineStr" s="14"><is><t>PENDING REVIEW</t></is></c>' .
            '<c r="F' . $rowIdx . '" t="inlineStr" s="12"><is><t>RATA-RATA / TIKET</t></is></c>' .
            '<c r="G' . $rowIdx . '" t="inlineStr" s="12"><is><t>SOLVENCY (LUNAS %)</t></is></c>' .
            '</row>';
        $rowIdx++;

        $xml .= '<row r="' . $rowIdx . '" ht="28" customHeight="1">' .
            '<c r="B' . $rowIdx . '" s="13"><v>' . $totalCount . '</v></c>' .
            '<c r="C' . $rowIdx . '" s="13"><v>' . $totalPaidRevenue . '</v></c>' .
            '<c r="D' . $rowIdx . '" s="13"><v>' . $paidCount . '</v></c>' .
            '<c r="E' . $rowIdx . '" s="15"><v>' . $pendingCount . '</v></c>' .
            '<c r="F' . $rowIdx . '" s="13"><v>' . $avgTicket . '</v></c>' .
            '<c r="G' . $rowIdx . '" s="13"><v>' . round($solvencyRate * 100, 1) . '%</v></c>' .
            '</row>';
        $rowIdx += 3;

        // TABLE 1: REKAPITULASI OMZET PER KATEGORI PESERTA
        $xml .= '<row r="' . $rowIdx . '">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="2"><is><t>📊 PIVOT 1: DISTRIBUSI OMZET PER KATEGORI PESERTA (LUNAS)</t></is></c>' .
            '</row>';
        $rowIdx++;

        $xml .= '<row r="' . $rowIdx . '" ht="24" customHeight="1">' .
            '<c r="A' . $rowIdx . '" t="inlineStr" s="3"><is><t>No</t></is></c>' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="3"><is><t>Kategori Delegasi / Peserta</t></is></c>' .
            '<c r="C' . $rowIdx . '" t="inlineStr" s="3"><is><t>Jumlah Transaksi (Tx)</t></is></c>' .
            '<c r="D' . $rowIdx . '" t="inlineStr" s="3"><is><t>Total Omzet Lunas (IDR)</t></is></c>' .
            '<c r="E' . $rowIdx . '" t="inlineStr" s="3"><is><t>Rata-rata Nominal (IDR)</t></is></c>' .
            '<c r="F' . $rowIdx . '" t="inlineStr" s="3"><is><t>Persentase Omzet</t></is></c>' .
            '</row>';
        $rowIdx++;

        $catStartRow = $rowIdx;
        $cNo = 1;
        foreach ($catBuckets as $cName => $cData) {
            if ($cData['count'] == 0 && $cName === 'Other') continue;
            $avgNom = $cData['count'] > 0 ? round($cData['revenue'] / $cData['count']) : 0;
            $pctVal = $totalPaidRevenue > 0 ? ($cData['revenue'] / $totalPaidRevenue) : 0;

            $xml .= '<row r="' . $rowIdx . '">' .
                '<c r="A' . $rowIdx . '" s="6"><v>' . $cNo++ . '</v></c>' .
                '<c r="B' . $rowIdx . '" t="inlineStr" s="5"><is><t>' . $this->xmlEscape($cName) . '</t></is></c>' .
                '<c r="C' . $rowIdx . '" s="8"><v>' . $cData['count'] . '</v></c>' .
                '<c r="D' . $rowIdx . '" s="7"><v>' . $cData['revenue'] . '</v></c>' .
                '<c r="E' . $rowIdx . '" s="7"><v>' . $avgNom . '</v></c>' .
                '<c r="F' . $rowIdx . '" s="17"><v>' . $pctVal . '</v></c>' .
                '</row>';
            $rowIdx++;
        }
        $catEndRow = $rowIdx - 1;

        if ($catEndRow >= $catStartRow) {
            $xml .= '<row r="' . $rowIdx . '" ht="22" customHeight="1">' .
                '<c r="A' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="B' . $rowIdx . '" t="inlineStr" s="9"><is><t>TOTAL REVENUE DIVERIFIKASI</t></is></c>' .
                '<c r="C' . $rowIdx . '" s="11"><f>SUM(C' . $catStartRow . ':C' . $catEndRow . ')</f><v>' . $paidCount . '</v></c>' .
                '<c r="D' . $rowIdx . '" s="10"><f>SUM(D' . $catStartRow . ':D' . $catEndRow . ')</f><v>' . $totalPaidRevenue . '</v></c>' .
                '<c r="E' . $rowIdx . '" s="10"><v>' . $avgTicket . '</v></c>' .
                '<c r="F' . $rowIdx . '" s="17"><v>1.0</v></c>' .
                '</row>';
        }
        $rowIdx += 3;

        // TABLE 2: TREN TRANSAKSI BULANAN
        $xml .= '<row r="' . $rowIdx . '">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="2"><is><t>📈 PIVOT 2: TREN TRANSAKSI BULANAN (MONTHLY RUN RATE)</t></is></c>' .
            '</row>';
        $rowIdx++;

        $xml .= '<row r="' . $rowIdx . '" ht="24" customHeight="1">' .
            '<c r="A' . $rowIdx . '" t="inlineStr" s="4"><is><t>No</t></is></c>' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="4"><is><t>Bulan Transaksi</t></is></c>' .
            '<c r="C' . $rowIdx . '" t="inlineStr" s="4"><is><t>Transaksi Baru (Tx)</t></is></c>' .
            '<c r="D' . $rowIdx . '" t="inlineStr" s="4"><is><t>Omzet Bulan Ini (IDR)</t></is></c>' .
            '<c r="E' . $rowIdx . '" t="inlineStr" s="4"><is><t>Kumulatif Transaksi (Tx)</t></is></c>' .
            '<c r="F' . $rowIdx . '" t="inlineStr" s="4"><is><t>Kumulatif Omzet (IDR)</t></is></c>' .
            '</row>';
        $rowIdx++;

        $mStartRow = $rowIdx;
        $mNo = 1;
        $cumMCount = 0;
        $cumMRev = 0;
        foreach ($monthlyBuckets as $mKey => $mData) {
            $cumMCount += $mData['count'];
            $cumMRev += $mData['revenue'];

            $xml .= '<row r="' . $rowIdx . '">' .
                '<c r="A' . $rowIdx . '" s="6"><v>' . $mNo++ . '</v></c>' .
                '<c r="B' . $rowIdx . '" t="inlineStr" s="5"><is><t>' . $this->xmlEscape($mData['label']) . '</t></is></c>' .
                '<c r="C' . $rowIdx . '" s="8"><v>' . $mData['count'] . '</v></c>' .
                '<c r="D' . $rowIdx . '" s="7"><v>' . $mData['revenue'] . '</v></c>' .
                '<c r="E' . $rowIdx . '" s="8"><v>' . $cumMCount . '</v></c>' .
                '<c r="F' . $rowIdx . '" s="7"><v>' . $cumMRev . '</v></c>' .
                '</row>';
            $rowIdx++;
        }
        $mEndRow = $rowIdx - 1;

        if ($mEndRow >= $mStartRow) {
            $xml .= '<row r="' . $rowIdx . '" ht="22" customHeight="1">' .
                '<c r="A' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="B' . $rowIdx . '" t="inlineStr" s="9"><is><t>TOTAL TRANSAKSI BULANAN</t></is></c>' .
                '<c r="C' . $rowIdx . '" s="11"><f>SUM(C' . $mStartRow . ':C' . $mEndRow . ')</f><v>' . $paidCount . '</v></c>' .
                '<c r="D' . $rowIdx . '" s="10"><f>SUM(D' . $mStartRow . ':D' . $mEndRow . ')</f><v>' . $totalPaidRevenue . '</v></c>' .
                '<c r="E' . $rowIdx . '" s="11"><v>' . $cumMCount . '</v></c>' .
                '<c r="F' . $rowIdx . '" s="10"><v>' . $cumMRev . '</v></c>' .
                '</row>';
        }
        $rowIdx += 3;

        // TABLE 3: REKAPITULASI STATUS & METODE PEMBAYARAN
        $xml .= '<row r="' . $rowIdx . '">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="2"><is><t>💳 PIVOT 3: REKAPITULASI METODE &amp; STATUS PEMBAYARAN</t></is></c>' .
            '</row>';
        $rowIdx++;

        $xml .= '<row r="' . $rowIdx . '" ht="24" customHeight="1">' .
            '<c r="A' . $rowIdx . '" t="inlineStr" s="3"><is><t>No</t></is></c>' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="3"><is><t>Metode Pembayaran</t></is></c>' .
            '<c r="C' . $rowIdx . '" t="inlineStr" s="3"><is><t>Status Pembayaran</t></is></c>' .
            '<c r="D' . $rowIdx . '" t="inlineStr" s="3"><is><t>Jumlah Transaksi (Tx)</t></is></c>' .
            '<c r="E' . $rowIdx . '" t="inlineStr" s="3"><is><t>Total Nominal (IDR)</t></is></c>' .
            '</row>';
        $rowIdx++;

        $stStartRow = $rowIdx;
        $stNo = 1;
        foreach ($methodBuckets as $mKey => $stData) {
            $xml .= '<row r="' . $rowIdx . '">' .
                '<c r="A' . $rowIdx . '" s="6"><v>' . $stNo++ . '</v></c>' .
                '<c r="B' . $rowIdx . '" t="inlineStr" s="5"><is><t>' . $this->xmlEscape($stData['method']) . '</t></is></c>' .
                '<c r="C' . $rowIdx . '" t="inlineStr" s="6"><is><t>' . $this->xmlEscape($stData['status']) . '</t></is></c>' .
                '<c r="D' . $rowIdx . '" s="8"><v>' . $stData['count'] . '</v></c>' .
                '<c r="E' . $rowIdx . '" s="7"><v>' . $stData['revenue'] . '</v></c>' .
                '</row>';
            $rowIdx++;
        }
        $stEndRow = $rowIdx - 1;

        if ($stEndRow >= $stStartRow) {
            $xml .= '<row r="' . $rowIdx . '" ht="22" customHeight="1">' .
                '<c r="A' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="B' . $rowIdx . '" t="inlineStr" s="9"><is><t>TOTAL KESELURUHAN</t></is></c>' .
                '<c r="C' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="D' . $rowIdx . '" s="11"><f>SUM(D' . $stStartRow . ':D' . $stEndRow . ')</f><v>' . $totalCount . '</v></c>' .
                '<c r="E' . $rowIdx . '" s="10"><f>SUM(E' . $stStartRow . ':E' . $stEndRow . ')</f><v>' . $totalNominal . '</v></c>' .
                '</row>';
        }

        $xml .= '</sheetData></worksheet>';
        return $xml;
    }

    /**
     * Build Sheet 2: 📋 DATA TRANSAKSI LENGKAP
     */
    private function buildDataSheetXml(Collection $payments, array $options): string
    {
        $headers = [
            'No',
            'ID Transaksi',
            'Tanggal Registrasi',
            'Tanggal Lunas',
            'Nama Peserta',
            'Email',
            'No. WhatsApp',
            'Kategori Peserta',
            'Kode Submisi Paper',
            'Judul Paper / Submisi',
            'Metode Pembayaran',
            'Gateway',
            'Status Pembayaran',
            'Nominal Transaksi (IDR)',
            'Order ID / Ref',
            'Transaction ID',
            'Bukti Transfer',
        ];

        // Column widths
        $widths = [6, 16, 20, 20, 28, 28, 18, 24, 20, 36, 22, 14, 18, 24, 22, 22, 24];

        $xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' .
            '<cols>';
        foreach ($widths as $idx => $w) {
            $colNum = $idx + 1;
            $xml .= '<col min="' . $colNum . '" max="' . $colNum . '" width="' . $w . '" customWidth="1"/>';
        }
        $xml .= '</cols><sheetData>';

        // Header Row (Row 1)
        $xml .= '<row r="1" ht="26" customHeight="1">';
        foreach ($headers as $idx => $title) {
            $cellRef = $this->getColLetter($idx + 1) . '1';
            $xml .= '<c r="' . $cellRef . '" t="inlineStr" s="3"><is><t>' . $this->xmlEscape($title) . '</t></is></c>';
        }
        $xml .= '</row>';

        $methodMap = [
            'bank_transfer' => 'Bank Transfer',
            'gopay' => 'GoPay',
            'shopeepay' => 'ShopeePay',
            'qris' => 'QRIS',
            'credit_card' => 'Credit Card',
            'cstore' => 'Convenience Store',
            'echannel' => 'Mandiri Bill',
        ];

        $rowIdx = 2;
        $totalNominal = 0.0;

        foreach ($payments as $pIdx => $p) {
            $amt = (float) ($p->amount ?? 0);
            $totalNominal += $amt;

            $method = 'Manual Bank Transfer';
            if ($p->gateway === 'manual') {
                $method = 'Manual Bank Transfer';
            } elseif ($p->order_id) {
                $method = $methodMap[$p->payment_type] ?? $p->payment_type ?? 'Midtrans';
            } elseif ($p->payment_proof_url) {
                $method = 'Manual Bank Transfer';
            }

            $status = 'Pending Verification';
            if ($p->status === 'paid' || $p->verified) {
                $status = 'Paid / Lunas';
            } elseif ($p->status === 'failed') {
                $status = 'Failed';
            } elseif ($p->status === 'expired') {
                $status = 'Expired';
            } elseif ($p->status === 'refunded') {
                $status = 'Refunded';
            }

            $uName = $p->user->name ?? 'N/A';
            $uEmail = $p->user->email ?? 'N/A';
            $uWa = $p->user->whatsapp ?? '-';
            $uCat = $p->user->category ?? 'General';
            $subCode = $p->submission->submission_code ?? '-';
            $subTitle = $p->submission->title ?? '-';

            $paidAtStr = $p->paid_at ? \Carbon\Carbon::parse($p->paid_at)->format('Y-m-d H:i:s') : '-';
            $createdAtStr = $p->created_at ? $p->created_at->format('Y-m-d H:i:s') : '-';
            $hasProof = !empty($p->payment_proof_url) ? 'Ada (Uploaded)' : 'Tidak Ada';

            $xml .= '<row r="' . $rowIdx . '">' .
                '<c r="A' . $rowIdx . '" s="6"><v>' . ($pIdx + 1) . '</v></c>' .
                '<c r="B' . $rowIdx . '" t="inlineStr" s="6"><is><t>#' . $p->id . '</t></is></c>' .
                '<c r="C' . $rowIdx . '" t="inlineStr" s="6"><is><t>' . $createdAtStr . '</t></is></c>' .
                '<c r="D' . $rowIdx . '" t="inlineStr" s="6"><is><t>' . $paidAtStr . '</t></is></c>' .
                '<c r="E' . $rowIdx . '" t="inlineStr" s="5"><is><t>' . $this->xmlEscape($uName) . '</t></is></c>' .
                '<c r="F' . $rowIdx . '" t="inlineStr" s="5"><is><t>' . $this->xmlEscape($uEmail) . '</t></is></c>' .
                '<c r="G' . $rowIdx . '" t="inlineStr" s="6"><is><t>' . $this->xmlEscape($uWa) . '</t></is></c>' .
                '<c r="H' . $rowIdx . '" t="inlineStr" s="5"><is><t>' . $this->xmlEscape($uCat) . '</t></is></c>' .
                '<c r="I' . $rowIdx . '" t="inlineStr" s="6"><is><t>' . $this->xmlEscape($subCode) . '</t></is></c>' .
                '<c r="J' . $rowIdx . '" t="inlineStr" s="5"><is><t>' . $this->xmlEscape($subTitle) . '</t></is></c>' .
                '<c r="K' . $rowIdx . '" t="inlineStr" s="5"><is><t>' . $this->xmlEscape($method) . '</t></is></c>' .
                '<c r="L' . $rowIdx . '" t="inlineStr" s="6"><is><t>' . strtoupper($p->gateway ?? 'MANUAL') . '</t></is></c>' .
                '<c r="M' . $rowIdx . '" t="inlineStr" s="6"><is><t>' . $this->xmlEscape($status) . '</t></is></c>' .
                '<c r="N' . $rowIdx . '" s="7"><v>' . $amt . '</v></c>' .
                '<c r="O' . $rowIdx . '" t="inlineStr" s="6"><is><t>' . $this->xmlEscape($p->order_id ?? '-') . '</t></is></c>' .
                '<c r="P' . $rowIdx . '" t="inlineStr" s="6"><is><t>' . $this->xmlEscape($p->transaction_id ?? '-') . '</t></is></c>' .
                '<c r="Q' . $rowIdx . '" t="inlineStr" s="6"><is><t>' . $hasProof . '</t></is></c>' .
                '</row>';

            $rowIdx++;
        }

        // Grand Total Row
        $dataEndRow = $rowIdx - 1;
        if ($dataEndRow >= 2) {
            $xml .= '<row r="' . $rowIdx . '" ht="24" customHeight="1">' .
                '<c r="A' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="B' . $rowIdx . '" t="inlineStr" s="9"><is><t>TOTAL KESELURUHAN</t></is></c>' .
                '<c r="C' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="D' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="E' . $rowIdx . '" t="inlineStr" s="9"><is><t>Total: ' . count($payments) . ' Transaksi</t></is></c>' .
                '<c r="F' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="G' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="H' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="I' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="J' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="K' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="L' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="M' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="N' . $rowIdx . '" s="10"><f>SUM(N2:N' . $dataEndRow . ')</f><v>' . $totalNominal . '</v></c>' .
                '<c r="O' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="P' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="Q' . $rowIdx . '" s="9"><v></v></c>' .
                '</row>';
        }

        $xml .= '</sheetData></worksheet>';
        return $xml;
    }
}

