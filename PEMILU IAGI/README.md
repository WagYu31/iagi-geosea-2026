# Web E-Voting Pemilu IAGI 2026 (Mobile PWA)
**Komisi Pemilihan Ketua Umum (KPKU) • Ikatan Ahli Geologi Indonesia (IAGI)**

Platform resmi pemungutan suara elektronik (E-Voting) pemilihan Ketua Umum IAGI Periode 2026–2029 berbasis **Responsive Mobile Progressive Web App (PWA)** yang dioptimalkan khusus untuk kenyamanan dan kecepatan pemilih melalui smartphone (HP).

---

## 🌟 Fitur Utama & Kepatuhan Regulasi KPKU

1. **Mobile-First Progressive Web App (PWA)**:
   - Dilengkapi `manifest.json` dan Service Worker (`sw.js`) untuk akses cepat, offline caching, serta opsi instalasi langsung ke Layar Utama (Home Screen) HP anggota.
   - Notch safe-area (`env(safe-area-inset-bottom)`) dan navigasi dock bawah yang ergonomis untuk pengoperasian dengan satu tangan.
   - Respon taktil haptik (`navigator.vibrate`) saat memilih kandidat dan konfirmasi pilihan.

2. **Cek DPT Online Mandiri**:
   - Pencarian instan berdasarkan Nama Lengkap atau Nomor Pokok Anggota (NPA).
   - Menampilkan status keaktifan keanggotaan dan hak pilih (Belum Klaim, Sudah Klaim Token, atau Sudah Memilih).
   - Sensor alamat email untuk privasi data pemilih.

3. **Klaim Surat Suara ("Claim Surat Suara")**:
   - Validasi data anggota (Nama, NPA, Email aktif).
   - Menghasilkan kode unik token kriptografi 128-bit sekali pakai (Format: `IAGI-2026-XXXX-XXXX`).
   - Simulasi pengiriman email instan beserta tombol salin token & akses langsung ke bilik suara.

4. **Bilik Suara Digital (Vote Now) & Kertas Suara 3 Caketum**:
   - Akses via kode token atau Magic Link URL (`?code=...&npa=...`).
   - Kertas suara digital resmi menampilkan 3 Caketum IAGI dengan foto studio beresolusi tinggi, nomor urut, visi, misi, dan rekam jejak.
   - **Dual-Confirmation Pop-up (Mandat KPKU 14 September 2026)**:
     - Pop-up konfirmasi: *"Apakah Anda yakin untuk submit pilihan ini?"*
     - Pilihan **TIDAK**: kembali ke kertas suara digital untuk memilih kembali.
     - Pilihan **YA**: suara direkam secara permanen ke kotak suara berenkripsi.

5. **Integritas LUBER (Zero-Knowledge Decoupling)**:
   - Pemisahan identitas pemilih dengan kotak suara anonim (`Anonymous Ballot Box`).
   - Token langsung dihanguskan (burned) seketika suara direkam untuk mencegah pemilihan ganda.

6. **Tanda Terima Digital (Digital Receipt)**:
   - Bukti coblos digital resmi dengan SHA-256 Cryptographic Receipt Hash, tanggal/waktu, dan stempel digital KPKU.
   - Fitur cetak/simpan PDF langsung dari browser HP.

7. **KPKU Command Center (Admin Panel)**:
   - Akses aman dengan PIN Panitia (PIN Default: `2026`).
   - Monitoring partisipasi pemilu real-time (Turnout %).
   - **Mode Segel (Sealed Vault) vs Buka Segel Pleno (Unsealed Quick Count)**:
     - Selama pemilihan, tabulasi hasil suara terkunci demi menjaga objektivitas.
     - Dibuka secara transparan saat Sidang Pleno resmi dengan grafik interaktif.
   - Audit trail aktivitas pemungutan suara & fitur reset demo data untuk simulasi.

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

### Menggunakan Python (Built-in)
Jalankan perintah ini di terminal:
```bash
cd "/Users/wagyua5/Downloads/55TH_PIT_IAGI-GEOSEA_XIX_2026/PEMILU IAGI"
python3 -m http.server 8088
```
Buka browser di HP atau Laptop Anda:
👉 `http://localhost:8088` (atau IP lokal komputer Anda pada jaringan WiFi yang sama untuk dicoba langsung di HP).

### Menggunakan Node.js / NPX
```bash
cd "/Users/wagyua5/Downloads/55TH_PIT_IAGI-GEOSEA_XIX_2026/PEMILU IAGI"
npx -y serve -p 8088
```

---

## 🛡️ Kredensial Super Admin & KPKU Command Center

- **Nama**: `WAGYUA%`
- **Email**: `cingire687@gmail.com`
- **NPA**: `31052`
- **No. HP**: `085771593522`
- **Password**: `wagyua5`
- **PIN Keamanan 2FA**: `2026`
- **Kode OTP Sim**: `123456`

---

## 📱 Data Uji Coba (Demo Testing DPT)

Anda dapat menggunakan akun pemilih uji coba berikut untuk mencoba alur klaim dan pemungutan suara:
- **NPA**: `IAGI-2024-0001`
  - **Nama**: `Anggota Uji Coba IAGI`
  - **Email**: `pemilih@iagi.or.id`
- **NPA**: `IAGI-2024-0002`
  - **Nama**: `Geologist Muda Indonesia`
  - **Email**: `geologist@iagi.or.id`
- **PIN Admin KPKU**: `2026`

