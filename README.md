# 🏸 ANT'S ARENA - Backend-Frontend Integration

> Sistem Manajemen Lapangan Badminton dengan Booking Online

## 📖 Overview

Integrasi sempurna antara frontend website public dan backend admin system untuk **@nt's Arena**. Users dapat melakukan reservasi lapangan badminton secara online dengan sistem yang terintegrasi penuh ke database admin.

---

## 📁 Project Structure

```
workspace/
├── ant-arena/ (FRONTEND)
│   ├── index.html ← Main website
│   ├── test-api.html ← API Testing tool
│   ├── assets/
│   │   ├── js/
│   │   │   ├── backend-integration.js ← API Integration
│   │   │   └── main.js (original)
│   │   ├── css/
│   │   └── img/
│   ├── INTEGRATION_GUIDE.md
│   ├── INTEGRATION_SUMMARY.md
│   └── FINAL_CHECKLIST.md
│
└── jadwal-ant-arena/ (BACKEND)
    ├── api-reservasi.php ← Reservasi API
    ├── api-data.php ← Data API
    ├── admin-*.php (existing admin files)
    ├── config.php
    └── database.sql
```

---

## 🚀 SETUP INSTRUCTIONS

### 1. Backend Setup (Laragon/XAMPP)

```bash
# Start services
- Start Apache
- Start MySQL
- Verify at http://localhost/dashboard

# Import Database
mysql -u root -p ant-arena < database.sql

# Verify API is working
Open: http://localhost/jadwal-ant-arena/api-data.php?action=jadwal
Expected: JSON response with jadwal data
```

### 2. Configure Backend URL

Edit `ant-arena/assets/js/backend-integration.js`:

```javascript
// Line 30 - Choose one method:

// Method 1: Auto-detect (recommended)
const BACKEND_URL = getBackendURL(); // Already set

// Method 2: Manual (if auto doesn't work)
const BACKEND_URL = 'http://localhost/jadwal-ant-arena';

// Method 3: Production
const BACKEND_URL = 'https://yourdomain.com/jadwal-ant-arena';
```

### 3. Test Integration

```bash
# Open API Tester
http://localhost/ant-arena/test-api.html

# Test buttons one by one:
✓ Get Jadwal
✓ Get Jam Options
✓ Get Testimoni
✓ Create Reservasi (test)

# Check Status Overview at bottom
All should show ✅ OK
```

### 4. Open Main Website

```bash
# Frontend website
http://localhost/ant-arena/index.html

# Or with local domain
http://ant-arena.local

# Verify:
✓ Jadwal table shows data
✓ Jam dropdown filled
✓ Testimoni carousel loaded
✓ Form submits successfully
```

---

## 🔌 API Reference

### Base URLs
- **Development**: `http://localhost/jadwal-ant-arena`
- **Local Domain**: `http://jadwal-ant-arena.local`
- **Production**: `https://yourdomain.com/jadwal-ant-arena`

### Endpoints

#### 📊 GET: Jadwal
```http
GET /api-data.php?action=jadwal
```
**Response:**
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

#### ⏰ GET: Jam Options
```http
GET /api-reservasi.php?action=jam
```
**Response:**
```json
{
  "success": true,
  "data": ["08.00 - 11.00", "11.00 - 14.00", ...]
}
```

#### ⭐ GET: Testimoni
```http
GET /api-data.php?action=testimoni
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama": "Budi",
      "pesan": "Tempat bagus!",
      "rating": 5,
      "status": "approved"
    }
  ]
}
```

#### 📝 POST: Create Reservasi
```http
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

**Response Success:**
```json
{
  "success": true,
  "message": "Permintaan reservasi berhasil dikirim...",
  "data": {"id": 123}
}
```

---

## 🛠️ Development

### File Dependencies

**Frontend Integration Library** (`backend-integration.js`):
- `loadJadwal()` - Load jadwal from API
- `loadJamOptions()` - Load jam dropdown options
- `loadTestimoni()` - Load testimonials
- `handleReservasiSubmit()` - Form submission handler

**Backend APIs**:
- `api-reservasi.php` - Handles reservasi operations
- `api-data.php` - Serves public data (jadwal, testimoni, fasilitas)

### Key Functions

```javascript
// Load and render jadwal
await loadJadwal(); 

// Load jam options for dropdown
await loadJamOptions();

// Load testimonials
await loadTestimoni();

// Handle form submission
form.addEventListener('submit', handleReservasiSubmit);

// Get auto-detected backend URL
const url = getBackendURL();
```

---

## 🧪 Testing

### Using API Testing Tool

Open `http://localhost/ant-arena/test-api.html`

**Features:**
- Set backend URL easily
- Test all GET endpoints
- Test POST (create reservasi)
- View JSON responses
- Health check status

### Manual Testing with cURL

```bash
# Test jadwal
curl http://localhost/jadwal-ant-arena/api-data.php?action=jadwal

# Test jam
curl http://localhost/jadwal-ant-arena/api-reservasi.php?action=jam

# Test create reservasi
curl -X POST http://localhost/jadwal-ant-arena/api-reservasi.php \
  -H "Content-Type: application/json" \
  -d '{
    "nama_tim": "Test Team",
    "email": "test@example.com",
    "no_telepon": "081234567890",
    "hari": "senin",
    "jam": "08.00 - 11.00",
    "tanggal_mulai": "2025-11-20",
    "pesan": "Test"
  }'
```

