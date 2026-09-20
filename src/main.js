import { initEditorialMotion } from './editorial-motion.js';

const WHATSAPP_NUMBER = '5547988639872';
const pageRegions = document.querySelectorAll('body > header, body > main, body > footer');
const menuToggle = document.querySelector('#menu-toggle');
const navigation = document.querySelector('#mobile-nav');
const modal = document.querySelector('#quote-modal');
const modalClose = document.querySelector('#modal-close');
const form = document.querySelector('#quote-form');
const areaField = document.querySelector('#form-area');
let lastFocusedElement;

document.documentElement.classList.add('js');

let motionStarted = false;
function startEditorialMotion() {
  if (motionStarted) return;
  motionStarted = true;
  initEditorialMotion();
}

window.addEventListener('scroll', startEditorialMotion, { once: true, passive: true });
window.addEventListener('pointerdown', startEditorialMotion, { once: true, passive: true });
window.addEventListener('keydown', startEditorialMotion, { once: true });

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(startEditorialMotion, { timeout: 3000 });
} else {
  window.setTimeout(startEditorialMotion, 1200);
}

function setMenu(isOpen) {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  menuToggle.classList.toggle('active', isOpen);
  navigation.classList.toggle('open', isOpen);
  navigation.setAttribute('aria-hidden', String(!isOpen));
  if (isOpen) {
    navigation.removeAttribute('inert');
    requestAnimationFrame(() => navigation.querySelector('a, button')?.focus());
  } else {
    navigation.setAttribute('inert', '');
  }
}

function setContext(context) {
  if (!areaField) return;
  const matchingOption = [...areaField.options].find(({ value }) => value && (value === context || context.includes(value)));
  areaField.value = matchingOption?.value ?? '';
}

function openModal(context = '') {
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  setContext(context);
  modal.hidden = false;
  document.body.classList.add('modal-open');
  pageRegions.forEach((region) => { region.inert = true; });
  requestAnimationFrame(() => areaField?.focus());
}

function closeModal() {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  pageRegions.forEach((region) => { region.inert = false; });
  lastFocusedElement?.focus?.();
}

menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
navigation?.querySelectorAll('a, button').forEach((item) => item.addEventListener('click', () => setMenu(false)));

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
  if (event.key === 'Escape') {
    if (modal && !modal.hidden) closeModal();
    else if (menuToggle?.getAttribute('aria-expanded') === 'true') setMenu(false);
    return;
  }

  if (event.key !== 'Tab' || !modal || modal.hidden) return;
  const focusable = [...modal.querySelectorAll('button, input, textarea, select')]
    .filter((element) => !element.disabled && element.getClientRects().length);
  const first = focusable[0];
  const last = focusable.at(-1);
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const optionalFields = [
    ['Meu nome', data.get('name')],
    ['Profissão ou segmento', data.get('segment')],
    ['Frente de interesse', data.get('area')],
    ['O que está pesando na rotina', data.get('notes')]
  ].map(([label, value]) => [label, String(value || '').trim()]).filter(([, value]) => value);

  const message = [
    'Olá, Norah! Gostaria de conversar sobre a operação do meu negócio.',
    ...optionalFields.flatMap(([label, value], index) => [index === 0 ? '' : null, `${label}: ${value}`]).filter(Boolean),
    '',
    'Podemos entender juntos o escopo ideal?'
  ].join('\n');

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  closeModal();
});
