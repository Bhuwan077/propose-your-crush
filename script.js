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

  // --- 5. Three.js 3D WebGL Living Crystal Lotus & Spiral Galaxy (High-Craft Edition) ---
  // (Curved 3D parametric petals, golden stamen core, emerald stem, 6,000-star galaxy, shooting stars, and orbit/zoom)
  const threeContainer = document.getElementById('threeGardenContainer');
  const threeCanvas = document.getElementById('threeCanvas');

  let threeRenderer = null;
  let threeScene = null;
  let threeCamera = null;
  let threeClock = null;
  let flowerGroup = null;
  let galaxyPoints = null;
  let galaxySpeeds = null;
  let sporePoints = null;
  let sporePositions = null;
  let sporeVelocities = [];
  const sporeCount = 75;
  const petals = [];

  // Loose floating petals in space
  let floatingPetalsGroup = null;
  const floatingPetalsData = [];

  // Shooting star system
  let shootingStarLine = null;
  let shootActive = false;
  let shootProgress = 0;
  let shootStart = null;
  let shootDir = null;
  let nextShootTime = 2.5;

  let bloomProgress = 0;
  let isBlooming = false;
  let hasThreeInit = false;

  // Interactive Touch & Mouse Orbit Drag + Pinch/Wheel Zoom
  let isDragging = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let targetRotY = 0;
  let targetRotX = 0.22;
  let currentRotY = 0;
  let currentRotX = 0.22;

  let targetCameraDist = 7.4;
  let currentCameraDist = 7.4;
  const lookTarget = { x: 0, y: 0.42, z: 0 };
  let initialPinchDist = null;

  // 1. Procedural Botanical Petal Vein & Velvet Bump Texture
  function createVeinBumpTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Base neutral 50% gray
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);

    // Radiating longitudinal botanical veins from petal base to tip
    for (let i = 0; i < 48; i++) {
      const norm = (i / 47) * 2 - 1; // -1 to +1
      const startX = 256 + norm * 18;
      const endX = 256 + norm * 220 + Math.sin(i * 1.8) * 8;
      const ctrlX = 256 + norm * 110 + (Math.random() - 0.5) * 12;

      const veinGrad = ctx.createLinearGradient(startX, 512, endX, 0);
      veinGrad.addColorStop(0, 'rgba(235, 235, 235, 0.65)');
      veinGrad.addColorStop(0.6, 'rgba(215, 215, 215, 0.45)');
      veinGrad.addColorStop(1, 'rgba(195, 195, 195, 0.25)');

      ctx.strokeStyle = veinGrad;
      ctx.lineWidth = Math.abs(norm) < 0.15 ? 2.4 : 1.3;
      ctx.beginPath();
      ctx.moveTo(startX, 512);
      ctx.quadraticCurveTo(ctrlX, 256, endX, 0);
      ctx.stroke();

      // Delicate lateral secondary branchlets
      if (i % 2 === 0) {
        for (let y = 140; y < 460; y += 36) {
          const branchSide = norm >= 0 ? 1 : -1;
          ctx.strokeStyle = 'rgba(205, 205, 205, 0.22)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          const bx = 256 + norm * (512 - y) * 0.42;
          ctx.moveTo(bx, y);
          ctx.quadraticCurveTo(bx + branchSide * 24, y - 10, bx + branchSide * 46, y - 20);
          ctx.stroke();
        }
      }
    }

    // Micro-velvet noise stippling for authentic floral light scattering
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 12;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(c);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  // 2. Parametric Organic Curved Petal Geometry Builder (With Ruffled Silk Margins)
  function createCurvedPetalGeometry(width, length, cupDepth, tipCurl, colorBaseHex, colorMidHex, colorRimHex, uSegs = 18, vSegs = 24) {
    const positions = [];
    const uvs = [];
    const colors = [];
    const indices = [];

    const colorBase = new THREE.Color(colorBaseHex);
    const colorMid = new THREE.Color(colorMidHex);
    const colorRim = new THREE.Color(colorRimHex);
    const colorGold = new THREE.Color(0xffd54f);

    for (let j = 0; j <= vSegs; j++) {
      const v = j / vSegs; // 0 at base to 1 at tip
      const contour = Math.sin(Math.PI * Math.pow(v, 0.65));
      const w = contour * (width * 0.5);
      const y = v * length;
      const zCurl = Math.pow(v, 2.2) * tipCurl;

      for (let i = 0; i <= uSegs; i++) {
        const uNorm = (i / uSegs) * 2 - 1; // -1 to +1
        const x = uNorm * w;

        // Spoon-like concave curvature along width
        const zCup = -(1 - uNorm * uNorm) * cupDepth * Math.sin(Math.PI * v * 0.85);

        // Organic harmonic edge ruffling along the petal margin
        const edgeDist = Math.abs(uNorm);
        const ruffle = Math.sin(v * 16.0 + uNorm * 10.0) * 0.045 * Math.pow(v, 1.2) * edgeDist;
        const z = zCup + zCurl + ruffle;

        // Subtle lateral lip flaring at the widest part
        const xFlare = x * (1.0 + Math.sin(v * Math.PI) * 0.08);
        positions.push(xFlare, y, z);
        uvs.push(i / uSegs, v);

        // Botanical vertex color gradient: Gold base -> Velvet Rose -> Crystal Blush -> Frosted Rim
        const vertexColor = new THREE.Color();
        if (v < 0.22) {
          vertexColor.lerpColors(colorGold, colorBase, v / 0.22);
        } else if (v < 0.72) {
          vertexColor.lerpColors(colorBase, colorMid, (v - 0.22) / 0.5);
        } else {
          vertexColor.lerpColors(colorMid, colorRim, (v - 0.72) / 0.28);
        }
        if (edgeDist > 0.72) {
          vertexColor.lerp(colorRim, (edgeDist - 0.72) / 0.28 * 0.45);
        }

        colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
      }
    }

    for (let j = 0; j < vSegs; j++) {
      for (let i = 0; i < uSegs; i++) {
        const a = j * (uSegs + 1) + i;
        const b = (j + 1) * (uSegs + 1) + i;
        const c = (j + 1) * (uSegs + 1) + (i + 1);
        const d = j * (uSegs + 1) + (i + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setIndex(indices);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }

  // 3. Dense 96-Stamen Golden Filament & Pollen Crown Builder
  function createStamenSystem(count = 96) {
    const linePositions = [];
    const lineColors = [];
    const headPositions = [];
    const headColors = [];
    const colGold = new THREE.Color(0xffd54f);
    const colAmber = new THREE.Color(0xffb300);
    const colPollen = new THREE.Color(0xfff59d);

    for (let i = 0; i < count; i++) {
      // Two concentric rings: inner ring (r ~ 0.16) and outer ring (r ~ 0.27)
      const isOuter = i % 2 === 0;
      const ringRadius = isOuter ? 0.26 + Math.random() * 0.08 : 0.16 + Math.random() * 0.06;
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
      const flare = isOuter ? 0.38 + Math.random() * 0.12 : 0.22 + Math.random() * 0.1;
      const height = isOuter ? 0.38 + Math.random() * 0.22 : 0.28 + Math.random() * 0.18;

      const x0 = Math.cos(angle) * ringRadius;
      const z0 = Math.sin(angle) * ringRadius;
      const y0 = 0.24;

      const x1 = Math.cos(angle) * (ringRadius + flare);
      const z1 = Math.sin(angle) * (ringRadius + flare);
      const y1 = y0 + height;

      linePositions.push(x0, y0, z0, x1, y1, z1);
      lineColors.push(colAmber.r, colAmber.g, colAmber.b, colGold.r, colGold.g, colGold.b);

      // Realistic double-lobed pollen anther head (two points per stamen)
      headPositions.push(x1, y1, z1);
      headColors.push(colPollen.r, colPollen.g, colPollen.b);
      headPositions.push(x1 + (Math.random() - 0.5) * 0.03, y1 + 0.02, z1 + (Math.random() - 0.5) * 0.03);
      headColors.push(1.0, 0.98, 0.75);
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const headGeo = new THREE.BufferGeometry();
    headGeo.setAttribute('position', new THREE.Float32BufferAttribute(headPositions, 3));
    headGeo.setAttribute('color', new THREE.Float32BufferAttribute(headColors, 3));

    return { lineGeo, headGeo };
  }

  function initThreeGarden() {
    if (!window.THREE || !threeCanvas || !threeContainer || hasThreeInit) return;
    hasThreeInit = true;

    threeScene = new THREE.Scene();
    threeScene.fog = new THREE.FogExp2(0x02000a, 0.016);

    // Camera near set to 0.05 for flawless super-macro close-up zooming without petal clipping
    threeCamera = new THREE.PerspectiveCamera(50, 1, 0.05, 1000);
    threeCamera.position.set(0, 2.1, currentCameraDist);
    threeCamera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z);

    threeRenderer = new THREE.WebGLRenderer({
      canvas: threeCanvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    threeRenderer.toneMappingExposure = 1.2;

    // --- Cinematic Botanical Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffc2d1, 0.88);
    threeScene.add(ambientLight);

    const centerPointLight = new THREE.PointLight(0xff1493, 4.4, 25);
    centerPointLight.position.set(0, 1.4, 0);
    threeScene.add(centerPointLight);

    // Radiant incandescent core light for Programmer's Lotus Glow
    const goldenStamenLight = new THREE.PointLight(0xffe885, 6.5, 15);
    goldenStamenLight.position.set(0, 0.52, 0);
    threeScene.add(goldenStamenLight);

    const innerHeartLight = new THREE.PointLight(0xff2a6d, 5.2, 12);
    innerHeartLight.position.set(0, 0.35, 0);
    threeScene.add(innerHeartLight);

    const topWarmLight = new THREE.DirectionalLight(0xfff0f5, 1.15);
    topWarmLight.position.set(3, 7, 5);
    threeScene.add(topWarmLight);

    const rimLight = new THREE.DirectionalLight(0x00e5ff, 0.7);
    rimLight.position.set(-4, -2, -4);
    threeScene.add(rimLight);

    // --- Procedural Textures ---
    function createStarTexture() {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(255, 224, 130, 0.9)');
      grad.addColorStop(0.55, 'rgba(0, 229, 255, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }
    const starTexture = createStarTexture();
    const veinBumpTexture = createVeinBumpTexture();

    // --- 1. 6,000-Star Python Logarithmic Spiral Galaxy with Differential Swirl ---
    const galaxyCount = 6000;
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPositions = new Float32Array(galaxyCount * 3);
    const galaxyColors = new Float32Array(galaxyCount * 3);
    galaxySpeeds = new Float32Array(galaxyCount);

    const colorCore = new THREE.Color(0xffe082); // Warm Gold (Python center)
    const colorMid = new THREE.Color(0xff6584);  // Romantic Hotpink (Python petals)
    const colorCyan = new THREE.Color(0x00e5ff); // Luminous Cyan (Python color='cyan')
    const colorWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < galaxyCount; i++) {
      const arm = (i % 3) * ((2 * Math.PI) / 3);
      const r = Math.pow(Math.random(), 1.3) * 26 + 1.2;
      const theta = arm + r * 0.38 + (Math.random() - 0.5) * 0.48;

      const x = Math.cos(theta) * r + (Math.random() - 0.5) * 0.42;
      const z = Math.sin(theta) * r + (Math.random() - 0.5) * 0.42;
      const y = (Math.random() - 0.5) * (7 / (r * 0.55 + 1)) - 0.35;

      galaxyPositions[i * 3] = x;
      galaxyPositions[i * 3 + 1] = y;
      galaxyPositions[i * 3 + 2] = z;

      galaxySpeeds[i] = 0.0024 / Math.sqrt(r * 0.4 + 1);

      const col = new THREE.Color();
      if (r < 4.8) {
        col.lerpColors(colorCore, colorMid, r / 4.8);
      } else if (r < 15) {
        col.lerpColors(colorMid, colorCyan, (r - 4.8) / 10.2);
      } else {
        col.lerpColors(colorCyan, colorWhite, Math.min(1, (r - 15) / 11));
      }

      galaxyColors[i * 3] = col.r;
      galaxyColors[i * 3 + 1] = col.g;
      galaxyColors[i * 3 + 2] = col.b;
    }

    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

    const galaxyMat = new THREE.PointsMaterial({
      size: 0.19,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
    galaxyPoints.rotation.x = 0.32;
    threeScene.add(galaxyPoints);

    // --- 2. Dynamic 3D Shooting Star System ---
    const shootGeo = new THREE.BufferGeometry();
    const shootPos = new Float32Array(6);
    shootGeo.setAttribute('position', new THREE.BufferAttribute(shootPos, 3));
    const shootMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    shootingStarLine = new THREE.Line(shootGeo, shootMat);
    threeScene.add(shootingStarLine);

    shootStart = new THREE.Vector3();
    shootDir = new THREE.Vector3();

    // --- 3. Master 3D Botanical Flower Group ---
    flowerGroup = new THREE.Group();

    // Programmer's Glowing Translucent Crystal Glass Petal Material
    const crystalPetalMat = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      bumpMap: veinBumpTexture,
      bumpScale: 0.022,
      transmission: 0.78, // High glass translucency
      roughness: 0.12,
      metalness: 0.04,
      thickness: 1.6,
      ior: 1.48,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      emissive: new THREE.Color(0xff2a6d),
      emissiveIntensity: 0.44, // Glowing inner illumination
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92
    });

    // 5 Organic Geometries across 5 Concentric Whorls (45 Total Petals with Natural Phyllotaxis)
    const geoWhorl0 = createCurvedPetalGeometry(1.68, 3.4, 0.36, -0.76, 0x880e4f, 0xe91e63, 0xff80ab); // Python 6-Petal Foundation
    const geoWhorl1 = createCurvedPetalGeometry(1.42, 3.15, 0.48, -0.56, 0xad1457, 0xff4081, 0xfff0f5); // Outer Guard Whorl
    const geoWhorl2 = createCurvedPetalGeometry(1.22, 2.75, 0.54, -0.40, 0xc2185b, 0xff6584, 0xfff5f8); // Middle Chalice Whorl
    const geoWhorl3 = createCurvedPetalGeometry(0.98, 2.35, 0.58, -0.25, 0xd81b60, 0xff8da1, 0xffffff); // Inner Standing Whorl
    const geoWhorl4 = createCurvedPetalGeometry(0.78, 1.95, 0.62, -0.14, 0xe91e63, 0xffa4ba, 0xffffff); // Heart Bud Whorl

    // Sparkling diamond starlight tips material
    const tipStarMat = new THREE.SpriteMaterial({
      map: starTexture,
      color: 0xffffff,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const petalTipSprites = [];

    const whorlConfigs = [
      { count: 6, geo: geoWhorl0, length: 3.4, curl: -0.76, scale: 1.18, angleOffset: 1.62, y: -0.15, startStage: 0.0, endStage: 0.75 },
      { count: 14, geo: geoWhorl1, length: 3.15, curl: -0.56, scale: 1.08, angleOffset: 1.38, y: -0.06, startStage: 0.10, endStage: 0.85 },
      { count: 11, geo: geoWhorl2, length: 2.75, curl: -0.40, scale: 0.88, angleOffset: 1.10, y: 0.04, startStage: 0.24, endStage: 0.92 },
      { count: 8, geo: geoWhorl3, length: 2.35, curl: -0.25, scale: 0.68, angleOffset: 0.80, y: 0.14, startStage: 0.38, endStage: 0.97 },
      { count: 6, geo: geoWhorl4, length: 1.95, curl: -0.14, scale: 0.48, angleOffset: 0.52, y: 0.22, startStage: 0.50, endStage: 1.0 }
    ];

    whorlConfigs.forEach(whorl => {
      for (let i = 0; i < whorl.count; i++) {
        // Natural organic angle jitter and scale variation so petals nestle naturally like real flowers
        const angleJitter = (Math.random() - 0.5) * 0.08;
        const scaleJitter = 1.0 + (Math.random() - 0.5) * 0.06;
        const tiltJitter = (Math.random() - 0.5) * 0.05;

        const angle = (i / whorl.count) * Math.PI * 2 + angleJitter;
        const petalMesh = new THREE.Mesh(whorl.geo, crystalPetalMat);
        const finalScale = whorl.scale * scaleJitter;
        petalMesh.scale.set(finalScale, finalScale, finalScale);
        petalMesh.position.y = 0;
        petalMesh.rotation.x = 0.08 + tiltJitter; // closed bud initially

        // Luminous Pinpoint Diamond Star at each petal tip (Programmer's Flower aesthetic)
        const tipStar = new THREE.Sprite(tipStarMat);
        tipStar.position.set(0, whorl.length * 0.98, whorl.curl * 0.95);
        tipStar.scale.set(0.24, 0.24, 1);
        petalMesh.add(tipStar);
        petalTipSprites.push({ sprite: tipStar, baseScale: 0.24, phase: Math.random() * Math.PI * 2 });

        const pivotGroup = new THREE.Group();
        pivotGroup.position.y = whorl.y;
        pivotGroup.rotation.y = angle;
        pivotGroup.add(petalMesh);

        flowerGroup.add(pivotGroup);
        petals.push({
          mesh: petalMesh,
          maxRotation: whorl.angleOffset,
          startStage: whorl.startStage,
          endStage: whorl.endStage,
          initialRotX: 0.08 + tiltJitter
        });
      }
    });

    // --- 4. Golden Honey Dome Receptacle & Dense 96-Stamen Crown ---
    const domeGeo = new THREE.SphereGeometry(0.38, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xffd54f,
      emissive: 0xffa000,
      emissiveIntensity: 0.55,
      roughness: 0.25,
      metalness: 0.3
    });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.position.y = 0.22;
    flowerGroup.add(domeMesh);

    // 96 Golden Stamen Filaments in Two Tiers
    const stamenData = createStamenSystem(96);
    const stamenLines = new THREE.LineSegments(stamenData.lineGeo, new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.92
    }));
    flowerGroup.add(stamenLines);

    // Double-Lobed Sparkling Pollen Heads
    const pollenMat = new THREE.PointsMaterial({
      size: 0.13,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const pollenPoints = new THREE.Points(stamenData.headGeo, pollenMat);
    flowerGroup.add(pollenPoints);

    // Volumetric Radiant Sunburst Core Billboard
    const coreSunburstMat = new THREE.SpriteMaterial({
      map: starTexture,
      color: 0xfff0b3,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const coreSunburst = new THREE.Sprite(coreSunburstMat);
    coreSunburst.position.set(0, 0.42, 0);
    coreSunburst.scale.set(1.9, 1.9, 1);
    flowerGroup.add(coreSunburst);

    // Glowing Core Halo
    const haloGeo = new THREE.SphereGeometry(0.56, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffe082,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.y = 0.35;
    flowerGroup.add(halo);

    // --- Elegant 3D Golden Filigree Flourish Curves (Programmer's FlourishGroup) ---
    const flourishGroup = new THREE.Group();
    const flourishMat = new THREE.LineBasicMaterial({
      color: 0xffd54f,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending
    });

    const flourishCurves = [
      // Left graceful arch
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, -0.1, 0),
        new THREE.Vector3(-1.2, 0.4, 0.6),
        new THREE.Vector3(-2.2, 1.2, -0.4),
        new THREE.Vector3(-1.8, 1.9, 0.2)
      ),
      // Right graceful arch
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, -0.1, 0),
        new THREE.Vector3(1.2, 0.4, -0.6),
        new THREE.Vector3(2.2, 1.2, 0.4),
        new THREE.Vector3(1.8, 1.9, -0.2)
      ),
      // Back subtle wings
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, -0.1, 0),
        new THREE.Vector3(0.6, 0.5, -1.4),
        new THREE.Vector3(-0.6, 1.4, -2.0),
        new THREE.Vector3(-1.4, 1.8, -1.2)
      ),
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, -0.1, 0),
        new THREE.Vector3(-0.6, 0.5, -1.4),
        new THREE.Vector3(0.6, 1.4, -2.0),
        new THREE.Vector3(1.4, 1.8, -1.2)
      )
    ];

    flourishCurves.forEach(curve => {
      const pts = curve.getPoints(36);
      const fGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const fLine = new THREE.Line(fGeo, flourishMat);
      flourishGroup.add(fLine);

      // Tip sparkle for each flourish curve
      const endPt = pts[pts.length - 1];
      const fStar = new THREE.Sprite(tipStarMat);
      fStar.position.copy(endPt);
      fStar.scale.set(0.22, 0.22, 1);
      flourishGroup.add(fStar);
    });
    flowerGroup.add(flourishGroup);

    // --- 5. Glistening Optical Water Dewdrops Resting on Petals ---
    const dewdropGroup = new THREE.Group();
    const dewdropGeo = new THREE.SphereGeometry(0.048, 16, 16);
    const dewdropMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      roughness: 0.02,
      ior: 1.333,
      thickness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04
    });

    const dewLocations = [
      { x: 0.28, y: 0.45, z: 0.35, s: 1.0 },
      { x: -0.32, y: 0.52, z: 0.22, s: 0.85 },
      { x: 0.15, y: 0.38, z: -0.38, s: 1.1 },
      { x: -0.22, y: 0.62, z: -0.28, s: 0.75 },
      { x: 0.42, y: 0.48, z: -0.15, s: 0.9 },
      { x: -0.38, y: 0.42, z: 0.40, s: 0.8 },
      { x: 0.05, y: 0.28, z: 0.45, s: 1.2 }
    ];

    dewLocations.forEach(loc => {
      const dew = new THREE.Mesh(dewdropGeo, dewdropMat);
      dew.position.set(loc.x, loc.y, loc.z);
      dew.scale.set(loc.s, loc.s * 0.75, loc.s);
      dewdropGroup.add(dew);
    });
    flowerGroup.add(dewdropGroup);

    // --- 6. Curved Crystal Emerald Stem & Dewdrop Leaves ---
    const stemCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, -0.15, 0),
      new THREE.Vector3(0.1, -0.8, -0.1),
      new THREE.Vector3(-0.15, -1.6, 0.12),
      new THREE.Vector3(-0.04, -2.4, 0)
    );
    const stemGeo = new THREE.TubeGeometry(stemCurve, 32, 0.075, 12, false);
    const stemMat = new THREE.MeshPhysicalMaterial({
      color: 0x2d6a4f,
      emissive: 0x1b4332,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      transmission: 0.45,
      thickness: 0.8,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15
    });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    flowerGroup.add(stemMesh);

    function createLeafMesh(scale, angle, yPos, tilt) {
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.bezierCurveTo(0.5, 0.3, 0.9, 1.0, 0, 2.2);
      leafShape.bezierCurveTo(-0.9, 1.0, -0.5, 0.3, 0, 0);
      const leafGeo = new THREE.ShapeGeometry(leafShape, 16);
      const pos = leafGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const lx = pos.getX(i);
        const ly = pos.getY(i);
        pos.setZ(i, -0.22 * Math.sin((ly / 2.2) * Math.PI) * (1 - Math.abs(lx / 0.9)));
      }
      leafGeo.computeVertexNormals();

      const leafMat = new THREE.MeshPhysicalMaterial({
        color: 0x40916c,
        emissive: 0x2d6a4f,
        emissiveIntensity: 0.3,
        roughness: 0.22,
        transmission: 0.5,
        thickness: 0.6,
        clearcoat: 0.85,
        side: THREE.DoubleSide
      });
      const leafMesh = new THREE.Mesh(leafGeo, leafMat);
      leafMesh.scale.set(scale, scale, scale);

      // Leaf dewdrop
      const dew = new THREE.Mesh(dewdropGeo, dewdropMat);
      dew.position.set(0.12, 1.1, 0.05);
      leafMesh.add(dew);

      const leafPivot = new THREE.Group();
      leafPivot.position.set(0, yPos, 0);
      leafPivot.rotation.y = angle;
      leafMesh.rotation.x = tilt;
      leafPivot.add(leafMesh);
      return leafPivot;
    }

    const leaf1 = createLeafMesh(0.85, 0.65, -0.85, 1.15);
    const leaf2 = createLeafMesh(0.75, -2.35, -1.45, 1.05);
    flowerGroup.add(leaf1);
    flowerGroup.add(leaf2);

    // --- 7. Floating Golden Stardust Spores ---
    const sporeGeo = new THREE.BufferGeometry();
    sporePositions = new Float32Array(sporeCount * 3);
    for (let i = 0; i < sporeCount; i++) {
      const spR = Math.random() * 1.6;
      const spAng = Math.random() * Math.PI * 2;
      sporePositions[i * 3] = Math.cos(spAng) * spR;
      sporePositions[i * 3 + 1] = Math.random() * 2.6;
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
      size: 0.13,
      color: 0xffe082,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    sporePoints = new THREE.Points(sporeGeo, sporeMat);
    flowerGroup.add(sporePoints);

    // --- 8. Loose Floating Petals Drifting in Cosmic Gravity ---
    floatingPetalsGroup = new THREE.Group();
    const miniPetalGeo = createCurvedPetalGeometry(0.65, 1.4, 0.25, -0.25, 0xff6584, 0xff8da1, 0xffffff, 8, 10);
    const miniPetalMat = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      transmission: 0.6,
      roughness: 0.2,
      clearcoat: 0.8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });

    for (let i = 0; i < 6; i++) {
      const pMesh = new THREE.Mesh(miniPetalGeo, miniPetalMat);
      const angle = (i / 6) * Math.PI * 2;
      const dist = 2.2 + Math.random() * 1.5;
      pMesh.position.set(Math.cos(angle) * dist, (Math.random() - 0.5) * 2.0, Math.sin(angle) * dist);
      pMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      floatingPetalsGroup.add(pMesh);
      floatingPetalsData.push({
        mesh: pMesh,
        angle: angle,
        dist: dist,
        orbitSpeed: 0.003 + Math.random() * 0.003,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        yBase: pMesh.position.y,
        ySpeed: 0.8 + Math.random() * 0.8
      });
    }
    threeScene.add(floatingPetalsGroup);

    flowerGroup.position.set(0, -0.22, 0);
    threeScene.add(flowerGroup);

    // --- 9. Interactive Touch & Mouse Orbit Drag + Extended Macro Zoom ---
    threeContainer.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch' && !e.isPrimary) return;
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
      targetRotX = Math.max(-0.45, Math.min(0.95, targetRotX));
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

    // Mouse Wheel Macro Zoom (Down to 2.5 for close-up inspection!)
    threeContainer.addEventListener('wheel', function (e) {
      e.preventDefault();
      targetCameraDist += e.deltaY * 0.005;
      targetCameraDist = Math.max(2.5, Math.min(10.5, targetCameraDist));
    }, { passive: false });

    // Touch Pinch Macro Zoom
    threeContainer.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (initialPinchDist !== null) {
          const diff = initialPinchDist - dist;
          targetCameraDist += diff * 0.012;
          targetCameraDist = Math.max(2.5, Math.min(10.5, targetCameraDist));
        }
        initialPinchDist = dist;
      }
    }, { passive: true });

    threeContainer.addEventListener('touchend', function () {
      initialPinchDist = null;
    }, { passive: true });

    // Double-click or double-tap to toggle macro zoom into the center
    let lastTap = 0;
    threeContainer.addEventListener('pointerup', function (e) {
      const now = Date.now();
      if (now - lastTap < 300) {
        targetCameraDist = targetCameraDist > 4.5 ? 2.8 : 7.4;
      }
      lastTap = now;
    });

    // --- 10. Resize Handling ---
    resizeThreeGarden();
    window.addEventListener('resize', resizeThreeGarden);

    // --- 11. Animation Loop ---
    threeClock = new THREE.Clock();
    requestAnimationFrame(animateThreeGarden);
  }

  function resizeThreeGarden() {
    if (!threeRenderer || !threeCamera || !threeContainer) return;
    const w = threeContainer.clientWidth || 600;
    const h = threeContainer.clientHeight || 500;
    threeCamera.aspect = w / h;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(w, h);
  }

  function triggerShootingStar(time) {
    shootActive = true;
    shootProgress = 0;
    const side = Math.random() < 0.5 ? -1 : 1;
    shootStart.set(side * (10 + Math.random() * 5), 6 + Math.random() * 5, -8 - Math.random() * 8);
    shootDir.set(-side * (14 + Math.random() * 6), -(8 + Math.random() * 5), 4 + Math.random() * 4).normalize();
    nextShootTime = time + 3.0 + Math.random() * 3.5;
  }

  function animateThreeGarden() {
    requestAnimationFrame(animateThreeGarden);
    if (!threeRenderer || !threeScene || !threeCamera) return;

    const delta = threeClock ? Math.min(threeClock.getDelta(), 0.1) : 0.016;
    const time = threeClock ? threeClock.getElapsedTime() : Date.now() * 0.001;

    // 1. Differential Spiral Galaxy Swirl
    if (galaxyPoints && galaxySpeeds) {
      const pos = galaxyPoints.geometry.attributes.position.array;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        const x = pos[i * 3];
        const z = pos[i * 3 + 2];
        const sp = galaxySpeeds[i];
        const cosS = Math.cos(sp);
        const sinS = Math.sin(sp);
        pos[i * 3] = x * cosS - z * sinS;
        pos[i * 3 + 2] = x * sinS + z * cosS;
      }
      galaxyPoints.geometry.attributes.position.needsUpdate = true;
    }

    // 2. Shooting Stars
    if (time > nextShootTime && !shootActive) {
      triggerShootingStar(time);
    }
    if (shootActive && shootingStarLine) {
      shootProgress += delta * 1.8;
      const p = shootingStarLine.geometry.attributes.position.array;
      const currentHead = shootStart.clone().addScaledVector(shootDir, shootProgress * 16.0);
      const currentTail = shootStart.clone().addScaledVector(shootDir, Math.max(0, shootProgress * 16.0 - 3.8));

      p[0] = currentHead.x; p[1] = currentHead.y; p[2] = currentHead.z;
      p[3] = currentTail.x; p[4] = currentTail.y; p[5] = currentTail.z;
      shootingStarLine.geometry.attributes.position.needsUpdate = true;

      const op = Math.sin(shootProgress * Math.PI);
      shootingStarLine.material.opacity = Math.max(0, Math.min(1, op * 0.9));

      if (shootProgress >= 1.0) {
        shootActive = false;
        shootingStarLine.material.opacity = 0;
      }
    }

    // 3. Interactive Damping & Idle Auto-Rotation
    if (!isDragging) {
      targetRotY += 0.0035;
    }
    currentRotY += (targetRotY - currentRotY) * 0.075;
    currentRotX += (targetRotX - currentRotX) * 0.075;

    // Smooth Camera Zoom Lerp with Adaptive Macro Centering
    currentCameraDist += (targetCameraDist - currentCameraDist) * 0.08;
    const sinX = Math.sin(currentRotX * 0.5);
    const cosX = Math.cos(currentRotX * 0.5);

    // As camera zooms closer, center directly on the golden stamen crown and dewdrops
    const zoomRatio = Math.max(0, Math.min(1, (7.4 - currentCameraDist) / (7.4 - 2.5)));
    const targetY = lookTarget.y + zoomRatio * 0.12;

    threeCamera.position.y = targetY + sinX * currentCameraDist + 0.8 * (1 - zoomRatio * 0.35);
    threeCamera.position.z = cosX * currentCameraDist;
    threeCamera.lookAt(lookTarget.x, targetY, lookTarget.z);

    if (flowerGroup) {
      flowerGroup.rotation.y = currentRotY;
      flowerGroup.rotation.x = currentRotX * 0.45;
      // Gentle floating breath
      flowerGroup.position.y = -0.22 + Math.sin(time * 1.5) * 0.075;

      // Pulse luminous petal tip stars & core sunburst
      if (typeof petalTipSprites !== 'undefined') {
        petalTipSprites.forEach(item => {
          const shimmer = 1.0 + Math.sin(time * 3.0 + item.phase) * 0.25;
          const s = item.baseScale * shimmer;
          item.sprite.scale.set(s, s, 1);
        });
      }
      if (typeof coreSunburst !== 'undefined') {
        const corePulse = 1.85 + Math.sin(time * 2.2) * 0.22;
        coreSunburst.scale.set(corePulse, corePulse, 1);
      }
    }

    // 4. Loose Drifting Petals in Space
    if (floatingPetalsGroup) {
      floatingPetalsData.forEach(d => {
        d.angle += d.orbitSpeed;
        d.mesh.position.x = Math.cos(d.angle) * d.dist;
        d.mesh.position.z = Math.sin(d.angle) * d.dist;
        d.mesh.position.y = d.yBase + Math.sin(time * d.ySpeed) * 0.25;
        d.mesh.rotation.x += d.rotSpeedX;
        d.mesh.rotation.y += d.rotSpeedY;
      });
    }

    // 5. Upward Drifting Stardust Spores
    if (sporePoints && sporePositions) {
      const p = sporePoints.geometry.attributes.position.array;
      for (let i = 0; i < sporeCount; i++) {
        p[i * 3 + 1] += sporeVelocities[i].speed;
        p[i * 3] += Math.sin(time * sporeVelocities[i].wobbleSpeed + sporeVelocities[i].seed) * sporeVelocities[i].wobbleAmp;
        if (p[i * 3 + 1] > 2.8) {
          p[i * 3 + 1] = 0.25;
          const spR = Math.random() * 1.4;
          const spAng = Math.random() * Math.PI * 2;
          p[i * 3] = Math.cos(spAng) * spR;
          p[i * 3 + 2] = Math.sin(spAng) * spR;
        }
      }
      sporePoints.geometry.attributes.position.needsUpdate = true;
    }

    // 6. Staged Organic Real-Time Blooming Animation (easeOutCubic per whorl)
    if (isBlooming && bloomProgress < 1) {
      bloomProgress += delta * 0.35; // smooth 2.8s bloom
      if (bloomProgress > 1) bloomProgress = 1;

      petals.forEach(item => {
        const start = item.startStage;
        const end = item.endStage;
        let localProgress = 0;
        if (bloomProgress > start) {
          localProgress = Math.min(1, (bloomProgress - start) / (end - start));
        }
        const p = 1 - Math.pow(1 - localProgress, 3);
        const initRot = item.initialRotX || 0.08;
        item.mesh.rotation.x = initRot + p * (item.maxRotation - initRot);
      });
    }

    threeRenderer.render(threeScene, threeCamera);
  }

  function triggerFlowerBloom() {
    bloomProgress = 0;
    isBlooming = true;
    targetCameraDist = 5.6; // Start slightly closer for cinematic glide
    setTimeout(() => {
      targetCameraDist = 7.4; // Glide back smoothly as bloom peaks
    }, 400);

    petals.forEach(item => {
      item.mesh.rotation.x = item.initialRotX || 0.08;
    });
  }

  function resetFlowerBud() {
    bloomProgress = 0;
    isBlooming = false;
    targetCameraDist = 7.4;
    petals.forEach(item => {
      item.mesh.rotation.x = item.initialRotX || 0.08;
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