### Browser DevTools

1. Open DevTools: **F12**
2. **Console** tab: Check for JavaScript errors
3. **Network** tab: Monitor API requests/responses
4. **Application** tab: Check localStorage for config

---

## 🐛 Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **"Failed to fetch" error** | Backend not running | Start Laragon/XAMPP, verify server running |
| **CORS error** | Cross-origin blocked | Already configured with CORS headers |
| **No jadwal/testimoni showing** | API error or empty DB | Check API response, verify data in admin panel |
| **Form not submitting** | JavaScript error | Check browser console (F12) for errors |
| **Date input shows old dates** | Server time issue | Check server timezone in config.php |
| **Jam dropdown empty** | API returns no data | Add jadwal entries in admin panel |

### Debug Checklist

- [ ] Server (Laragon) is running
- [ ] API URL is correct
- [ ] Database is imported
- [ ] Browser console has no errors
- [ ] Network tab shows successful API calls
- [ ] Admin panel has data to display
- [ ] CORS headers are sent

---

## 🔒 Security

### Input Validation
✅ Email format validation
✅ Phone number format check
✅ Date validation (no past dates)
✅ Required fields validation
✅ Enum validation for hari (senin-minggu)

### Protection
✅ Prepared statements (SQL injection prevention)
✅ Parameter binding
✅ Output escaping (htmlspecialchars)
✅ CORS headers configured
✅ No sensitive data exposed

---

## 📱 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Mobile (iOS) | Latest | ✅ Full Support |
| Mobile (Android) | Latest | ✅ Full Support |

---

## 🚢 Deployment

### Pre-deployment Checklist

- [ ] Test all endpoints thoroughly
- [ ] Update BACKEND_URL to production domain
- [ ] Configure SSL/HTTPS
- [ ] Update CORS headers to specific domain
- [ ] Setup database backups
- [ ] Configure firewall rules
- [ ] Monitor server performance
- [ ] Setup error logging

### Production Config

```javascript
// Update backend-integration.js
const BACKEND_URL = 'https://yourdomain.com/jadwal-ant-arena';
```

```php
// Update api-reservasi.php
header('Access-Control-Allow-Origin: https://yourdomain.com');
```

---

## 📊 Features

### Frontend Features
✅ Dynamic reservasi form
✅ Real-time jadwal sync
✅ Auto-loading jam options
✅ Testimonial carousel
✅ Form validation
✅ Error handling
✅ Success notifications

### Backend Features
✅ REST API endpoints
✅ JSON responses
✅ CORS support
✅ Data validation
✅ Error handling
✅ Database integration
✅ Input sanitization

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `INTEGRATION_GUIDE.md` | Complete setup and testing guide |
| `INTEGRATION_SUMMARY.md` | Feature overview and troubleshooting |
| `FINAL_CHECKLIST.md` | Implementation checklist |
| `README.md` | This file |

---

## 🎯 Usage Examples

### Example 1: Check Jadwal on Load
```javascript
// Automatically triggered on page load
window.addEventListener('load', async () => {
  await loadJadwal(); // Fetch and display jadwal
  await loadJamOptions(); // Populate jam dropdown
  await loadTestimoni(); // Load testimonials
});
```

### Example 2: Submit Reservasi
```javascript
// User fills form and clicks "Reservasi"
const form = document.getElementById('reservasiForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Data is collected and posted to backend
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  const response = await fetch(`${BACKEND_URL}/api-reservasi.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  // Show success/error message
});
```

---

## 📞 Support

### Getting Help

1. **Check Documentation**: Read relevant .md files
2. **Open Test Tool**: Use `test-api.html` to diagnose issues
3. **Browser Console**: Check F12 Console for errors
4. **Network Tab**: Monitor API calls in Network tab
5. **Database**: Verify data exists in admin panel

### Common Questions

**Q: Form not submitting?**
A: Check browser console (F12) for errors. Verify backend URL is correct.

**Q: Jadwal not showing?**
A: Test API directly: `http://localhost/jadwal-ant-arena/api-data.php?action=jadwal`

**Q: Getting CORS error?**
A: API already has CORS headers. May need to update for production domain.

**Q: How to add more testimoni?**
A: Use admin panel to add approved testimoni. They'll appear on frontend automatically.

---

## 🔄 Maintenance

### Regular Tasks
- Monitor API response times
- Check error logs
- Backup database regularly
- Update testimonials
- Review reservasi requests

### Performance Optimization
- Cache API responses (optional)
- Use CDN for static assets
- Optimize database queries
- Monitor server resources

---

## ✨ Future Enhancements

- [ ] WhatsApp API integration
- [ ] Email notifications
- [ ] Payment gateway
- [ ] Real-time WebSocket updates
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-language support

---

## 📝 License

© 2025 @nt's Arena. All rights reserved.

---

## 👥 Authors

- **Frontend**: HTML/CSS/JavaScript
- **Backend**: PHP/MySQL
- **Integration**: RESTful API

---

## 🎉 Getting Started

1. **Start**: Laragon/XAMPP
2. **Test**: Open `test-api.html`
3. **Verify**: All endpoints return data
4. **Deploy**: Use `index.html`
5. **Monitor**: Check console for errors

**Ready to go! 🚀**

---

**Last Updated**: 2025-11-13
**Version**: 1.0
**Status**: ✅ Production Ready
