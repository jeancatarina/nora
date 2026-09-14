import * as THREE from './vendor/three.module.js';

/**
 * Experiência 3D NORA — "Transformar complexidade em organização"
 * Representa tarefas, documentos, mensagens, eventos de agenda e processos
 * que começam dispersos e convergem para uma ordem arquitetônica harmônica.
 */
export function initScene3D(containerId = 'canvas-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene setup
  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 0, 11);

  // WebGL Renderer with tone mapping & anti-aliasing
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xF4EDE2, 1.4);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
  keyLight.position.set(5, 8, 7);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xCFC0AA, 0.8);
  fillLight.position.set(-6, -4, 4);
  scene.add(fillLight);

  // Brand Materials (Matte, editorial finish)
  const matCafe = new THREE.MeshStandardMaterial({
    color: 0x493C35,
    roughness: 0.45,
    metalness: 0.1
  });

  const matOliva = new THREE.MeshStandardMaterial({
    color: 0x727A5B,
    roughness: 0.35,
    metalness: 0.15
  });

  const matBege = new THREE.MeshStandardMaterial({
    color: 0xCFC0AA,
    roughness: 0.5,
    metalness: 0.05
  });

  const matLight = new THREE.MeshStandardMaterial({
    color: 0xFDFBF7,
    roughness: 0.3,
    metalness: 0.1
  });

  // Base Geometries for elements
  const geomDoc = new THREE.BoxGeometry(0.9, 1.25, 0.05); // Documentos
  const geomMsg = new THREE.CylinderGeometry(0.55, 0.55, 0.08, 32); // Mensagens/Tokens
  const geomCal = new THREE.BoxGeometry(0.85, 0.85, 0.08); // Agenda/Eventos
  const geomProcess = new THREE.DodecahedronGeometry(0.42); // Processos/Fluxos
  const geomTask = new THREE.TorusGeometry(0.38, 0.08, 16, 32); // Tarefas/Checks

  const elements = [];
  const TOTAL_ITEMS = 28;

  // Grid configuration for organized state (4 cols x 7 rows or 7 x 4)
  const cols = 7;
  const rows = 4;
  const spacingX = 1.25;
  const spacingY = 1.25;
  const offsetX = -((cols - 1) * spacingX) / 2;
  const offsetY = -((rows - 1) * spacingY) / 2;

  let index = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let geom;
      let mat;

      const typeMod = index % 5;
      if (typeMod === 0) {
        geom = geomDoc;
        mat = index % 2 === 0 ? matCafe : matBege;
      } else if (typeMod === 1) {
        geom = geomMsg;
        mat = matOliva;
      } else if (typeMod === 2) {
        geom = geomCal;
        mat = index % 3 === 0 ? matOliva : matLight;
      } else if (typeMod === 3) {
        geom = geomProcess;
        mat = matCafe;
      } else {
        geom = geomTask;
        mat = matOliva;
      }

      const mesh = new THREE.Mesh(geom, mat);

      // Dispersed (chaotic) position: spread randomly in space
      const chaoticPos = new THREE.Vector3(
        (Math.random() - 0.5) * 8.5,
        (Math.random() - 0.5) * 6.5,
        (Math.random() - 0.5) * 4.5
      );

      // Dispersed chaotic rotation
      const chaoticRot = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      // Target organized position in matrix
      const organizedPos = new THREE.Vector3(
        offsetX + c * spacingX,
        offsetY + (rows - 1 - r) * spacingY,
        0
      );

      // Target organized rotation (facing forward neatly)
      const organizedRot = new THREE.Euler(0, 0, 0);

      // Set initial position & rotation
      mesh.position.copy(chaoticPos);
      mesh.rotation.copy(chaoticRot);

      // Organic subtle floating seeds
      const floatSpeed = 0.5 + Math.random() * 0.8;
      const floatOffset = Math.random() * Math.PI * 2;

      scene.add(mesh);

      elements.push({
        mesh,
        chaoticPos,
        chaoticRot,
        organizedPos,
        organizedRot,
        floatSpeed,
        floatOffset
      });

      index++;
    }
  }

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      targetMouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      targetMouseY = -((e.clientY - rect.top) / height - 0.5) * 2;
    }
  });

  // Organization factor: driven by scroll or automatic transition
  let organizationFactor = 0;
  let targetOrgFactor = 0;

  // Scroll listener to update organization factor
  const updateScrollProgress = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowH = window.innerHeight;
    // As user scrolls from 0 to 600px, organization factor moves from 0 to 1
    const progress = Math.min(Math.max(scrollY / (windowH * 0.65), 0), 1);
    targetOrgFactor = progress;

    // Update status text in UI overlay
    const statusTextEl = document.getElementById('canvas-status-text');
    if (statusTextEl) {
      if (progress < 0.25) {
        statusTextEl.textContent = 'Rotinas dispersas';
      } else if (progress < 0.75) {
        statusTextEl.textContent = 'Estruturando fluxos...';
      } else {
        statusTextEl.textContent = 'Operação organizada';
      }
    }
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Allow clicking on canvas to toggle organization state for instant delight
  container.style.cursor = 'pointer';
  container.addEventListener('click', () => {
    targetOrgFactor = targetOrgFactor > 0.5 ? 0 : 1;
    const statusTextEl = document.getElementById('canvas-status-text');
    if (statusTextEl) {
      statusTextEl.textContent = targetOrgFactor > 0.5 ? 'Operação organizada' : 'Rotinas dispersas';
    }
  });

  // Handle Resize
  const handleResize = () => {
    if (!container) return;
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  };
  window.addEventListener('resize', handleResize);

  // IntersectionObserver to pause rendering when not in view (Saves CPU/Battery/Lighthouse 100)
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.1 });
  observer.observe(container);

  // Animation Loop
  let clock = new THREE.Clock();
  let animationFrameId;

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Smooth lerp for mouse parallax
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    camera.position.x = mouseX * 0.8;
    camera.position.y = mouseY * 0.6;
    camera.lookAt(0, 0, 0);

    // Smooth lerp for organization progress
    organizationFactor += (targetOrgFactor - organizationFactor) * 0.06;

    // Update each element's position and rotation
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const mesh = el.mesh;

      // Floating oscillation amount reduces as organization approaches 100%
      const floatAmp = (1 - organizationFactor * 0.85) * 0.18;
      const floatY = Math.sin(elapsedTime * el.floatSpeed + el.floatOffset) * floatAmp;
      const floatRot = Math.cos(elapsedTime * el.floatSpeed * 0.5 + el.floatOffset) * floatAmp * 0.5;

      // Lerp Position
      mesh.position.x = THREE.MathUtils.lerp(el.chaoticPos.x, el.organizedPos.x, organizationFactor);
      mesh.position.y = THREE.MathUtils.lerp(el.chaoticPos.y, el.organizedPos.y, organizationFactor) + floatY;
      mesh.position.z = THREE.MathUtils.lerp(el.chaoticPos.z, el.organizedPos.z, organizationFactor);

      // Lerp Rotation
      mesh.rotation.x = THREE.MathUtils.lerp(el.chaoticRot.x, el.organizedRot.x, organizationFactor) + floatRot;
      mesh.rotation.y = THREE.MathUtils.lerp(el.chaoticRot.y, el.organizedRot.y, organizationFactor) + floatRot;
      mesh.rotation.z = THREE.MathUtils.lerp(el.chaoticRot.z, el.organizedRot.z, organizationFactor);
    }

    renderer.render(scene, camera);
  };

  animate();

  return {
    destroy: () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateScrollProgress);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    }
  };
}
