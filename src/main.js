import { initScene3D } from './scene3d.js';
import { initCalculator } from './calculator.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializa Instalação Cinética 3D
  initScene3D('canvas-container');

  // 2. Inicializa Calculadora Operacional
  initCalculator();

  // 3. Cursor de Alta Costura (Desktop)
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mousePos = { x: -100, y: -100 };
  let ringPos = { x: -100, y: -100 };

  window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    cursorDot.style.left = `${mousePos.x}px`;
    cursorDot.style.top = `${mousePos.y}px`;
  });

  function updateCursorRing() {
    ringPos.x += (mousePos.x - ringPos.x) * 0.15;
    ringPos.y += (mousePos.y - ringPos.y) * 0.15;
    cursorRing.style.left = `${ringPos.x}px`;
    cursorRing.style.top = `${ringPos.y}px`;
    requestAnimationFrame(updateCursorRing);
  }
  updateCursorRing();

  const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .custom-chip, .service-card, .hiring-card, #canvas-container');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // 4. Controle do Card 4 — Monte do seu jeito (Seleção de Tags & Dossiê Flutuante)
  const chipButtons = document.querySelectorAll('.custom-chip');
  const selectedTags = new Set();
  const floatingDock = document.getElementById('floating-scope-dock');
  const floatingBadge = document.getElementById('floating-scope-count');
  const floatingHours = document.getElementById('floating-scope-hours');

  chipButtons.forEach((chip) => {
    chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-tag');
      if (chip.classList.contains('is-selected')) {
        chip.classList.remove('is-selected');
        selectedTags.delete(tag);
      } else {
        chip.classList.add('is-selected');
        selectedTags.add(tag);
      }
      syncModalTags();
      updateFloatingDock();
    });
  });

  function updateFloatingDock() {
    if (!floatingDock) return;
    const count = selectedTags.size;
    if (count > 0) {
      floatingDock.classList.add('is-visible');
      if (floatingBadge) floatingBadge.textContent = `${count} ${count === 1 ? 'rotina' : 'rotinas'}`;
      if (floatingHours) {
        const estHours = count * 8;
        floatingHours.textContent = `~${estHours}h/mês recuperadas para você`;
      }
    } else {
      floatingDock.classList.remove('is-visible');
    }
  }

  function syncModalTags() {
    const modalTagsContainer = document.getElementById('modal-selected-tags-container');
    const hiddenServicesInput = document.getElementById('form-services-input');
    if (!modalTagsContainer) return;

    modalTagsContainer.innerHTML = '';
    if (selectedTags.size === 0) {
      modalTagsContainer.innerHTML = '<span class="text-caption text-muted" style="font-style: italic;">Nenhum serviço selecionado previamente (você pode descrever sua rotina abaixo).</span>';
      if (hiddenServicesInput) hiddenServicesInput.value = '';
      return;
    }

    const tagsArray = Array.from(selectedTags);
    if (hiddenServicesInput) {
      hiddenServicesInput.value = tagsArray.join(', ');
    }

    tagsArray.forEach((tag) => {
      const pill = document.createElement('span');
      pill.className = 'selected-tag-pill';
      pill.textContent = tag;
      modalTagsContainer.appendChild(pill);
    });
  }

  // 5. Modal de Solicitação de Orçamento
  const modalBackdrop = document.getElementById('quote-modal');
  const openModalButtons = document.querySelectorAll('[data-open-modal="quote"]');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const quoteForm = document.getElementById('quote-form');

  function openModal(presetContext = '') {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    if (presetContext && presetContext !== 'custom') {
      const notesField = document.getElementById('form-notes');
      if (notesField && !notesField.value.includes(presetContext)) {
        notesField.placeholder = `Interesse inicial: ${presetContext}. Conte brevemente sua rotina e principais necessidades...`;
      }
    }
    syncModalTags();
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  openModalButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const context = btn.getAttribute('data-context') || '';
      openModal(context);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('is-active')) {
      closeModal();
    }
  });

  // 6. Envio do Formulário de Orçamento com Integração WhatsApp
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value || '';
      const segment = document.getElementById('form-segment')?.value || '';
      const phone = document.getElementById('form-phone')?.value || '';
      const email = document.getElementById('form-email')?.value || '';
      const notes = document.getElementById('form-notes')?.value || '';
      const services = Array.from(selectedTags).join(', ') || 'A definir no alinhamento';

      const waMessage = `Olá, NORA! Gostaria de solicitar um orçamento personalizado.\n\n` +
        `• *Nome*: ${name}\n` +
        `• *Atividade/Segmento*: ${segment}\n` +
        `• *WhatsApp*: ${phone}\n` +
        `• *E-mail*: ${email}\n` +
        `• *Serviços de interesse*: ${services}\n` +
        (notes ? `• *Detalhes da rotina*: ${notes}\n` : '') +
        `\nPodemos agendar uma conversa para entender o escopo ideal?`;

      const encodedMessage = encodeURIComponent(waMessage);
      const waUrl = `https://wa.me/5511999990000?text=${encodedMessage}`;

      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '✓ Enviando para atendimento WhatsApp...';
        submitBtn.classList.add('btn-oliva');
      }

      setTimeout(() => {
        window.open(waUrl, '_blank');
        closeModal();
        if (submitBtn) {
          submitBtn.innerHTML = 'Enviar solicitação de orçamento';
          submitBtn.classList.remove('btn-oliva');
        }
      }, 700);
    });
  }

  // 7. Menu Mobile
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        mobileDrawer.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('is-open');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 8. Header scroll
  const headerEl = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      headerEl?.classList.add('is-scrolled');
    } else {
      headerEl?.classList.remove('is-scrolled');
    }
  }, { passive: true });
});
