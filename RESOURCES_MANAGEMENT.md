# Seminar Resources Management

Fitur ini memungkinkan admin untuk mengelola file-file resources untuk seminar seperti template presentasi dan guidelines yang dapat didownload oleh user dari landing page.

## Fitur yang Ditambahkan

### 1. Database Setup
- Menambahkan setting `resources` ke dalam tabel `landing_page_settings`
- Format JSON array dengan 3 resource default:
  - Oral Presentation Template
  - Poster Presentation Template  
  - Seminar Guidelines

### 2. Backend (Laravel)

#### Controller Method Baru
File: `app/Http/Controllers/LandingPageSettingController.php`

**`uploadResourceFile(Request $request)`**
- Handle upload file untuk resources
- Validasi: PDF, PPT, PPTX, DOC, DOCX, TXT (max 10MB)
- Upload ke: `public/storage/resources/`
- Update database dengan file path baru
- Delete file lama otomatis

#### Route Baru
File: `routes/web.php`

```php
Route::post('/settings/upload-resource-file', [LandingPageSettingController::class, 'uploadResourceFile'])
    ->name('settings.uploadResourceFile');
```

### 3. Frontend (React)

#### Admin Settings Page
File: `resources/js/Pages/Admin/Settings.jsx`

**State Baru:**
```javascript
const [resources, setResources] = useState(resourcesData);
```

**Upload Handler:**
```javascript
handleResourceFileChange(e, index)
```
- Validasi file type dan size
- Upload via FormData ke backend
- Reload page setelah sukses

**UI Section:**
- Card untuk setiap resource
- Button "Upload New File"
- Display current filename
- Support multiple file types

#### Landing Page
File: `resources/js/Pages/LandingPage.jsx`

**Update:**
- Fetch resources dari API `/api/landing-settings`
- Dynamic rendering berdasarkan database
- Fallback ke default files jika belum ada di database
- Download button untuk setiap resource

### 4. Directory Structure

```
public/
├── storage/
│   └── resources/         # Directory untuk uploaded files
└── templates/              # Default template files
    ├── oral-template.pptx
    ├── poster-template.pptx
    └── seminar-template.txt
```

## Cara Penggunaan

### Untuk Admin:

1. **Login sebagai Admin**
   - Buka `/admin/settings`

2. **Upload Resource File**
   - Scroll ke section "Seminar Resources"
   - Klik "Upload New File" pada resource yang ingin diupdate
   - Pilih file (PDF, PPT, PPTX, DOC, DOCX, atau TXT)
   - File akan diupload dan halaman akan reload otomatis

3. **File yang Diupload**
   - File lama akan dihapus otomatis
   - File baru tersimpan di `/public/storage/resources/`
   - Nama file: `timestamp_index.extension`

### Untuk User:

1. **Akses Landing Page**
   - Buka `/` atau homepage

2. **Download Resources**
   - Scroll ke section "Seminar Resources"
   - Klik button "Download" pada resource yang diinginkan
   - File akan terdownload otomatis

## Setup Awal

Jalankan script untuk menambahkan resource settings ke database:

```bash
php add-resources-setting.php
```

Script ini akan membuat setting baru dengan 3 resources default yang mengarah ke file di folder `/public/templates/`.

## File-File yang Dimodifikasi

1. `app/Http/Controllers/LandingPageSettingController.php` - Tambah upload method
2. `routes/web.php` - Tambah route upload
3. `resources/js/Pages/Admin/Settings.jsx` - Tambah UI & handler
4. `resources/js/Pages/LandingPage.jsx` - Dynamic resources rendering
5. `add-resources-setting.php` - Setup script (new)

## Keamanan

- **File Validation**: Hanya file tertentu yang diizinkan
- **Size Limit**: Maximum 10MB per file
- **Path Protection**: File disimpan di public/storage (web accessible)
- **Auto Cleanup**: File lama dihapus otomatis saat upload baru

## Troubleshooting

### File Upload Gagal
- Pastikan directory `public/storage/resources/` exists dan writable
- Check file size < 10MB
- Check file extension valid (pdf, ppt, pptx, doc, docx, txt)

### Resources Tidak Muncul
- Pastikan script `add-resources-setting.php` sudah dijalankan
- Check database table `landing_page_settings` ada row dengan key='resources'
- Clear browser cache

### Download File Tidak Berfungsi
- Pastikan file path di database valid
- Check file exists di folder `public/storage/resources/` atau `public/templates/`

## API Endpoint

**GET `/api/landing-settings`**
- Return semua settings termasuk resources
- Format JSON
- Public access (no auth required)

**POST `/admin/settings/upload-resource-file`**
- Upload resource file
- Requires admin authentication
- Parameters:
  - `file`: File to upload
  - `index`: Resource index (0, 1, or 2)

## Future Enhancements

- [ ] Tambah/hapus resource secara dynamic
- [ ] Edit title dan description resource
- [ ] File preview sebelum download
- [ ] Download statistics tracking
- [ ] Multiple files per resource
- [ ] Resource categories
