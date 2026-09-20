const WHATSAPP_NUMBER = '5547988639872';
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('#menu-toggle');
const navigation = document.querySelector('#mobile-nav');
const modal = document.querySelector('#quote-modal');
const modalClose = document.querySelector('#modal-close');
const form = document.querySelector('#quote-form');
const areaField = document.querySelector('#form-area');
let lastFocused = null;

function setMenu(open) {
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menuToggle?.classList.toggle('active', open);
  navigation?.classList.toggle('open', open);
  navigation?.setAttribute('aria-hidden', String(!open));
  if (open) navigation?.removeAttribute('inert'); else navigation?.setAttribute('inert', '');
}

function setContext(context) {
  if (!areaField) return;
  const match = [...areaField.options].find(option => option.value === context || context.includes(option.value));
  areaField.value = match?.value || '';
}

function openModal(context = '') {
  if (!modal) return;
  lastFocused = document.activeElement;
  setContext(context);
  modal.hidden = false;
  document.body.classList.add('modal-open');
  document.querySelectorAll('body > header, body > main, body > footer').forEach(element => { element.inert = true; });
  requestAnimationFrame(() => areaField?.focus());
}

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  document.querySelectorAll('body > header, body > main, body > footer').forEach(element => { element.inert = false; });
  lastFocused?.focus?.();
}

menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
navigation?.querySelectorAll('a, button').forEach(item => item.addEventListener('click', () => setMenu(false)));
document.querySelectorAll('[data-open-modal]').forEach(trigger => trigger.addEventListener('click', event => {
  if (trigger.tagName === 'A') event.preventDefault();
  openModal(trigger.dataset.context || '');
}));
modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (modal && !modal.hidden) closeModal();
    else if (menuToggle?.getAttribute('aria-expanded') === 'true') setMenu(false);
  }
  if (event.key !== 'Tab' || !modal || modal.hidden) return;
  const focusable = [...modal.querySelectorAll('button,input,textarea,select')].filter(element => !element.disabled);
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

form?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const segment = String(data.get('segment') || '').trim();
  const area = String(data.get('area') || '').trim();
  const notes = String(data.get('notes') || '').trim();
  const message = ['Olá, Norah! Gostaria de conversar sobre a operação do meu negócio.'];
  if (name) message.push('', `Meu nome: ${name}`);
  if (segment) message.push(`Profissão ou segmento: ${segment}`);
  if (area) message.push(`Frente de interesse: ${area}`);
  if (notes) message.push(`O que está pesando na rotina: ${notes}`);
  message.push('', 'Podemos entender juntos o escopo ideal?');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message.join('\n'))}`, '_blank', 'noopener,noreferrer');
  closeModal();
});

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { header?.classList.toggle('scrolled', scrollY > 28); ticking = false; });
}, { passive: true });
