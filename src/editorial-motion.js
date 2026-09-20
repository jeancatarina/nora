const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function initEditorialMotion() {
  const header = document.querySelector('.site-header');
  const logo = document.querySelector('.header-logo');
  const hero = document.querySelector('.hero');
  const brand = document.querySelector('.hero-word');
  const copy = [...document.querySelectorAll('.hero h1, .hero-intro, .hero .text-link')];
  const leaf = document.querySelector('.hero-leaf');
  const revealTargets = [...document.querySelectorAll('.section, .final-cta, footer')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  let heroVisible = true;
  let origin;
  let destination;
  let pointerX = 0;
  let pointerY = 0;
  let frameId = 0;

  if (!header || !logo || !hero || !brand) return;

  function measure() {
    const transform = brand.style.transform;
    brand.style.transform = 'none';
    const brandBox = brand.getBoundingClientRect();
    const logoBox = logo.getBoundingClientRect();
    brand.style.transform = transform;
    origin = { x: brandBox.left, y: brandBox.top + window.scrollY, width: brandBox.width };
    destination = { x: logoBox.left, y: logoBox.top, width: logoBox.width };
    schedule();
  }

  function render() {
    frameId = 0;
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 40);

    if (reducedMotion.matches || !origin || !destination) {
      brand.style.transform = '';
      brand.style.opacity = '1';
      logo.style.opacity = '1';
      logo.style.pointerEvents = 'auto';
      logo.tabIndex = 0;
      copy.forEach((element) => { element.style.opacity = '1'; });
      leaf?.style.removeProperty('transform');
      return;
    }

    const progress = clamp(scrollY / 280, 0, 1);
    const eased = progress * progress * (3 - 2 * progress);
    const targetScale = clamp(destination.width / origin.width, 0.18, 0.42);
    const scale = 1 - (1 - targetScale) * eased;
    const translateX = (destination.x - origin.x) * eased;
    const translateY = (destination.y - origin.y + scrollY) * eased;
    const fading = clamp((progress - 0.65) / 0.35, 0, 1);

    if (heroVisible || progress < 1) {
      brand.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
      brand.style.opacity = String(1 - fading);
    }
    logo.style.opacity = String(fading);
    logo.style.pointerEvents = progress > 0.84 ? 'auto' : 'none';
    logo.tabIndex = progress > 0.84 ? 0 : -1;

    copy.forEach((element) => { element.style.opacity = String(1 - clamp(progress * 1.25, 0, 1)); });
    if (leaf && heroVisible) {
      const vertical = -scrollY * 0.12 + pointerY * 8;
      leaf.style.transform = `translate3d(${pointerX * 10}px, ${vertical}px, 0) rotate(${scrollY * 0.004}deg)`;
    }
  }

  function schedule() {
    if (!frameId) frameId = window.requestAnimationFrame(render);
  }

  const heroObserver = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    schedule();
  }, { rootMargin: '150px 0px' });
  heroObserver.observe(hero);

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8%', threshold: 0.08 });
  revealTargets.forEach((target) => revealObserver.observe(target));

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  reducedMotion.addEventListener('change', schedule);
  if (finePointer.matches) {
    window.addEventListener('pointermove', (event) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
      if (heroVisible) schedule();
    }, { passive: true });
  }

  document.fonts.ready.then(measure);
  measure();
}
