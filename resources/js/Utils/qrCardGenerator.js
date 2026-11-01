import JSZip from 'jszip';

/**
 * Helper to draw a rounded rectangle on a 2D canvas context.
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
    if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, radius);
        return;
    }
    // Fallback for older canvas implementations
    let r = typeof radius === 'number' ? { tl: radius, tr: radius, br: radius, bl: radius } : radius;
    ctx.beginPath();
    ctx.moveTo(x + (r.tl || 0), y);
    ctx.lineTo(x + width - (r.tr || 0), y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + (r.tr || 0));
    ctx.lineTo(x + width, y + height - (r.br || 0));
    ctx.quadraticCurveTo(x + width, y + height, x + width - (r.br || 0), y + height);
    ctx.lineTo(x + (r.bl || 0), y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - (r.bl || 0));
    ctx.lineTo(x, y + (r.tl || 0));
    ctx.quadraticCurveTo(x, y, x + (r.tl || 0), y);
    ctx.closePath();
}

/**
 * Generate a single high-resolution E-Ticket QR Pass or raw QR PNG.
 * 
 * @param {Object} ticket - Visitor ticket object
 * @param {HTMLCanvasElement} qrCanvas - Source canvas with the generated QR code
 * @param {string} format - 'card' | 'qr_only'
 * @returns {Promise<Blob>}
 */
export async function generateQrImageBlob(ticket, qrCanvas, format = 'card') {
    const canvas = document.createElement('canvas');

    if (format === 'qr_only') {
        canvas.width = 500;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        // Clean white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 500, 500);
        // Centered QR
        if (qrCanvas) {
            ctx.drawImage(qrCanvas, 25, 25, 450, 450);
        }
        return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    }

    // Full Digital E-Pass Card (640 x 880 px portrait)
    canvas.width = 640;
    canvas.height = 880;
    const ctx = canvas.getContext('2d');

    // 1. Background fill
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 640, 880);

    // 2. White card container with rounded corners and subtle border
    ctx.fillStyle = '#ffffff';
    drawRoundedRect(ctx, 20, 20, 600, 840, 22);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 20, 20, 600, 840, 22);
    ctx.stroke();

    // 3. Header Banner (Dark Emerald Gradient)
    const headerGrad = ctx.createLinearGradient(20, 20, 620, 115);
    headerGrad.addColorStop(0, '#064e3b');
    headerGrad.addColorStop(1, '#0d9488');
    ctx.fillStyle = headerGrad;

    ctx.save();
    drawRoundedRect(ctx, 20, 20, 600, 95, { tl: 22, tr: 22, br: 0, bl: 0 });
    ctx.fill();
    ctx.restore();

    // Header Text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('55TH PIT IAGI & GEOSEA XIX 2026', 320, 58);

    ctx.fillStyle = '#99f6e4';
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillText('OFFICIAL DIGITAL EVENT GATE PASS', 320, 82);

    // 4. Category Badge Pill
    const categoryName = (ticket.category_label || ticket.visitor_type || 'PARTICIPANT').toUpperCase();
    ctx.font = 'bold 13px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
    const textWidth = ctx.measureText(categoryName).width;
    const badgeW = Math.max(textWidth + 34, 140);
    const badgeX = 320 - badgeW / 2;
    const badgeY = 132;

    ctx.fillStyle = '#ecfdf5';
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, 30, 15);
    ctx.fill();
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, 30, 15);
    ctx.stroke();

    ctx.fillStyle = '#15803d';
    ctx.fillText(categoryName, 320, badgeY + 20);

    // 5. QR Code Box (white card with soft border & shadow)
    ctx.fillStyle = '#ffffff';
    drawRoundedRect(ctx, 130, 180, 380, 380, 18);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, 130, 180, 380, 380, 18);
    ctx.stroke();

    // Draw the QR Code image centered inside the box
    if (qrCanvas) {
        ctx.drawImage(qrCanvas, 150, 200, 340, 340);
    }

    // 6. Ticket Code (Monospace Pill)
    ctx.fillStyle = '#f1f5f9';
    drawRoundedRect(ctx, 150, 580, 340, 38, 19);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 150, 580, 340, 38, 19);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillText(ticket.ticket_code || 'TKT-2026', 320, 605);

    // 7. Participant Name (Large & Bold)
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
    let name = ticket.visitor_name || 'Participant';
    if (name.length > 32) name = name.substring(0, 30) + '...';
    ctx.fillText(name, 320, 654);

    // 8. Institution
    ctx.fillStyle = '#094d42';
    ctx.font = 'bold 15px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
    let inst = ticket.visitor_institution || '-';
    if (inst.length > 38) inst = inst.substring(0, 36) + '...';
    ctx.fillText(inst, 320, 686);

    // 9. Contact Info (Email • Phone)
    ctx.fillStyle = '#64748b';
    ctx.font = 'normal 12px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
    const email = ticket.visitor_email || '';
    const phone = ticket.visitor_phone || '';
    const contactStr = [email, phone].filter(Boolean).join(' • ');
    if (contactStr) {
        let cleanContact = contactStr.length > 44 ? contactStr.substring(0, 42) + '...' : contactStr;
        ctx.fillText(cleanContact, 320, 715);
    }

    // 10. Dashed divider
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(50, 745);
    ctx.lineTo(590, 745);
    ctx.stroke();
    ctx.setLineDash([]); // reset dash

    // 11. Footer Venue & Instruction
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('📍 Royal Ambarrukmo Yogyakarta • 3-5 November 2026', 320, 778);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 11px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Tunjukkan QR Code ini pada kamera Gate Scanner saat registrasi ulang venue.', 320, 804);

    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

