/**
 * Cute, Simple & Responsive Proposal Engine
 * - Automatic YouTube Music Stream (https://www.youtube.com/watch?v=BqupBJ2NNNU) at Medium Volume (45%)
 * - Playful, Unclickable "No" Button that Dodges on Hover/Touch and Grows the "Yes" Button
 * - Blossoming Flowers & Stars Canvas Simulation
 */

(function () {
  'use strict';

  // --- 1. Background Music (BqupBJ2NNNU) at Medium Volume (45%) ---
  const YOUTUBE_VIDEO_ID = 'BqupBJ2NNNU';
  const MEDIUM_VOLUME = 45;

  let ytPlayer = null;
  let isYtReady = false;
  let hasMusicStarted = false;

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
        onReady: function () {
          isYtReady = true;
          if (ytPlayer && ytPlayer.setVolume) {
            ytPlayer.setVolume(MEDIUM_VOLUME);
          }
          tryStartMusic();
        },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.PLAYING) {
            hasMusicStarted = true;
          }
        }
      }
    });
  };

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  function tryStartMusic() {
    if (hasMusicStarted) return;
    if (isYtReady && ytPlayer && ytPlayer.playVideo) {
      try {
        ytPlayer.setVolume(MEDIUM_VOLUME);
        ytPlayer.playVideo();
      } catch (e) {}
    }
  }

  // Ensure playback on first touch/click anywhere if browser blocked silent autoplay
  function onFirstUserTouch() {
    tryStartMusic();
  }
  window.addEventListener('click', onFirstUserTouch, { passive: true });
  window.addEventListener('touchstart', onFirstUserTouch, { passive: true });

  // Web Audio chime for interactions
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
      osc.frequency.exponentialRampToValueAtTime(700, audioCtx.currentTime + 0.1);
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

  // --- 2. Blossoming Flowers & Stars Canvas ---
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
        // 5-petal Sakura flower
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
        // Center
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = '#FFE599';
        ctx.fill();
      } else {
        // 4-point golden star
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

  function dodgeNoButton(e) {
    if (isCelebration) return;
    playPopChime();
    dodgeCount++;

    // Calculate a playful dodge that stays comfortably within screen/card
    const dir = (dodgeCount % 2 === 1) ? 1 : -1;
    // On mobile screens, keep offsets tighter so it never gets clipped
    const isMobile = window.innerWidth <= 480;
    const maxOffset = isMobile ? 55 : 85;
    const dx = dir * (Math.floor(Math.random() * 25) + (maxOffset - 25));
    const dy = (Math.random() - 0.5) * (isMobile ? 30 : 40);

    noBtn.style.transform = `translate(${dx}px, ${dy}px)`;

    // Cute toast excuse
    if (toast) {
      toast.textContent = excuses[(dodgeCount - 1) % excuses.length];
      toast.classList.add('show');
    }

    // Yes button gets bigger and more inviting!
    const yesScale = Math.min(1.4, 1 + dodgeCount * 0.07);
    if (yesBtn) {
      yesBtn.style.transform = `scale(${yesScale})`;
    }

    // Spawn 5 mini sparkles
    const rect = noBtn.getBoundingClientRect();
    triggerBurst(5, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  if (noBtn) {
    // Desktop hover
    noBtn.addEventListener('mouseenter', dodgeNoButton);
    noBtn.addEventListener('mouseover', dodgeNoButton);
    
    // Mobile touch (dodges immediately before click can register!)
    noBtn.addEventListener('touchstart', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dodgeNoButton(e);
    }, { passive: false });

    noBtn.addEventListener('click', function (e) {
      e.preventDefault();
      dodgeNoButton(e);
    });
  }

  // Desktop proximity dodge
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
      dodgeNoButton(e);
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
      tryStartMusic();

      // Grand celebration burst
      const rect = yesBtn.getBoundingClientRect();
      triggerBurst(160, rect.left + rect.width / 2, rect.top + rect.height / 2);

      // Transition smoothly
      if (proposalCard && celebrationCard) {
        proposalCard.classList.remove('active');
        setTimeout(function () {
          celebrationCard.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
      }
    });
  }

  // Replay button
  const replayBtn = document.getElementById('replayBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      isCelebration = false;
      isYesHovered = false;
      dodgeCount = 0;

      if (noBtn) {
        noBtn.style.transform = '';
      }
      if (yesBtn) {
        yesBtn.style.transform = '';
      }
      if (toast) {
        toast.textContent = '';
        toast.classList.remove('show');
      }

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
