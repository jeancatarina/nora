/**
 * NORA — Efeitos Cinéticos de Alta Precisão (Scroll & Mouse Parallax)
 * Editorial Luxury Motion Architecture
 */

export function initScrollEffects() {
  const heroLeaf = document.querySelector('.hero-leaf-art');
  const heroNora = document.querySelector('.hero-display-nora');
  const heroLightBeam = document.querySelector('.hero-sunlight-beam');
  const header = document.querySelector('.site-header-reference');
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');

  // 1. Mouse Tracking com amortecimento inercial
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
    // Lerp mouse
    mouseX += (targetMouseX - mouseX) * 0.06;
    mouseY += (targetMouseY - mouseY) * 0.06;

    // Lerp scroll
    currentScrollY += (targetScrollY - currentScrollY) * 0.09;

    // Header fixo refinado com blur na rolagem
    if (header) {
      if (currentScrollY > 30) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // Parallax orgânico da folha botânica:
    // Flutua suavemente com o mouse em 3D e sobe suavemente no scroll
    if (heroLeaf) {
      const scrollYOffset = -currentScrollY * 0.22;
      const scrollRotate = currentScrollY * 0.012;
      const tiltX = mouseY * 7;
      const tiltY = -mouseX * 10;
      const posX = mouseX * 18;
      const posY = scrollYOffset + mouseY * 12;

      heroLeaf.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${scrollRotate}deg) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }

    // Parallax óptico do título NORA + Sombra que reage ao ângulo de luz
    if (heroNora) {
      const noraScroll = currentScrollY * 0.12;
      const shadowX = 14 - mouseX * 10;
      const shadowY = 18 - mouseY * 10;
      heroNora.style.transform = `translate3d(${-mouseX * 8}px, ${noraScroll}px, 0)`;
      heroNora.style.textShadow = `${shadowX}px ${shadowY}px 28px rgba(60, 66, 48, 0.2)`;
    }

    // Feixe de luz natural e sombras dinâmicas no fundo
    if (heroLightBeam) {
      const beamX = mouseX * 28;
      const beamY = mouseY * 18 + currentScrollY * 0.12;
      heroLightBeam.style.transform = `translate3d(${beamX}px, ${beamY}px, 0) rotate(-22deg)`;
    }

    checkReveals();
    requestAnimationFrame(tick);
  }

  // 3. Revelação Cinética de Linhas Verticais e Conteúdos Editoriais
  const revealElements = Array.from(document.querySelectorAll('.reveal-on-scroll'));
  const lineIndicators = Array.from(document.querySelectorAll('.vertical-accent-line'));
  let pendingElements = [...revealElements, ...lineIndicators];

  function checkReveals() {
    if (pendingElements.length === 0) return;
    const windowH = window.innerHeight || document.documentElement.clientHeight;
    pendingElements = pendingElements.filter((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowH * 0.94 && rect.bottom >= -50) {
        el.classList.add('is-revealed');
        return false;
      }
      return true;
    });
  }

  // Revela elementos visíveis imediatamente
  checkReveals();
  requestAnimationFrame(tick);

  // 4. Clique suave no indicador de rolagem
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

  // 5. Efeito magnético suave nos cards de serviços (Seção 02)
  const servicePills = document.querySelectorAll('.olive-service-pill');
  servicePills.forEach(pill => {
    pill.addEventListener('mousemove', (e) => {
      const rect = pill.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      pill.style.transform = `translate3d(${x * 0.08}px, ${y * 0.08 - 2}px, 0)`;
    });

    pill.addEventListener('mouseleave', () => {
      pill.style.transform = '';
    });
  });
}
