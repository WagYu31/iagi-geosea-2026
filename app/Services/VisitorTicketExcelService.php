<?php

namespace App\Services;

use ZipArchive;
use Illuminate\Support\Collection;

class VisitorTicketExcelService
{
    /**
     * Helper to compute accurate financial allocation per ticket,
     * accounting for single tickets vs group/company invoices.
     */
    public static function computeTicketFinancials($ticket): array
    {
        $p = $ticket->payment;
        if (!$p) {
            return [
                'is_paid' => false,
                'is_debt' => false,
                'is_free' => true,
                'is_pending' => false,
                'ticket_price' => 0.0,
                'paid_amount' => 0.0,
                'debt_amount' => 0.0,
                'status_label' => 'FREE PASS',
                'is_group' => false,
                'group_count' => 1,
                'invoice_total' => 0.0,
                'receipt_no' => '-',
                'payment_code' => '-',
                'payment_method' => 'FREE',
                'payment_status' => 'FREE',
            ];
        }

        $groupCount = max(
            $p->tickets_count ?? ($p->tickets ? $p->tickets->count() : 0),
            (int) ($p->total_members ?? 0),
            1
        );
        $isGroup = $groupCount > 1 || (bool) $p->is_mixed_category;

        $indPrice = ($ticket->individual_price && (float) $ticket->individual_price > 0)
            ? (float) $ticket->individual_price
            : (((float) ($p->price_per_ticket ?? 0) > 0)
                ? (float) $p->price_per_ticket
                : round((float) ($p->total_amount ?? 0) / $groupCount));

        $ticketPrice = $isGroup ? $indPrice : (float) ($p->total_amount ?? $indPrice ?? 0);

        $isDebt = (bool) $p->is_debt;
        $pStatus = strtolower($p->status ?? '');
        $isApproved = in_array($pStatus, ['approved', 'paid', 'verified', 'success']) && !$isDebt;
        $isFree = ($ticketPrice <= 0 || $pStatus === 'free');

        $paidAmount = 0.0;
        $debtAmount = 0.0;
        $statusLabel = 'FREE PASS';

        if ($isFree) {
            $statusLabel = 'FREE PASS';
        } elseif ($isDebt) {
            $debtAmount = $ticketPrice;
            $statusLabel = 'OUTSTANDING DEBT (HUTANG)';
        } elseif ($isApproved) {
            $paidAmount = $ticketPrice;
            $statusLabel = 'PAID / LUNAS';
        } else {
            $statusLabel = 'PENDING VERIFIKASI';
        }

        return [
            'is_paid' => $isApproved,
            'is_debt' => $isDebt,
            'is_free' => $isFree,
            'is_pending' => (!$isApproved && !$isDebt && !$isFree),
            'ticket_price' => $ticketPrice,
            'paid_amount' => $paidAmount,
            'debt_amount' => $debtAmount,
            'status_label' => $statusLabel,
            'is_group' => $isGroup,
            'group_count' => $groupCount,
            'invoice_total' => (float) $p->total_amount,
            'receipt_no' => $p->receipt_no ?? '-',
            'payment_code' => $p->payment_code ?? '-',
            'payment_method' => strtoupper($p->payment_method ?? 'TRANSFER'),
            'payment_status' => strtoupper($p->status ?? 'PENDING'),
        ];
    }

    /**
     * Generate an Excel .xlsx workbook containing:
     * Sheet 1: 📊 REKAP & PIVOT EXECUTIVE (Executive financial & attendance summary)
     * Sheet 2: 📋 DATA TIKET & INVOICE (Complete data rows with SUM totals at bottom)
     *
     * @param Collection $tickets
     * @param array $options
     * @return string Temporary path of the generated .xlsx file
     */
    public function generateWorkbook($tickets, array $options = []): string
    {
        $tempPath = tempnam(sys_get_temp_dir(), 'vis_xlsx_') . '.xlsx';
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
        $zip->addFromString('xl/worksheets/sheet1.xml', $this->buildPivotSheetXml($tickets, $options));
        $zip->addFromString('xl/worksheets/sheet2.xml', $this->buildDataSheetXml($tickets, $options));

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
            '<sheet name="📋 DATA TIKET &amp; INVOICE" sheetId="2" r:id="rId2"/>' .
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
            '<!-- 17: Percentage Format -->' .
            '<xf numFmtId="165" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyFont="1" applyBorder="1"><alignment horizontal="right" vertical="center"/></xf>' .
            '</cellXfs>' .
            '</styleSheet>';
    }

