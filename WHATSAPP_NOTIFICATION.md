# WhatsApp Notification System

## Overview
Sistem notifikasi WhatsApp otomatis yang mengirimkan pemberitahuan kepada user ketika status submission mereka diubah oleh admin.

## Features
- ✅ Notifikasi otomatis ketika status submission berubah
- ✅ Mendukung single update dan bulk update
- ✅ Format pesan yang informatif dan profesional
- ✅ Logging untuk tracking notifikasi
- ✅ Handle error dengan baik

## Setup

### 1. Tambahkan API Key ke .env
Tambahkan API key FlowKirim ke file `.env`:
```env
FLOWKIRIM_API_KEY=ea0eaebe96e43a3fd9ea82583192b0ab9c0720b18f8b40c0253da3f18bfe391a
```

### 2. Service Sudah Terintegrasi
Service `WhatsAppNotificationService` sudah terintegrasi dengan:
- `AdminController::updateSubmissionStatus()` - untuk single status update
- `AdminController::bulkUpdateStatus()` - untuk bulk status update

## Status Messages

Sistem akan mengirimkan pesan yang berbeda untuk setiap status:

| Status | Message |
|--------|---------|
| **Pending** | Status submission Anda telah diubah menjadi Pending. Submission akan segera ditinjau oleh tim kami. |
| **Under Review** | Status submission Anda telah diubah menjadi Under Review. Submission Anda sedang dalam proses peninjauan oleh reviewer. |
| **Revision Phase 1** | Status submission Anda telah diubah menjadi Revision Phase 1. Silakan lakukan revisi sesuai dengan komentar reviewer. |
| **Revision Phase 2** | Status submission Anda telah diubah menjadi Revision Phase 2. Silakan lakukan revisi tambahan sesuai dengan komentar reviewer. |
| **Accepted** | 🎉 Selamat! 🎉 Submission Anda telah DITERIMA (Accepted). Terima kasih atas kontribusi Anda dalam konferensi ini. |
| **Rejected** | Status submission Anda telah diubah menjadi Rejected. Mohon maaf submission Anda tidak dapat diterima kali ini. |

## Format Pesan WhatsApp

Contoh pesan yang dikirim:
```
*IAGI-GEOSEA 2026 - Notification*

Halo *John Doe*,

Submission ID: *7*
Judul: *TESTING9*

🎉 *Selamat!* 🎉

Submission Anda telah *DITERIMA* (Accepted).

Terima kasih atas kontribusi Anda dalam konferensi ini.

Silakan login ke dashboard Anda untuk informasi lebih lanjut.

Terima kasih,
Tim IAGI-GEOSEA 2026
```

## Phone Number Format

Service akan otomatis menangani berbagai format nomor telepon:
- `08212226504` → `628212226504`
- `8212226504` → `628212226504`
- `+628212226504` → `628212226504`

## Logging

Semua aktivitas notifikasi akan di-log di `storage/logs/laravel.log`:
- ✅ Notifikasi berhasil dikirim
- ❌ Notifikasi gagal dikirim
- ⚠️ User tidak memiliki nomor WhatsApp

## Error Handling

Service memiliki error handling yang baik:
- Jika user tidak memiliki nomor WhatsApp, notifikasi akan di-skip dengan warning log
- Jika API gagal, error akan di-log dan proses update status tetap berlanjut
- Tidak akan mengganggu proses update status submission

## API Integration

### FlowKirim API
- **Base URL**: `https://api.flowkirim.com`
- **Endpoint**: `/v1/send-message`
- **Method**: POST
- **Headers**: 
  - `Authorization: Bearer {API_KEY}`
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "phone": "628212226504",
    "message": "Your message here"
  }
  ```

## Testing

Untuk testing notifikasi:

1. Pastikan user memiliki nomor WhatsApp di profile mereka
2. Login sebagai admin
3. Buka halaman Manage Submissions
4. Update status submission
5. Check logs di `storage/logs/laravel.log`
6. Verifikasi user menerima pesan WhatsApp

## Troubleshooting

### Notifikasi tidak terkirim?
1. ✅ Pastikan API key sudah benar di `.env`
2. ✅ Pastikan user memiliki nomor WhatsApp
3. ✅ Check logs di `storage/logs/laravel.log`
4. ✅ Verifikasi format nomor telepon benar

### Check Logs
```bash
tail -f storage/logs/laravel.log | grep WhatsApp
```

## Future Improvements

Beberapa improvement yang bisa ditambahkan:
- [ ] Queue system untuk notifikasi
- [ ] Retry mechanism jika notifikasi gagal
- [ ] Template pesan yang bisa dikustomisasi dari admin panel
- [ ] Notifikasi untuk event lain (payment verified, reviewer assigned, dll)
- [ ] Dashboard untuk tracking notifikasi yang terkirim

## Support

Untuk bantuan lebih lanjut:
- FlowKirim Documentation: https://flowkirim.com/docs
- Laravel Documentation: https://laravel.com/docs
