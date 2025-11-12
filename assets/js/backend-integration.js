/**
 * Backend Integration Script
 * Menghubungkan Frontend Ant Arena dengan Backend API
 * 
 * @requires JavaScript ES6+
 * @requires Swiper (untuk carousel)
 */

// ============================================
// CONFIGURATION
// ============================================

// Auto-detect backend URL
function getBackendURL() {
  // Option 1: From data attribute in HTML
  const html = document.documentElement;
  if (html.dataset.backendUrl) {
    return html.dataset.backendUrl;
  }
  
  // Option 2: From localStorage
  const stored = localStorage.getItem('http://localhost/jadwal-ant-arena.test');
  if (stored) {
    return stored;
  }
  
  // Option 3: Auto-detect based on current domain
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost/jadwal-ant-arena';
  } else if (host.includes('.local')) {
    return `http://${host.replace('ant-arena', 'jadwal-ant-arena')}`;
  } else {
    // Production: assume same domain structure
    return `${window.location.protocol}//${host}/jadwal-ant-arena`;
  }
}

const BACKEND_URL = getBackendURL();

// ============================================
// 1. LOAD JADWAL DATA
// ============================================
async function loadJadwal() {
  try {
    const url = `${BACKEND_URL}/api-data.php?action=jadwal`;
    console.log('[Jadwal] Loading from:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[Jadwal] Response:', data);
    
    if (data.success && data.data.length > 0) {
      renderJadwal(data.data);
      console.log('[Jadwal] Successfully rendered', data.data.length, 'rows');
    } else {
      console.warn('[Jadwal] No data found:', data.message);
    }
  } catch (error) {
    console.error('[Jadwal] Error:', error.message);
    const tbody = document.getElementById('jadwalBody');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-danger text-center">Error loading jadwal: ${error.message}</td></tr>`;
    }
  }
}

function renderJadwal(jadwalData) {
  const tbody = document.getElementById('jadwalBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  jadwalData.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="time-slot">${escapeHtml(row.jam)}</td>
      <td>${row.senin ? escapeHtml(row.senin) : '<span class="text-success">Tersedia</span>'}</td>
      <td>${row.selasa ? escapeHtml(row.selasa) : '<span class="text-success">Tersedia</span>'}</td>
      <td>${row.rabu ? escapeHtml(row.rabu) : '<span class="text-success">Tersedia</span>'}</td>
      <td>${row.kamis ? escapeHtml(row.kamis) : '<span class="text-success">Tersedia</span>'}</td>
      <td>${row.jumat ? escapeHtml(row.jumat) : '<span class="text-success">Tersedia</span>'}</td>
      <td>${row.sabtu ? escapeHtml(row.sabtu) : '<span class="text-success">Tersedia</span>'}</td>
      <td>${row.minggu ? escapeHtml(row.minggu) : '<span class="text-success">Tersedia</span>'}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ============================================
// 2. LOAD JAM OPTIONS
// ============================================
async function loadJamOptions() {
  try {
    const url = `${BACKEND_URL}/api-reservasi.php?action=jam`;
    console.log('[Jam] Loading from:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[Jam] Response:', data);
    
    if (data.success && data.data.length > 0) {
      populateJamDropdown(data.data);
      console.log('[Jam] Populated with', data.data.length, 'options');
    } else {
      console.warn('[Jam] No jam data found');
    }
  } catch (error) {
    console.error('[Jam] Error:', error.message);
  }
}

function populateJamDropdown(jamOptions) {
  const jamSelect = document.getElementById('jam');
  if (!jamSelect) return;
  
  jamOptions.forEach(jam => {
    const option = document.createElement('option');
    option.value = jam;
    option.textContent = jam;
    jamSelect.appendChild(option);
  });
}

// ============================================
// 3. LOAD TESTIMONI
// ============================================
async function loadTestimoni() {
  try {
    const url = `${BACKEND_URL}/api-data.php?action=testimoni`;
    console.log('[Testimoni] Loading from:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[Testimoni] Response:', data);
    
    if (data.success && data.data.length > 0) {
      renderTestimoni(data.data);
      console.log('[Testimoni] Successfully rendered', data.data.length, 'items');
    } else {
      console.warn('[Testimoni] No testimoni found, using fallback');
      renderTestimoniPlaceholder();
    }
  } catch (error) {
    console.error('[Testimoni] Error:', error.message);
    renderTestimoniPlaceholder();
  }
}

function renderTestimoniPlaceholder() {
  const wrapper = document.getElementById('testimoniWrapper');
  if (!wrapper) return;
  
  wrapper.innerHTML = `
    <div class="swiper-slide">
      <div class="testimonial-item">
        <div class="row gy-4 justify-content-center">
          <div class="col-lg-6">
            <div class="testimonial-content">
              <p>
                <i class="bi bi-quote quote-icon-left"></i>
                <span>Belum ada testimoni tersedia. Jadilah yang pertama!</span>
                <i class="bi bi-quote quote-icon-right"></i>
              </p>
              <h3>Anda</h3>
              <div class="stars">
                <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTestimoni(testimoniData) {
  const wrapper = document.getElementById('testimoniWrapper');
  if (!wrapper) return;
  
  wrapper.innerHTML = '';
  
  testimoniData.forEach(item => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="testimonial-item">
        <div class="row gy-4 justify-content-center">
          <div class="col-lg-6">
            <div class="testimonial-content">
              <p>
                <i class="bi bi-quote quote-icon-left"></i>
                <span>${escapeHtml(item.pesan || '')}</span>
                <i class="bi bi-quote quote-icon-right"></i>
              </p>
              <h3>${escapeHtml(item.nama || 'Pengguna')}</h3>
              <div class="stars">
                ${renderStars(item.rating || 5)}
              </div>
            </div>
          </div>
          ${item.foto ? `<div class="col-lg-2 text-center">
            <img src="${escapeHtml(item.foto)}" class="img-fluid testimonial-img" alt="">
          </div>` : ''}
        </div>
      </div>
    `;
    wrapper.appendChild(slide);
  });
  
  // Re-initialize swiper setelah update
  if (window.Swiper) {
    const swiperEl = document.querySelector('#testimoniSwiper');
    if (swiperEl.swiper) {
      swiperEl.swiper.destroy();
    }
    initSwiperAgain();
  }
}

