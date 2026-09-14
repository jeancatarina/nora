import * as THREE from './vendor/three.module.js';

/**
 * Experiência 3D NORA — "Transformar complexidade em organização"
 * Instalação cinética interativa com materiais nobres:
 * Documentos em cerâmica, cápsulas de comunicação em esmalte oliva,
 * blocos de agenda em bege acetinado, nós de processos em latão e partículas douradas.
 */
export function initScene3D(containerId = 'canvas-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Limpa qualquer canvas anterior caso exista
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 500;

  // 1. Cena com atmosfera suave
  const scene = new THREE.Scene();

  // 2. Câmera com ângulo refinado e profundidade focal
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 0, 10.5);

  // 3. Renderer com tons cinematográficos
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // 4. Iluminação Nobre & Editorial
  const ambientLight = new THREE.AmbientLight(0xFDFBF7, 1.8);
  scene.add(ambientLight);

  // Key light dourada suave
  const keyLight = new THREE.DirectionalLight(0xFFF6E8, 2.2);
  keyLight.position.set(6, 8, 8);
  keyLight.castShadow = true;
  scene.add(keyLight);

  // Fill light fria sutil de contraponto
  const fillLight = new THREE.DirectionalLight(0xCFC0AA, 1.2);
  fillLight.position.set(-6, -4, 5);
  scene.add(fillLight);

  // Rim light traseira para brilho nas bordas metálicas
  const rimLight = new THREE.DirectionalLight(0x727A5B, 1.4);
  rimLight.position.set(0, -6, -5);
  scene.add(rimLight);

  // 5. Texturas procedurais para detalhes tangíveis de alto padrão
  function createDocTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 340;
    const ctx = canvas.getContext('2d');
    
    // Fundo papel marfim
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, 256, 340);
    
    // Borda sutil de encadernação
    ctx.strokeStyle = '#E2D7C8';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, 232, 316);

    // Linhas tipográficas elegantes em café
    ctx.fillStyle = '#493C35';
    ctx.globalAlpha = 0.75;
    ctx.fillRect(28, 36, 90, 8); // Título
    
    ctx.globalAlpha = 0.25;
    for (let y = 64; y < 300; y += 18) {
      const w = 140 + Math.sin(y) * 40;
      ctx.fillRect(28, y, Math.min(w, 200), 4);
    }
    
    // Selo oliva no canto inferior
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#727A5B';
    ctx.beginPath();
    ctx.arc(200, 280, 14, 0, Math.PI * 2);
    ctx.fill();

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
    
    // Faixa superior Café
    ctx.fillStyle = '#493C35';
    ctx.fillRect(0, 0, 256, 60);

    // Grid de dias
    ctx.strokeStyle = '#CFC0AA';
    ctx.lineWidth = 2;
    for (let x = 36; x < 256; x += 46) {
      ctx.beginPath();
      ctx.moveTo(x, 70);
      ctx.lineTo(x, 240);
      ctx.stroke();
    }
    for (let y = 70; y < 256; y += 42) {
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(246, y);
      ctx.stroke();
    }

    // Ponto de destaque ativo em oliva
    ctx.fillStyle = '#727A5B';
    ctx.beginPath();
    ctx.arc(128, 154, 12, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    return texture;
  }

  const docTex = createDocTexture();
  const calTex = createCalendarTexture();

  // 6. Materiais Nobres da Paleta NORA
  const matDoc = new THREE.MeshStandardMaterial({
    map: docTex,
    roughness: 0.35,
    metalness: 0.05
  });

  const matCal = new THREE.MeshStandardMaterial({
    map: calTex,
    roughness: 0.3,
    metalness: 0.08
  });

  const matOlivaEsmalte = new THREE.MeshStandardMaterial({
    color: 0x727A5B,
    roughness: 0.2,
    metalness: 0.35
  });

  const matCafeProfundo = new THREE.MeshStandardMaterial({
    color: 0x493C35,
    roughness: 0.3,
    metalness: 0.2
  });

  const matLatao = new THREE.MeshStandardMaterial({
    color: 0xCFC0AA,
    roughness: 0.18,
    metalness: 0.75
  });

  // 7. Geometrias refinadas
  const geomDoc = new THREE.BoxGeometry(1.0, 1.35, 0.03);
  const geomCal = new THREE.BoxGeometry(1.0, 1.0, 0.05);
  const geomCapsule = new THREE.CylinderGeometry(0.32, 0.32, 0.85, 32);
  const geomRing = new THREE.TorusGeometry(0.48, 0.05, 20, 48);
  const geomSphere = new THREE.SphereGeometry(0.32, 32, 32);

  // Agrupador principal para permitir rotação de cena e paralaxe
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Grade arquitetônica de destino (4 colunas x 6 linhas = 24 elementos)
  const cols = 6;
  const rows = 4;
  const spacingX = 1.35;
  const spacingY = 1.35;
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
        mesh = new THREE.Mesh(geomSphere, index % 2 === 0 ? matCafeProfundo : matOlivaEsmalte);
      }

      // Posição caótica (dispersa em 3D)
      const chaoticPos = new THREE.Vector3(
        (Math.random() - 0.5) * 11,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
      );

      // Rotação caótica
      const chaoticRot = new THREE.Euler(
        (Math.random() - 0.5) * Math.PI * 2,
        (Math.random() - 0.5) * Math.PI * 2,
        (Math.random() - 0.5) * Math.PI * 2
      );

      // Posição perfeitamente organizada (Matriz Arquitetônica)
      const organizedPos = new THREE.Vector3(
        offsetX + c * spacingX,
        offsetY + (rows - 1 - r) * spacingY,
        0
      );

      // Rotação organizada: todos virados elegantemente para a câmera
      const organizedRot = new THREE.Euler(0, 0, 0);

      // Inicia disperso
      mesh.position.copy(chaoticPos);
      mesh.rotation.copy(chaoticRot);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mainGroup.add(mesh);

      elements.push({
        mesh,
        chaoticPos,
        chaoticRot,
        organizedPos,
        organizedRot,
        floatSpeed: 0.6 + Math.random() * 0.8,
        floatOffset: Math.random() * Math.PI * 2,
        floatAmplitude: 0.12 + Math.random() * 0.1
      });

      index++;
    }
  }

  // 8. Poeira dourada / Partículas atmosféricas de prestígio
  const particleCount = 140;
  const particleGeom = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePos[i] = (Math.random() - 0.5) * 14;
    particlePos[i + 1] = (Math.random() - 0.5) * 10;
    particlePos[i + 2] = (Math.random() - 0.5) * 8;
  }
  particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xCFC0AA,
    size: 0.08,
    transparent: true,
    opacity: 0.65
  });
  const particles = new THREE.Points(particleGeom, particleMat);
  mainGroup.add(particles);

  // 9. Linhas conectoras sutis (que se conectam na matriz organizada)
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

  // 10. Variáveis de Interatividade e Estado
  let organizationProgress = 0; // 0 = Caótico, 1 = Perfeitamente Organizado
  let targetProgress = 0;

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

  // Interação do Mouse / Parallax
  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      targetMouseX = ((e.clientX - rect.left) / width - 0.5) * 1.5;
      targetMouseY = -((e.clientY - rect.top) / height - 0.5) * 1.5;
    }
  });

  // Drag para girar em 3D
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

    targetGroupRotY += deltaX * 0.005;
    targetGroupRotX += deltaY * 0.005;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Touch para celular
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

    targetGroupRotY += deltaX * 0.006;
    targetGroupRotX += deltaY * 0.006;

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  // Scroll Progress
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollThreshold = window.innerHeight * 0.8;
    // O progresso avança suavemente conforme rola a página
    const prog = Math.min(Math.max(scrollY / scrollThreshold, 0), 1);
    targetProgress = prog;
    updateUIStatus(prog);
  };

  function updateUIStatus(prog) {
    const statusTextEl = document.getElementById('canvas-status-text');
    const toggleBtn = document.getElementById('canvas-toggle-btn');
    if (statusTextEl) {
      if (prog < 0.25) {
        statusTextEl.textContent = 'Rotinas dispersas';
      } else if (prog < 0.75) {
        statusTextEl.textContent = 'Estruturando fluxos...';
      } else {
        statusTextEl.textContent = 'Operação organizada';
      }
    }
    if (toggleBtn) {
      toggleBtn.textContent = prog > 0.5 ? 'Ver dispersão' : 'Organizar rotina';
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Botão interativo para alternar estado instantaneamente (Efeito WOW sob demanda!)
  const toggleBtn = document.getElementById('canvas-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      targetProgress = targetProgress > 0.5 ? 0 : 1;
      updateUIStatus(targetProgress);
    });
  }

  // Clique no container também alterna com elegância
  container.addEventListener('click', () => {
    if (!isDragging) {
      targetProgress = targetProgress > 0.5 ? 0 : 1;
      updateUIStatus(targetProgress);
    }
  });

  // Redimensionamento responsivo
  const handleResize = () => {
    if (!container) return;
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  };
  window.addEventListener('resize', handleResize);

  // Otimização: Pausar quando fora de visão
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.1 });
  observer.observe(container);

  // Loop de Animação
  const clock = new THREE.Clock();
  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);

    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Interpolação suave do estado de organização
    organizationProgress += (targetProgress - organizationProgress) * 0.055;

    // Interpolação suave do movimento do mouse e rotação
    mouseX += (targetMouseX - mouseX) * 0.06;
    mouseY += (targetMouseY - mouseY) * 0.06;

    groupRotationX += (targetGroupRotX - groupRotationX) * 0.08;
    groupRotationY += (targetGroupRotY - groupRotationY) * 0.08;

    mainGroup.rotation.x = groupRotationX + mouseY * 0.25;
    mainGroup.rotation.y = groupRotationY + mouseX * 0.35;

    // Rotação suave das partículas douradas
    particles.rotation.y = elapsedTime * 0.03;
    particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

    // Atualiza cada elemento com física elástica
    const posArray = lineGeom.attributes.position.array;
    let lineIdx = 0;

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const mesh = el.mesh;

      // Amplitude de flutuação diminui na medida em que se organiza
      const currentAmp = el.floatAmplitude * (1.0 - organizationProgress * 0.75);
      const floatY = Math.sin(elapsedTime * el.floatSpeed + el.floatOffset) * currentAmp;
      const floatRot = Math.cos(elapsedTime * el.floatSpeed * 0.6 + el.floatOffset) * currentAmp * 0.6;

      // Posição lerp
      mesh.position.x = THREE.MathUtils.lerp(el.chaoticPos.x, el.organizedPos.x, organizationProgress);
      mesh.position.y = THREE.MathUtils.lerp(el.chaoticPos.y, el.organizedPos.y, organizationProgress) + floatY;
      mesh.position.z = THREE.MathUtils.lerp(el.chaoticPos.z, el.organizedPos.z, organizationProgress);

      // Rotação lerp
      mesh.rotation.x = THREE.MathUtils.lerp(el.chaoticRot.x, el.organizedRot.x, organizationProgress) + floatRot;
      mesh.rotation.y = THREE.MathUtils.lerp(el.chaoticRot.y, el.organizedRot.y, organizationProgress) + floatRot;
      mesh.rotation.z = THREE.MathUtils.lerp(el.chaoticRot.z, el.organizedRot.z, organizationProgress);

      // Linhas de conexão que aparecem quando organizado
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

    lineGeom.attributes.position.needsUpdate = true;
    lineMat.opacity = Math.max(0, (organizationProgress - 0.5) * 0.45);

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
