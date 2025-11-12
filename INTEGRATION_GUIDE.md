# PANDUAN INTEGRASI BACKEND-FRONTEND ANT ARENA

## 📋 Overview
Integrasi Backend-Frontend menghubungkan website public (`index.html`) dengan sistem admin (`jadwal-ant-arena/`) menggunakan REST API.

---

## 🔧 SETUP AWAL

### 1. **Konfigurasi URL Backend**
Buka file `assets/js/backend-integration.js` dan update URL backend:

```javascript
const BACKEND_URL = 'http://localhost/jadwal-ant-arena'; // Sesuaikan dengan URL Anda
```

Kemungkinan URL:
- Local: `http://localhost/jadwal-ant-arena`
- Laragon: `http://jadwal-ant-arena.test`
- Production: `https://yourdomain.com/jadwal-ant-arena`

### 2. **Pastikan Database Terinstall**
```sql
-- Buka file database.sql di backend dan jalankan:
mysql -u root -p ant-arena < database.sql
```

### 3. **CORS Configuration (Jika Frontend di URL berbeda)**
File `api-reservasi.php` dan `api-data.php` sudah memiliki CORS headers:
```php
header('Access-Control-Allow-Origin: *');
```

Untuk production, ganti `*` dengan URL frontend yang spesifik.

---

## 🌐 ENDPOINTS API

### A. **Reservasi API** (`api-reservasi.php`)

#### GET - Track Reservasi
```
GET /api-reservasi.php?action=track&q=email@example.com
```
Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama_tim": "Tim Garuda",
      "email": "tim@example.com",
      "no_telepon": "081234567890",
      "hari": "senin",
      "jam": "08.00 - 11.00",
      "tanggal_mulai": "2025-11-20",
      "status": "pending",
      "created_at": "2025-11-13 10:30:00"
    }
  ]
}
```

#### GET - Ambil Jam Options
```
GET /api-reservasi.php?action=jam
```
Response:
```json
{
  "success": true,
  "data": ["08.00 - 11.00", "11.00 - 14.00", "14.00 - 17.00", ...]
}
```

#### GET - Ambil Jadwal
```
GET /api-reservasi.php?action=jadwal
```

#### POST - Buat Reservasi Baru
```
POST /api-reservasi.php
Content-Type: application/json

{
  "nama_tim": "Tim Garuda",
  "email": "tim@example.com",
  "no_telepon": "081234567890",
  "hari": "senin",
  "jam": "08.00 - 11.00",
  "tanggal_mulai": "2025-11-20",
  "pesan": "Catatan tambahan"
}
```

Response Success:
```json
{
  "success": true,
  "message": "Permintaan reservasi berhasil dikirim. Status: pending. Admin akan mengonfirmasi.",
  "data": {"id": 123}
}
```

---

### B. **Data API** (`api-data.php`)

#### GET - Jadwal
```
GET /api-data.php?action=jadwal
```
Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "jam": "08.00 - 11.00",
      "senin": "Tim Garuda",
      "selasa": null,
      "rabu": null,
      ...
    }
  ]
}
```

#### GET - Testimoni
```
GET /api-data.php?action=testimoni
```
Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama": "Budi Santoso",
      "pesan": "Tempatnya bersih dan nyaman!",
      "rating": 5,
      "foto": "path/to/image.jpg",
      "status": "approved"
    }
  ]
}
```

#### GET - Fasilitas
```
GET /api-data.php?action=fasilitas
```

---

## 🧪 TESTING

### Test 1: Cek Jadwal di Frontend
1. Buka `http://localhost/ant-arena/index.html`
2. Scroll ke section **"Jadwal"**
3. Tabel harus menampilkan data dari database backend
4. Jika error, buka browser console (F12) lihat error message

### Test 2: Submit Reservasi
1. Scroll ke section **"Reservasi"**
2. Isi form dengan data:
   - Nama Tim: `Test Team`
   - Email: `test@example.com`
   - No. Telepon: `081234567890`
   - Hari: `Senin`
   - Jam: (pilih dari dropdown)
   - Tanggal: (besok atau lebih)
