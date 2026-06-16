(function() {
  'use strict';

  let mouseX = 0, mouseY = 0;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring && !('ontouchstart' in window)) {
    let ringX = 0, ringY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });
    (function ringSmooth() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(ringSmooth);
    })();
    const hoverTargets = document.querySelectorAll('a, button, .btn-primary, .btn-ghost, .filter-btn, .faq-q, .nav-logo');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2000);
    document.body.style.overflow = 'hidden';
  }

  const scrambleEl = document.getElementById('scrambleText');
  if (scrambleEl) {
    const finalText = scrambleEl.textContent;
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let frame = 0;
    const totalFrames = 50;
    function scramble() {
      if (frame >= totalFrames) {
        scrambleEl.textContent = finalText;
        return;
      }
      let output = '';
      const progress = frame / totalFrames;
      const revealCount = Math.floor(progress * finalText.length);
      for (let i = 0; i < finalText.length; i++) {
        if (i < revealCount) {
          output += finalText[i];
        } else if (finalText[i] === ' ') {
          output += ' ';
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      scrambleEl.textContent = output;
      frame++;
      requestAnimationFrame(scramble);
    }
    scramble();
  }

  const typewriterEl = document.getElementById('typewriterText');
  if (typewriterEl) {
    const text = 'ScreenShare proof. Precision combat. Undetectable injection.';
    let idx = 0;
    function typeWrite() {
      if (idx < text.length) {
        typewriterEl.textContent += text[idx];
        idx++;
        const delay = text[idx - 1] === '.' || text[idx - 1] === ',' ? 120 : 28 + Math.random() * 20;
        setTimeout(typeWrite, delay);
      }
    }
    setTimeout(typeWrite, 800);
  }

  function isInView(el, offset = 0.85) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * offset && rect.bottom > 0;
  }

  const revealEls = document.querySelectorAll('[data-reveal]');
  function checkReveals() {
    revealEls.forEach(el => {
      if (isInView(el) && !el.classList.contains('visible')) {
        el.classList.add('visible');
      }
    });
  }

  const featureCards = document.querySelectorAll('.feature-card');
  const featureObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.index || 0) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
      }
    });
  }, { threshold: 0.1 });
  featureCards.forEach(c => featureObs.observe(c));

  const moduleCards = document.querySelectorAll('.module-card:not(.hidden)');
  const moduleObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.parentElement.querySelectorAll('.module-card:not(.hidden)');
        let idx = 0;
        cards.forEach((c, i) => {
          if (c === entry.target) idx = i;
        });
        setTimeout(() => entry.target.classList.add('visible'), idx * 60);
        moduleObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  moduleCards.forEach(c => moduleObs.observe(c));

  const techSteps = document.querySelectorAll('.tech-step, .tech-arrow');
  const techObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const all = entry.target.parentElement.querySelectorAll('.tech-step, .tech-arrow');
        all.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 100);
        });
        techObs.unobserve(entry.target.parentElement);
      }
    });
  }, { threshold: 0.15 });
  if (document.querySelector('.tech-flow')) {
    techObs.observe(document.querySelector('.tech-flow'));
  }

  const faqItems = document.querySelectorAll('.faq-item');
  const faqObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        faqObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  faqItems.forEach(item => faqObs.observe(item));

  const planCards = document.querySelectorAll('.plan-card');
  const planObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        planObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  planCards.forEach(c => planObs.observe(c));

  const ctaBox = document.querySelector('.cta-box');
  if (ctaBox) {
    const ctaObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          ctaObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    ctaObs.observe(ctaBox);
  }

  checkReveals();
  window.addEventListener('scroll', checkReveals);

  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('backToTop');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + '%';

    if (navbar) {
      if (scrollY > lastScrollY && scrollY > 120) {
        navbar.classList.add('hidden-nav');
      } else {
        navbar.classList.remove('hidden-nav');
      }
      navbar.style.background = scrollY > 40
        ? 'rgba(8,11,18,0.95)'
        : 'rgba(8,11,18,0.7)';
    }
    lastScrollY = scrollY;

    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.textContent = '☰';
      });
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  const allModuleCards = document.querySelectorAll('.module-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      allModuleCards.forEach((card, i) => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = 'fadeIn 0.3s ease both';
          setTimeout(() => card.classList.add('visible'), i * 30);
        } else {
          card.classList.remove('visible');
          card.classList.add('hidden');
        }
      });
    });
  });

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        fi.querySelector('.faq-a').style.maxHeight = '0';
        fi.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + entry.target.id
            ? 'var(--purple-lite)'
            : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => sectionObs.observe(s));

  const counterEl = document.querySelector('[data-counter]');
  if (counterEl) {
    const target = parseInt(counterEl.dataset.counter);
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let current = 0;
          const step = Math.ceil(target / 40);
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            counterEl.textContent = current + '+';
          }, 40);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterObs.observe(counterEl);
  }

  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '139,92,246' : '34,211,238';
        this.baseX = this.x;
        this.baseY = this.y;
      }
      update(mx, my) {
        this.x += this.vx;
        this.y += this.vy;
        const dx = this.x - mx;
        const dy = this.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x += dx * force * 0.02;
          this.y += dy * force * 0.02;
        }
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((W * H) / 8000), 120);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function drawLines() {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${(1 - d / maxDist) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    let mousePfx = -1000, mousePfy = -1000;
    canvas.addEventListener('mousemove', e => {
      mousePfx = e.clientX;
      mousePfy = e.clientY;
    });
    canvas.addEventListener('mouseleave', () => {
      mousePfx = -1000;
      mousePfy = -1000;
    });

    function animate() {
      ctx.clearRect(0, 0, W, H);
      drawLines();
      particles.forEach(p => { p.update(mousePfx, mousePfy); p.draw(); });
      requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();
    window.addEventListener('resize', () => { resize(); initParticles(); });
  }

  const tiltEls = document.querySelectorAll('.tilt-element');
  tiltEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      const glare = el.querySelector('.preview-glow');
      if (glare) {
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(ellipse at ${pctX}% ${pctY}%, rgba(139,92,246,0.25) 0%, transparent 70%)`;
      }
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      const glare = el.querySelector('.preview-glow');
      if (glare) glare.style.background = '';
    });
  });

  document.querySelectorAll('.btn-primary, .btn-ghost, .filter-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      if ('ontouchstart' in window) return;
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  const heroContent = document.querySelector('.hero-content');
  if (heroContent && !('ontouchstart' in window)) {
    document.querySelector('#hero').addEventListener('mousemove', e => {
      const rect = heroContent.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroContent.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
    });
    document.querySelector('#hero').addEventListener('mouseleave', () => {
      heroContent.style.transform = '';
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const glowEl = document.createElement('div');
  glowEl.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: -1;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease-out, top 0.15s ease-out;
  `;
  if (!('ontouchstart' in window)) {
    document.body.appendChild(glowEl);
    document.addEventListener('mousemove', e => {
      glowEl.style.left = e.clientX + 'px';
      glowEl.style.top = e.clientY + 'px';
    });
  }

})();
