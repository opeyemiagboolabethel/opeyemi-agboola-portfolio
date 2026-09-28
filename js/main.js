
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
