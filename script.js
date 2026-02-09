// ===== Mobile Navigation Toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('active');
  navToggle?.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('active');
    navToggle?.classList.remove('active');
  });
});

// ===== Particles Background =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const particleCount = 40;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      background: rgba(88, 101, 242, ${Math.random() * 0.3 + 0.1});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 15}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(particle);
  }
}

// Add particle float animation
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translate(0, 0); opacity: 0.3; }
    25% { transform: translate(20px, -30px); opacity: 0.6; }
    50% { transform: translate(-15px, 20px); opacity: 0.4; }
    75% { transform: translate(30px, 10px); opacity: 0.5; }
  }
`;
document.head.appendChild(style);

createParticles();

// ===== Navbar scroll effect =====
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav?.classList.add('scrolled');
  } else {
    nav?.classList.remove('scrolled');
  }
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== Scroll reveal animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, observerOptions);

// Observe elements for reveal
document.querySelectorAll('.project-card, .download-card, .testimonial-card, .skill-category, .feature').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Add revealed class styles
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .project-card.revealed,
  .download-card.revealed,
  .testimonial-card.revealed,
  .skill-category.revealed,
  .feature.revealed {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  .nav.scrolled {
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    .nav-links.active {
      display: flex !important;
      position: fixed;
      top: 70px;
      left: 24px;
      right: 24px;
      flex-direction: column;
      background: var(--bg-card);
      padding: 24px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      gap: 16px;
    }
  }
`;
document.head.appendChild(revealStyle);