3. Klik "Reservasi"
4. Pesan sukses harus muncul
5. Check di admin panel: `http://localhost/jadwal-ant-arena/admin-login.php`

### Test 3: Lihat Testimoni
1. Buka admin panel
2. Tambah testimoni baru
3. Refresh frontend
4. Testimoni baru harus tampil di section testimoni

### Test 4: Browser Console Check
1. Buka DevTools (F12)
2. Lihat Console tab
3. Tidak boleh ada error (HTTP 404, CORS error, etc)
4. Jika ada error, perbaiki URL backend di `backend-integration.js`

---

## 🐛 TROUBLESHOOTING

### Error 1: "Failed to fetch"
**Penyebab**: URL backend salah atau backend tidak running
**Solusi**:
1. Cek URL di `backend-integration.js`
2. Pastikan server PHP (Laragon) running
3. Test di browser: `http://localhost/jadwal-ant-arena/api-data.php?action=jadwal`

### Error 2: "CORS error"
**Penyebab**: Frontend & Backend di domain berbeda
**Solusi**: API sudah punya CORS headers, jika masih error cek file `api-reservasi.php` line 3

### Error 3: Jadwal tidak loading
**Penyebab**: Database kosong atau tabel tidak ada
**Solusi**:
1. Login ke admin panel
2. Setup jadwal di menu "Jadwal"
3. Refresh frontend

### Error 4: Form submit tidak bekerja
**Penyebab**: JavaScript error atau form HTML mismatch
**Solusi**:
1. Buka F12 > Console
2. Lihat error yang muncul
3. Pastikan `<form id="reservasiForm">` ada di HTML
4. Pastikan `backend-integration.js` sudah di-load (lihat Network tab)

---

## 📝 FORM FIELD MAPPING

### Frontend Form ↔ Backend Database

| Frontend | Backend Column | Type | Validasi |
|----------|-----------------|------|----------|
| nama_tim | nama_tim | string | Required, max 100 |
| email | email | email | Required, valid email |
| no_telepon | no_telepon | string | Required, 8-20 chars |
| hari | hari | enum | Required, senin-minggu |
| jam | jam | string | Required, dari jadwal |
| tanggal_mulai | tanggal_mulai | date | Required, >= today |
| pesan | pesan | text | Optional |

---

## 🔄 DATA FLOW

```
Frontend (index.html)
    ↓
[Form Submit]
    ↓
backend-integration.js
    ↓
api-reservasi.php (POST)
    ↓
MySQL Database (reservasi table)
    ↓
Admin Panel (Review & Approve/Reject)
    ↓
Admin Confirm via WhatsApp/Email
```

---

## 📱 FITUR-FITUR

### ✅ Sudah Diimplementasikan:
- [x] Fetch Jadwal dari Backend
- [x] Submit Reservasi ke Backend
- [x] Load Testimoni dari Backend
- [x] Load Jam Options dinamis
- [x] Form Validasi
- [x] Real-time update jadwal (setiap 5 menit)
- [x] CORS headers untuk cross-domain

### 🔲 Optional/Future:
- [ ] Live notification untuk admin
- [ ] Email confirmation automatic
- [ ] SMS notification via WhatsApp API
- [ ] Real-time availability check
- [ ] Payment gateway integration

---

## 🚀 DEPLOYMENT

### Production Setup:
1. Update `BACKEND_URL` di `backend-integration.js` ke URL production
2. Update CORS headers: ganti `*` dengan frontend URL
3. Ensure SSL/HTTPS di kedua frontend & backend
4. Setup environment variables untuk database

### Contoh Production:
```javascript
const BACKEND_URL = 'https://antarena.com/admin';
```

---

## 📞 SUPPORT

Jika ada error atau issue:
1. Cek browser console (F12)
2. Lihat network tab untuk request/response
3. Check PHP error logs di backend
4. Pastikan database connected

---

Generated: 2025-11-13
Version: 1.0
