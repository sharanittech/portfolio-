gsap.registerPlugin(ScrollTrigger);

// Orbit Rotation
const orbitTween = gsap.to(".orbit-wrapper", {
    rotate: 360, duration: 40, repeat: -1, ease: "linear"
});
gsap.to(".skill-icon", {
    rotate: -360, duration: 40, repeat: -1, ease: "linear"
});

// Scroll Reveal Logic
// Reliable Reveal Logic
const revealElements = document.querySelectorAll(".reveal");

const observerOptions = {
    threshold: 0.15 // Triggers when 15% of the element is visible
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.to(entry.target, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                overwrite: true
            });
            revealObserver.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

revealElements.forEach(el => {
    // Force set initial hidden state
    gsap.set(el, { opacity: 0, y: 40 });
    revealObserver.observe(el);
});

// Cursor following logic (Optional - ensure you have .cursor div in HTML)
document.addEventListener('mousemove', e => {
    gsap.to(".cursor", { x: e.clientX, y: e.clientY, duration: 0.1 });
});
