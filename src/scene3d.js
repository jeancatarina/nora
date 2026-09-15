import * as THREE from './vendor/three.module.js';

/**
 * NORA — Instalação Cinética 3D de Alta Costura
 * "Transformar complexidade em organização"
 *
 * Coreografia com interpolação escalonada (staggered spring dynamics),
 * materiais táteis (papel marfim com carimbo dourado, esmalte verde oliva,
 * latão escovado, cerâmica fosca) e atmosfera de poeira dourada flutuante.
 */
export function initScene3D(containerId = 'canvas-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Limpa canvas anterior se houver
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 500;

  // 1. Cena com profundidade atmosférica
  const scene = new THREE.Scene();

  // 2. Câmera com perspectiva cinematográfica
  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
  camera.position.set(0, 0, 11.2);

  // 3. Renderer com suporte a sombras suaves e ACESFilmic Tone Mapping
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // 4. Iluminação Escultural (Luz de estúdio fotográfico / atelier de luxo)
  const ambientLight = new THREE.AmbientLight(0xFBF8F2, 2.0);
  scene.add(ambientLight);

  // Key light dourada com sombras realistas
  const keyLight = new THREE.DirectionalLight(0xFFF2DC, 2.6);
  keyLight.position.set(7, 9, 8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 30;
  scene.add(keyLight);

  // Fill light acetinada de contraponto
  const fillLight = new THREE.DirectionalLight(0xCFC0AA, 1.4);
  fillLight.position.set(-7, -5, 6);
  scene.add(fillLight);

  // Rim light verde oliva nas silhuetas metálicas
  const rimLight = new THREE.DirectionalLight(0x727A5B, 1.8);
  rimLight.position.set(0, -6, -6);
  scene.add(rimLight);

  // 5. Texturas Procedurais de Papel Artesanal e Agenda
  function createDocumentTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    // Fundo papel marfim suave com textura sutil
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, 256, 360);

    // Moldura de margem editorial
    ctx.strokeStyle = '#E0D4C3';
    ctx.lineWidth = 3;
    ctx.strokeRect(14, 14, 228, 332);

    // Cabeçalho institucional NORA em miniatura
    ctx.fillStyle = '#493C35';
    ctx.globalAlpha = 0.85;
    ctx.font = 'bold 16px serif';
    ctx.fillText('N O R A', 30, 48);

    ctx.fillStyle = '#727A5B';
    ctx.font = '9px sans-serif';
    ctx.fillText('RELATÓRIO OPERACIONAL', 30, 64);

    // Pautas tipográficas
    ctx.fillStyle = '#493C35';
    ctx.globalAlpha = 0.22;
    for (let y = 92; y < 310; y += 18) {
      const len = 150 + Math.sin(y * 1.5) * 45;
      ctx.fillRect(30, y, Math.min(len, 196), 3.5);
    }

    // Selo de cera / chancela em oliva com relevo
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#727A5B';
    ctx.beginPath();
    ctx.arc(196, 296, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FAF7F2';
    ctx.font = 'bold 12px serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', 196, 301);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    return texture;
  }

  function createCalendarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#F4EDE2';
    ctx.fillRect(0, 0, 256, 256);

    // Cabeçalho Café com tipografia
    ctx.fillStyle = '#493C35';
    ctx.fillRect(0, 0, 256, 68);

    ctx.fillStyle = '#F4EDE2';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AGENDA NORA', 128, 42);

    // Grade de dias com linhas finas
    ctx.strokeStyle = '#D9CCBA';
    ctx.lineWidth = 1.5;
    for (let x = 36; x < 256; x += 46) {
      ctx.beginPath();
      ctx.moveTo(x, 76);
      ctx.lineTo(x, 244);
      ctx.stroke();
    }
    for (let y = 76; y < 256; y += 42) {
      ctx.beginPath();
      ctx.moveTo(8, y);
      ctx.lineTo(248, y);
      ctx.stroke();
    }

    // Marcador ativo de confirmação de consulta
    ctx.fillStyle = '#727A5B';
    ctx.beginPath();
    ctx.arc(128, 160, 13, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    return texture;
  }

  const docTex = createDocumentTexture();
  const calTex = createCalendarTexture();

  // 6. Materiais Nobres (Foscos, Acetinados e Metálicos)
  const matDoc = new THREE.MeshStandardMaterial({
    map: docTex,
    roughness: 0.32,
    metalness: 0.05
  });

  const matCal = new THREE.MeshStandardMaterial({
    map: calTex,
    roughness: 0.28,
    metalness: 0.08
  });

  const matOlivaEsmalte = new THREE.MeshStandardMaterial({
    color: 0x727A5B,
    roughness: 0.18,
    metalness: 0.4
  });

  const matCafe = new THREE.MeshStandardMaterial({
    color: 0x493C35,
    roughness: 0.35,
    metalness: 0.25
  });

  const matLatao = new THREE.MeshStandardMaterial({
    color: 0xD6C6AF,
    roughness: 0.16,
    metalness: 0.8
  });

  // 7. Geometrias
  const geomDoc = new THREE.BoxGeometry(1.05, 1.45, 0.035);
  const geomCal = new THREE.BoxGeometry(1.05, 1.05, 0.05);
  const geomCapsule = new THREE.CylinderGeometry(0.34, 0.34, 0.95, 32);
  const geomRing = new THREE.TorusGeometry(0.52, 0.055, 24, 64);
  const geomSphere = new THREE.SphereGeometry(0.35, 32, 32);

  // Grupo principal para permitir rotação de cena
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Grade arquitetônica de destino (4 colunas x 6 linhas = 24 elementos)
  const cols = 6;
  const rows = 4;
  const spacingX = 1.38;
  const spacingY = 1.38;
  const offsetX = -((cols - 1) * spacingX) / 2;
  const offsetY = -((rows - 1) * spacingY) / 2;

  const elements = [];
  let index = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let mesh;
      const typeMod = index % 5;

      if (typeMod === 0) {
        mesh = new THREE.Mesh(geomDoc, matDoc);
      } else if (typeMod === 1) {
        mesh = new THREE.Mesh(geomCal, matCal);
      } else if (typeMod === 2) {
        mesh = new THREE.Mesh(geomCapsule, matOlivaEsmalte);
        mesh.rotation.z = Math.PI / 2;
      } else if (typeMod === 3) {
        mesh = new THREE.Mesh(geomRing, matLatao);
      } else {
        mesh = new THREE.Mesh(geomSphere, index % 2 === 0 ? matCafe : matOlivaEsmalte);
      }

      // Posição caótica inicial (dispersão volumétrica 3D)
      const chaoticPos = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8.5,
        (Math.random() - 0.5) * 6.5
      );

      // Rotação caótica
      const chaoticRot = new THREE.Euler(
        (Math.random() - 0.5) * Math.PI * 2,
        (Math.random() - 0.5) * Math.PI * 2,
        (Math.random() - 0.5) * Math.PI * 2
      );

      // Posição organizada (matriz harmônica)
      const organizedPos = new THREE.Vector3(
        offsetX + c * spacingX,
        offsetY + (rows - 1 - r) * spacingY,
        0
      );

      // Rotação organizada
      const organizedRot = new THREE.Euler(0, 0, 0);

      mesh.position.copy(chaoticPos);
      mesh.rotation.copy(chaoticRot);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mainGroup.add(mesh);

      // Atraso escalonado (stagger) para transição fluida em cascata
      const distanceFromCenter = Math.sqrt(Math.pow(c - (cols - 1) / 2, 2) + Math.pow(r - (rows - 1) / 2, 2));
      const staggerDelay = distanceFromCenter * 0.12;

      elements.push({
        mesh,
        chaoticPos,
        chaoticRot,
        organizedPos,
        organizedRot,
        staggerDelay,
        currentProgress: 0,
        floatSpeed: 0.65 + Math.random() * 0.75,
        floatOffset: Math.random() * Math.PI * 2,
        floatAmplitude: 0.14 + Math.random() * 0.1
      });

      index++;
    }
  }

  // 8. Atmosfera com 180 Partículas de Poeira Dourada
  const particleCount = 180;
  const particleGeom = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePos[i] = (Math.random() - 0.5) * 15;
    particlePos[i + 1] = (Math.random() - 0.5) * 11;
    particlePos[i + 2] = (Math.random() - 0.5) * 9;
  }
  particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xCFC0AA,
    size: 0.085,
    transparent: true,
    opacity: 0.7
  });
  const particles = new THREE.Points(particleGeom, particleMat);
  mainGroup.add(particles);

  // 9. Linhas Conectoras Sutis que surgem quando organizado
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x727A5B,
    transparent: true,
    opacity: 0.0
  });
  const lineGeom = new THREE.BufferGeometry();
  const linePositions = new Float32Array(elements.length * 6);
  lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const connectionLines = new THREE.LineSegments(lineGeom, lineMat);
  mainGroup.add(connectionLines);

  // 10. Interatividade Dinâmica
  let globalTargetProgress = 0; // 0 = Caótico, 1 = Organizado
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let groupRotationX = 0;
  let groupRotationY = 0;
  let targetGroupRotX = 0;
  let targetGroupRotY = 0;

  // Rastreamento suave do mouse
  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      targetMouseX = ((e.clientX - rect.left) / width - 0.5) * 1.6;
      targetMouseY = -((e.clientY - rect.top) / height - 0.5) * 1.6;
    }
  });

  // Arrastar com o mouse (Rotação 360°)
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    targetGroupRotY += deltaX * 0.006;
    targetGroupRotX += deltaY * 0.006;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Touch no celular
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    targetGroupRotY += deltaX * 0.007;
    targetGroupRotX += deltaY * 0.007;

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  // Scroll Progress
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const threshold = window.innerHeight * 0.85;
    const prog = Math.min(Math.max(scrollY / threshold, 0), 1);
    globalTargetProgress = prog;
    updateUI(prog);
  };

  function updateUI(prog) {
    const statusTextEl = document.getElementById('canvas-status-text');
    const toggleBtn = document.getElementById('canvas-toggle-btn');
    if (statusTextEl) {
      if (prog < 0.25) {
        statusTextEl.textContent = 'Rotinas dispersas';
      } else if (prog < 0.75) {
        statusTextEl.textContent = 'Harmonizando fluxos...';
      } else {
        statusTextEl.textContent = 'Operação organizada';
      }
    }
    if (toggleBtn) {
      toggleBtn.textContent = prog > 0.5 ? 'Ver dispersão' : 'Organizar rotina';
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Botão interativo de ação direta
  const toggleBtn = document.getElementById('canvas-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      globalTargetProgress = globalTargetProgress > 0.5 ? 0 : 1;
      updateUI(globalTargetProgress);
    });
  }

  // Clique na caixa do 3D
  container.addEventListener('click', () => {
    if (!isDragging) {
      globalTargetProgress = globalTargetProgress > 0.5 ? 0 : 1;
      updateUI(globalTargetProgress);
    }
  });

  // Redimensionamento
  const handleResize = () => {
    if (!container) return;
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  };
  window.addEventListener('resize', handleResize);

  // Otimização: Pausar fora de visão
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.1 });
  observer.observe(container);

  // Loop de Renderização
  const clock = new THREE.Clock();
  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);

    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Lerp suave do mouse e rotação do grupo
    mouseX += (targetMouseX - mouseX) * 0.055;
    mouseY += (targetMouseY - mouseY) * 0.055;

    groupRotationX += (targetGroupRotX - groupRotationX) * 0.07;
    groupRotationY += (targetGroupRotY - groupRotationY) * 0.07;

    mainGroup.rotation.x = groupRotationX + mouseY * 0.22;
    mainGroup.rotation.y = groupRotationY + mouseX * 0.32;

    // Rotação suave da poeira estelar
    particles.rotation.y = elapsedTime * 0.025;
    particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.04;

    const posArray = lineGeom.attributes.position.array;
    let lineIdx = 0;
    let avgProgress = 0;

    // Atualiza cada elemento com física escalonada (Staggered Spring Lerp)
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const mesh = el.mesh;

      // Cálculo de interpolação com delay escalonado individual
      const elementTarget = Math.max(0, Math.min(1, (globalTargetProgress - el.staggerDelay) / (1 - el.staggerDelay || 1)));
      el.currentProgress += (elementTarget - el.currentProgress) * 0.065;
      avgProgress += el.currentProgress;

      // Amplitude de flutuação diminui na medida em que se organiza
      const currentAmp = el.floatAmplitude * (1.0 - el.currentProgress * 0.8);
      const floatY = Math.sin(elapsedTime * el.floatSpeed + el.floatOffset) * currentAmp;
      const floatRot = Math.cos(elapsedTime * el.floatSpeed * 0.6 + el.floatOffset) * currentAmp * 0.6;

      // Posicionamento elástico
      mesh.position.x = THREE.MathUtils.lerp(el.chaoticPos.x, el.organizedPos.x, el.currentProgress);
      mesh.position.y = THREE.MathUtils.lerp(el.chaoticPos.y, el.organizedPos.y, el.currentProgress) + floatY;
      mesh.position.z = THREE.MathUtils.lerp(el.chaoticPos.z, el.organizedPos.z, el.currentProgress);

      // Rotação elástica
      mesh.rotation.x = THREE.MathUtils.lerp(el.chaoticRot.x, el.organizedRot.x, el.currentProgress) + floatRot;
      mesh.rotation.y = THREE.MathUtils.lerp(el.chaoticRot.y, el.organizedRot.y, el.currentProgress) + floatRot;
      mesh.rotation.z = THREE.MathUtils.lerp(el.chaoticRot.z, el.organizedRot.z, el.currentProgress);

      // Linhas de conexão que surgem ao atingir a ordem
      if (i < elements.length - 1 && i % cols !== cols - 1) {
        const nextEl = elements[i + 1];
        posArray[lineIdx++] = mesh.position.x;
        posArray[lineIdx++] = mesh.position.y;
        posArray[lineIdx++] = mesh.position.z;
        posArray[lineIdx++] = nextEl.mesh.position.x;
        posArray[lineIdx++] = nextEl.mesh.position.y;
        posArray[lineIdx++] = nextEl.mesh.position.z;
      }
    }

    avgProgress /= elements.length;

    lineGeom.attributes.position.needsUpdate = true;
    lineMat.opacity = Math.max(0, (avgProgress - 0.45) * 0.55);

    renderer.render(scene, camera);
  }

  animate();

  return {
    destroy: () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    }
  };
}