function renderStars(rating) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) {
      stars += '<i class="bi bi-star-fill"></i>';
    } else if (i < rating) {
      stars += '<i class="bi bi-star-half"></i>';
    } else {
      stars += '<i class="bi bi-star"></i>';
    }
  }
  return stars;
}

// ============================================
// 4. FORM RESERVASI HANDLER
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('[Init] Backend URL:', BACKEND_URL);
  
  const form = document.getElementById('reservasiForm');
  if (form) {
    form.addEventListener('submit', handleReservasiSubmit);
    console.log('[Init] Form handler attached');
  } else {
    console.warn('[Init] Form with ID "reservasiForm" not found');
  }
  
  // Set tanggal minimum ke hari ini
  const tanggalInput = document.getElementById('tanggal_mulai');
  if (tanggalInput) {
    tanggalInput.min = new Date().toISOString().split('T')[0];
    console.log('[Init] Tanggal min set to:', tanggalInput.min);
  }
  
  // Load data saat page load
  console.log('[Init] Starting data load...');
  loadJadwal();
  loadJamOptions();
  loadTestimoni();
});

async function handleReservasiSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const loadingEl = form.querySelector('.loading');
  const errorEl = form.querySelector('.error-message');
  const successEl = form.querySelector('.sent-message');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  console.log('[Submit] Form submitted');
  
  // Reset messages
  if (loadingEl) loadingEl.style.display = 'block';
  if (errorEl) errorEl.style.display = 'none';
  if (successEl) successEl.style.display = 'none';
  submitBtn.disabled = true;
  
  try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log('[Submit] Form data:', data);
    
    // Validasi tanggal
    const tanggalInput = new Date(data.tanggal_mulai);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (tanggalInput < today) {
      throw new Error('Tanggal tidak boleh lewat');
    }
    
    const url = `${BACKEND_URL}/api-reservasi.php`;
    console.log('[Submit] Posting to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    console.log('[Submit] Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('[Submit] Response data:', result);
    
    if (result.success) {
      if (successEl) successEl.style.display = 'block';
      if (errorEl) errorEl.style.display = 'none';
      
      console.log('[Submit] Success! Reservation ID:', result.data?.id);
      
      // Reset form
      form.reset();
      
      // Scroll to success message
      setTimeout(() => {
        successEl?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      throw new Error(result.message || 'Terjadi kesalahan');
    }
  } catch (error) {
    console.error('[Submit] Error:', error.message);
    if (errorEl) {
      errorEl.textContent = error.message || 'Terjadi kesalahan saat mengirim data';
      errorEl.style.display = 'block';
    }
  } finally {
    if (loadingEl) loadingEl.style.display = 'none';
    submitBtn.disabled = false;
  }
}

// ============================================
// 5. UTILITY FUNCTIONS
// ============================================
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Re-initialize swiper
function initSwiperAgain() {
  if (typeof Swiper !== 'undefined') {
    document.querySelectorAll('.init-swiper').forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector('.swiper-config').innerHTML.trim()
      );
      
      if (!swiperElement.swiper) {
        new Swiper(swiperElement, config);
      }
    });
  }
}