    /**
     * Build Sheet 1: 📊 REKAP & PIVOT EXECUTIVE
     */
    private function buildPivotSheetXml($tickets, array $options): string
    {
        $totalCount = $tickets->count();
        $totalNominal = 0.0;
        $totalPaid = 0.0;
        $totalDebt = 0.0;
        $checkedInCount = 0;
        $cardPrintedCount = 0;
        $paidCount = 0;
        $debtCount = 0;
        $freeCount = 0;

        $categoryStats = [];
        $paymentStatusStats = [];
        $companyStats = [];

        foreach ($tickets as $t) {
            $fin = self::computeTicketFinancials($t);
            $cat = $t->category_label ?? strtoupper($t->visitor_type ?? 'VISITOR');
            $inst = trim($t->visitor_institution ?? '');
            if (empty($inst) || $inst === '-') $inst = '(Tanpa Instansi / Individu)';

            $ticketPrice = $fin['ticket_price'];
            $paidAmount = $fin['paid_amount'];
            $debtAmount = $fin['debt_amount'];

            $totalNominal += $ticketPrice;
            $totalPaid += $paidAmount;
            $totalDebt += $debtAmount;

            if ($fin['is_paid']) $paidCount++;
            if ($fin['is_debt']) $debtCount++;
            if ($fin['is_free']) $freeCount++;

            if ($t->checked_in) $checkedInCount++;
            if ($t->card_printed) $cardPrintedCount++;

            // Category breakdown
            if (!isset($categoryStats[$cat])) {
                $categoryStats[$cat] = [
                    'count' => 0,
                    'total' => 0.0,
                    'paid' => 0.0,
                    'debt' => 0.0,
                    'card_printed' => 0,
                    'checked_in' => 0,
                ];
            }
            $categoryStats[$cat]['count']++;
            $categoryStats[$cat]['total'] += $ticketPrice;
            $categoryStats[$cat]['paid'] += $paidAmount;
            $categoryStats[$cat]['debt'] += $debtAmount;
            if ($t->card_printed) $categoryStats[$cat]['card_printed']++;
            if ($t->checked_in) $categoryStats[$cat]['checked_in']++;

            // Payment status breakdown
            $statusKey = $fin['status_label'];
            if (!isset($paymentStatusStats[$statusKey])) {
                $paymentStatusStats[$statusKey] = ['count' => 0, 'total' => 0.0];
            }
            $paymentStatusStats[$statusKey]['count']++;
            $paymentStatusStats[$statusKey]['total'] += $ticketPrice;

            // Company breakdown
            if (!isset($companyStats[$inst])) {
                $companyStats[$inst] = ['count' => 0, 'total' => 0.0, 'paid' => 0.0, 'debt' => 0.0];
            }
            $companyStats[$inst]['count']++;
            $companyStats[$inst]['total'] += $ticketPrice;
            $companyStats[$inst]['paid'] += $paidAmount;
            $companyStats[$inst]['debt'] += $debtAmount;
        }

        // Sort companies by participant count descending
        uasort($companyStats, fn($a, $b) => $b['count'] <=> $a['count']);
        $topCompanies = array_slice($companyStats, 0, 15, true);

        // Build XML with generous column widths so numbers never show "###"
        $xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' .
            '<cols>' .
            '<col min="1" max="1" width="6" customWidth="1"/>' .
            '<col min="2" max="2" width="38" customWidth="1"/>' .
            '<col min="3" max="3" width="28" customWidth="1"/>' .
            '<col min="4" max="4" width="28" customWidth="1"/>' .
            '<col min="5" max="5" width="28" customWidth="1"/>' .
            '<col min="6" max="6" width="24" customWidth="1"/>' .
            '<col min="7" max="7" width="24" customWidth="1"/>' .
            '<col min="8" max="8" width="20" customWidth="1"/>' .
            '</cols>' .
            '<sheetData>';

        $rowIdx = 1;

        // Title
        $xml .= '<row r="' . $rowIdx . '" ht="26" customHeight="1">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="1"><is><t>55TH PIT IAGI &amp; GEOSEA XIX 2026 - EXECUTIVE SUMMARY &amp; FINANCIAL RECAP</t></is></c>' .
            '</row>';
        $rowIdx++;

        // Subtitle
        $nowStr = date('d F Y - H:i:s') . ' WIB';
        $xml .= '<row r="' . $rowIdx . '">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="16"><is><t>Dicetak pada: ' . $this->xmlEscape($nowStr) . ' | Total Sample Data: ' . number_format($totalCount) . ' Pengunjung</t></is></c>' .
            '</row>';
        $rowIdx += 2;

        // KPI CARDS BLOCK (Table-style)
        $xml .= '<row r="' . $rowIdx . '">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="2"><is><t>📌 RINGKASAN INDIKATOR UTAMA (KEY PERFORMANCE INDICATORS)</t></is></c>' .
            '</row>';
        $rowIdx++;

        // KPI Card Header Labels
        $xml .= '<row r="' . $rowIdx . '" ht="20" customHeight="1">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="12"><is><t>TOTAL PENGUNJUNG</t></is></c>' .
            '<c r="C' . $rowIdx . '" t="inlineStr" s="12"><is><t>KAS LUNAS (PAID)</t></is></c>' .
            '<c r="D' . $rowIdx . '" t="inlineStr" s="14"><is><t>OUTSTANDING DEBT (HUTANG)</t></is></c>' .
            '<c r="E' . $rowIdx . '" t="inlineStr" s="12"><is><t>TOTAL AKUMULASI</t></is></c>' .
            '<c r="F' . $rowIdx . '" t="inlineStr" s="12"><is><t>HADIR CHECK-IN GATE</t></is></c>' .
            '<c r="G' . $rowIdx . '" t="inlineStr" s="12"><is><t>KARTU SUDAH DICETAK</t></is></c>' .
            '</row>';
        $rowIdx++;

        // KPI Card Values
        $xml .= '<row r="' . $rowIdx . '" ht="28" customHeight="1">' .
            '<c r="B' . $rowIdx . '" s="13"><v>' . $totalCount . '</v></c>' .
            '<c r="C' . $rowIdx . '" s="13"><v>' . $totalPaid . '</v></c>' .
            '<c r="D' . $rowIdx . '" s="15"><v>' . $totalDebt . '</v></c>' .
            '<c r="E' . $rowIdx . '" s="13"><v>' . $totalNominal . '</v></c>' .
            '<c r="F' . $rowIdx . '" s="13"><v>' . $checkedInCount . '</v></c>' .
            '<c r="G' . $rowIdx . '" s="13"><v>' . $cardPrintedCount . '</v></c>' .
            '</row>';
        $rowIdx += 3;

        // TABLE 1: REKAPITULASI KATEGORI PESERTA
        $xml .= '<row r="' . $rowIdx . '">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="2"><is><t>📊 PIVOT REKAPITULASI BERDASARKAN KATEGORI PESERTA</t></is></c>' .
            '</row>';
        $rowIdx++;

        $xml .= '<row r="' . $rowIdx . '" ht="24" customHeight="1">' .
            '<c r="A' . $rowIdx . '" t="inlineStr" s="3"><is><t>No</t></is></c>' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="3"><is><t>Kategori Peserta / Tiket</t></is></c>' .
            '<c r="C' . $rowIdx . '" t="inlineStr" s="3"><is><t>Jumlah Tiket</t></is></c>' .
            '<c r="D' . $rowIdx . '" t="inlineStr" s="3"><is><t>Total Tagihan (IDR)</t></is></c>' .
            '<c r="E' . $rowIdx . '" t="inlineStr" s="3"><is><t>Kas Lunas (IDR)</t></is></c>' .
            '<c r="F' . $rowIdx . '" t="inlineStr" s="3"><is><t>Piutang / Debt (IDR)</t></is></c>' .
            '<c r="G' . $rowIdx . '" t="inlineStr" s="3"><is><t>Sudah Cetak Kartu</t></is></c>' .
            '<c r="H' . $rowIdx . '" t="inlineStr" s="3"><is><t>Hadir Gate</t></is></c>' .
            '</row>';
        $rowIdx++;

        $catStartRow = $rowIdx;
        $cNo = 1;
        foreach ($categoryStats as $cName => $cData) {
            $xml .= '<row r="' . $rowIdx . '">' .
                '<c r="A' . $rowIdx . '" s="6"><v>' . $cNo++ . '</v></c>' .
                '<c r="B' . $rowIdx . '" t="inlineStr" s="5"><is><t>' . $this->xmlEscape($cName) . '</t></is></c>' .
                '<c r="C' . $rowIdx . '" s="8"><v>' . $cData['count'] . '</v></c>' .
                '<c r="D' . $rowIdx . '" s="7"><v>' . $cData['total'] . '</v></c>' .
                '<c r="E' . $rowIdx . '" s="7"><v>' . $cData['paid'] . '</v></c>' .
                '<c r="F' . $rowIdx . '" s="7"><v>' . $cData['debt'] . '</v></c>' .
                '<c r="G' . $rowIdx . '" s="8"><v>' . $cData['card_printed'] . '</v></c>' .
                '<c r="H' . $rowIdx . '" s="8"><v>' . $cData['checked_in'] . '</v></c>' .
                '</row>';
            $rowIdx++;
        }
        $catEndRow = $rowIdx - 1;

        // Category Totals Row
        $xml .= '<row r="' . $rowIdx . '" ht="22" customHeight="1">' .
            '<c r="A' . $rowIdx . '" s="9"><v></v></c>' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="9"><is><t>TOTAL KESELURUHAN KATEGORI</t></is></c>' .
            '<c r="C' . $rowIdx . '" s="11"><f>SUM(C' . $catStartRow . ':C' . $catEndRow . ')</f><v>' . $totalCount . '</v></c>' .
            '<c r="D' . $rowIdx . '" s="10"><f>SUM(D' . $catStartRow . ':D' . $catEndRow . ')</f><v>' . $totalNominal . '</v></c>' .
            '<c r="E' . $rowIdx . '" s="10"><f>SUM(E' . $catStartRow . ':E' . $catEndRow . ')</f><v>' . $totalPaid . '</v></c>' .
            '<c r="F' . $rowIdx . '" s="10"><f>SUM(F' . $catStartRow . ':F' . $catEndRow . ')</f><v>' . $totalDebt . '</v></c>' .
            '<c r="G' . $rowIdx . '" s="11"><f>SUM(G' . $catStartRow . ':G' . $catEndRow . ')</f><v>' . $cardPrintedCount . '</v></c>' .
            '<c r="H' . $rowIdx . '" s="11"><f>SUM(H' . $catStartRow . ':H' . $catEndRow . ')</f><v>' . $checkedInCount . '</v></c>' .
            '</row>';
        $rowIdx += 3;

        // TABLE 2: REKAPITULASI STATUS PEMBAYARAN
        $xml .= '<row r="' . $rowIdx . '">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="2"><is><t>💳 PIVOT REKAPITULASI STATUS PEMBAYARAN</t></is></c>' .
            '</row>';
        $rowIdx++;

        $xml .= '<row r="' . $rowIdx . '" ht="24" customHeight="1">' .
            '<c r="A' . $rowIdx . '" t="inlineStr" s="4"><is><t>No</t></is></c>' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="4"><is><t>Status Pembayaran</t></is></c>' .
            '<c r="C' . $rowIdx . '" t="inlineStr" s="4"><is><t>Jumlah Tiket</t></is></c>' .
            '<c r="D' . $rowIdx . '" t="inlineStr" s="4"><is><t>Total Nominal (IDR)</t></is></c>' .
            '</row>';
        $rowIdx++;

        $pStartRow = $rowIdx;
        $pNo = 1;
        foreach ($paymentStatusStats as $pName => $pData) {
            $xml .= '<row r="' . $rowIdx . '">' .
                '<c r="A' . $rowIdx . '" s="6"><v>' . $pNo++ . '</v></c>' .
                '<c r="B' . $rowIdx . '" t="inlineStr" s="5"><is><t>' . $this->xmlEscape($pName) . '</t></is></c>' .
                '<c r="C' . $rowIdx . '" s="8"><v>' . $pData['count'] . '</v></c>' .
                '<c r="D' . $rowIdx . '" s="7"><v>' . $pData['total'] . '</v></c>' .
                '</row>';
            $rowIdx++;
        }
        $pEndRow = $rowIdx - 1;

        $xml .= '<row r="' . $rowIdx . '" ht="22" customHeight="1">' .
            '<c r="A' . $rowIdx . '" s="9"><v></v></c>' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="9"><is><t>TOTAL STATUS PEMBAYARAN</t></is></c>' .
            '<c r="C' . $rowIdx . '" s="11"><f>SUM(C' . $pStartRow . ':C' . $pEndRow . ')</f><v>' . $totalCount . '</v></c>' .
            '<c r="D' . $rowIdx . '" s="10"><f>SUM(D' . $pStartRow . ':D' . $pEndRow . ')</f><v>' . $totalNominal . '</v></c>' .
            '</row>';
        $rowIdx += 3;

        // TABLE 3: TOP 15 INSTANSI / PERUSAHAAN
        $xml .= '<row r="' . $rowIdx . '">' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="2"><is><t>🏢 TOP 15 INSTANSI / PERUSAHAAN DENGAN DELEGASI TERBANYAK</t></is></c>' .
            '</row>';
        $rowIdx++;

        $xml .= '<row r="' . $rowIdx . '" ht="24" customHeight="1">' .
            '<c r="A' . $rowIdx . '" t="inlineStr" s="3"><is><t>No</t></is></c>' .
            '<c r="B' . $rowIdx . '" t="inlineStr" s="3"><is><t>Nama Instansi / Perusahaan Sponsor</t></is></c>' .
            '<c r="C' . $rowIdx . '" t="inlineStr" s="3"><is><t>Jumlah Delegasi</t></is></c>' .
            '<c r="D' . $rowIdx . '" t="inlineStr" s="3"><is><t>Total Tagihan (IDR)</t></is></c>' .
            '<c r="E' . $rowIdx . '" t="inlineStr" s="3"><is><t>Kas Lunas (IDR)</t></is></c>' .
            '<c r="F' . $rowIdx . '" t="inlineStr" s="3"><is><t>Piutang / Debt (IDR)</t></is></c>' .
            '</row>';
        $rowIdx++;

        $iStartRow = $rowIdx;
        $iNo = 1;
        foreach ($topCompanies as $instName => $instData) {
            $xml .= '<row r="' . $rowIdx . '">' .
                '<c r="A' . $rowIdx . '" s="6"><v>' . $iNo++ . '</v></c>' .
                '<c r="B' . $rowIdx . '" t="inlineStr" s="5"><is><t>' . $this->xmlEscape($instName) . '</t></is></c>' .
                '<c r="C' . $rowIdx . '" s="8"><v>' . $instData['count'] . '</v></c>' .
                '<c r="D' . $rowIdx . '" s="7"><v>' . $instData['total'] . '</v></c>' .
                '<c r="E' . $rowIdx . '" s="7"><v>' . $instData['paid'] . '</v></c>' .
                '<c r="F' . $rowIdx . '" s="7"><v>' . $instData['debt'] . '</v></c>' .
                '</row>';
            $rowIdx++;
        }
        $iEndRow = $rowIdx - 1;

        if ($iEndRow >= $iStartRow) {
            $xml .= '<row r="' . $rowIdx . '" ht="22" customHeight="1">' .
                '<c r="A' . $rowIdx . '" s="9"><v></v></c>' .
                '<c r="B' . $rowIdx . '" t="inlineStr" s="9"><is><t>SUBTOTAL TOP 15 INSTANSI</t></is></c>' .
                '<c r="C' . $rowIdx . '" s="11"><f>SUM(C' . $iStartRow . ':C' . $iEndRow . ')</f></c>' .
                '<c r="D' . $rowIdx . '" s="10"><f>SUM(D' . $iStartRow . ':D' . $iEndRow . ')</f></c>' .
                '<c r="E' . $rowIdx . '" s="10"><f>SUM(E' . $iStartRow . ':E' . $iEndRow . ')</f></c>' .
                '<c r="F' . $rowIdx . '" s="10"><f>SUM(F' . $iStartRow . ':F' . $iEndRow . ')</f></c>' .
                '</row>';
        }

        $xml .= '</sheetData></worksheet>';
        return $xml;
    }

