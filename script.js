const body = document.body;
const storage = window.localStorage;

if (storage.getItem("theme") === "light") {
    body.classList.add("theme-light");
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reduceMotionEnabled = () => prefersReducedMotion;

const gsapAvailable = typeof window.gsap !== "undefined";
if (gsapAvailable && typeof window.ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Scroll Reveal Logic
const revealElements = document.querySelectorAll(".reveal");

const observerOptions = {
    threshold: 0.15
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (reduceMotionEnabled() || !gsapAvailable) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "none";
            } else {
                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power2.out",
                    overwrite: true
                });
            }
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach(el => {
    if (reduceMotionEnabled() || !gsapAvailable) {
        el.style.opacity = "1";
        el.style.transform = "none";
    } else {
        gsap.set(el, { opacity: 0, y: 24 });
    }
    revealObserver.observe(el);
});

// Cursor following logic (disable on touch/reduced motion)
const cursorEl = document.querySelector(".cursor");
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

if (!reduceMotionEnabled() && hasFinePointer && cursorEl && gsapAvailable) {
    document.addEventListener("mousemove", e => {
        gsap.to(cursorEl, { x: e.clientX, y: e.clientY, duration: 0.1 });
    });
} else if (cursorEl) {
    cursorEl.style.display = "none";
}

// Theme toggle
const themeToggle = document.querySelector(".theme-toggle");

const refreshThemeToggle = () => {
    if (!themeToggle) {
        return;
    }
    const isLight = body.classList.contains("theme-light");
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("title", isLight ? "Switch to dark theme" : "Switch to light theme");
};

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("theme-light");
        storage.setItem("theme", body.classList.contains("theme-light") ? "light" : "dark");
        refreshThemeToggle();
    });
}
refreshThemeToggle();

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            navLinks.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("click", (event) => {
        if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
            navLinks.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });
}

// Resume download count
const resumeLink = document.getElementById("resume-download");
const downloadCount = document.getElementById("download-count");
if (resumeLink && downloadCount) {
    let count = Number(storage.getItem("resumeDownloads") || "0");
    downloadCount.textContent = String(count);
    resumeLink.addEventListener("click", () => {
        count += 1;
        storage.setItem("resumeDownloads", String(count));
        downloadCount.textContent = String(count);
    });
}

// Milestone counters
const milestoneValues = document.querySelectorAll(".milestone-value");
const animateValue = (el) => {
    const target = Number(el.getAttribute("data-target") || "0");
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = `${value}${suffix}`;
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = `${target}${suffix}`;
        }
    };
    requestAnimationFrame(step);
};

if (milestoneValues.length) {
    const milestoneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (reduceMotionEnabled()) {
                    milestoneValues.forEach(el => {
                        const target = el.getAttribute("data-target") || "0";
                        const suffix = el.getAttribute("data-suffix") || "";
                        el.textContent = `${target}${suffix}`;
                    });
                } else {
                    milestoneValues.forEach(animateValue);
                }
                milestoneObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    milestoneObserver.observe(milestoneValues[0]);
}

// Project filters
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        projectCards.forEach(card => {
            const tags = (card.getAttribute("data-tags") || "").split(",").map(tag => tag.trim());
            const matches = filter === "all" || tags.includes(filter);
            card.hidden = !matches;
        });
    });
});

// Project case study modal
const modal = document.getElementById("case-modal");
const modalTitle = document.getElementById("modal-title");
const modalSummary = document.getElementById("modal-summary");
const modalStack = document.getElementById("modal-stack");
const modalImpact = document.getElementById("modal-impact");
const modalGithub = document.getElementById("modal-github");
const modalDemo = document.getElementById("modal-demo");
const radarShape = document.getElementById("radar-shape");

const closeModal = () => {
    if (!modal) {
        return;
    }
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
};

const openModal = (card) => {
    if (!modal || !card) {
        return;
    }
    modalTitle.textContent = card.getAttribute("data-title") || "Project";
    modalSummary.textContent = card.getAttribute("data-summary") || "";
    modalStack.textContent = card.getAttribute("data-stack") || "";
    modalImpact.textContent = card.getAttribute("data-impact") || "";

    const dna = (card.getAttribute("data-dna") || "").split(",").map(item => Number(item.trim()) || 0);
    if (radarShape && dna.length === 4) {
        const [speed, ux, accuracy, security] = dna.map(v => Math.max(0, Math.min(v, 100)) / 100);
        const r = 40;
        const cx = 50;
        const cy = 50;
        const points = [
            `${cx},${cy - r * speed}`,
            `${cx + r * ux},${cy}`,
            `${cx},${cy + r * accuracy}`,
            `${cx - r * security},${cy}`
        ].join(" ");
        radarShape.setAttribute("points", points);
    }

    const github = card.getAttribute("data-github") || "#";
    modalGithub.href = github;
    const demo = card.getAttribute("data-demo") || "";
    modalDemo.href = demo || "#";
    modalDemo.classList.toggle("disabled", !demo);
    modalDemo.setAttribute("aria-disabled", demo ? "false" : "true");
    modalDemo.setAttribute("tabindex", demo ? "0" : "-1");

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
};

document.querySelectorAll(".details-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        openModal(btn.closest(".project-card"));
    });
});

if (modal) {
    modal.addEventListener("click", (event) => {
        if (event.target.matches("[data-close]")) {
            closeModal();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("open")) {
            closeModal();
        }
    });
}

// Back-to-top button
const toTopBtn = document.querySelector(".to-top");
if (toTopBtn) {
    const toggleToTop = () => {
        if (window.scrollY > 500) {
            toTopBtn.classList.add("show");
        } else {
            toTopBtn.classList.remove("show");
        }
    };
    toggleToTop();
    window.addEventListener("scroll", toggleToTop, { passive: true });
    toTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: reduceMotionEnabled() ? "auto" : "smooth" });
    });
}

// Live demo links
document.querySelectorAll(".project-card").forEach(card => {
    const demoLink = card.querySelector("[data-demo-link]");
    if (!demoLink) {
        return;
    }
    const demo = card.getAttribute("data-demo") || "";
    if (demo) {
        demoLink.href = demo;
        demoLink.classList.remove("disabled");
        demoLink.setAttribute("target", "_blank");
        demoLink.setAttribute("rel", "noopener noreferrer");
    } else {
        demoLink.classList.add("disabled");
        demoLink.setAttribute("aria-disabled", "true");
    }
});
