// =========================
// Tailwind Config
// =========================
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-fixed-dim": "#a6c8ff",
        "primary": "#a6c8ff",
        "on-primary": "#00315f",
        "surface-bright": "#353a3f",
        "secondary": "#e9c349",
        "secondary-container": "#af8d11",
        "surface-container-low": "#171c21",
        "outline-variant": "#434750",
        "inverse-on-surface": "#2c3137",
        "surface-container-highest": "#30353b",
        "on-error": "#690005",
        "on-tertiary-fixed": "#1a1c1d",
        "inverse-primary": "#355f97",
        "on-secondary-fixed-variant": "#574500",
        "surface-container-high": "#252a30",
        "inverse-surface": "#dee3ea",
        "surface-dim": "#0f1419",
        "tertiary-fixed-dim": "#c6c6c8",
        "secondary-fixed": "#ffe088",
        "surface-tint": "#a6c8ff",
        "surface-container": "#1b2025",
        "on-tertiary-container": "#999a9c",
        "on-secondary-container": "#342800",
        "surface-container-lowest": "#0a0f14",
        "tertiary": "#c6c6c8",
        "error": "#ffb4ab",
        "on-secondary-fixed": "#241a00",
        "primary-container": "#003261",
        "outline": "#8e909b",
        "tertiary-container": "#303234",
        "tertiary-fixed": "#e2e2e4",
        "error-container": "#93000a",
        "surface": "#0f1419",
        "on-error-container": "#ffdad6",
        "secondary-fixed-dim": "#e9c349",
        "on-tertiary-fixed-variant": "#454749",
        "on-background": "#dee3ea",
        "background": "#0f1419",
        "on-primary-fixed-variant": "#18477e",
        "on-primary-fixed": "#001c3b",
        "on-secondary": "#3c2f00",
        "on-surface": "#dee3ea",
        "on-tertiary": "#2f3132",
        "on-primary-container": "#739bd7",
        "primary-fixed": "#d5e3ff",
        "on-surface-variant": "#c4c6d2",
        "surface-variant": "#30353b"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body": ["Inter"],
        "label": ["Inter"]
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      }
    }
  }
};


// =========================
// DOM Ready
// =========================
document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // Modal Trigger
  // =========================
  const heroButton = document.querySelector("button.liquid-gradient");
  const modal = document.getElementById("info-modal");

  if (heroButton && modal) {
    heroButton.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  }

  // =========================
  // Close Modal (overlay click)
  // =========================
  const overlay = modal?.querySelector(".absolute.inset-0");
  if (overlay) {
    overlay.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // =========================
  // Update Year
  // =========================
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});

// =========================
// Load Listings + Details Modal
// =========================
let condosData = [];
let currentImageIndex = 0;

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    condosData = data;                     // เก็บข้อมูลไว้ใช้ใน modal
    const container = document.getElementById("listings");

const sortedData = data.sort((a, b) => (a.is_sold === b.is_sold ? 0 : a.is_sold ? 1 : -1));