/**
 * Sanitize filename for safe OS saving.
 */
export function sanitizeFilename(str) {
    return str.replace(/[\\/:*?"<>|]/g, '_').trim();
}

/**
 * Download a single ticket QR E-Pass.
 */
export async function downloadSingleQr(ticket, qrCanvas, format = 'card') {
    const blob = await generateQrImageBlob(ticket, qrCanvas, format);
    const cleanName = sanitizeFilename(ticket.visitor_name || 'Participant');
    const cleanCode = sanitizeFilename(ticket.ticket_code || 'TKT');
    const suffix = format === 'qr_only' ? '_QR' : '_Pass';
    const filename = `[${cleanCode}]_${cleanName}${suffix}.png`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Package multiple QR code images into a ZIP archive and trigger download.
 * 
 * @param {Array} tickets - Array of ticket objects
 * @param {Function} getQrCanvasForTicket - Function (ticket) => HTMLCanvasElement
 * @param {string} format - 'card' | 'qr_only' | 'both'
 * @param {Function} onProgress - Callback (current, total, statusText) => void
 * @param {string} zipNamePrefix - Optional zip filename prefix
 */
export async function exportTicketsQrZip(tickets, getQrCanvasForTicket, format = 'card', onProgress = () => {}, zipNamePrefix = 'QR_Codes_PIT_IAGI_2026') {
    if (!tickets || tickets.length === 0) return;

    const zip = new JSZip();
    const total = tickets.length;

    for (let i = 0; i < total; i++) {
        const ticket = tickets[i];
        const cleanName = sanitizeFilename(ticket.visitor_name || `Participant_${i + 1}`);
        const cleanCode = sanitizeFilename(ticket.ticket_code || `TKT_${ticket.id}`);
        const qrCanvas = getQrCanvasForTicket(ticket);

        if (onProgress) {
            onProgress(i + 1, total, `Membuat QR (${i + 1}/${total}): ${cleanName}`);
        }

        if (format === 'card' || format === 'both') {
            const cardBlob = await generateQrImageBlob(ticket, qrCanvas, 'card');
            zip.file(`[${cleanCode}] ${cleanName}.png`, cardBlob);
        }

        if (format === 'qr_only' || format === 'both') {
            const qrBlob = await generateQrImageBlob(ticket, qrCanvas, 'qr_only');
            const subfolder = format === 'both' ? 'Raw_QR_Codes/' : '';
            zip.file(`${subfolder}[${cleanCode}] ${cleanName} (QR).png`, qrBlob);
        }

        // Yield to browser UI thread briefly every 5 tickets to keep UI smooth
        if (i % 5 === 0) {
            await new Promise(r => setTimeout(r, 10));
        }
    }

    if (onProgress) {
        onProgress(total, total, 'Mengompresi berkas ZIP...');
    }

    const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
    });

    const nowStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const finalZipName = `${zipNamePrefix}_${nowStr}.zip`;

    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalZipName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onProgress) {
        onProgress(total, total, 'Selesai diunduh!');
    }
}
