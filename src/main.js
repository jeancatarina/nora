import { initCalculator } from './calculator.js';
import { initScrollEffects } from './scroll-effects.js';

// Previne restauração indesejada de rolagem e limpa hashes residuais
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);

  // 1. Inicializa Efeitos de Scroll & Parallax da Referência
  initScrollEffects();

  // 2. Inicializa Calculadora Operacional
  initCalculator();

  // 2. Cursor de Alta Costura (Desktop)
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

  const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .custom-chip, .monograph-row, .practice-item, .toggle-tab');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // 3. Controle Interativo: "Antes da NORA vs Com a NORA" (Vida & Emoção Real)
  const toggleBtnAntes = document.getElementById('toggle-state-antes');
  const toggleBtnDepois = document.getElementById('toggle-state-depois');
  const panelAntes = document.getElementById('panel-state-antes');
  const panelDepois = document.getElementById('panel-state-depois');

  if (toggleBtnAntes && toggleBtnDepois && panelAntes && panelDepois) {
    toggleBtnAntes.addEventListener('click', () => {
      toggleBtnAntes.classList.add('is-active');
      toggleBtnDepois.classList.remove('is-active');
      panelAntes.classList.add('is-active');
      panelDepois.classList.remove('is-active');
    });

    toggleBtnDepois.addEventListener('click', () => {
      toggleBtnDepois.classList.add('is-active');
      toggleBtnAntes.classList.remove('is-active');
      panelDepois.classList.add('is-active');
      panelAntes.classList.remove('is-active');
    });
  }

  // 4. Diálogo Interativo WhatsApp (Como a NORA fala com o seu cliente)
  const dialogTabs = document.querySelectorAll('.dialog-tab-btn');
  const dialogMessages = document.querySelectorAll('.dialog-message-pane');

  dialogTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetKey = tab.getAttribute('data-dialog');
      dialogTabs.forEach(t => t.classList.remove('is-active'));
      dialogMessages.forEach(m => m.classList.remove('is-active'));

      tab.classList.add('is-active');
      const activePane = document.getElementById(`dialog-pane-${targetKey}`);
      if (activePane) activePane.classList.add('is-active');
    });
  });

  // 5. Controle do Card 4 — Monte do seu jeito (Seleção de Tags & Dossiê Flutuante)
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

  // 6. Modal de Orçamento
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

  // 7. Envio do Formulário WhatsApp
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
        submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:6px;"><polyline points="20 6 9 17 4 12"></polyline></svg> Abrindo conversa no WhatsApp...';
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

  // 8. Menu Mobile & Drawer Interativo
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        mobileDrawer.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('is-open');
        menuToggle.classList.add('is-active');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fechar gaveta ao clicar fora
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('is-open') && !mobileDrawer.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileDrawer.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 9. Header scroll (Suavidade & Glassmorphism)
  const headerEl = document.querySelector('.site-header-reference, .site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      headerEl?.classList.add('is-scrolled');
    } else {
      headerEl?.classList.remove('is-scrolled');
    }
  }, { passive: true });

  // 10. Navegação Suave em Âncoras sem Reter Hash Residual
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#quote-modal')) return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();

        // Fechar gaveta mobile se estiver aberta
        if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
          mobileDrawer.classList.remove('is-open');
          menuToggle?.classList.remove('is-active');
          menuToggle?.setAttribute('aria-expanded', 'false');
        }

        const headerHeight = 76;
        const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - (href === '#inicio' ? 0 : headerHeight);

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        // Limpa a hash da URL para que futuros acessos ou reloads sempre iniciem no topo (Hero NORA)
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    });
  });
});
