/**
 * 3D Hero Background - Subtle particle field and connecting lines
 * Provides depth behind the SVG puzzle logo
 */

(function () {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 20);

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Brand colors
  var coralColor = 0xFD9D7D;
  var tealColor = 0x5BB9B0;
  var greenColor = 0x7DC47C;

  // Particles
  var particleCount = 80;
  var particleGeometry = new THREE.BufferGeometry();
  var positions = new Float32Array(particleCount * 3);
  var colors = new Float32Array(particleCount * 3);
  var pColors = [
    new THREE.Color(coralColor),
    new THREE.Color(tealColor),
    new THREE.Color(greenColor),
    new THREE.Color(0xffffff)
  ];

  for (var i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25 - 5;
    var c = pColors[Math.floor(Math.random() * pColors.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  var particleMaterial = new THREE.PointsMaterial({
    size: 0.06,
    transparent: true,
    opacity: 0.3,
    vertexColors: true,
    sizeAttenuation: true
  });

  var particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Subtle connecting lines
  var linePos = [];
  for (var j = 0; j < 15; j++) {
    var x1 = (Math.random() - 0.5) * 40;
    var y1 = (Math.random() - 0.5) * 28;
    var z1 = (Math.random() - 0.5) * 15 - 6;
    linePos.push(x1, y1, z1, x1 + (Math.random() - 0.5) * 10, y1 + (Math.random() - 0.5) * 7, z1 + (Math.random() - 0.5) * 5);
  }
  var lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
  var lineMat = new THREE.LineBasicMaterial({ color: tealColor, transparent: true, opacity: 0.04 });
  var linesMesh = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(linesMesh);

  // Mouse parallax
  var mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
  document.addEventListener('mousemove', function (e) {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);

    mouseX += (targetMouseX - mouseX) * 0.02;
    mouseY += (targetMouseY - mouseY) * 0.02;

    camera.position.x = mouseX * 1.5;
    camera.position.y = mouseY * -1;
    camera.lookAt(0, 0, 0);

    particles.rotation.y += 0.00015;
    particles.rotation.x += 0.00008;
    linesMesh.rotation.y += 0.0001;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
