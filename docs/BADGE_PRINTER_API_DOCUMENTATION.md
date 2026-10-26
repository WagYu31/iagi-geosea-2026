# 🖨️ Dokumentasi API Integrasi Cetak Badge & ID Card
**55th PIT IAGI & GEOSEA XIX 2026 — Royal Ambarrukmo Yogyakarta**

Dokumentasi ini ditujukan bagi pihak **Vendor / Software Mesin Printer & ID Card** untuk mengambil data peserta, melakukan pencarian via Barcode/QR Code scanner, serta memperbarui status pencetakan kartu fisik secara real-time.

---

## 🔑 1. Autentikasi & Konfigurasi Dasar

- **Format Data**: JSON (`Content-Type: application/json`, `Accept: application/json`)
- **Metode Autentikasi**: **API Key** (dapat dikirimkan melalui Header atau Query Parameter).

### Kredensial API Key:
```http
X-API-KEY: geosea2026-badge-api-key
```
*Atau via Bearer Token:*
```http
Authorization: Bearer geosea2026-badge-api-key
```
*Atau via Query Parameter (opsional jika software printer tidak mendukung custom header):*
```text
?api_key=geosea2026-badge-api-key
```

> **Base URL Server**:
> - Production: `https://geosea2026.iagi.or.id` (atau domain server PIT IAGI yang aktif)
> - Prefix API: `/api/v1/badges` atau alias `/api/badges`

---

## 📡 2. Endpoint API

### 🟢 Endpoint 1: Bulk Ambil Data Seluruh Peserta (Bulk Participants)
Digunakan untuk mengunduh seluruh data peserta sekaligus, baik untuk keperluan pencetakan massal sebelum acara (*pre-printing*) maupun sinkronisasi database lokal di software printer.

- **HTTP Method**: `GET`
- **URL**: `/api/v1/badges/participants` (atau `/api/badges/participants`)

#### Query Parameters (Opsional):
| Parameter | Tipe | Default | Keterangan |
| :--- | :--- | :--- | :--- |
| **`all`** | `boolean` | `false` | Set `all=true` untuk **mengambil seluruh data peserta tanpa paginasi** (sangat disarankan untuk bulk printing). |
| **`limit`** | `integer` | `500` | Jumlah data per halaman jika menggunakan paginasi (maksimal: 2000). |
| **`page`** | `integer` | `1` | Nomor halaman (jika menggunakan paginasi). |
| **`status`** | `string` | `active` | Pilihan: `active` (hanya yang sudah lunas/tervalidasi), `all`, `pending`. |
| **`card_printed`**| `boolean`| - | Filter status cetak: `false` (hanya yang belum dicetak), `true` (yang sudah dicetak). |
| **`category`** | `string` | - | Filter tipe/kategori peserta (contoh: `vip`, `iagi_member_professional`, `committee`). |
| **`search`** | `string` | - | Pencarian kata kunci pada Nama, Institusi, Email, atau Kode Tiket. |

#### Contoh Request (cURL):
```bash
curl -X GET "https://geosea2026.iagi.or.id/api/v1/badges/participants?all=true" \
     -H "X-API-KEY: geosea2026-badge-api-key" \
     -H "Accept: application/json"
```

#### Contoh Response JSON (200 OK):
```json
{
  "success": true,
  "total": 1250,
  "data": [
    {
      "id": 45,
      "ticket_code": "TKT-IPRO-26-8A3F12",
      "registration_code": "TKT-IPRO-26-8A3F12",
      "barcode_data": "TKT-IPRO-26-8A3F12",
      "qr_content": "TKT-IPRO-26-8A3F12",
      "qr_verify_url": "https://geosea2026.iagi.or.id/tickets/verify/TKT-IPRO-26-8A3F12",
      "visitor_name": "DR. IR. BUDI SANTOSO, M.T.",
      "name": "DR. IR. BUDI SANTOSO, M.T.",
      "visitor_institution": "PT PERTAMINA HULU ENERGI",
      "institution": "PT PERTAMINA HULU ENERGI",
      "visitor_type": "iagi_member_professional",
      "category": "iagi_member_professional",
      "category_label": "Professional (Member)",
      "badge_role": "PARTICIPANT",
      "badge_template_filename": "Participant.png",
      "badge_template_url": "https://geosea2026.iagi.or.id/images/badges/Participant.png",
      "status": "active",
      "is_group_leader": false,
      "group_code": null,
      "checked_in": true,
      "checked_in_at": "2026-10-26T08:30:15+07:00",
      "card_printed": false,
      "card_printed_at": null,
      "visitor_email": "budi.santoso@pertamina.com",
      "visitor_phone": "081234567890",
      "registered_at": "2026-09-12T14:22:10+07:00"
    }
  ]
}
```

