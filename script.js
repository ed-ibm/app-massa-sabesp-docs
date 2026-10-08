'use strict';

const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');
function applyTheme(theme) {
  root.dataset.theme = theme;
  toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  toggle.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
}
try {
  const saved = localStorage.getItem('massa-docs-theme');
  if (saved === 'light' || saved === 'dark') applyTheme(saved);
} catch (_) { /* O tema funciona mesmo sem armazenamento disponível. */ }
toggle.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try { localStorage.setItem('massa-docs-theme', theme); } catch (_) {}
});

const search = document.getElementById('doc-search');
const status = document.getElementById('search-status');
const sections = [...document.querySelectorAll('.content section:not(#guias)')];
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function filterDocs() {
  const query = normalize(search.value.trim());
  let found = 0;
  sections.forEach(section => {
    section.hidden = Boolean(query) && !normalize(section.textContent).includes(query);
    if (!section.hidden) found += 1;
  });
  document.getElementById('guias').hidden = Boolean(query);
  status.hidden = !query;
  status.textContent = found ? `${found} seção(ões) encontrada(s).` : 'Nenhuma seção encontrada. Tente outro termo.';
}
search.addEventListener('input', filterDocs);
search.addEventListener('keydown', event => {
  if (event.key === 'Escape') { search.value = ''; filterDocs(); }
});
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => { search.value = ''; filterDocs(); });
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.nav a, .toc a').forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-60px 0px -65% 0px' });
  sections.forEach(section => observer.observe(section));
}