sortedData.forEach(item => {
      // 1. ดึง Path โฟลเดอร์ (ถ้าไม่มีให้เป็นค่าว่าง)
      const folderPath = item.folder || "";

      // 2. หาชื่อไฟล์รูปภาพ: 
      // - ถ้ามี item.image (แบบไม่มี s) ให้ใช้ตัวนั้น
      // - แต่ถ้าไม่มี ให้ไปดึงรูปแรกจากรายการ item.images[0] (แบบมี s) มาใช้แทน
      let fileName = item.image || (item.images && item.images.length > 0 ? item.images[0] : "");

      // 3. รวมร่าง Path กับชื่อไฟล์
      // ถ้า fileName มีคำว่า "img/" อยู่แล้ว ให้ใช้ค่านั้นเลย (สำหรับ ID 5-6)
      // ถ้าไม่มี ให้เอา folderPath มาแปะข้างหน้า (สำหรับ ID 1-4)
      const fullImagePath = fileName.includes("img/") ? fileName : folderPath + fileName;

        // 1. เตรียมสถานะ (วางไว้ก่อน const card)
        const isSold = item.is_sold === true; 
        const soldOverlay = isSold ? 'grayscale opacity-50' : ''; // ถ้าขายแล้วให้รูปเป็นขาวดำและจางลง
        const soldPointer = isSold ? 'pointer-events-none' : ''; // ถ้าขายแล้วจะกดที่ตัวการ์ดไม่ได้
        
        const card = `
          <div class="bg-surface-container-low rounded-xl overflow-hidden group hover:translate-y-[-4px] transition-all duration-500 shadow-2xl ${soldPointer}">
            <div class="relative aspect-[4/3] overflow-hidden">
              
              ${isSold ? `
                <div class="absolute inset-0 flex items-center justify-center z-20">
                  <span class="bg-red-600 text-white px-8 py-2 rounded-lg font-black text-3xl border-4 border-white rotate-[-12deg] shadow-2xl tracking-tighter">
                    SOLD
                  </span>
                </div>
              ` : ''}
        
              <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${soldOverlay}" 
                   src="${fullImagePath}" loading="lazy" />
              
              ${item.badges.map((b, i) => `
                <div class="absolute ${i === 0 ? 'top-4' : 'bottom-4'} left-4 bg-${i === 0 ? 'primary' : 'secondary'}/90 text-on-${i === 0 ? 'primary' : 'secondary'} text-[0.65rem] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  ${b}
                </div>
              `).join("")}
            </div>
        
            <div class="p-8 space-y-4">
              <div class="space-y-1">
                <div class="font-headline text-3xl font-extrabold ${isSold ? 'text-on-surface-variant' : 'text-primary'} tracking-tight">
                  ฿${item.price_thb.toLocaleString()}
                </div>
                <div class="text-on-surface-variant font-label text-sm tracking-wide">
                  Approx. $${item.price_usd.toLocaleString()} USD
                </div>
              </div>
        
              <div class="space-y-1">
                <h3 class="font-headline text-xl font-bold truncate text-on-surface">
                  ${item.title}
                </h3>
                <p class="text-on-surface-variant text-sm truncate font-body">
                  ${item.size} m² ${item.bedroom}BR near ${item.nearby} in ${item.location}
                </p>
              </div>
        
              <button data-id="${item.id}" 
                      ${isSold ? 'disabled' : ''}
                      class="${isSold ? 'bg-surface-container-highest opacity-50 cursor-not-allowed' : 'more-details-btn hover:bg-surface-container-highest/60'} w-full glass-card border border-outline-variant/20 text-on-surface py-4 rounded-xl font-semibold inner-glow transition-colors mt-4">
                ${isSold ? 'SOLD OUT' : 'More Details'}
              </button>
            </div>
          </div>
        `;

      container.innerHTML += card;
    });

    // ======================
    // Event Delegation สำหรับ More Details
    // ======================
    container.addEventListener("click", function(e) {
      const btn = e.target.closest(".more-details-btn");
      if (btn) {
        const id = parseInt(btn.getAttribute("data-id"));
        const condo = condosData.find(item => item.id === id);
        if (condo) showCondoDetails(condo);
      }
    });
  })
  .catch(err => console.error("โหลด JSON ไม่ได้:", err));