---

### 🟢 Endpoint 2: Cari Peserta Berdasarkan Barcode / Kode Tiket / ID
Digunakan untuk pencetakan langsung saat peserta hadir di meja registrasi (*on-demand check-in printing*). Saat scanner membaca Barcode/QR Code, software vendor memanggil API ini untuk mendapatkan data cetak kartu peserta secara instan.

- **HTTP Method**: `GET`
- **URL**:
  - Opsi A (Query Param): `/api/v1/badges/search?code={KODE_TIKET_ATAU_ID}`
  - Opsi B (Path Param): `/api/v1/badges/participant/{KODE_TIKET_ATAU_ID}`

#### Query Parameters:
| Parameter | Tipe | Wajib? | Keterangan |
| :--- | :--- | :--- | :--- |
| **`code`** atau **`q`** | `string` | Ya (jika Opsi A) | Kode tiket dari Barcode/QR (misal: `TKT-IPRO-26-8A3F12`) atau ID angka (misal: `45`). |
| **`mark_printed`** | `boolean` | Opsional | Jika `true`, sistem akan langsung mencatat status bahwa kartu peserta sudah dicetak (`card_printed = true`). |
| **`mark_checkin`** | `boolean` | Opsional | Jika `true`, sistem akan sekaligus mencatat kehadiran peserta di gate (`checked_in = true`). |

#### Contoh Request:
```bash
curl -X GET "https://geosea2026.iagi.or.id/api/v1/badges/search?code=TKT-IPRO-26-8A3F12&mark_printed=true" \
     -H "X-API-KEY: geosea2026-badge-api-key"
```

#### Contoh Response JSON (200 OK):
```json
{
  "success": true,
  "status": "active",
  "data": {
    "id": 45,
    "ticket_code": "TKT-IPRO-26-8A3F12",
    "registration_code": "TKT-IPRO-26-8A3F12",
    "barcode_data": "TKT-IPRO-26-8A3F12",
    "qr_content": "TKT-IPRO-26-8A3F12",
    "visitor_name": "DR. IR. BUDI SANTOSO, M.T.",
    "name": "DR. IR. BUDI SANTOSO, M.T.",
    "visitor_institution": "PT PERTAMINA HULU ENERGI",
    "institution": "PT PERTAMINA HULU ENERGI",
    "visitor_type": "iagi_member_professional",
    "category_label": "Professional (Member)",
    "badge_role": "PARTICIPANT",
    "badge_template_filename": "Participant.png",
    "badge_template_url": "https://geosea2026.iagi.or.id/images/badges/Participant.png",
    "status": "active",
    "checked_in": true,
    "checked_in_at": "2026-10-26T08:30:15+07:00",
    "card_printed": true,
    "card_printed_at": "2026-10-26T08:31:02+07:00",
    "visitor_email": "budi.santoso@pertamina.com",
    "visitor_phone": "081234567890"
  }
}
```

#### Response Error (404 Not Found):
```json
{
  "success": false,
  "status": "not_found",
  "message": "Peserta dengan kode atau ID 'TKT-XXX' tidak ditemukan."
}
```

---

### 🟢 Endpoint 3: Tandai Kartu Sudah Dicetak (Mark Card Printed)
Jika software printer vendor ingin mengirimkan konfirmasi (*callback*) setelah printer fisik selesai mencetak kartu.

