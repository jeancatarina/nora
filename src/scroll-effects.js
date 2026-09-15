/**
 * NORA — Efeitos Cinéticos de Alta Precisão (Scroll & Mouse Parallax Integral)
 * Editorial Luxury Motion Architecture
 */

export function initScrollEffects() {
  const heroLeaf = document.querySelector('.hero-leaf-art');
  const heroNora = document.querySelector('.hero-display-nora');
  const heroTagline = document.querySelector('.hero-stacked-tagline');
  const heroSubtitle = document.querySelector('.hero-reference-subtitle');
  const heroLightBeam = document.querySelector('.hero-sunlight-beam');
  const header = document.querySelector('.site-header-reference');
  const headerLogo = document.querySelector('.header-logo-serif');
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

  // 1.5. Geometria Dinâmica para Morphing de Marca de Alta Fidelidade
  let restingDeltaX = -280;
  let restingDeltaY = -320;
  let morphTargetScale = 0.28;

  function updateMorphGeometry() {
    if (!headerLogo || !heroNora) return;
    const prevHeroT = heroNora.style.transform;
    const prevHeaderT = headerLogo.style.transform;
    heroNora.style.transform = 'none';
    headerLogo.style.transform = 'none';

    const hRect = headerLogo.getBoundingClientRect();
    const nRect = heroNora.getBoundingClientRect();
    const scrollYNow = window.scrollY || window.pageYOffset;

    heroNora.style.transform = prevHeroT;
    headerLogo.style.transform = prevHeaderT;

    if (nRect.width > 0 && hRect.width > 0) {
      restingDeltaX = hRect.left - nRect.left;
      restingDeltaY = hRect.top - (nRect.top + scrollYNow);
      morphTargetScale = Math.min(Math.max(hRect.height / nRect.height, 0.20), 0.40);
    }
  }

  updateMorphGeometry();
  window.addEventListener('resize', updateMorphGeometry, { passive: true });

  // 2. Scroll Physics Loop
  const urlScroll = parseInt(new URLSearchParams(window.location.search).get('scroll') || '0', 10);
  let currentScrollY = urlScroll > 0 ? urlScroll : (window.scrollY || window.pageYOffset);
  let targetScrollY = currentScrollY;
  if (urlScroll > 0) {
    window.scrollTo(0, urlScroll);
  }

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
      if (currentScrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // ==========================================
    // TRANSIÇÃO DE MARCA NORA (HERO -> HEADER MORPH)
    // Na primeira página não aparece o NORA no header;
    // Conforme o scroll desce, o NORA monumental do hero
    // sobe, reduz e se transforma de forma contínua no NORA do header.
    // ==========================================
    const morphDistance = 280;
    const morphP = Math.min(Math.max(currentScrollY / morphDistance, 0), 1);

    // 1. NORA Monumental do Hero (metamorfose, redução e voo até a posição do header)
    if (heroNora && currentScrollY < windowH * 1.5) {
      if (morphP < 1) {
        const easeP = morphP * morphP * (3 - 2 * morphP);
        const noraScale = 1 - ((1 - morphTargetScale) * easeP);
        const noraTransX = -mouseX * 8 * (1 - easeP) + (restingDeltaX * easeP);
        const noraTransY = (restingDeltaY + currentScrollY) * easeP;
        
        const noraOpacity = morphP < 0.65 ? 1 : Math.max(1 - ((morphP - 0.65) / 0.35), 0);
        const shadowAlpha = 0.2 * (1 - morphP);
        const shadowSpread = 28 * (1 - morphP);
        const shadowX = (14 - mouseX * 10) * (1 - morphP);
        const shadowY = (18 - mouseY * 10) * (1 - morphP);

        heroNora.style.transform = `translate3d(${noraTransX}px, ${noraTransY}px, 0) scale(${noraScale})`;
        heroNora.style.opacity = `${noraOpacity}`;
        heroNora.style.textShadow = `${shadowX}px ${shadowY}px ${shadowSpread}px rgba(60, 66, 48, ${shadowAlpha})`;
      } else {
        heroNora.style.opacity = '0';
      }
    }

    // 2. Logo NORA no Header (surge e assume o posto no exato instante da atracação)
    if (headerLogo) {
      if (morphP <= 0.65) {
        headerLogo.style.opacity = '0';
        headerLogo.style.pointerEvents = 'none';
        headerLogo.style.transform = 'translate3d(0, 0, 0) scale(1)';
      } else if (morphP < 1) {
        const dockProgress = (morphP - 0.65) / 0.35;
        headerLogo.style.opacity = `${dockProgress}`;
        headerLogo.style.pointerEvents = morphP >= 0.85 ? 'auto' : 'none';
        headerLogo.style.transform = 'translate3d(0, 0, 0) scale(1)';
      } else {
        headerLogo.style.opacity = '1';
        headerLogo.style.pointerEvents = 'auto';
        headerLogo.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
    }

    // 3. Textos do Hero (tagline e subtítulo esvanecem suavemente durante a transição da marca)
    if (heroTagline && currentScrollY < windowH * 1.5) {
      heroTagline.style.opacity = `${Math.max(1 - (morphP * 1.5), 0)}`;
    }
    if (heroSubtitle && currentScrollY < windowH * 1.5) {
      heroSubtitle.style.opacity = `${Math.max(1 - (morphP * 1.5), 0)}`;
    }

    // 4. Indicador de scroll (desaparece nos primeiros pixels rolados)
    if (scrollIndicator && currentScrollY < windowH * 0.8) {
      scrollIndicator.style.opacity = `${Math.max(1 - (currentScrollY / 120), 0)}`;
      scrollIndicator.style.pointerEvents = currentScrollY > 100 ? 'none' : 'auto';
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
