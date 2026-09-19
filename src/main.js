import { initEditorialMotion } from './editorial-motion.js';

const WHATSAPP_NUMBER = '5547988639872';
initEditorialMotion();

document.documentElement.classList.add('js');

const menuToggle = document.querySelector('#menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const modal = document.querySelector('#quote-modal');
const modalClose = document.querySelector('#modal-close');
const quoteForm = document.querySelector('#quote-form');
const firstModalField = document.querySelector('#form-name');
const notesField = document.querySelector('#form-notes');
const defaultNotesPlaceholder = notesField?.getAttribute('placeholder') || '';
let lastFocusedElement = null;

function setMenu(open) {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileNav.setAttribute('aria-hidden', String(!open));
  mobileNav.classList.toggle('is-open', open);
  menuToggle.classList.toggle('is-active', open);
  if (open) mobileNav.removeAttribute('inert');
  else {
    mobileNav.setAttribute('inert', '');
    if (mobileNav.contains(document.activeElement)) menuToggle.focus();
  }
  if (open) window.requestAnimationFrame(() => mobileNav.querySelector('a, button')?.focus());
}

menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileNav?.querySelectorAll('a, button').forEach((link) => link.addEventListener('click', () => setMenu(false)));

function openModal(context = '') {
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  document.querySelectorAll('body > header, body > main, body > footer').forEach(element => { element.inert = true; });
  if (notesField) notesField.placeholder = context
    ? `Interesse inicial: ${context}. Conte brevemente o que está pesando na sua rotina...`
    : defaultNotesPlaceholder;
  window.requestAnimationFrame(() => firstModalField?.focus());
}

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  document.querySelectorAll('body > header, body > main, body > footer').forEach(element => { element.inert = false; });
  lastFocusedElement?.focus?.();
}

document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    if (trigger.tagName === 'A') event.preventDefault();
    openModal(trigger.dataset.context || '');
  });
});

modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (modal && !modal.hidden && event.key === 'Tab') {
    const focusable = [...modal.querySelectorAll('button, input, textarea, select, a[href]')]
      .filter((element) => !element.disabled && element.getClientRects().length);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (first && last) {
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }
  if (event.key === 'Escape') {
    if (modal && !modal.hidden) closeModal();
    else if (menuToggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  }
});

quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(quoteForm);
  const areas = data.getAll('areas');
  const name = data.get('name') || '';
  const segment = data.get('segment') || '';
  const phone = data.get('phone') || '';
  const notes = data.get('notes') || 'A definir em conversa';
  const message = [
    'Olá, Norah! Gostaria de conversar sobre a operação do meu negócio.',
    '',
    `Nome: ${name}`,
    `Profissão ou segmento: ${segment}`,
    `Meu WhatsApp: ${phone}`,
    `Frentes de interesse: ${areas.length ? areas.join(', ') : 'A definir em conversa'}`,
    `O que está pesando na rotina: ${notes}`,
    '',
    'Podemos entender juntos o escopo ideal?'
  ].join('\n');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  closeModal();
});

const header = document.querySelector('.site-header');
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(() => {
    header?.classList.toggle('is-scrolled', window.scrollY > 18);
    scrollTicking = false;
  });
}, { passive: true });

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-heading, .service-item, .process-grid li, .capacity-card, .faq-list details').forEach((element) => observer.observe(element));
}
