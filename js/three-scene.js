/**
 * 3D Hero Scene - Calm, architectural floating geometry
 * Uses Three.js for a subtle depth effect with gentle particle motion
 */

(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Colors matching brand
  const navyColor = new THREE.Color(0x1a2744);
  const goldColor = new THREE.Color(0xc9a84c);
  const sageColor = new THREE.Color(0x6b8f71);
  const lightColor = new THREE.Color(0xfaf8f4);

  // Floating geometric shapes - architectural feel
  const shapes = [];

  // Create wireframe icosahedrons
  function createShape(geometry, color, x, y, z, scale) {
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.15
    });
    const mesh = new THREE.LineSegments(edges, material);
    mesh.position.set(x, y, z);
    mesh.scale.setScalar(scale);
    mesh.userData = {
      rotSpeed: {
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.002
      },
      floatSpeed: 0.3 + Math.random() * 0.4,
      floatAmplitude: 0.5 + Math.random() * 1,
      originalY: y
    };
    scene.add(mesh);
    shapes.push(mesh);
    return mesh;
  }

  // Architectural shapes scattered in 3D space
  createShape(new THREE.IcosahedronGeometry(3, 1), goldColor, -12, 5, -10, 1);
  createShape(new THREE.OctahedronGeometry(2.5, 0), lightColor, 15, -3, -15, 1);
  createShape(new THREE.TetrahedronGeometry(2, 0), sageColor, -8, -6, -8, 1.2);
  createShape(new THREE.DodecahedronGeometry(2, 0), goldColor, 10, 8, -20, 0.8);
  createShape(new THREE.IcosahedronGeometry(4, 0), lightColor, 0, -2, -25, 0.6);
  createShape(new THREE.OctahedronGeometry(1.5, 0), sageColor, -18, 2, -12, 1);
  createShape(new THREE.BoxGeometry(2, 2, 2), goldColor, 20, -5, -18, 0.7);
  createShape(new THREE.IcosahedronGeometry(2, 1), lightColor, -5, 10, -22, 0.5);

  // Particle field for depth
  const particleCount = 200;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
    particleSizes[i] = Math.random() * 2 + 0.5;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xc9a84c,
    size: 0.08,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Subtle connecting lines
  const linePositions = [];
  for (let i = 0; i < 30; i++) {
    const x1 = (Math.random() - 0.5) * 50;
    const y1 = (Math.random() - 0.5) * 30;
    const z1 = (Math.random() - 0.5) * 20 - 15;
    const x2 = x1 + (Math.random() - 0.5) * 15;
    const y2 = y1 + (Math.random() - 0.5) * 10;
    const z2 = z1 + (Math.random() - 0.5) * 10;
    linePositions.push(x1, y1, z1, x2, y2, z2);
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xc9a84c,
    transparent: true,
    opacity: 0.05
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // Mouse interaction for depth parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  document.addEventListener('mousemove', function (e) {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Scroll-based depth
  let scrollY = 0;
  window.addEventListener('scroll', function () {
    scrollY = window.pageYOffset;
  });

  // Animation loop
  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Smooth mouse follow
    mouseX += (targetMouseX - mouseX) * 0.02;
    mouseY += (targetMouseY - mouseY) * 0.02;

    // Camera responds to mouse and scroll
    camera.position.x = mouseX * 2;
    camera.position.y = -mouseY * 1.5 - scrollY * 0.005;
    camera.lookAt(0, -scrollY * 0.003, -15);

    // Animate shapes
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      const data = shape.userData;
      shape.rotation.x += data.rotSpeed.x;
      shape.rotation.y += data.rotSpeed.y;
      shape.rotation.z += data.rotSpeed.z;
      shape.position.y = data.originalY + Math.sin(time * data.floatSpeed) * data.floatAmplitude;
    }

    // Gently rotate particles
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;
    lines.rotation.y += 0.0002;

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
