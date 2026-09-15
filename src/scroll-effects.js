/**
 * NORA — Efeitos Cinéticos de Alta Precisão (Scroll & Mouse Parallax Integral)
 * Editorial Luxury Motion Architecture
 */

export function initScrollEffects() {
  const heroLeaf = document.querySelector('.hero-leaf-art');
  const heroNora = document.querySelector('.hero-display-nora');
  const heroLightBeam = document.querySelector('.hero-sunlight-beam');
  const header = document.querySelector('.site-header-reference');
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');

  // Elementos cinéticos distribuídos por todo o site
  const watermarkNumbers = Array.from(document.querySelectorAll('.section-watermark-num'));
  const kineticCards = Array.from(document.querySelectorAll('.kinetic-card'));
  const kineticFloats = Array.from(document.querySelectorAll('.kinetic-float'));
  const kineticImages = Array.from(document.querySelectorAll('.kinetic-image'));
  const comoFuncionaSection = document.getElementById('como-funciona');
  const timelineFill = document.querySelector('.timeline-progress-fill');

  // 1. Mouse Tracking com amortecimento inercial global
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    targetMouseX = (e.clientX / innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  // 2. Scroll Physics Loop
  let currentScrollY = window.scrollY || window.pageYOffset;
  let targetScrollY = currentScrollY;

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY || window.pageYOffset;
  }, { passive: true });

  function tick() {
    // Lerp mouse inercial
    mouseX += (targetMouseX - mouseX) * 0.06;
    mouseY += (targetMouseY - mouseY) * 0.06;

    // Lerp scroll
    currentScrollY += (targetScrollY - currentScrollY) * 0.09;

    const windowH = window.innerHeight || document.documentElement.clientHeight;

    // Header fixo refinado com blur na rolagem
    if (header) {
      if (currentScrollY > 30) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // ==========================================
    // CAMADA HERO (REFERÊNCIA PERFEITA PRESERVADA)
    // ==========================================
    if (heroLeaf && currentScrollY < windowH * 1.5) {
      const scrollYOffset = -currentScrollY * 0.22;
      const scrollRotate = currentScrollY * 0.012;
      const tiltX = mouseY * 7;
      const tiltY = -mouseX * 10;
      const posX = mouseX * 18;
      const posY = scrollYOffset + mouseY * 12;

      heroLeaf.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${scrollRotate}deg) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }

    if (heroNora && currentScrollY < windowH * 1.5) {
      const noraScroll = currentScrollY * 0.12;
      const shadowX = 14 - mouseX * 10;
      const shadowY = 18 - mouseY * 10;
      heroNora.style.transform = `translate3d(${-mouseX * 8}px, ${noraScroll}px, 0)`;
      heroNora.style.textShadow = `${shadowX}px ${shadowY}px 28px rgba(60, 66, 48, 0.2)`;
    }

    if (heroLightBeam && currentScrollY < windowH * 1.5) {
      const beamX = mouseX * 28;
      const beamY = mouseY * 18 + currentScrollY * 0.12;
      heroLightBeam.style.transform = `translate3d(${beamX}px, ${beamY}px, 0) rotate(-22deg)`;
    }

    // ==========================================
    // FÍSICA CINÉTICA DO RESTO DO SITE AO MOVER O MOUSE
    // ==========================================

    // 1. Marcas d'água numéricas de fundo (Parallax suave e amplo)
    watermarkNumbers.forEach((wm) => {
      const rect = wm.getBoundingClientRect();
      if (rect.top < windowH + 120 && rect.bottom > -120) {
        const driftX = mouseX * 24;
        const driftY = mouseY * 16;
        wm.style.transform = `translate3d(${driftX}px, ${driftY}px, 0)`;
      }
    });

    // 2. Cards Editoriais e Painéis (Tilt 3D e flutuação inercial)
    kineticCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < windowH + 100 && rect.bottom > -100) {
        const tiltX = -mouseY * 3.5;
        const tiltY = mouseX * 4.2;
        const transX = mouseX * 7;
        const transY = mouseY * 5;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${transX}px, ${transY}px, 0)`;
      }
    });

    // 3. Badges, Tags e Chips Interativos (Flutuação magnética sutil em oposição)
    kineticFloats.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowH + 60 && rect.bottom > -60) {
        const floatX = -mouseX * 6;
        const floatY = -mouseY * 5;
        el.style.transform = `translate3d(${floatX}px, ${floatY}px, 0)`;
      }
    });

    // 4. Imagens e Molduras Editoriais
    kineticImages.forEach((img) => {
      const rect = img.getBoundingClientRect();
      if (rect.top < windowH + 80 && rect.bottom > -80) {
        const driftX = mouseX * 10;
        const driftY = mouseY * 8;
        img.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) scale(1.015)`;
      }
    });

    // 5. Linha de Progresso Viva na Seção 06 (Método & Fluxo)
    if (comoFuncionaSection && timelineFill) {
      const rect = comoFuncionaSection.getBoundingClientRect();
      const progress = Math.min(Math.max((windowH * 0.72 - rect.top) / (rect.height * 0.78), 0), 1);
      timelineFill.style.width = `${progress * 100}%`;
    }

    // ==========================================
    // MONTAGEM CINEMATOGRÁFICA AO SCROLL
    // ==========================================
    checkReveals();
    requestAnimationFrame(tick);
  }

  // 3. Revelação Cinética de Linhas, Máscaras e Blocos Editoriais
  const revealTargets = Array.from(document.querySelectorAll(
    '.reveal-on-scroll, .vertical-accent-line, .reveal-mask-line, .draw-line-h, .draw-line-v, .stagger-group'
  ));
  let pendingReveals = [...revealTargets];

  function checkReveals() {
    if (pendingReveals.length === 0) return;
    const windowH = window.innerHeight || document.documentElement.clientHeight;

    pendingReveals = pendingReveals.filter((el) => {
      const rect = el.getBoundingClientRect();
      // Revela quando o elemento atinge 93% da altura da tela
      if (rect.top <= windowH * 0.93 && rect.bottom >= -50) {
        el.classList.add('is-revealed');
        return false;
      }
      return true;
    });
  }

  // Inicializa a primeira dobra
  checkReveals();
  requestAnimationFrame(tick);

  // 4. Clique suave no indicador de rolagem da primeira dobra
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const target = document.querySelector('#nosso-proposito');
      if (target) {
        const headerHeight = 76;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  }

  // 5. Efeito magnético refinado nos pills de serviços
  const servicePills = document.querySelectorAll('.olive-service-pill');
  servicePills.forEach(pill => {
    pill.addEventListener('mousemove', (e) => {
      const rect = pill.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      pill.style.transform = `translate3d(${x * 0.1}px, ${y * 0.1 - 2}px, 0)`;
    });

    pill.addEventListener('mouseleave', () => {
      pill.style.transform = '';
    });
  });
}
