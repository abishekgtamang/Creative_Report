const supportForm = document.querySelector(".support-form");
const statusText = document.querySelector(".form-status");
const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const contactEmail = "abishekgtamang@gmail.com,moktanamit1234@gmail.com";
const themeToggle = document.getElementById("theme-toggle");

// Theme toggle: restore saved preference or respect system preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.setAttribute("data-theme", "dark");
}

themeToggle?.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});
const revealItems = document.querySelectorAll(
  ".hero-copy, .intro-photo, .intro-content, .section-heading, .report-item, .map-header, .map-stats, .map-container, .support-copy, .contact-box, .support-form"
);

let lastScrollY = window.scrollY;

const closeNavMenu = () => {
  siteHeader?.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation menu");
};

const updateHeaderVisibility = () => {
  if (!siteHeader) return;

  const currentScrollY = window.scrollY;
  const isScrollingDown = currentScrollY > lastScrollY;
  const isScrollingDownSignificantly = currentScrollY > lastScrollY + 5;
  const hasScrolledPastHeader = currentScrollY > siteHeader.offsetHeight + 24;
  const isMenuOpen = siteHeader.classList.contains("nav-open");

  if (isScrollingDownSignificantly && isMenuOpen) {
    closeNavMenu();
  }

  siteHeader.classList.toggle(
    "is-hidden",
    isScrollingDown && hasScrolledPastHeader && !siteHeader.classList.contains("nav-open")
  );
  lastScrollY = Math.max(currentScrollY, 0);
};

navToggle?.addEventListener("click", () => {
  const willOpen = navToggle.getAttribute("aria-expanded") !== "true";

  siteHeader?.classList.toggle("nav-open", willOpen);
  navToggle.setAttribute("aria-expanded", String(willOpen));
  navToggle.setAttribute(
    "aria-label",
    willOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavMenu();
  }
});

/* Throttle scroll handler with requestAnimationFrame for performance */
let scrollTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateHeaderVisibility();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  },
  { passive: true }
);

const aura = document.getElementById("mouse-aura");
if (aura) {
  let hasMoved = false;
  window.addEventListener("mousemove", (e) => {
    if (!hasMoved) {
      aura.style.opacity = "1";
      hasMoved = true;
    }
    // We use requestAnimationFrame to make the transform buttery smooth
    requestAnimationFrame(() => {
      aura.style.setProperty("--mouse-x", `${e.clientX}px`);
      aura.style.setProperty("--mouse-y", `${e.clientY}px`);
    });
  }, { passive: true });
}

if ("IntersectionObserver" in window) {
  revealItems.forEach((item, index) => {
    item.classList.add("scroll-reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 280)}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "-8% 0px -12% 0px",
      threshold: 0.18,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Odometer count-up animation for stats
const statNumbers = document.querySelectorAll('.stat-number');
if ("IntersectionObserver" in window) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.classList.contains('animated')) return;
        el.classList.add('animated');
        
        const originalText = el.innerText;
        const target = parseInt(originalText.replace(/[^0-9]/g, ''), 10);
        const suffix = originalText.replace(/[0-9]/g, '');
        
        if (isNaN(target)) return;

        const duration = 1200; // ms
        const startTime = performance.now();
        
        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // easeOutExpo for a nice fast-start, slow-end odometer effect
          const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          
          const current = Math.floor(easeOut * target);
          el.innerText = current + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.innerText = target + suffix;
          }
        }
        requestAnimationFrame(updateCount);
      }
    });
  }, { threshold: 0.2 });

  statNumbers.forEach(stat => statsObserver.observe(stat));
}

supportForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(supportForm);
  const name = String(formData.get("name") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !message) {
    statusText.textContent = "Please add your name and message.";
    statusText.style.color = "#b44040";
    return;
  }

  statusText.style.color = "";

  const subject = encodeURIComponent("Creative Bible Exposition Support Message");
  const body = encodeURIComponent(`Name: ${name}\n\nMessage:\n${message}`);

  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  supportForm.reset();
  statusText.textContent = `Thank you, ${name}. Your email app is opening.`;
});

// Interactive Canvas Wave Background
const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width, height;
  let mouse = { x: -1000, y: -1000 };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  };
  
  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  // Generate random, subtle, and different-colored waves
  const numWaves = 4;
  const waves = [];
  for (let i = 0; i < numWaves; i++) {
    // Generate different random hues spread across the spectrum
    const hue = Math.floor(Math.random() * 360);
    waves.push({
      y: 0.25 + (i * 0.2) + (Math.random() * 0.1 - 0.05),
      length1: 0.001 + Math.random() * 0.0015,
      length2: 0.002 + Math.random() * 0.003,
      amplitude: 120 + Math.random() * 100,
      speed1: 0.0003 + Math.random() * 0.0004,
      speed2: 0.0005 + Math.random() * 0.0005,
      color: `hsla(${hue}, 70%, 75%, 0.03)`, // Very subtle fill
      lineColor: `hsla(${hue}, 60%, 65%, 0.15)`, // Subtle stroke
      lineWidth: 1 + Math.random() * 0.5, // Thin lines
      scrollPhase: 0.001 + Math.random() * 0.002,
      scrollY: 0.05 + i * 0.06
    });
  }

  let time = 0;

  const animateWaves = () => {
    ctx.clearRect(0, 0, width, height);
    time += 1;
    const scrollPos = window.scrollY;

    waves.forEach((wave) => {
      ctx.beginPath();
      
      for (let x = 0; x <= width + 20; x += 20) {
        // Complex random wave pattern using dual sine harmonics
        const harmonic1 = Math.sin(x * wave.length1 + time * wave.speed1 + scrollPos * wave.scrollPhase);
        const harmonic2 = Math.sin(x * wave.length2 - time * wave.speed2 + scrollPos * (wave.scrollPhase * 1.5)) * 0.4;
        
        let y = (harmonic1 + harmonic2) * wave.amplitude 
                + height * wave.y 
                - (scrollPos * wave.scrollY);
        
        // Fluid mouse repulsion logic
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const repulsionRadius = 400;
        if (distance < repulsionRadius) {
          // Calculate an easing force so it feels like liquid tension
          const force = Math.pow((repulsionRadius - distance) / repulsionRadius, 2);
          const pushY = dy > 0 ? force * 120 : -force * 120; 
          y += pushY;
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Stroke the wave line BEFORE closing the path to the bottom
      ctx.strokeStyle = wave.lineColor;
      ctx.lineWidth = wave.lineWidth;
      ctx.stroke();

      // Complete the path for the fill
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = wave.color;
      ctx.fill();
    });

    requestAnimationFrame(animateWaves);
  };

  animateWaves();
}
