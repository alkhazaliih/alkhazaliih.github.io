const card = document.getElementById("main-card");
const bg = document.querySelector(".custom-background");
const particleContainer = document.getElementById("particle-container");
const entryOverlay = document.getElementById("entry-overlay");
const musicBtn = document.getElementById("music-btn");
const video = document.getElementById("bg-video");
let isPlaying = false;

// Title typewriter loop — cycles typing and erasing "Sanad"
(function titleLoop() {
    const text = 'Sanad';
    const typingSpeed = 250; // ms per character when typing
    const erasingSpeed = 250; // ms per character when erasing
    const delayAfterTyped = 1000; // pause after full word
    const delayAfterErased = 400; // pause after fully erased

    let i = 0;
    let isErasing = false;

    function tick() {
        if (!isErasing) {
            i++;
            document.title = "@" + text.slice(0, i) + (i < text.length ? '\u258F' : '');
            if (i === text.length) {
                // finished typing, pause then start erasing
                isErasing = true;
                setTimeout(tick, delayAfterTyped);
                return;
            }
            setTimeout(tick, typingSpeed);
        } else {
            i--;
            document.title = "@" + text.slice(0, i) + (i > 0 ? '\u258F' : '');
            if (i === 0) {
                // finished erasing, pause then start typing again
                isErasing = false;
                setTimeout(tick, delayAfterErased);
                return;
            }
            setTimeout(tick, erasingSpeed);
        }
    }

    tick();
})();

// Smooth parallax state
let target = { x: 0, y: 0 };
let current = { x: 0, y: 0 };
const lerp = (a, b, n) => (1 - n) * a + n * b;
// UI Listeners
const enterSite = () => {
    console.log("Entry overlay clicked!"); // Debug log
    entryOverlay.classList.add("fade-out");
    video.play().catch(() => { });
    const video = document.getElementById('bg-video');
    if (video) {
        // ensure the background video loops and provide a fallback
        video.loop = true;
        video.play().catch(() => { });
        video.addEventListener('ended', () => {
            try {
                video.currentTime = 0;
                video.play().catch(() => { });
            } catch (e) { /* ignore */ }
        });
    }
    musicBtn.innerHTML =
        '<i class="fa-solid fa-volume-high text-sm text-white"></i>';
    isPlaying = true;

    entryOverlay.addEventListener(
        "transitionend",
        () => {
            console.log("Transition ended, setting display to none");
            entryOverlay.style.display = "none";
        },
        { once: true }
    );
};

entryOverlay.addEventListener("click", enterSite);
musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    if (video.muted) {
        musicBtn.innerHTML = '<i class="fa-solid fa-volume-xmark text-sm opacity-40"></i>';
    } else {
        musicBtn.innerHTML = '<i class="fa-solid fa-volume-high text-sm text-white"></i>';
    }
});

document.addEventListener("mousemove", (e) => {
    // set target normalized -1..1
    const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const y =
        (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    target.x = x;
    target.y = y;

    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);

    // update custom cursor target if enabled
    if (window._cursorEnabled) {
        window._cursorTarget.x = e.clientX;
        window._cursorTarget.y = e.clientY;
    }
});

// Custom cursor setup
(function setupCustomCursor() {
    const cursorEl = document.getElementById('custom-cursor');
    if (!cursorEl) {
        window._cursorEnabled = false;
        return;
    }

    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (isTouch) {
        cursorEl.style.display = 'none';
        window._cursorEnabled = false;
        return;
    }

    window._cursorEnabled = true;
    document.body.classList.add('custom-cursor-enabled');

    window._cursorTarget = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    window._cursorCurrent = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    cursorEl.style.left = window._cursorTarget.x + 'px';
    cursorEl.style.top = window._cursorTarget.y + 'px';

    document.addEventListener('mousedown', () => cursorEl.classList.add('click'));
    document.addEventListener('mouseup', () => cursorEl.classList.remove('click'));
    document.addEventListener('mouseenter', () => { cursorEl.style.opacity = '1'; });
    document.addEventListener('mouseleave', () => { cursorEl.style.opacity = '0'; });

    const hoverEls = document.querySelectorAll('a, button, .social-btn, .badge, .action-trigger');
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => cursorEl.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorEl.classList.remove('hover'));
    });

    window.addEventListener('resize', () => {
        window._cursorTarget.x = window.innerWidth / 2;
        window._cursorTarget.y = window.innerHeight / 2;
        window._cursorCurrent.x = window.innerWidth / 2;
        window._cursorCurrent.y = window.innerHeight / 2;
    });
})();

