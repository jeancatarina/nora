import { initScene3D } from './scene3d.js';
import { initCalculator } from './calculator.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializa Three.js 3D
  initScene3D('canvas-container');

  // 2. Inicializa Calculadora Operacional
  initCalculator();

  // 3. Controle do Card 4 — Monte do seu jeito (Seleção de Tags)
  const chipButtons = document.querySelectorAll('.custom-chip');
  const selectedTags = new Set();

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
    });
  });

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

  // 4. Modal de Solicitação de Orçamento
  const modalBackdrop = document.getElementById('quote-modal');
  const openModalButtons = document.querySelectorAll('[data-open-modal="quote"]');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const quoteForm = document.getElementById('quote-form');

  function openModal(presetContext = '') {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Se veio de um card específico
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

  // 5. Envio do Formulário de Orçamento com Integração WhatsApp
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value || '';
      const segment = document.getElementById('form-segment')?.value || '';
      const phone = document.getElementById('form-phone')?.value || '';
      const email = document.getElementById('form-email')?.value || '';
      const notes = document.getElementById('form-notes')?.value || '';
      const services = Array.from(selectedTags).join(', ') || 'A definir no alinhamento';

      // Mensagem personalizada estruturada para WhatsApp
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

      // Exibe estado de sucesso e redireciona
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

  // 6. Menu Mobile
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

  // 7. Efeito sutil no Header ao rolar
  const headerEl = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      headerEl?.classList.add('is-scrolled');
    } else {
      headerEl?.classList.remove('is-scrolled');
    }
  }, { passive: true });
});
