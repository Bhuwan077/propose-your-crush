/**
 * Cute, Simple & Responsive Proposal Engine
 * - Bulletproof HTML5 Local Audio (song.m4a) at Medium Volume (45%)
 * - Stops audio when phone screen is powered off or locked (visibilitychange API)
 * - Official Love Pass & Interactive Flip Love Notes
 * - Playful Unclickable "No" Button (Grows Yes button!)
 * - Dedicated Gift Page Navigation (gift.html)
 */

(function () {
  'use strict';

  // --- 1. Bulletproof Local Audio Playback (song.m4a) at 45% Volume ---
  const bgAudio = document.getElementById('bgAudio');
  let hasMusicStarted = false;
  let wasPlayingBeforeLock = true;

  function startAudio() {
    if (!bgAudio) return;
    bgAudio.volume = 0.45; // Medium, comfortable volume

    // Resume from saved position if returning from gift.html
    const savedTime = sessionStorage.getItem('songTime');
    if (savedTime && bgAudio.currentTime === 0) {
      bgAudio.currentTime = parseFloat(savedTime);
    }

    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          hasMusicStarted = true;
        })
        .catch(() => {
          // Handled on first user touch
        });
    }
  }

  // Attempt autoplay immediately
  startAudio();

  // Play audio on first user touch/click anywhere if browser restricted silent start
  function onFirstTouch() {
    startAudio();
  }
  window.addEventListener('click', onFirstTouch, { passive: true });
  window.addEventListener('touchstart', onFirstTouch, { passive: true });
  window.addEventListener('pointerdown', onFirstTouch, { passive: true });

  // IMPORTANT: Stop the song when phone screen powers off or locks!
  document.addEventListener('visibilitychange', function () {
    if (document.hidden || document.visibilityState === 'hidden') {
      // Phone screen powered off / locked or tab switched
      if (bgAudio && !bgAudio.paused) {
        bgAudio.pause();
        wasPlayingBeforeLock = true;
      }
    } else if (document.visibilityState === 'visible') {
      // Phone unlocked / screen turned on
      if (bgAudio && wasPlayingBeforeLock) {
        bgAudio.play().catch(() => {});
      }
    }
  });

  window.addEventListener('pagehide', function () {
    if (bgAudio) bgAudio.pause();
  });

  // Web Audio chime synthesizer for sound effects
  let audioCtx = null;
  function playPopChime() {
    try {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx && AudioClass) audioCtx = new AudioClass();
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  }

  function playSparkleChime() {
    try {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx && AudioClass) audioCtx = new AudioClass();
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      if (!audioCtx) return;

      const notes = [659.25, 880, 987.77, 1174.66, 1318.51];
      const freq = notes[Math.floor(Math.random() * notes.length)];
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {}
  }

  // --- 2. Dynamic Blossoming Flowers & Stars Canvas ---
  const canvas = document.getElementById('magicCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  let isYesHovered = false;
  let isCelebration = false;
  let isGalaxyActive = false;

  const pastelColors = [
    '#FFAEC0', '#FFCCD7', '#FFDEE9', '#FFE599', '#D8F3DC', '#FFC6FF', '#BEE1E6'
  ];

  class FlowerStarParticle {
    constructor(isBurst = false, x = null, y = null) {
      this.reset(isBurst, x, y);
    }

    reset(isBurst = false, x = null, y = null) {
      this.isBurst = isBurst;
      this.type = Math.random() < 0.6 ? 'flower' : 'star';
      this.color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      this.radius = Math.random() * 8 + (this.type === 'star' ? 4 : 7);
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.035;
      this.alpha = isBurst ? 1 : Math.random() * 0.55 + 0.45;

      if (isBurst) {
        this.x = x !== null ? x : width / 2;
        this.y = y !== null ? y : height / 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 11 + 3.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 2.5;
        this.gravity = 0.15;
        this.decay = Math.random() * 0.012 + 0.007;
      } else {
        this.x = Math.random() * width;
        this.y = Math.random() * height - 40;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = Math.random() * 1.1 + 0.5;
        this.gravity = 0;
        this.decay = 0;
      }
    }

    update() {
      const speedMult = isYesHovered ? 2.5 : isCelebration ? 1.6 : 1.0;
      this.rotation += this.rotSpeed * speedMult;

      if (this.isBurst) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.985;
        this.alpha -= this.decay;
        return this.alpha > 0;
      } else {
        this.x += this.vx * speedMult + Math.sin(this.y * 0.015) * 0.5;
        this.y += this.vy * speedMult;

        if (this.y > height + 20) {
          this.y = -20;
          this.x = Math.random() * width;
        }
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        return true;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0.1, Math.min(1, this.alpha));

      if (this.type === 'flower') {
        const r = this.radius;
        ctx.fillStyle = this.color;
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI) / 5;
          const px = Math.cos(angle) * (r * 0.65);
          const py = Math.sin(angle) * (r * 0.65);
          ctx.beginPath();
          ctx.arc(px, py, r * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = '#FFE599';
        ctx.fill();
      } else {
        const r = this.radius;
        ctx.fillStyle = '#FFE082';
        ctx.shadowColor = '#FFAEC0';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const outer = (i * Math.PI) / 2;
          const inner = outer + Math.PI / 4;
          ctx.lineTo(Math.cos(outer) * r * 1.2, Math.sin(outer) * r * 1.2);
          ctx.lineTo(Math.cos(inner) * (r * 0.35), Math.sin(inner) * (r * 0.35));
        }
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    }
  }

  // --- Galaxy Engine: Twinkling Stars, Cosmic Sakura & Shooting Stars ---
  class GalaxyStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.6;
      this.baseAlpha = Math.random() * 0.7 + 0.3;
      this.twinkleSpeed = Math.random() * 0.035 + 0.012;
      this.twinklePhase = Math.random() * Math.PI * 2;
      const colors = ['#FFFFFF', '#FFE082', '#80D8FF', '#FF80AB', '#E1BEE7'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.twinklePhase += this.twinkleSpeed;
    }
    draw() {
      const alpha = this.baseAlpha * (0.6 + 0.4 * Math.sin(this.twinklePhase));
      ctx.save();
      ctx.globalAlpha = Math.max(0.12, alpha);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.size > 1.8 ? 8 : 0;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class CosmicPetal {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height - 30;
      this.size = Math.random() * 7 + 5;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.vy = Math.random() * 0.9 + 0.4;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.025;
      this.alpha = Math.random() * 0.6 + 0.3;
      const palette = ['#FFCCD7', '#FFDEE9', '#FFE599', '#EA80FC'];
      this.color = palette[Math.floor(Math.random() * palette.length)];
    }
    update() {
      this.rotation += this.rotSpeed;
      this.x += this.vx + Math.sin(this.y * 0.012) * 0.4;
      this.y += this.vy;

      if (this.y > height + 20) {
        this.y = -20;
        this.x = Math.random() * width;
      }
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.55, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class ShootingStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width * 0.85;
      this.y = Math.random() * (height * 0.4);
      this.length = Math.random() * 90 + 60;
      this.speed = Math.random() * 9 + 10;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
      this.alpha = 1;
      this.decay = Math.random() * 0.018 + 0.012;
    }
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.alpha -= this.decay;
      return this.alpha > 0;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;
      const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
      grad.addColorStop(0, 'rgba(255, 224, 130, 0)');
      grad.addColorStop(1, '#FFFFFF');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFE082';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const BASE_PARTICLES = 50;
  for (let i = 0; i < BASE_PARTICLES; i++) {
    particles.push(new FlowerStarParticle());
  }

  const galaxyStars = [];
  const STAR_COUNT = 100;
  for (let i = 0; i < STAR_COUNT; i++) {
    galaxyStars.push(new GalaxyStar());
  }

  const cosmicPetals = [];
  const PETAL_COUNT = 32;
  for (let i = 0; i < PETAL_COUNT; i++) {
    cosmicPetals.push(new CosmicPetal());
  }

  const shootingStars = [];

  function triggerBurst(count = 150, x = null, y = null) {
    for (let i = 0; i < count; i++) {
      particles.push(new FlowerStarParticle(true, x, y));
    }
  }

  function spawnHoverFlowers() {
    if (!isYesHovered) return;
    const yesBtn = document.getElementById('yesBtn');
    if (!yesBtn) return;
    const rect = yesBtn.getBoundingClientRect();
    const spawnX = rect.left + Math.random() * rect.width;
    const spawnY = rect.top + Math.random() * rect.height;

    for (let i = 0; i < 3; i++) {
      const p = new FlowerStarParticle(true, spawnX, spawnY);
      p.vy = -(Math.random() * 5 + 2);
      p.vx = (Math.random() - 0.5) * 5;
      p.decay = Math.random() * 0.01 + 0.008;
      particles.push(p);
    }
  }

  let lastHover = 0;
  function animate(t) {
    ctx.clearRect(0, 0, width, height);

    if (isGalaxyActive) {
      // 1. Draw Twinkling Milky Way Stars
      for (let i = 0; i < galaxyStars.length; i++) {
        galaxyStars[i].update();
        galaxyStars[i].draw();
      }

      // 2. Natural Shooting Stars
      if (Math.random() < 0.008) {
        shootingStars.push(new ShootingStar());
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        if (!s.update()) {
          shootingStars.splice(i, 1);
        } else {
          s.draw();
        }
      }

      // 3. Drifting Cosmic Sakura Petals
      for (let i = 0; i < cosmicPetals.length; i++) {
        cosmicPetals[i].update();
        cosmicPetals[i].draw();
      }
    }

    if (isYesHovered && t - lastHover > 50) {
      spawnHoverFlowers();
      lastHover = t;
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (!p.update()) {
        particles.splice(i, 1);
      } else {
        p.draw();
      }
    }

    if (!isGalaxyActive) {
      while (particles.filter((p) => !p.isBurst).length < BASE_PARTICLES) {
        particles.push(new FlowerStarParticle());
      }
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // --- 3. Playful Evasive "No" Button (Impossible to Click!) ---
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const toast = document.getElementById('dodgeToast');

  const excuses = [
    "Oops, too slow! 🙈",
    "Try the pink one! 👉💖",
    "Nuh-uh, can't touch this! 🐰",
    "Almost got me! ✨",
    "I'm floating away~ 🌸",
    "Destiny says click Yes! 🌸✨"
  ];

  let dodgeCount = 0;

  function dodgeNoButton() {
    if (isCelebration) return;
    playPopChime();
    dodgeCount++;

    const dir = (dodgeCount % 2 === 1) ? 1 : -1;
    const isMobile = window.innerWidth <= 480;
    const maxOffset = isMobile ? 55 : 85;
    const dx = dir * (Math.floor(Math.random() * 25) + (maxOffset - 25));
    const dy = (Math.random() - 0.5) * (isMobile ? 30 : 40);

    noBtn.style.transform = `translate(${dx}px, ${dy}px)`;

    if (toast) {
      toast.textContent = excuses[(dodgeCount - 1) % excuses.length];
      toast.classList.add('show');
    }

    // Yes button gets bigger and more inviting!
    const yesScale = Math.min(1.4, 1 + dodgeCount * 0.07);
    if (yesBtn) {
      yesBtn.style.transform = `scale(${yesScale})`;
    }

    const rect = noBtn.getBoundingClientRect();
    triggerBurst(5, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  if (noBtn) {
    noBtn.addEventListener('mouseenter', dodgeNoButton);
    noBtn.addEventListener('mouseover', dodgeNoButton);

    noBtn.addEventListener('touchstart', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dodgeNoButton();
    }, { passive: false });

    noBtn.addEventListener('click', function (e) {
      e.preventDefault();
      dodgeNoButton();
    });
  }

  let lastProximity = 0;
  window.addEventListener('mousemove', function (e) {
    if (!noBtn || isCelebration) return;
    const now = Date.now();
    if (now - lastProximity < 100) return;

    const rect = noBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

    if (dist < 60) {
      lastProximity = now;
      dodgeNoButton();
    }
  });

  // --- 4. "Yes" Button Acceptance & Celebration ---
  const proposalCard = document.getElementById('proposalCard');
  const celebrationCard = document.getElementById('celebrationCard');

  if (yesBtn) {
    yesBtn.addEventListener('mouseenter', function () {
      isYesHovered = true;
      playSparkleChime();
    });

    yesBtn.addEventListener('mouseleave', function () {
      if (!isCelebration) isYesHovered = false;
    });

    yesBtn.addEventListener('click', function () {
      isCelebration = true;
      isYesHovered = false;
      startAudio();

      const rect = yesBtn.getBoundingClientRect();
      triggerBurst(160, rect.left + rect.width / 2, rect.top + rect.height / 2);

      if (proposalCard && celebrationCard) {
        proposalCard.classList.remove('active');
        setTimeout(function () {
          celebrationCard.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
      }
    });
  }

  // --- 5. Three.js 3D WebGL Living Crystal Lotus & Spiral Galaxy ---
  // (Seamlessly translates user's Three.js Crystal Petals, Python 6-Petal flower layout, and 3,000-Point Galaxy math)
  const threeContainer = document.getElementById('threeGardenContainer');
  const threeCanvas = document.getElementById('threeCanvas');

  let threeRenderer = null;
  let threeScene = null;
  let threeCamera = null;
  let threeClock = null;
  let flowerGroup = null;
  let galaxyPoints = null;
  let sporePoints = null;
  let sporePositions = null;
  let sporeVelocities = [];
  const sporeCount = 65;
  const petals = [];

  let bloomProgress = 0;
  let isBlooming = false;
  let hasThreeInit = false;

  // Interactive Touch & Mouse Orbit Drag
  let isDragging = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let targetRotY = 0;
  let targetRotX = 0.22;
  let currentRotY = 0;
  let currentRotX = 0.22;

  function initThreeGarden() {
    if (!window.THREE || !threeCanvas || !threeContainer || hasThreeInit) return;
    hasThreeInit = true;

    threeScene = new THREE.Scene();
    threeScene.fog = new THREE.FogExp2(0x03000b, 0.022);

    threeCamera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    threeCamera.position.set(0, 2.0, 7.2);
    threeCamera.lookAt(0, 0.45, 0);

    threeRenderer = new THREE.WebGLRenderer({
      canvas: threeCanvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    threeRenderer.toneMappingExposure = 1.15;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffb6c1, 0.75);
    threeScene.add(ambientLight);

    const centerLight = new THREE.PointLight(0xff69b4, 3.8, 22);
    centerLight.position.set(0, 1.2, 0);
    threeScene.add(centerLight);

    const topWarmLight = new THREE.DirectionalLight(0xfff0e6, 0.95);
    topWarmLight.position.set(2, 6, 4);
    threeScene.add(topWarmLight);

    const goldenCoreLight = new THREE.PointLight(0xffd54f, 2.2, 10);
    goldenCoreLight.position.set(0, 0.4, 0);
    threeScene.add(goldenCoreLight);

    // 1. Star Texture
    function createStarTexture() {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(255, 220, 245, 0.9)');
      grad.addColorStop(0.55, 'rgba(128, 216, 255, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }
    const starTexture = createStarTexture();

    // 2. 3,500-Star Mathematical Spiral Galaxy (Python Galaxy Formula Translated)
    // User's formula:
    // theta = np.random.uniform(0, 4 * np.pi, n)
    // r = np.sqrt(np.random.uniform(0, 1, n)) * 5
    // x = r * np.cos(theta) + normal
    // y = r * np.sin(theta) + normal
    const galaxyCount = 3500;
    const galaxyGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(galaxyCount * 3);
    const colors = new Float32Array(galaxyCount * 3);

    const colorCore = new THREE.Color(0xffe082); // Warm Gold (Python center)
    const colorMid = new THREE.Color(0xff6584);  // Romantic Hotpink (Python petals)
    const colorCyan = new THREE.Color(0x00e5ff); // Cyan (Python galaxy color='cyan')

    for (let i = 0; i < galaxyCount; i++) {
      const arm = (i % 3) * ((2 * Math.PI) / 3);
      const r = Math.pow(Math.random(), 1.35) * 22 + 1.2;
      const theta = arm + r * 0.42 + (Math.random() - 0.5) * 0.52;

      const x = Math.cos(theta) * r + (Math.random() - 0.5) * 0.4;
      const z = Math.sin(theta) * r + (Math.random() - 0.5) * 0.4;
      const y = (Math.random() - 0.5) * (7 / (r * 0.6 + 1)) - 0.4;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mixedColor = new THREE.Color();
      if (r < 5.0) {
        mixedColor.lerpColors(colorCore, colorMid, r / 5.0);
      } else {
        mixedColor.lerpColors(colorMid, colorCyan, Math.min(1, (r - 5.0) / 14.0));
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const galaxyMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
    galaxyPoints.rotation.x = 0.32;
    threeScene.add(galaxyPoints);

    // 3. 3D Blooming Crystal Lotus & 6-Petal Mandala
    const petalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffb6c1,
      emissive: 0xff1493,
      emissiveIntensity: 0.36,
      roughness: 0.12,
      transmission: 0.65,
      thickness: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });

    // Deep hotpink material for the Python-inspired 6-petal foundation layer
    const mandalaMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff4081,
      emissive: 0xd81b60,
      emissiveIntensity: 0.42,
      roughness: 0.14,
      transmission: 0.58,
      thickness: 1.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92
    });

    function createPetalShape() {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.bezierCurveTo(0.8, 1.0, 1.25, 2.4, 0, 3.8);
      shape.bezierCurveTo(-1.25, 2.4, -0.8, 1.0, 0, 0);
      const extrudeSettings = { depth: 0.05, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.02 };
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }
    const petalGeometry = createPetalShape();

    flowerGroup = new THREE.Group();

    // Multi-tier layered petal arrangement:
    // Layer 0: Python-inspired 6-petal radial foundation (for theta in linspace(0, 2*pi, 6))
    // Layer 1: Outer Lotus Petals (14 petals)
    // Layer 2: Mid Lotus Petals (10 petals)
    // Layer 3: Inner Lotus Petals (6 petals)
    const layers = [
      { count: 6, scale: 1.16, angleOffset: 1.55, y: -0.12, mat: mandalaMaterial },
      { count: 14, scale: 1.05, angleOffset: 1.38, y: -0.05, mat: petalMaterial },
      { count: 10, scale: 0.80, angleOffset: 1.05, y: 0.06, mat: petalMaterial },
      { count: 6, scale: 0.56, angleOffset: 0.75, y: 0.16, mat: petalMaterial }
    ];

    layers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2;
        const petalMesh = new THREE.Mesh(petalGeometry, layer.mat);
        petalMesh.scale.set(layer.scale, layer.scale, layer.scale);
        petalMesh.position.y = 0;
        petalMesh.rotation.x = 0.08; // closed bud initially

        const pivotGroup = new THREE.Group();
        pivotGroup.position.y = layer.y;
        pivotGroup.rotation.y = angle;
        pivotGroup.add(petalMesh);

        flowerGroup.add(pivotGroup);
        petals.push({ mesh: petalMesh, maxRotation: layer.angleOffset });
      }
    });

    // Core Glowing Sphere
    const coreGeo = new THREE.SphereGeometry(0.38, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.32;
    flowerGroup.add(core);

    // Golden Halo (from Python code: center = plt.Circle((0, 0), 0.5, color='gold'))
    const haloGeo = new THREE.SphereGeometry(0.56, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffd54f,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.y = 0.32;
    flowerGroup.add(halo);

    // 4. Stardust Spores floating upward from core
    const sporeGeo = new THREE.BufferGeometry();
    sporePositions = new Float32Array(sporeCount * 3);
    for (let i = 0; i < sporeCount; i++) {
      const spR = Math.random() * 1.5;
      const spAng = Math.random() * Math.PI * 2;
      sporePositions[i * 3] = Math.cos(spAng) * spR;
      sporePositions[i * 3 + 1] = Math.random() * 2.5;
      sporePositions[i * 3 + 2] = Math.sin(spAng) * spR;
      sporeVelocities.push({
        speed: 0.006 + Math.random() * 0.008,
        wobbleSpeed: 1 + Math.random() * 2,
        wobbleAmp: 0.004 + Math.random() * 0.004,
        seed: Math.random() * 10
      });
    }
    sporeGeo.setAttribute('position', new THREE.BufferAttribute(sporePositions, 3));
    const sporeMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0xffe082,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    sporePoints = new THREE.Points(sporeGeo, sporeMat);
    flowerGroup.add(sporePoints);

    flowerGroup.position.set(0, -0.2, 0);
    threeScene.add(flowerGroup);

    // 5. Interactive Touch / Mouse Drag Orbit
    threeContainer.addEventListener('pointerdown', function (e) {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      try { threeContainer.setPointerCapture(e.pointerId); } catch (err) {}
    });

    window.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;
      targetRotY += deltaX * 0.0075;
      targetRotX += deltaY * 0.0075;
      targetRotX = Math.max(-0.4, Math.min(0.95, targetRotX));
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    });

    function endPointerDrag(e) {
      if (isDragging) {
        isDragging = false;
        try { threeContainer.releasePointerCapture(e.pointerId); } catch (err) {}
      }
    }
    window.addEventListener('pointerup', endPointerDrag);
    window.addEventListener('pointercancel', endPointerDrag);

    // 6. Resize Handling
    resizeThreeGarden();
    window.addEventListener('resize', resizeThreeGarden);

    // 7. Animation Loop
    threeClock = new THREE.Clock();
    requestAnimationFrame(animateThreeGarden);
  }

  function resizeThreeGarden() {
    if (!threeRenderer || !threeCamera || !threeContainer) return;
    const w = threeContainer.clientWidth || 540;
    const h = threeContainer.clientHeight || 440;
    threeCamera.aspect = w / h;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(w, h);
  }

  function animateThreeGarden() {
    requestAnimationFrame(animateThreeGarden);
    if (!threeRenderer || !threeScene || !threeCamera) return;

    const delta = threeClock ? threeClock.getDelta() : 0.016;
    const time = threeClock ? threeClock.getElapsedTime() : Date.now() * 0.001;

    // Rotate spiral galaxy slowly
    if (galaxyPoints) {
      galaxyPoints.rotation.y += 0.0012;
    }

    // Interactive damping & idle auto-rotation
    if (!isDragging) {
      targetRotY += 0.004;
    }
    currentRotY += (targetRotY - currentRotY) * 0.07;
    currentRotX += (targetRotX - currentRotX) * 0.07;

    if (flowerGroup) {
      flowerGroup.rotation.y = currentRotY;
      flowerGroup.rotation.x = currentRotX;
      // Gentle floating breath
      flowerGroup.position.y = -0.2 + Math.sin(time * 1.6) * 0.08;
    }

    // Upward drifting stardust spores
    if (sporePoints && sporePositions) {
      const p = sporePoints.geometry.attributes.position.array;
      for (let i = 0; i < sporeCount; i++) {
        p[i * 3 + 1] += sporeVelocities[i].speed;
        p[i * 3] += Math.sin(time * sporeVelocities[i].wobbleSpeed + sporeVelocities[i].seed) * sporeVelocities[i].wobbleAmp;
        if (p[i * 3 + 1] > 2.8) {
          p[i * 3 + 1] = 0.25;
          const spR = Math.random() * 1.3;
          const spAng = Math.random() * Math.PI * 2;
          p[i * 3] = Math.cos(spAng) * spR;
          p[i * 3 + 2] = Math.sin(spAng) * spR;
        }
      }
      sporePoints.geometry.attributes.position.needsUpdate = true;
    }

    // Real-time Blooming Animation (smooth easeOutCubic)
    if (isBlooming && bloomProgress < 1) {
      bloomProgress += delta * 0.38; // blooms over ~2.6 seconds
      if (bloomProgress > 1) bloomProgress = 1;

      const p = 1 - Math.pow(1 - bloomProgress, 3);
      petals.forEach(item => {
        item.mesh.rotation.x = 0.08 + p * (item.maxRotation - 0.08);
      });
    }

    threeRenderer.render(threeScene, threeCamera);
  }

  function triggerFlowerBloom() {
    bloomProgress = 0;
    isBlooming = true;
    petals.forEach(item => {
      item.mesh.rotation.x = 0.08;
    });
  }

  function resetFlowerBud() {
    bloomProgress = 0;
    isBlooming = false;
    petals.forEach(item => {
      item.mesh.rotation.x = 0.08;
    });
  }

  // Pre-initialize Three.js scene so it's loaded and ready instantaneously
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeGarden);
  } else {
    initThreeGarden();
  }

  // --- 6. Seamless Gift Open & Galaxy Transition (ZERO audio interruption!) ---
  const openGiftBtn = document.getElementById('openGiftBtn');
  const galaxyStage = document.getElementById('galaxyStage');
  const backToPassBtn = document.getElementById('backToPassBtn');

  if (openGiftBtn) {
    openGiftBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      playSparkleChime();

      const rect = openGiftBtn.getBoundingClientRect();
      triggerBurst(90, rect.left + rect.width / 2, rect.top + rect.height / 2);

      // Transition smoothly into Galaxy Mode without leaving the page or stopping the audio!
      if (celebrationCard) celebrationCard.classList.remove('active');
      document.body.classList.add('galaxy-active');

      setTimeout(function () {
        if (galaxyStage) {
          galaxyStage.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        isGalaxyActive = true;
        resizeThreeGarden();
        triggerFlowerBloom();
      }, 300);
    });
  }

  if (backToPassBtn) {
    backToPassBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      playSparkleChime();

      if (galaxyStage) galaxyStage.classList.remove('active');
      document.body.classList.remove('galaxy-active');
      isGalaxyActive = false;

      setTimeout(function () {
        if (celebrationCard) {
          celebrationCard.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 250);
    });
  }

  // --- 7. Floating Hearts & Celestial Stardust on Every Tap (Non-blocking) ---
  const heartEmojis = ['💖', '💕', '🌸', '✨', '⭐', '🧁', '💫'];
  window.addEventListener('click', function (e) {
    const target = e.target;
    if (target.closest('button') || target.closest('a') || target.closest('.love-note')) return;

    playSparkleChime();

    if (isGalaxyActive) {
      triggerBurst(18, e.clientX, e.clientY);
    }

    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  });

  // --- 8. Replay Button ---
  const replayBtn = document.getElementById('replayBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      isCelebration = false;
      isGalaxyActive = false;
      isYesHovered = false;
      dodgeCount = 0;

      document.body.classList.remove('galaxy-active');
      if (galaxyStage) galaxyStage.classList.remove('active');

      resetFlowerBud();

      if (noBtn) noBtn.style.transform = '';
      if (yesBtn) yesBtn.style.transform = '';
      if (toast) {
        toast.textContent = '';
        toast.classList.remove('show');
      }

      // Close flipped notes
      document.querySelectorAll('.love-note.flipped').forEach(n => n.classList.remove('flipped'));

      if (celebrationCard && proposalCard) {
        celebrationCard.classList.remove('active');
        setTimeout(function () {
          proposalCard.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 180);
      }
    });
  }

})();