// ============================================
// 6. REALTIME UPDATES (Optional: Refresh setiap 5 menit)
// ============================================
setInterval(function() {
  loadJadwal(); // Update jadwal setiap 5 menit
}, 5 * 60 * 1000);


// ============================================
// 7. LOAD FASILITAS AND GALERI
// ============================================
async function loadFasilitas() {
    const wrapper = document.getElementById('fasilitasWrapper');
    if (!wrapper) return;

    try {
        const response = await fetch('jadwal-ant-arena/api-data.php?action=get_fasilitas');
        if (!response.ok) {
            throw new Error('Gagal memuat data fasilitas');
        }
        
        const fasilitas = await response.json();
        
        if (fasilitas.length > 0) {
            wrapper.innerHTML = ''; // Kosongkan placeholder
            fasilitas.forEach(item => {
                const slide = `
                <div class="swiper-slide event-item d-flex flex-column justify-content-end" style="background-image: url(${item.foto_url})">
                    <h3>${item.nama}</h3>
                    <p class="description">${item.deskripsi}</p>
                </div>`;
                wrapper.innerHTML += slide;
            });

            // Re-inisialisasi Swiper untuk Fasilitas
            // (Asumsi: main.js tidak otomatis mendeteksi perubahan ini)
            new Swiper('#fasilitas .swiper', {
                loop: true,
                speed: 600,
                autoplay: { delay: 5000 },
                slidesPerView: 'auto',
                pagination: {
                    el: '#fasilitas .swiper-pagination',
                    type: 'bullets',
                    clickable: true
                },
                breakpoints: {
                    320: { slidesPerView: 1, spaceBetween: 40 },
                    1200: { slidesPerView: 3, spaceBetween: 1 }
                }
            });

        } else {
            wrapper.innerHTML = '<div class="swiper-slide"><p>Belum ada data fasilitas.</p></div>';
        }

    } catch (error) {
        console.error('Error memuat fasilitas:', error);
        wrapper.innerHTML = '<div class="swiper-slide"><p>Gagal memuat fasilitas. Coba lagi nanti.</p></div>';
    }
}

/**
 * Memuat data galeri dari API dan menampilkannya di Swiper.
 */
async function loadGaleri() {
    const wrapper = document.getElementById('galeriWrapper');
    if (!wrapper) return;

    try {
        const response = await fetch('jadwal-ant-arena/api-data.php?action=get_galeri');
        if (!response.ok) {
            throw new Error('Gagal memuat data galeri');
        }

        const galeri = await response.json();

        if (galeri.length > 0) {
            wrapper.innerHTML = ''; // Kosongkan placeholder
            galeri.forEach(imgUrl => {
                const slide = `
                <div class="swiper-slide">
                    <a class="glightbox" data-gallery="images-gallery" href="${imgUrl}">
                        <img src="${imgUrl}" class="img-fluid" alt="Galeri Ant Arena">
                    </a>
                </div>`;
                wrapper.innerHTML += slide;
            });

            // Re-inisialisasi Swiper untuk Galeri
            new Swiper('#galeri .swiper', {
                loop: true,
                speed: 600,
                autoplay: { delay: 5000 },
                slidesPerView: 'auto',
                centeredSlides: true,
                pagination: {
                    el: '#galeri .swiper-pagination',
                    type: 'bullets',
                    clickable: true
                },
                breakpoints: {
                    320: { slidesPerView: 1, spaceBetween: 20 },
                    768: { slidesPerView: 2, spaceBetween: 30 },
                    1200: { slidesPerView: 3, spaceBetween: 30 }
                }
            });
            
            // Re-inisialisasi Glightbox (jika main.js tidak melakukannya)
            // Anda mungkin perlu menyesuaikan pemanggilan ini
            if (typeof GLightbox === 'function') {
                GLightbox({ selector: '.glightbox' });
            }

        } else {
            wrapper.innerHTML = '<div class="swiper-slide"><p>Belum ada foto di galeri.</p></div>';
        }

    } catch (error) {
        console.error('Error memuat galeri:', error);
        wrapper.innerHTML = '<div class="swiper-slide"><p>Gagal memuat galeri. Coba lagi nanti.</p></div>';
    }
}