// ======================
// Functions สำหรับ Modal
// ======================
function showCondoDetails(item) {
  const modal = document.getElementById("details-modal");
  const body = document.getElementById("modal-body");

  const folderPath = item.folder || "";
  const images = item.images
    ? item.images.map(img => folderPath + img)
    : [item.image];

  const badgesHTML = item.badges.map((b, i) => `
    <span class="text-[0.65rem] font-bold px-2 py-1 rounded border ${i === 0
      ? 'bg-primary/10 text-primary border-primary/20'
      : 'bg-secondary/10 text-secondary border-secondary/20'}">
      ${b}
    </span>`).join('');

  const electricalHTML = item.electrical ? `
    <div class="space-y-3">
      <h4 class="font-headline font-bold text-lg flex items-center gap-2 text-on-surface">
        <i class="bi bi-plug-fill text-primary"></i> Electrical Appliances
      </h4>
      <ul class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-on-surface-variant text-sm font-light">
        ${item.electrical.map(a => `<li class="flex items-center gap-2"><i class="bi bi-check2 text-emerald-400"></i>${a}</li>`).join('')}
      </ul>
    </div>` : '';
    
  const facilityHTML = item.facility?.length ? `
      <div class="space-y-3">
        <h4 class="font-headline font-bold text-lg flex items-center gap-2 text-on-surface">
          <i class="bi bi-grid-fill text-primary"></i> Facility
        </h4>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-on-surface-variant text-sm font-light">
          ${item.facility.map(f => `
            <li class="flex items-center gap-2.5">
              <div class="flex justify-center w-5">
                <i class="bi ${f.icon} text-emerald-400"></i>
              </div>
              <span>${f.name}</span>
            </li>`).join('')}
        </ul>
      </div>` : '';

  const locationHTML = item.location_details?.length ? `
    <div class="space-y-3">
      <h4 class="font-headline font-bold text-lg flex items-center gap-2 text-on-surface">
        <i class="bi bi-geo-alt-fill text-primary"></i> Location
      </h4>
      <div class="space-y-2.5 text-sm text-on-surface-variant">
        ${item.location_details.map(loc => `
          <div class="grid grid-cols-[1.5rem_1fr_auto] items-center gap-2">
            <div class="flex justify-center">
              <i class="bi ${loc.icon} text-primary"></i>
            </div>
            <span class="leading-tight">${loc.name}</span>
            <span class="text-[0.7rem] opacity-60 font-medium">${loc.distance}</span>
          </div>`).join('')}
      </div>
    </div>` : '';

  const mapHTML = item.map_embed ? `
    <div class="w-full aspect-video rounded-xl overflow-hidden border border-outline-variant/20">
      <iframe src="${item.map_embed}" class="w-full h-full" frameborder="0" allowfullscreen loading="lazy"></iframe>
    </div>` : '';

  body.innerHTML = `

    <!-- ปุ่ม X อยู่ใน scroll area แต่ sticky ติดบนสุด -->
    <div class="sticky top-0 z-50 flex justify-end p-3 pointer-events-none">
      <button onclick="closeDetailsModal()"
              class="pointer-events-auto w-9 h-9 bg-black/50 hover:bg-black/70 backdrop-blur-md
                     rounded-full flex items-center justify-center text-white text-lg shadow-lg transition-all">
        ✕
      </button>
    </div>

    <!-- Slider -->
    <div class="relative -mt-[3.75rem]">
      <div class="aspect-[4/3] bg-black group/slider relative">
        <div id="slider-container"
             class="flex w-full h-full overflow-x-auto no-scrollbar"
             style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scroll-behavior: smooth;">
          ${images.map(img => `
            <div style="flex: 0 0 100%; scroll-snap-align: start;">
              <img src="${img}" class="w-full h-full object-cover" alt="${item.title}">
            </div>`).join('')}
        </div>

        ${images.length > 1 ? `
          <button onclick="scrollSlider(-1)"
                  class="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur text-white flex items-center justify-center z-10">
            <i class="bi bi-chevron-left"></i>
          </button>
          <button onclick="scrollSlider(1)"
                  class="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur text-white flex items-center justify-center z-10">
            <i class="bi bi-chevron-right"></i>
          </button>
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
            ${images.map((_, i) => `
              <div class="slider-dot rounded-full transition-all ${i === 0 ? 'bg-white w-4 h-1.5' : 'bg-white/40 w-1.5 h-1.5'}"></div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 sm:p-9 space-y-8">
      <div class="space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <div class="font-headline text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              ฿${item.price_thb.toLocaleString()}
            </div>
            <div class="text-on-surface-variant text-sm">Approx. $${item.price_usd.toLocaleString()} USD</div>
          </div>
          <div class="flex gap-2">${badgesHTML}</div>
        </div>
        <h2 class="font-headline text-xl sm:text-2xl font-bold leading-tight">${item.title}</h2>
        ${item.floor ? `<p class="text-on-surface-variant text-sm flex items-center gap-2"><i class="bi bi-geo-alt text-primary"></i>${item.floor}</p>` : ''}
      </div>

      <div class="grid grid-cols-2 gap-4 border-y border-outline-variant/20 py-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/10">
            <span class="material-symbols-outlined text-primary !text-xl">aspect_ratio</span>
          </div>
          <div>
            <p class="text-[0.65rem] uppercase text-on-surface-variant font-bold">Size</p>
            <p class="font-semibold text-sm">${item.size} Sq.m.</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/10">
            <span class="material-symbols-outlined text-primary !text-xl">chair</span>
          </div>
          <div>
            <p class="font-semibold text-sm text-amber-400">${item.status}</p>
          </div>          
        </div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/10">
            <span class="material-symbols-outlined text-primary !text-xl">king_bed</span>
          </div>
          <div>
            <p class="text-[0.65rem] uppercase text-on-surface-variant font-bold">Bedroom</p>
            <p class="font-semibold text-sm">${item.bedroom}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/10">
            <span class="material-symbols-outlined text-primary !text-xl">shower</span>
          </div>
          <div>
            <p class="text-[0.65rem] uppercase text-on-surface-variant font-bold">Bathroom</p>
            <p class="font-semibold text-sm">${item.bathroom}</p>
          </div>          
        </div>
      </div>

      ${item.description ? `<p class="text-on-surface-variant text-sm leading-relaxed">${item.description}</p>` : ''}
      ${electricalHTML}
      ${facilityHTML}
      ${locationHTML}
      ${mapHTML}

      <div class="sticky bottom-0 bg-transparent py-4 flex flex-col sm:flex-row gap-3">
        <a href="mailto:info@lg.in.th?subject=Inquiry: ${encodeURIComponent(item.title)}"
           class="flex-1 flex items-center justify-center gap-2 bg-on-surface text-surface py-4 rounded-xl font-bold">
          <i class="bi bi-envelope-at-fill"></i> EMAIL ENQUIRY
        </a>
        <a href="https://wa.me/66900429994?text=I am interested in ${encodeURIComponent(item.title)}"
           target="_blank"
           class="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl font-bold">
          <i class="bi bi-whatsapp"></i> WHATSAPP
        </a>
      </div>
    </div>
  `;

  // ผูก scroll → อัปเดต dots
  const sliderEl = document.getElementById('slider-container');
  if (sliderEl) {
    sliderEl.addEventListener('scroll', function () {
      const index = Math.round(this.scrollLeft / this.clientWidth);
      document.querySelectorAll('.slider-dot').forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('bg-white', 'w-4');
          dot.classList.remove('bg-white/40', 'w-1.5');
        } else {
          dot.classList.remove('bg-white', 'w-4');
          dot.classList.add('bg-white/40', 'w-1.5');
        }
      });
    }, { passive: true });
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = 'hidden';
}