    /**
     * Build Sheet 2: 📋 DATA TIKET & INVOICE
     */
    private function buildDataSheetXml($tickets, array $options): string
    {
        $headers = [
            'No',
            'Kode Tiket',
            'No. Invoice / Receipt',
            'Kode Pembayaran',
            'Nama Peserta',
            'Email',
            'No. WhatsApp / HP',
            'Instansi / Institusi',
            'Kategori Tiket',
            'Jalur Registrasi',
            'Status Tiket',
            'Status Pembayaran',
            'Metode Bayar',
            'Harga Satuan Tiket (IDR)',
            'Diskon (IDR)',
            'Keterangan Diskon',
            'Kode Unik (IDR)',
            'Total Tagihan Tiket (IDR)',
            'Total Invoice Grup (IDR)',
            'Status Check-In Gate',
            'Waktu Check-In',
            'Status Cetak Kartu',
            'Tanggal Registrasi',
            'File Bukti Bayar (ZIP)',
            'Link Bukti Bayar Online',
        ];

        // Column widths
        $widths = [6, 20, 28, 20, 28, 28, 18, 30, 22, 18, 14, 18, 16, 22, 16, 20, 14, 22, 22, 18, 20, 18, 20, 32, 40];

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

        $rowIdx = 2;
        $addedProofs = $options['added_proofs'] ?? [];

        foreach ($tickets as $t) {
            $fin = self::computeTicketFinancials($t);
            $p = $t->payment;

            $proofZip = ($p && isset($addedProofs[$p->id])) ? $addedProofs[$p->id] : '-';
            $proofUrl = ($p && !empty($p->proof_of_payment)) ? ($options['resolve_url_fn'] ?? fn($x) => $x)($p->proof_of_payment) : '-';

            $discountAmount = $p ? (float)($p->discount_amount ?? 0) : 0;
            $uniqueCode = $p ? (float)($p->unique_code ?? 0) : 0;
            $groupInvoiceDisplay = $fin['is_group'] ? $fin['invoice_total'] : '-';

            $rowData = [
                ['val' => $rowIdx - 1, 'style' => 6], // 1. No
                ['val' => $t->ticket_code, 'style' => 6], // 2. Code
                ['val' => $fin['receipt_no'], 'style' => 5], // 3. Invoice
                ['val' => $fin['payment_code'], 'style' => 6], // 4. PayCode
                ['val' => $t->visitor_name, 'style' => 5], // 5. Name
                ['val' => $t->visitor_email, 'style' => 5], // 6. Email
                ['val' => $t->visitor_phone ?? '-', 'style' => 6], // 7. Phone
                ['val' => $t->visitor_institution ?? '-', 'style' => 5], // 8. Inst
                ['val' => $t->category_label ?? strtoupper($t->visitor_type), 'style' => 5], // 9. Cat
                ['val' => $t->registration_source === 'admin_onsite' ? 'Onsite Admin' : 'Online Self', 'style' => 6], // 10. Source
                ['val' => strtoupper($t->status), 'style' => 6], // 11. Status
                ['val' => $fin['payment_status'], 'style' => 6], // 12. PayStatus
                ['val' => $fin['payment_method'], 'style' => 6], // 13. Method
                ['val' => $fin['ticket_price'], 'style' => 7, 'isNum' => true], // 14. Ticket Price
                ['val' => $discountAmount, 'style' => 7, 'isNum' => true], // 15. Discount
                ['val' => $p ? ($p->discount_notes ?? '-') : '-', 'style' => 5], // 16. Disc Notes
                ['val' => $uniqueCode, 'style' => 7, 'isNum' => true], // 17. Unique
                ['val' => $fin['ticket_price'], 'style' => 7, 'isNum' => true], // 18. Total Tagihan Tiket
                ['val' => $groupInvoiceDisplay, 'style' => is_numeric($groupInvoiceDisplay) ? 7 : 6, 'isNum' => is_numeric($groupInvoiceDisplay)], // 19. Total Invoice Grup
                ['val' => $t->checked_in ? 'YES' : 'NO', 'style' => 6], // 20. Checked In
                ['val' => $t->checked_in_at ? $t->checked_in_at->format('Y-m-d H:i:s') : '-', 'style' => 6], // 21. Check In Time
                ['val' => $t->card_printed ? 'SUDAH CETAK' : 'BELUM CETAK', 'style' => 6], // 22. Card
                ['val' => $t->created_at->format('Y-m-d H:i:s'), 'style' => 6], // 23. Registered At
                ['val' => $proofZip, 'style' => 5], // 24. Zip Entry
                ['val' => $proofUrl, 'style' => 5], // 25. Online URL
            ];

            $xml .= '<row r="' . $rowIdx . '">';
            foreach ($rowData as $colIdx => $cell) {
                $ref = $this->getColLetter($colIdx + 1) . $rowIdx;
                $s = $cell['style'] ?? 0;
                if (!empty($cell['isNum'])) {
                    $xml .= '<c r="' . $ref . '" s="' . $s . '"><v>' . $cell['val'] . '</v></c>';
                } else {
                    $xml .= '<c r="' . $ref . '" t="inlineStr" s="' . $s . '"><is><t>' . $this->xmlEscape((string)$cell['val']) . '</t></is></c>';
                }
            }
            $xml .= '</row>';
            $rowIdx++;
        }

        $lastDataRow = $rowIdx - 1;

        // Blank separation row
        $xml .= '<row r="' . $rowIdx . '"></row>';
        $rowIdx++;

        // GRAND TOTAL ROW WITH EXCEL FORMULAS
        $xml .= '<row r="' . $rowIdx . '" ht="26" customHeight="1">';
        $xml .= '<c r="A' . $rowIdx . '" s="9"><v></v></c>';
        $xml .= '<c r="B' . $rowIdx . '" t="inlineStr" s="9"><is><t>TOTAL KESELURUHAN</t></is></c>';
        $xml .= '<c r="C' . $rowIdx . '" s="9"><v></v></c>';
        $xml .= '<c r="D' . $rowIdx . '" s="9"><v></v></c>';
        $xml .= '<c r="E' . $rowIdx . '" s="9"><f>CONCATENATE("Total: ", COUNTA(B2:B' . $lastDataRow . '), " Peserta")</f></c>';
        for ($c = 6; $c <= 13; $c++) {
            $xml .= '<c r="' . $this->getColLetter($c) . $rowIdx . '" s="9"><v></v></c>';
        }
        // Column N: Sum Harga Satuan Tiket
        $xml .= '<c r="N' . $rowIdx . '" s="10"><f>SUM(N2:N' . $lastDataRow . ')</f></c>';
        // Column O: Sum Diskon
        $xml .= '<c r="O' . $rowIdx . '" s="10"><f>SUM(O2:O' . $lastDataRow . ')</f></c>';
        // Column P & Q
        $xml .= '<c r="P' . $rowIdx . '" s="9"><v></v></c>';
        $xml .= '<c r="Q' . $rowIdx . '" s="10"><f>SUM(Q2:Q' . $lastDataRow . ')</f></c>';
        // Column R: Sum Total Tagihan Tiket
        $xml .= '<c r="R' . $rowIdx . '" s="10"><f>SUM(R2:R' . $lastDataRow . ')</f></c>';
        // Column S: Invoice grup
        $xml .= '<c r="S' . $rowIdx . '" s="9"><v></v></c>';
        // Column T: Check in count
        $xml .= '<c r="T' . $rowIdx . '" s="11"><f>COUNTIF(T2:T' . $lastDataRow . ', "YES")</f></c>';
        $xml .= '<c r="U' . $rowIdx . '" s="9"><v></v></c>';
        // Column V: Card printed count
        $xml .= '<c r="V' . $rowIdx . '" s="11"><f>COUNTIF(V2:V' . $lastDataRow . ', "SUDAH CETAK")</f></c>';
        // Column W, X, Y
        $xml .= '<c r="W' . $rowIdx . '" s="9"><v></v></c>';
        $xml .= '<c r="X' . $rowIdx . '" s="9"><v></v></c>';
        $xml .= '<c r="Y' . $rowIdx . '" s="9"><v></v></c>';
        $xml .= '</row>';

        $xml .= '</sheetData></worksheet>';
        return $xml;
    }
}
