(function(){
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('primaryNav');
  const toggle = document.getElementById('menuToggle');
  const backToTop = document.getElementById('backToTop');
  const themeToggle = document.getElementById('themeToggle');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }));
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          o.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  if (nav) {
    const map = new Map();
    nav.querySelectorAll('a').forEach(a => map.set(a.getAttribute('href')?.replace('#',''), a));
    if ('IntersectionObserver' in window) {
      const so = new IntersectionObserver((entries) => {
        entries.forEach(ent => {
          const id = ent.target.id;
          const link = map.get(id);
          if (!link) return;
          if (ent.isIntersecting) {
            nav.querySelectorAll('a').forEach(x => x.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0.01 });
      ['home','skills','projects','experience','contact'].forEach(id => {
        const el = document.getElementById(id);
        if (el) so.observe(el);
      });
    }
  }

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    header?.classList.toggle('scrolled', y > 10);
    backToTop?.classList.toggle('show', y > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = this.name.value;
      const out = document.getElementById('formResult');
      const endpoint = this.getAttribute('data-form-endpoint');
      if (endpoint) {
        fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: this.name.value, email: this.email.value, message: this.message.value }) })
          .then(() => { if (out) out.textContent = `Thanks, ${name}! I'll get back to you soon.`; this.reset(); })
          .catch(() => { if (out) out.textContent = 'Something went wrong. Please email me directly.'; });
      } else {
        if (out) out.textContent = `Thanks, ${name}! I'll get back to you soon. (Demo form — set data-form-endpoint to enable sending)`;
        this.reset();
      }
    });
  }

  // Project search
  const projectSearch = document.getElementById('projectSearch');
  if (projectSearch) {
    const grid = document.getElementById('projectGrid');
    const cards = grid ? Array.from(grid.querySelectorAll('.project')) : [];
    const filter = () => {
      const term = projectSearch.value.trim().toLowerCase();
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const tags = (card.getAttribute('data-tags') || '').toLowerCase();
        const visible = !term || text.includes(term) || tags.includes(term);
        card.style.display = visible ? '' : 'none';
      });
    };
    projectSearch.addEventListener('input', filter);
  }

  // Theme toggle with persistence
  const applyTheme = (t) => {
    document.body.classList.toggle('theme-dark', t === 'dark');
  };
  const preferred = localStorage.getItem('theme');
  if (preferred) applyTheme(preferred);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('theme-dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // Copy email helper
  const copyEmailBtn = document.getElementById('copyEmail');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'you@example.com';
      try {
        await navigator.clipboard.writeText(email);
        const out = document.getElementById('formResult');
        if (out) out.textContent = 'Email copied to clipboard!';
      } catch {
        window.prompt('Copy email:', email);
      }
    });
  }
})();


