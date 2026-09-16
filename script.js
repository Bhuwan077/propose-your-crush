/**
 * Cute, Simple & Responsive Proposal Engine
 * - Bulletproof HTML5 Local Audio (song.m4a) at Medium Volume (45%)
 * - Official Love Pass & Interactive Flip Love Notes
 * - Playful Unclickable "No" Button (Grows Yes button!)
 * - Dynamic Blossoming Flowers & Stars Canvas
 * - Special Gift: Milky Way Galaxy & Blooming Botanical Garden (Rose, Poppy, Lotus!)
 */

(function () {
  'use strict';

  // --- 1. Bulletproof Local Audio Playback (song.m4a) at 45% Volume ---
  const bgAudio = document.getElementById('bgAudio');
  let hasMusicStarted = false;

  function startAudio() {
    if (!bgAudio || hasMusicStarted) return;
    bgAudio.volume = 0.45; // Medium, comfortable volume
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          hasMusicStarted = true;
        })
        .catch(() => {
          // Autoplay restricted by browser, will trigger on first user touch
        });
    }
  }

  // Attempt autoplay immediately
  startAudio();

  // Instant fallback: play audio on first user touch or click anywhere
  function onFirstTouch() {
    startAudio();
  }
  window.addEventListener('click', onFirstTouch, { passive: true });
  window.addEventListener('touchstart', onFirstTouch, { passive: true });
  window.addEventListener('pointerdown', onFirstTouch, { passive: true });

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

  // --- 2. Dynamic Blossoming Flowers & Stars Canvas (With Galaxy Mode) ---
  const canvas = document.getElementById('magicCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const shootingStars = [];
  let isYesHovered = false;
  let isCelebration = false;
  let isGalaxyMode = false;

  const pastelColors = [
    '#FFAEC0', '#FFCCD7', '#FFDEE9', '#FFE599', '#D8F3DC', '#FFC6FF', '#BEE1E6'
  ];
  const cosmicColors = [
    '#FFFFFF', '#FFE082', '#FF80AB', '#B388FF', '#80D8FF', '#EA80FC'
  ];

  class FlowerStarParticle {
    constructor(isBurst = false, x = null, y = null) {
      this.reset(isBurst, x, y);
    }

    reset(isBurst = false, x = null, y = null) {
      this.isBurst = isBurst;
      this.type = Math.random() < 0.6 ? 'flower' : 'star';
      const colors = isGalaxyMode ? cosmicColors : pastelColors;
      this.color = colors[Math.floor(Math.random() * colors.length)];
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
      const speedMult = isYesHovered ? 2.5 : isCelebration ? 1.6 : isGalaxyMode ? 1.2 : 1.0;
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
        ctx.fillStyle = isGalaxyMode ? '#FFF9C4' : '#FFE599';
        ctx.fill();
      } else {
        const r = this.radius;
        ctx.fillStyle = this.color;
        ctx.shadowColor = isGalaxyMode ? '#80D8FF' : '#FFAEC0';
        ctx.shadowBlur = isGalaxyMode ? 12 : 8;
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

  // Shooting star in galaxy mode
  class ShootingStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width * 0.8;
      this.y = Math.random() * (height * 0.4);
      this.length = Math.random() * 80 + 50;
      this.speed = Math.random() * 9 + 10;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
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
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  const BASE_PARTICLES = 50;
  for (let i = 0; i < BASE_PARTICLES; i++) {
    particles.push(new FlowerStarParticle());
  }

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

    if (isYesHovered && t - lastHover > 50) {
      spawnHoverFlowers();
      lastHover = t;
    }

    // Shooting stars in galaxy mode
    if (isGalaxyMode) {
      if (Math.random() < 0.008) shootingStars.push(new ShootingStar());
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        if (!star.update()) {
          shootingStars.splice(i, 1);
        } else {
          star.draw();
        }
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (!p.update()) {
        particles.splice(i, 1);
      } else {
        p.draw();
      }
    }

    while (particles.filter((p) => !p.isBurst).length < BASE_PARTICLES) {
      particles.push(new FlowerStarParticle());
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
  const galaxyStage = document.getElementById('galaxyStage');

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

  // --- 5. THE SURPRISE GIFT: MILKY WAY GALAXY & BLOOMING SEEDS ---
  const openGiftBtn = document.getElementById('openGiftBtn');
  const closeGalaxyBtn = document.getElementById('closeGalaxyBtn');

  if (openGiftBtn) {
    openGiftBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      playSparkleChime();

      // Fade out celebration card
      if (celebrationCard) celebrationCard.classList.remove('active');

      // Enable galaxy mode & cosmic background
      isGalaxyMode = true;
      document.body.classList.add('galaxy-mode');

      // Burst of cosmic stars
      triggerBurst(100, width / 2, height / 2);

      // Show galaxy stage & trigger blooming flowers
      setTimeout(function () {
        if (galaxyStage) {
          galaxyStage.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });

          // Reset and replay SVG flower growth animations
          const stems = galaxyStage.querySelectorAll('.growing-stem');
          stems.forEach(stem => {
            stem.style.animation = 'none';
            stem.offsetHeight; /* trigger reflow */
            stem.style.animation = '';
          });

          const blooms = galaxyStage.querySelectorAll('.flower-bloom, .blooming-leaf');
          blooms.forEach(bloom => {
            bloom.style.animation = 'none';
            bloom.offsetHeight; /* trigger reflow */
            bloom.style.animation = '';
          });
        }
      }, 400);
    });
  }

  if (closeGalaxyBtn) {
    closeGalaxyBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      playPopChime();

      isGalaxyMode = false;
      document.body.classList.remove('galaxy-mode');

      if (galaxyStage) galaxyStage.classList.remove('active');

      setTimeout(function () {
        if (celebrationCard) {
          celebrationCard.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 300);
    });
  }

  // --- 6. Floating Hearts on Every Tap (Non-blocking) ---
  const heartEmojis = ['💖', '💕', '🌸', '✨', '🧁', '⭐'];
  window.addEventListener('click', function (e) {
    // Only spawn heart if not clicking on interactive buttons or cards directly
    const target = e.target;
    if (target.closest('button') || target.closest('.love-note')) return;

    playSparkleChime();
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  });

  // --- 7. Replay Button ---
  const replayBtn = document.getElementById('replayBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      isCelebration = false;
      isYesHovered = false;
      dodgeCount = 0;

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
