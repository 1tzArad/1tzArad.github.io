/* ===== PARTICLE SYSTEM ===== */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const count = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 25000));
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.15,
        color: '#FFFFFF',
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Mouse interaction
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.x += (dx / dist) * force * 2;
        p.y += (dy / dist) * force * 2;
        p.opacity = Math.min(1, p.opacity + 0.1);
      } else {
        p.opacity = Math.max(0.15, p.opacity - 0.01);
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx2 = p.x - p2.x;
        const dy2 = p.y - p2.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (dist2 < 150) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = p.color;
          this.ctx.globalAlpha = (1 - dist2 / 150) * 0.2;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

/* ===== SCROLL ANIMATIONS ===== */
class ScrollAnimations {
  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-reveal');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    this.initObserver();
  }

  initObserver() {
    document.querySelectorAll('.skill-category, .project-card').forEach((el) => {
      this.observer.observe(el);
    });
  }
}

/* ===== NAVIGATION ===== */
class Navigation {
  constructor() {
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMenu = document.querySelector('.navbar-menu');
    this.navLinks = document.querySelectorAll('.nav-link');

    this.initToggle();
    this.initScrollSpy();
  }

  initToggle() {
    this.navToggle.addEventListener('click', () => {
      this.navMenu.classList.toggle('active');
    });

    this.navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        this.navMenu.classList.remove('active');
      });
    });
  }

  initScrollSpy() {
    const sections = document.querySelectorAll('.section');

    const handleScroll = () => {
      let current = '';

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      this.navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
  }
}

/* ===== GITHUB API ===== */
class GitHubProjects {
  constructor() {
    this.username = '1tzArad';
    this.container = document.getElementById('projects-container');
    this.fetchProjects();
  }

  async fetchProjects() {
    try {
      const response = await fetch(
        `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=12&type=all`
      );

      if (!response.ok) throw new Error('GitHub API error');

      const repos = await response.json();
      this.renderProjects(repos);
    } catch (error) {
      console.error('Error fetching projects:', error);
      this.container.innerHTML = `
        <div class="loading-state" style="grid-column: 1 / -1;">
          <p>Unable to load projects. Please visit <a href="https://github.com/${this.username}" target="_blank" rel="noreferrer">GitHub</a> directly.</p>
        </div>
      `;
    }
  }

  renderProjects(repos) {
    this.container.innerHTML = '';

    repos.forEach((repo, index) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.style.animationDelay = `${index * 0.1}s`;

      const language = repo.language || 'JavaScript';
      const stars = repo.stargazers_count || 0;

      card.innerHTML = `
        <div class="project-header">
          <h3 class="project-title">${this.escapeHtml(repo.name)}</h3>
          <a href="${repo.html_url}" target="_blank" rel="noreferrer" class="project-link" title="Open on GitHub">↗</a>
        </div>
        <p class="project-desc">${this.escapeHtml(repo.description || 'No description provided')}</p>
        <div class="project-meta">
          ${language ? `<span class="project-lang">${this.escapeHtml(language)}</span>` : ''}
          ${stars > 0 ? `<span class="project-stars">⭐ ${stars}</span>` : ''}
        </div>
      `;

      this.container.appendChild(card);
    });
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/* ===== POINTER EFFECTS ===== */
class PointerEffects {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.position.x = e.clientX;
      this.position.y = e.clientY;
      this.updateLighting();
    });
  }

  updateLighting() {
    const ambientLights = document.querySelectorAll('.ambient-light');
    ambientLights.forEach((light, index) => {
      const angle = Math.atan2(
        this.position.y - light.offsetTop - light.offsetHeight / 2,
        this.position.x - light.offsetLeft - light.offsetWidth / 2
      );

      const distance = Math.hypot(
        this.position.x - (light.offsetLeft + light.offsetWidth / 2),
        this.position.y - (light.offsetTop + light.offsetHeight / 2)
      );

      const opacity = Math.max(0.02, 0.1 - distance / 3000);
      light.style.opacity = opacity;
    });
  }
}

/* ===== SMOOTH SCROLL ===== */
class SmoothScroll {
  constructor() {
    this.initLinks();
  }

  initLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));

        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }
}

/* ===== HERO TEXT ANIMATION ===== */
class HeroAnimation {
  constructor() {
    this.init();
  }

  init() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    // Split words and wrap in spans for animation
    const words = heroTitle.querySelectorAll('.word');
    words.forEach((word, index) => {
      word.style.animationDelay = `${0.2 + index * 0.2}s`;
    });
  }
}

/* ===== BUTTON INTERACTIONS ===== */
class ButtonInteractions {
  constructor() {
    this.initButtons();
  }

  initButtons() {
    document.querySelectorAll('.cta-button, .contact-link').forEach((button) => {
      button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.98)';
      });

      button.addEventListener('mouseup', () => {
        button.style.transform = '';
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });
  }
}

/* ===== MAIN INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize particle system
  const canvas = document.getElementById('particle-canvas');
  if (canvas && canvas.getContext) {
    new ParticleSystem(canvas);
  }

  // Initialize all systems
  new Navigation();
  new ScrollAnimations();
  new GitHubProjects();
  new PointerEffects();
  new SmoothScroll();
  new HeroAnimation();
  new ButtonInteractions();

  // Page entrance animation
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.style.opacity = '1';
  }

  console.log('A0Zero portfolio initialized ✨');
});

/* ===== WINDOW EVENTS ===== */
window.addEventListener('load', () => {
  // Ensure all animations are applied
  document.body.style.opacity = '1';
});
