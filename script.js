/**
 * Bespoke Romantic Proposal Experience
 * - Automatic YouTube Music Stream (https://youtu.be/vBTcsTd2kF0) at Medium Volume (45%)
 * - Chapter 1 (Wax-Sealed Letter) -> Chapter 2 (Proposal) -> Chapter 3 (Celebration & Promise Capsule)
 * - Elevated 3D Fluttering Petals & Dynamic Shooting Stars Engine
 * - Smooth Weightless Hovering "No" Button Physics
 */

(function () {
  'use strict';

  // --- 1. YouTube Background Music Stream (vBTcsTd2kF0) ---
  const YOUTUBE_VIDEO_ID = 'vBTcsTd2kF0';
  const TARGET_VOLUME = 45; // Medium, pleasant, non-intrusive sound

  let ytPlayer = null;
  let isYtReady = false;
  let hasMusicStarted = false;

  const musicIndicator = document.getElementById('musicIndicator');

  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('ytPlayer', {
      height: '180',
      width: '180',
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        loop: 1,
        playlist: YOUTUBE_VIDEO_ID,
        playsinline: 1,
        rel: 0
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  };

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  function onPlayerReady() {
    isYtReady = true;
    if (ytPlayer && ytPlayer.setVolume) {
      ytPlayer.setVolume(TARGET_VOLUME);
    }
    // Attempt auto-start immediately
    tryStartMusic();
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      hasMusicStarted = true;
      if (musicIndicator) musicIndicator.classList.add('visible');
    }
  }

  function tryStartMusic() {
    if (hasMusicStarted) return;
    if (isYtReady && ytPlayer && ytPlayer.playVideo) {
      try {
        ytPlayer.setVolume(TARGET_VOLUME);
        ytPlayer.playVideo();
      } catch (e) {}
    }
  }

  // Seamless trigger on any first touch, click, or key press
  function onUserGesture() {
    tryStartMusic();
  }
  window.addEventListener('click', onUserGesture, { passive: true });
  window.addEventListener('touchstart', onUserGesture, { passive: true });
  window.addEventListener('pointerdown', onUserGesture, { passive: true });

  // Web Audio chime synthesizer for interaction sounds
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playSparkleSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [659.25, 880, 987.77, 1174.66, 1318.51];
      const freq = notes[Math.floor(Math.random() * notes.length)];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  }

  function playPopChime() {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  // --- 2. Dynamic 3D Petal, Star & Shooting Star Canvas Engine ---
  const canvas = document.getElementById('magicCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const shootingStars = [];
  let isYesHovered = false;
  let isCelebration = false;

  // Romantic Petal Color Palettes
  const petalStyles = [
    { fill: '#FFB8C6', stroke: '#FFA0B3' }, // Delicate Sakura
    { fill: '#FFCCD7', stroke: '#FFB3C2' }, // Rose Blush
    { fill: '#FFE4E9', stroke: '#FFCCD7' }, // Moonlight Petal
    { fill: '#FFF1C5', stroke: '#FFE599' }, // Fairy Starlight
    { fill: '#EADCF8', stroke: '#D8C5EE' }  // Twilight Lilac
  ];

  class PetalParticle {
    constructor(isBurst = false, originX = null, originY = null) {
      this.reset(isBurst, originX, originY);
    }

    reset(isBurst = false, originX = null, originY = null) {
      this.isBurst = isBurst;
      this.kind = Math.random() < 0.65 ? 'petal' : 'star';
      this.style = petalStyles[Math.floor(Math.random() * petalStyles.length)];
      
      this.size = Math.random() * 8 + (this.kind === 'star' ? 4 : 8);
      this.rotationZ = Math.random() * Math.PI * 2;
      this.rotSpeedZ = (Math.random() - 0.5) * 0.03;
      
      // 3D Tumbling Rotation around Y-axis
      this.rotY = Math.random() * Math.PI * 2;
      this.rotSpeedY = Math.random() * 0.04 + 0.02;

      this.alpha = isBurst ? 1 : Math.random() * 0.55 + 0.45;

      if (isBurst) {
        this.x = originX !== null ? originX : width / 2;
        this.y = originY !== null ? originY : height / 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 2.5;
        this.gravity = 0.15;
        this.decay = Math.random() * 0.012 + 0.007;
      } else {
        this.x = Math.random() * width;
        this.y = Math.random() * height - 50;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = Math.random() * 1.1 + 0.6;
        this.gravity = 0;
        this.decay = 0;
      }
    }

    update() {
      const speedMult = isYesHovered ? 2.4 : isCelebration ? 1.7 : 1.0;
      this.rotationZ += this.rotSpeedZ * speedMult;
      this.rotY += this.rotSpeedY * speedMult;

      if (this.isBurst) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.985;
        this.alpha -= this.decay;
        return this.alpha > 0;
      } else {
        // Natural wind drift
        this.x += this.vx * speedMult + Math.sin(this.y * 0.012) * 0.5;
        this.y += this.vy * speedMult;

        if (this.y > height + 30) {
          this.y = -30;
          this.x = Math.random() * width;
        }
        if (this.x < -30) this.x = width + 30;
        if (this.x > width + 30) this.x = -30;
        return true;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotationZ);

      // 3D Perspective tumble: scale X by cosine of rotY
      const scaleX = Math.cos(this.rotY);
      ctx.scale(scaleX, 1);

      ctx.globalAlpha = Math.max(0.1, Math.min(1, this.alpha));

      if (this.kind === 'petal') {
        this.drawRealisticPetal();
      } else {
        this.drawGlowingStar();
      }

      ctx.restore();
    }

    drawRealisticPetal() {
      const r = this.size;
      ctx.fillStyle = this.style.fill;
      ctx.beginPath();
      // Curved heart-notched sakura petal
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-r * 0.6, -r * 0.6, -r * 0.7, -r * 1.2, -r * 0.1, -r * 1.4);
      ctx.bezierCurveTo(0, -r * 1.3, 0, -r * 1.3, r * 0.1, -r * 1.4);
      ctx.bezierCurveTo(r * 0.7, -r * 1.2, r * 0.6, -r * 0.6, 0, 0);
      ctx.fill();
    }

    drawGlowingStar() {
      const r = this.size;
      ctx.fillStyle = '#FFE082';
      ctx.shadowColor = '#FFD54F';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const outerAngle = (i * Math.PI) / 2;
        const innerAngle = outerAngle + Math.PI / 4;
        ctx.lineTo(Math.cos(outerAngle) * r * 1.2, Math.sin(outerAngle) * r * 1.2);
        ctx.lineTo(Math.cos(innerAngle) * (r * 0.3), Math.sin(innerAngle) * (r * 0.3));
      }
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Shooting Star Class
  class ShootingStar {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width * 0.8;
      this.y = Math.random() * (height * 0.35);
      this.length = Math.random() * 90 + 60;
      this.speed = Math.random() * 10 + 12;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // roughly 45 degrees
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

      const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
      gradient.addColorStop(0, 'rgba(255, 224, 130, 0)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      // Glowing head
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFE082';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Initialize ambient petals
  const BASE_PETAL_COUNT = 65;
  for (let i = 0; i < BASE_PETAL_COUNT; i++) {
    petals.push(new PetalParticle());
  }

  function triggerBurst(count = 180, x = null, y = null) {
    for (let i = 0; i < count; i++) {
      petals.push(new PetalParticle(true, x, y));
    }
  }

  function spawnShootingStar() {
    shootingStars.push(new ShootingStar());
    playSparkleSound();
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const star = shootingStars[i];
      if (!star.update()) {
        shootingStars.splice(i, 1);
      } else {
        star.draw();
      }
    }

    // Occasional natural shooting star in the background
    if (Math.random() < 0.003) {
      shootingStars.push(new ShootingStar());
    }

    // Update & draw petals
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      if (!p.update()) {
        petals.splice(i, 1);
      } else {
        p.draw();
      }
    }

    while (petals.filter((p) => !p.isBurst).length < BASE_PETAL_COUNT) {
      petals.push(new PetalParticle());
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // --- 3. Chapter Flow Management ---
  const envelopeStage = document.getElementById('envelopeStage');
  const proposalStage = document.getElementById('proposalStage');
  const celebrationStage = document.getElementById('celebrationStage');
  const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');

  if (openEnvelopeBtn) {
    openEnvelopeBtn.addEventListener('click', () => {
      playSparkleSound();
      tryStartMusic();

      // Burst of golden stardust upon opening
      const rect = openEnvelopeBtn.getBoundingClientRect();
      triggerBurst(80, rect.left + rect.width / 2, rect.top + rect.height / 2);
      spawnShootingStar();

      if (envelopeStage && proposalStage) {
        envelopeStage.classList.remove('active');
        setTimeout(() => {
          proposalStage.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 220);
      }
    });
  }

  // --- 4. The Weightless Hovering "No" Button Physics ---
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const dodgeToast = document.getElementById('dodgeToast');

  const playfulPhrases = [
    "Hovering away~ 🌸",
    "Still floating! ✨",
    "Almost got me! 🙈",
    "Nuh-uh, can't touch this! 🐰",
    "Psst... the pink button is cuter! 👉💖",
    "I like floating right here! 💫",
    "Destiny says click Yes! 🌸",
    "Two stars says click the pink one! ⭐"
  ];

  let dodgeCount = 0;

  function glideNoButton() {
    if (isCelebration) return;
    playPopChime();
    dodgeCount++;

    // Alternates left and right with small, organic offsets (stays inside the card arena!)
    const dir = dodgeCount % 2 === 1 ? 1 : -1;
    const dx = dir * (Math.floor(Math.random() * 30) + 65); // 65px to 95px
    const dy = (Math.random() - 0.5) * 40;                  // -20px to +20px

    noBtn.style.setProperty('--dx', `${dx}px`);
    noBtn.style.setProperty('--dy', `${dy}px`);

    // Cute teasing toast
    if (dodgeToast) {
      const phrase = playfulPhrases[(dodgeCount - 1) % playfulPhrases.length];
      dodgeToast.textContent = phrase;
      dodgeToast.classList.add('show');
    }

    // Warmly grow the Yes button
    const yesScale = Math.min(1.45, 1 + dodgeCount * 0.06);
    if (yesBtn) {
      yesBtn.style.transform = `scale(${yesScale})`;
    }

    // Spawn 6 tiny stardust particles from button
    const rect = noBtn.getBoundingClientRect();
    triggerBurst(6, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  if (noBtn) {
    noBtn.addEventListener('mouseenter', glideNoButton);
    noBtn.addEventListener('mouseover', glideNoButton);
    noBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      glideNoButton();
    }, { passive: false });
    noBtn.addEventListener('click', (e) => {
      e.preventDefault();
      glideNoButton();
    });
  }

  // Smooth proximity glide when pointer comes within 60px
  let lastProximity = 0;
  window.addEventListener('mousemove', (e) => {
    if (!noBtn || isCelebration) return;
    const now = Date.now();
    if (now - lastProximity < 100) return;

    const rect = noBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

    if (dist < 60) {
      lastProximity = now;
      glideNoButton();
    }
  });

  // --- 5. "Yes" Button & Grand Celebration ---
  if (yesBtn) {
    yesBtn.addEventListener('mouseenter', () => {
      isYesHovered = true;
      playSparkleSound();
    });

    yesBtn.addEventListener('mouseleave', () => {
      if (!isCelebration) isYesHovered = false;
    });

    yesBtn.addEventListener('click', () => {
      isCelebration = true;
      isYesHovered = false;
      tryStartMusic();

      // Grand celebration explosion & 3 shooting stars
      const rect = yesBtn.getBoundingClientRect();
      triggerBurst(200, rect.left + rect.width / 2, rect.top + rect.height / 2);
      spawnShootingStar();
      setTimeout(spawnShootingStar, 250);
      setTimeout(spawnShootingStar, 500);

      // Transition to celebration stage
      if (proposalStage && celebrationStage) {
        proposalStage.classList.remove('active');
        setTimeout(() => {
          celebrationStage.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 220);
      }
    });
  }

  // --- 6. Celebration Screen Actions (Promise Capsule & Shooting Star Wish) ---
  const shootingStarBtn = document.getElementById('shootingStarBtn');
  if (shootingStarBtn) {
    shootingStarBtn.addEventListener('click', () => {
      spawnShootingStar();
      setTimeout(spawnShootingStar, 200);
      setTimeout(spawnShootingStar, 400);
      const rect = shootingStarBtn.getBoundingClientRect();
      triggerBurst(40, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  const replayBtn = document.getElementById('replayBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      isCelebration = false;
      isYesHovered = false;
      dodgeCount = 0;

      if (noBtn) {
        noBtn.style.setProperty('--dx', '0px');
        noBtn.style.setProperty('--dy', '0px');
      }
      if (yesBtn) {
        yesBtn.style.transform = '';
      }
      if (dodgeToast) {
        dodgeToast.textContent = '';
        dodgeToast.classList.remove('show');
      }

      if (celebrationStage && proposalStage) {
        celebrationStage.classList.remove('active');
        setTimeout(() => {
          proposalStage.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
      }
    });
  }

  // Interactive cursor stardust trail
  const stardustCursor = document.getElementById('stardustCursor');
  let cursorTimer = null;
  window.addEventListener('mousemove', (e) => {
    if (!stardustCursor) return;
    stardustCursor.style.opacity = '0.7';
    stardustCursor.style.left = e.clientX + 'px';
    stardustCursor.style.top = e.clientY + 'px';

    clearTimeout(cursorTimer);
    cursorTimer = setTimeout(() => {
      stardustCursor.style.opacity = '0';
    }, 1200);
  });

})();