function closeDetailsModal() {
  document.getElementById("details-modal").classList.add("hidden");
  document.body.style.overflow = 'auto';
}

function scrollSlider(dir) {
  const slider = document.getElementById('slider-container');
  if (!slider) return;
  slider.scrollBy({ left: dir * slider.clientWidth, behavior: 'smooth' });
}

// =========================
// Window Load (Preloader)
// =========================
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("loader-hidden");
    }, 2400);
  }
});

// ==================
// Slider for Gallery 
// ==================
function scrollSlider(dir) {
  const slider = document.getElementById('slider-container');
  if (!slider) return;
  slider.scrollBy({ left: dir * slider.clientWidth, behavior: 'smooth' });
}

// อัปเดต dots ตาม scroll
function initSliderDots() {
  const slider = document.getElementById('slider-container');
  if (!slider) return;

  slider.addEventListener('scroll', function() {
    const index = Math.round(this.scrollLeft / this.clientWidth);
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('bg-white', '!w-5');
        dot.classList.remove('bg-white/40');
      } else {
        dot.classList.remove('bg-white', '!w-5');
        dot.classList.add('bg-white/40');
      }
    });
  }, { passive: true });
}

// ========================
// Touch Swipe for Slider
// ========================
function initSliderSwipe(totalImages) {
  const container = document.getElementById('slider-container');
  if (!container) return;

  let startX = 0;
  let isPointerDown = false;

  container.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    isPointerDown = true;
    container.setPointerCapture(e.pointerId);
  });

  container.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 5) {
      e.preventDefault();
    }
  });

  container.addEventListener('pointerup', (e) => {
    if (!isPointerDown) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 40) {
      moveSlider(deltaX < 0 ? 1 : -1, totalImages);
    }
    isPointerDown = false;
  });

  container.addEventListener('pointercancel', () => {
    isPointerDown = false;
  });
}