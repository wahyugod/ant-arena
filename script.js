/* script.js — @nt's Arena — v1 */

// Utility: throttle to limit high-frequency events (e.g., scroll/resize)
function throttle(fn, wait = 100) {
  let last = 0;
  let timer;
  return function throttled(...args) {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      clearTimeout(timer);
      last = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll for anchor links (progressive enhancement)
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  anchorLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      // Ignore just '#' or external-like anchors
      if (!href || href === "#" || href.length === 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const header = document.querySelector("header");
      const headerOffset = header ? header.offsetHeight : 0;
      const top =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        (headerOffset + 8);
      if (prefersReduced) {
        window.scrollTo(0, top);
      } else {
        window.scrollTo({ top, behavior: "smooth" });
      }
      // Close mobile nav after click
      document.body.classList.remove("nav-open");
    });
  });

  // Navbar state change on scroll
  const headerEl = document.querySelector("header");
  const navbarEl = document.querySelector(".navbar");
  const heroEl = document.querySelector(".hero");
  const updateNavbar = () => {
    const trigger = (heroEl?.offsetHeight || 120) * 0.6; // when 60% past hero height
    const scrolled = window.scrollY > trigger;
    if (scrolled) {
      headerEl?.classList.add("scrolled");
      navbarEl?.classList.add("scrolled");
    } else {
      headerEl?.classList.remove("scrolled");
      navbarEl?.classList.remove("scrolled");
    }
  };
  updateNavbar();
  window.addEventListener("scroll", throttle(updateNavbar, 100), {
    passive: true,
  });

  // IntersectionObserver: reveal animations
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: make all visible
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Mobile hamburger toggle (in case not present in HTML, inject it)
  let hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (!hamburger && navLinks) {
    hamburger = document.createElement("button");
    hamburger.className = "hamburger";
    hamburger.setAttribute("aria-label", "Toggle navigation");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.innerHTML = '<span class="bar" aria-hidden="true"></span>';
    const logo = document.querySelector(".logo");
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      // Insert after logo
      if (logo && logo.nextSibling) {
        navbar.insertBefore(hamburger, logo.nextSibling);
      } else {
        navbar.insertBefore(hamburger, navbar.firstChild);
      }
    }
  }
  if (hamburger) {
    const toggleNav = () => {
      const isOpen = document.body.classList.toggle("nav-open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
    };
    hamburger.addEventListener("click", toggleNav);
    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.body.classList.remove("nav-open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Testimonial carousel (lightweight, accessible)
  const carouselRoot = document.querySelector(".testimonial");
  if (carouselRoot) {
    // Build structure if needed
    const items = carouselRoot.querySelectorAll(".testimonial-item");
    if (items.length) {
      let viewport = carouselRoot.querySelector(".carousel-viewport");
      let track = carouselRoot.querySelector(".carousel-track");
      if (!viewport) {
        viewport = document.createElement("div");
        viewport.className = "carousel-viewport";
        const wrapper = document.createElement("div");
        wrapper.className = "carousel-track";
        // Move items into track
        items.forEach((el) => wrapper.appendChild(el));
        // Replace container content
        viewport.appendChild(wrapper);
        const container =
          carouselRoot.querySelector(".testimonial-carousel") || carouselRoot;
        container.innerHTML = "";
        container.appendChild(viewport);
      }
      track = carouselRoot.querySelector(".carousel-track");

      // Controls
      let controls = carouselRoot.querySelector(".carousel-controls");
      if (!controls) {
        controls = document.createElement("div");
        controls.className = "carousel-controls";
        const prevBtn = document.createElement("button");
        prevBtn.className = "carousel-btn prev";
        prevBtn.setAttribute("aria-label", "Sebelumnya");
        prevBtn.innerHTML = "&#9664;"; // left triangle
        const nextBtn = document.createElement("button");
        nextBtn.className = "carousel-btn next";
        nextBtn.setAttribute("aria-label", "Berikutnya");
        nextBtn.innerHTML = "&#9654;"; // right triangle
        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);
        carouselRoot.appendChild(controls);
      }

      const prev = carouselRoot.querySelector(".carousel-btn.prev");
      const next = carouselRoot.querySelector(".carousel-btn.next");

      let index = 0;
      let slideCount = items.length;

      const computePerView = () => {
        const w = window.innerWidth;
        if (w <= 768) return 1;
        if (w <= 1199) return 2;
        return 3;
      };
      let perView = computePerView();

      const update = () => {
        // clamp index
        const maxIndex = Math.max(0, slideCount - perView);
        index = Math.min(Math.max(0, index), maxIndex);
        const card = track.querySelector(".testimonial-item");
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const cardWidth = card ? card.getBoundingClientRect().width : 0;
        const offset = -(index * (cardWidth + gap));
        track.style.transform = `translateX(${offset}px)`;
        if (prev) prev.disabled = index === 0;
        if (next) next.disabled = index >= maxIndex;
      };

      const onResize = throttle(() => {
        perView = computePerView();
        update();
      }, 150);
      window.addEventListener("resize", onResize);

      prev?.addEventListener("click", () => {
        index -= 1;
        update();
      });
      next?.addEventListener("click", () => {
        index += 1;
        update();
      });

      // Keyboard accessibility on controls
      [prev, next].forEach((btn) => {
        btn?.addEventListener("keydown", (e) => {
          if (e.key === "ArrowLeft" && btn === next) {
            index -= 1;
            update();
          }
          if (e.key === "ArrowRight" && btn === prev) {
            index += 1;
            update();
          }
        });
      });

      // Touch/drag support
      let startX = 0;
      let currentX = 0;
      let isDown = false;
      const onTouchStart = (x) => {
        isDown = true;
        startX = x;
        currentX = x;
      };
      const onTouchMove = (x) => {
        if (!isDown) return;
        currentX = x;
      };
      const onTouchEnd = () => {
        if (!isDown) return;
        isDown = false;
        const dx = currentX - startX;
        const threshold = 40; // minimal swipe
        if (Math.abs(dx) > threshold) {
          if (dx < 0) {
            index += 1;
          } else {
            index -= 1;
          }
          update();
        }
      };
      viewport.addEventListener(
        "touchstart",
        (e) => onTouchStart(e.touches[0].clientX),
        { passive: true }
      );
      viewport.addEventListener(
        "touchmove",
        (e) => onTouchMove(e.touches[0].clientX),
        { passive: true }
      );
      viewport.addEventListener("touchend", onTouchEnd);

      // Optional auto-slide (pause on hover)
      let autoTimer = null;
      const startAuto = () => {
        if (autoTimer) return;
        autoTimer = setInterval(() => {
          index += 1;
          update();
        }, 5000);
      };
      const stopAuto = () => {
        if (autoTimer) {
          clearInterval(autoTimer);
          autoTimer = null;
        }
      };
      carouselRoot.addEventListener("mouseenter", stopAuto);
      carouselRoot.addEventListener("mouseleave", startAuto);

      // Initialize
      update();
      startAuto();
    }
  }
});
