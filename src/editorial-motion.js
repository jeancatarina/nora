// Event-driven version of the original brand transition and botanical parallax.
export function initEditorialMotion() {
  const brand = document.querySelector('.hero-display-nora');
  const logo = document.querySelector('.header-logo-serif');
  const header = document.querySelector('.site-header-reference');
  const leaf = document.querySelector('.hero-leaf-art');
  const tagline = document.querySelector('.hero-stacked-tagline');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!brand || !logo || !header) return;
  let origin;
  let target;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  function measure() {
    const saved = brand.style.transform;
    brand.style.transform = 'none';
    const rect = brand.getBoundingClientRect();
    origin = { x: rect.left, y: rect.top + window.scrollY, width: rect.width };
    target = logo.getBoundingClientRect();
    brand.style.transform = saved;
    schedule();
  }
  function render() {
    frame = 0;
    const y = window.scrollY;
    const p = Math.max(0, Math.min(y / 280, 1));
    const eased = p * p * (3 - 2 * p);
    header.classList.toggle('is-scrolled', y > 40);
    logo.style.opacity = String(Math.max(0, (p - .65) / .35));
    logo.style.transform = 'none';
    logo.style.pointerEvents = p > .85 ? 'auto' : 'none';
    logo.tabIndex = p > .85 ? 0 : -1;
    if (reduced.matches) {
      brand.style.transform = '';
      brand.style.opacity = '1';
      leaf.style.transform = '';
      tagline.style.opacity = '1';
      return;
    }
    const scale = 1 - (1 - target.width / origin.width) * eased;
    brand.style.transform = `translate3d(${(target.left-origin.x)*eased}px, ${(target.top-origin.y+y)*eased}px, 0) scale(${scale})`;
    brand.style.opacity = String(1 - Math.max(0, (p - .65) / .35));
    tagline.style.opacity = String(Math.max(0, 1 - p * 1.25));
    if (y < window.innerHeight * 1.5) leaf.style.transform = `translate3d(${pointerX*12}px,${-y*.15+pointerY*8}px,0) rotate(${y*.006}deg)`;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  reduced.addEventListener('change', schedule);
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', event => {
      pointerX = event.clientX / window.innerWidth - .5;
      pointerY = event.clientY / window.innerHeight - .5;
      schedule();
    }, { passive: true });
  }
  measure();
  document.fonts.ready.then(measure);
}
