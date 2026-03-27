const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const year = document.getElementById("year");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

window.addEventListener("scroll", () => {
  if (navbar) {
    navbar.classList.toggle("visible", window.scrollY > 80);
  }
});

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll("a[href^='#']").forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") {
      return;
    }

    const target = document.querySelector(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function animateCounters() {
  const counters = document.querySelectorAll(".count-up");

  counters.forEach((counter) => {
    const targetValue = Number(counter.getAttribute("data-count") || 0);
    let started = false;

    const startCounter = () => {
      if (started) {
        return;
      }

      started = true;
      const duration = 1400;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.round(progress * targetValue);
        counter.textContent = value === 100 ? "100%" : `${value}+`;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounter();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}

function setupFallbackReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".reveal-up, .reveal-card").forEach((element) => {
    element.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    observer.observe(element);
  });
}

function setupGsapAnimations() {
  if (!window.gsap || !window.ScrollTrigger) {
    setupFallbackReveal();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.set(".hero-copy", { opacity: 0, y: 36 });
  gsap.set(".hero-visual", { opacity: 0, y: 36, scale: 0.96 });
  gsap.set(".stats-bar .stat-card", { opacity: 0, y: 30 });

  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to(".hero-copy", { opacity: 1, y: 0, duration: 0.85 })
    .to(".hero-visual", { opacity: 1, y: 0, scale: 1, duration: 0.9 }, "-=0.5")
    .to(".stats-bar .stat-card", { opacity: 1, y: 0, duration: 0.55, stagger: 0.12 }, "-=0.35");

  document.querySelectorAll(".reveal-up").forEach((element) => {
    gsap.set(element, { opacity: 0, y: 36 });

    ScrollTrigger.create({
      trigger: element,
      start: "top 84%",
      once: true,
      onEnter: () => {
        gsap.to(element, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
      }
    });
  });

  document.querySelectorAll(".stagger-group").forEach((group) => {
    const cards = group.querySelectorAll(".reveal-card");
    if (!cards.length) {
      return;
    }

    gsap.set(cards, { opacity: 0, y: 36 });

    ScrollTrigger.batch(cards, {
      start: "top 84%",
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out"
        });
      }
    });
  });
}

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "Thanks. Your request has been received. Ilmora Education will contact you shortly.";
    contactForm.reset();
  });
}

animateCounters();
setupGsapAnimations();