- **HTTP Method**: `POST`
- **URL**: `/api/v1/badges/mark-printed`

#### Body JSON (Single):
```json
{
  "ticket_code": "TKT-IPRO-26-8A3F12"
}
```
*Atau menggunakan ID*:
```json
{
  "id": 45
}
```

#### Body JSON (Bulk / Batch):
```json
{
  "ticket_codes": [
    "TKT-IPRO-26-8A3F12",
    "TKT-VIP-26-99C12A",
    "TKT-SPK-26-7788AA"
  ]
}
```

#### Response JSON:
```json
{
  "success": true,
  "message": "Kartu badge peserta berhasil ditandai telah dicetak."
}
```

---

### 🟢 Endpoint 4: Daftar Kategori & URL Template Gambar Badge
Digunakan oleh tim teknis vendor untuk mengunduh / meng-cache seluruh file gambar background lanyard badge resolusi tinggi sebelum acara.

- **HTTP Method**: `GET`
- **URL**: `/api/v1/badges/categories`

#### Contoh Response JSON (200 OK):
```json
{
  "success": true,
  "total": 14,
  "data": [
    {
      "type": "iagi_member_professional",
      "label": "Professional (Member)",
      "badge_role": "PARTICIPANT",
      "template_filename": "Participant.png",
      "template_url": "https://geosea2026.iagi.or.id/images/badges/Participant.png"
    },
    {
      "type": "vip",
      "label": "VIP",
      "badge_role": "VIP",
      "template_filename": "VIP.png",
      "template_url": "https://geosea2026.iagi.or.id/images/badges/VIP.png"
    },
    {
      "type": "speaker",
      "label": "Keynote Speaker",
      "badge_role": "KEYNOTE SPEAKER",
      "template_filename": "Speaker.png",
      "template_url": "https://geosea2026.iagi.or.id/images/badges/Speaker.png"
    },
    {
      "type": "committee",
      "label": "Committee",
      "badge_role": "COMMITTEE",
      "template_filename": "Committee.png",
      "template_url": "https://geosea2026.iagi.or.id/images/badges/Committee.png"
    },
    {
      "type": "exhibition",
      "label": "Exhibition",
      "badge_role": "EXHIBITOR",
      "template_filename": "Exhibitor.png",
      "template_url": "https://geosea2026.iagi.or.id/images/badges/Exhibitor.png"
    }
  ]
}
```

---

## 📇 3. Detail Elemen yang Dicetak pada Badge Lanyard

Sistem badge PIT IAGI & GEOSEA 2026 memiliki layout standar berikut:

1. **Background Image** (`badge_template_url`):
   - Resolusi: **790 x 1253 px** (High-Resolution PNG, 300 DPI ready).
   - Ukuran Cetak Fisik: **100 mm x 158.6 mm** (Standar Lanyard Pouch A6 / 10 x 15 cm).
2. **Nama Peserta** (`name` / `visitor_name`):
   - Dicetak pada area kotak nama bagian tengah badge.
   - Menggunakan huruf kapital (*Uppercase*), font tebal (*Bold / 800*), posisi rata tengah (*Center*).
3. **Institusi / Perusahaan** (`institution` / `visitor_institution`):
   - Dicetak tepat di bawah nama peserta.
   - Huruf kapital, posisi rata tengah (*Center*).
4. **Role Kategori** (`badge_role`):
   - Menampilkan tulisan kategori besar (contoh: `PARTICIPANT`, `VIP`, `SPEAKER`, `COMMITTEE`, `EXHIBITOR`, `STUDENT`, `DELEGATE`).
5. **QR Code / Barcode** (`qr_content` / `barcode_data`):
   - Nilai teks: string dari `ticket_code` (contoh: `TKT-IPRO-26-8A3F12`).
   - Dapat di-generate menggunakan format **QR Code** atau **Code 128 (1D Barcode)**.

---

## 📞 Kontak Teknis
Jika pihak vendor memerlukan penyesuaian format payload khusus (misal untuk software *BarTender*, *CardStudio*, atau aplikasi *Direct Thermal SDK*), silakan hubungi tim IT panitia.
