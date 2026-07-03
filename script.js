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

// Interactive SVG Wave Background
const svg = document.getElementById("bg-waves");
if (svg && window.SimplexNoise) {
  const noise2D = new SimplexNoise().noise2D.bind(new SimplexNoise());
  const colors = ["#ffc64f", "#6bb9d4", "#084463", "#a3ddf0", "#436c7c"];
  let mouse = { x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false };
  let paths = [];
  let lines = [];
  let width, height;

  const setSize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    svg.style.width = `${width}px`;
    svg.style.height = `${height}px`;
  };

  const setLines = () => {
    paths.forEach(p => p.remove());
    paths = [];
    lines = [];

    const xGap = 24;
    const yGap = 32;
    const oWidth = width + 200;
    const oHeight = height + 2500; // Generate extra height for parallax scrolling
    const totalLines = Math.ceil(oWidth / xGap);
    const totalPoints = Math.ceil(oHeight / yGap);
    const xStart = (width - xGap * totalLines) / 2;
    const yStart = (height - yGap * totalPoints) / 2;

    for (let i = 0; i < totalLines; i++) {
      const points = [];
      for (let j = 0; j < totalPoints; j++) {
        points.push({
          x: xStart + xGap * i,
          y: yStart + yGap * j,
          wave: { x: 0, y: 0 },
          cursor: { x: 0, y: 0, vx: 0, vy: 0 }
        });
      }

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', colors[i % colors.length]);
      path.setAttribute('stroke-width', '1.0');
      path.setAttribute('opacity', '0.15'); // Very soft watermark-style opacity
      
      svg.appendChild(path);
      paths.push(path);
      lines.push(points);
    }
  };

  const resize = () => {
    setSize();
    setLines();
  };

  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!mouse.set) {
      mouse.sx = mouse.x;
      mouse.sy = mouse.y;
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.set = true;
    }
  }, { passive: true });

  const movePoints = (time) => {
    lines.forEach(points => {
      points.forEach(p => {
        const move = noise2D(
          (p.x + time * 0.008) * 0.003,
          (p.y + time * 0.003) * 0.002
        ) * 8;

        p.wave.x = Math.cos(move) * 12;
        p.wave.y = Math.sin(move) * 6;

        const dx = p.x - mouse.sx;
        const dy = p.y - mouse.sy;
        const d = Math.hypot(dx, dy);
        const l = Math.max(175, mouse.vs);

        if (d < l) {
          const s = 1 - d / l;
          const f = Math.cos(d * 0.001) * s;
          p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00035;
          p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00035;
        }

        p.cursor.vx += (0 - p.cursor.x) * 0.01;
        p.cursor.vy += (0 - p.cursor.y) * 0.01;
        p.cursor.vx *= 0.95;
        p.cursor.vy *= 0.95;
        p.cursor.x += p.cursor.vx;
        p.cursor.y += p.cursor.vy;
        p.cursor.x = Math.min(50, Math.max(-50, p.cursor.x));
        p.cursor.y = Math.min(50, Math.max(-50, p.cursor.y));
      });
    });
  };

  const moved = (point) => {
    return {
      x: point.x + point.wave.x + point.cursor.x,
      y: point.y + point.wave.y + point.cursor.y - window.scrollY * 0.4
    };
  };

  const drawLines = () => {
    lines.forEach((points, lIndex) => {
      if (points.length < 2 || !paths[lIndex]) return;
      const first = moved(points[0]);
      let d = `M ${first.x} ${first.y}`;
      
      // Use Quadratic Bezier curves for perfectly smooth lines with fewer points
      for (let i = 1; i < points.length - 1; i++) {
        const current = moved(points[i]);
        const next = moved(points[i + 1]);
        const xc = (current.x + next.x) / 2;
        const yc = (current.y + next.y) / 2;
        d += ` Q ${current.x} ${current.y} ${xc} ${yc}`;
      }
      
      // Connect to the very last point
      const last = moved(points[points.length - 1]);
      d += ` L ${last.x} ${last.y}`;
      
      paths[lIndex].setAttribute('d', d);
    });
  };

  const tick = (time) => {
    mouse.sx += (mouse.x - mouse.sx) * 0.1;
    mouse.sy += (mouse.y - mouse.sy) * 0.1;

    const dx = mouse.x - mouse.lx;
    const dy = mouse.y - mouse.ly;
    const d = Math.hypot(dx, dy);

    mouse.v = d;
    mouse.vs += (d - mouse.vs) * 0.1;
    mouse.vs = Math.min(100, mouse.vs);

    mouse.lx = mouse.x;
    mouse.ly = mouse.y;
    mouse.a = Math.atan2(dy, dx);

    movePoints(time);
    drawLines();
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