// Smooth animation loop
(function animate() {
    current.x = lerp(current.x, target.x, 0.08);
    current.y = lerp(current.y, target.y, 0.08);

    const rotateX = -current.y * 10; // degrees
    const rotateY = current.x * 10;
    const translateX = current.x * 12; // px
    const translateY = current.y * 8; // px

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0)`;

    if (bg) {
        // subtle parallax on background (inverse movement)
        bg.style.transform = `translate3d(${-current.x * 10}px, ${-current.y * 10
            }px, 0) scale(1.02)`;
    }

    // update custom cursor position if enabled
    if (window._cursorEnabled) {
        const cursorEl = document.getElementById('custom-cursor');
        if (cursorEl) {
            window._cursorCurrent.x = lerp(window._cursorCurrent.x, window._cursorTarget.x, 0.18);
            window._cursorCurrent.y = lerp(window._cursorCurrent.y, window._cursorTarget.y, 0.18);
            cursorEl.style.left = window._cursorCurrent.x + 'px';
            cursorEl.style.top = window._cursorCurrent.y + 'px';
        }
    }

    requestAnimationFrame(animate);
})();

// Firebase analytics and realtime snapshot removed — no-op

// Particles
setInterval(() => {
    const p = document.createElement("div");
    p.className = "dust-particle";
    const size = Math.random() * 2 + 1;
    Object.assign(p.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `50%`,
        opacity: 0,
        animation: `float-particle 3s ease-out forwards`,
    });
    p.style.setProperty("--dx", `${(Math.random() - 0.5) * 50}px`);
    p.style.setProperty("--dy", `-60px`);
    particleContainer.appendChild(p);
    setTimeout(() => p.remove(), 1000);
}, 500);
(function faviconAnimator() {
    const link = document.getElementById('dynamic-favicon');
    if (!link) return;

    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    let t = 0;
    let raf = null;

    function draw() {
        ctx.clearRect(0, 0, size, size);

        // --- Configuration ---
        const centerX = size / 2;
        const floorY = size - 8; // The "ground" level
        const jumpHeight = 35;   // How high it bounces
        const ballRadius = 10;

        // --- Math & Physics ---
        // Math.abs(Math.sin) creates a perfect bouncing loop without complex gravity logic
        const bounceCycle = Math.abs(Math.sin(t));

        // Calculate Y position (High when bounceCycle is 1, Low when 0)
        const ballY = floorY - ballRadius - (bounceCycle * jumpHeight);

        // --- 1. Draw The Shadow ---
        // Shadow grows when ball is low (bounceCycle close to 0)
        // Shadow shrinks when ball is high (bounceCycle close to 1)
        const shadowWidth = ballRadius * (1.5 - bounceCycle * 0.8);
        const shadowAlpha = 0.4 - (bounceCycle * 0.3); // Fades out as ball goes up

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
        // Draw an ellipse for the shadow
        ctx.ellipse(centerX, floorY, shadowWidth, shadowWidth * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // --- 2. Draw The Ball ---
        ctx.save();
        ctx.translate(centerX, ballY);

        // Create a gradient to give the ball a 3D sphere look
        const grad = ctx.createRadialGradient(-3, -3, 1, 0, 0, ballRadius);
        grad.addColorStop(0, '#c343ffff'); // Highlight
        grad.addColorStop(1, '#8e52eeff');  // Main color

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, ballRadius, 0, Math.PI * 2);
        ctx.fill();

        // Optional: Add a subtle white rim/stroke for contrast on dark browser tabs
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();

        // --- Update Link ---
        try {
            link.href = canvas.toDataURL('image/png');
        } catch (e) { /* ignore */ }

        // Speed of animation
        t += 0.12;
        raf = requestAnimationFrame(draw);
    }

    function start() {
        if (raf) return;
        raf = requestAnimationFrame(draw);
    }
    function stop() {
        if (!raf) return;
        cancelAnimationFrame(raf);
        raf = null;
    }

    // Performance: Stop animation when tab is not active
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop(); else start();
    });

    start();
})();