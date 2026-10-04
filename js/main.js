
const toggle = document.querySelector('[data-menu-toggle]');
const mobile = document.querySelector('[data-mobile-nav]');
if (toggle && mobile) {
  toggle.addEventListener('click', () => {
    const isOpen = mobile.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobile.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
  }));
}
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');
      contactForm.reset();
      formStatus.textContent = 'Thank you. Your message has been sent successfully.';
      formStatus.classList.add('success');
    } catch (error) {
      formStatus.textContent = 'The message could not be sent. Please try again in a moment.';
      formStatus.classList.add('error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

// V6 interactive portfolio filters, reveal effects and scroll progress
(() => {
  const trackButtons = [...document.querySelectorAll('[data-track-filter]')];
  const domainButtons = [...document.querySelectorAll('[data-domain-filter]')];
  const cards = [...document.querySelectorAll('[data-track][data-domain]')];
  const countEl = document.querySelector('[data-project-count]');
  let activeTrack = 'all';
  let activeDomain = 'all';

  const updateCards = () => {
    let visible = 0;
    cards.forEach(card => {
      const matchesTrack = activeTrack === 'all' || card.dataset.track === activeTrack;
      const domains = (card.dataset.domain || '').split(/\s+/);
      const matchesDomain = activeDomain === 'all' || domains.includes(activeDomain);
      const show = matchesTrack && matchesDomain;
      card.classList.toggle('hidden-card', !show);
      if (show) visible += 1;
    });
    if (countEl) countEl.textContent = visible;
  };

  const activate = (buttons, selected, dataKey) => {
    buttons.forEach(button => button.classList.toggle('active', button.dataset[dataKey] === selected));
  };

  trackButtons.forEach(button => button.addEventListener('click', () => {
    activeTrack = button.dataset.trackFilter;
    activate(trackButtons, activeTrack, 'trackFilter');
    updateCards();
  }));

  domainButtons.forEach(button => button.addEventListener('click', () => {
    activeDomain = button.dataset.domainFilter;
    activate(domainButtons, activeDomain, 'domainFilter');
    updateCards();
  }));

  document.querySelectorAll('[data-jump-filter]').forEach(link => link.addEventListener('click', () => {
    activeTrack = link.dataset.jumpFilter;
    activeDomain = 'all';
    activate(trackButtons, activeTrack, 'trackFilter');
    activate(domainButtons, activeDomain, 'domainFilter');
    setTimeout(updateCards, 120);
  }));

  document.querySelectorAll('[data-jump-domain]').forEach(link => link.addEventListener('click', () => {
    activeTrack = 'all';
    activeDomain = link.dataset.jumpDomain;
    activate(trackButtons, activeTrack, 'trackFilter');
    activate(domainButtons, activeDomain, 'domainFilter');
    setTimeout(updateCards, 120);
  }));

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = Number(entry.target.dataset.delay || 0);
          window.setTimeout(() => entry.target.classList.add('is-visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(item => observer.observe(item));
  } else {
    reveals.forEach(item => item.classList.add('is-visible'));
  }

  const progress = document.querySelector('[data-scroll-progress]');
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  // Gentle pointer response on desktop case-study cards.
  if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    cards.forEach(card => {
      card.addEventListener('mousemove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-7px) rotateX(${(-y * 1.5).toFixed(2)}deg) rotateY(${(x * 1.5).toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  updateCards();
})();
