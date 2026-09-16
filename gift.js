/**
 * Milky Way Galaxy & Blooming Botanical Garden (gift.js)
 * - Seamless audio continuation from proposal page (volume 45%)
 * - Stops audio when phone screen is powered off / locked (visibilitychange API)
 * - Dynamic Milky Way Starry Canvas with Shooting Stars & Cosmic Stardust
 */

(function () {
  'use strict';

  // --- 1. Audio Continuation & Phone Lock Pause Control ---
  const bgAudio = document.getElementById('bgAudio');
  let wasPlayingBeforeLock = true;

  function resumeAudio() {
    if (!bgAudio) return;
    bgAudio.volume = 0.45; // Medium, pleasant volume

    // Seek to previous playback time if transferred
    const savedTime = sessionStorage.getItem('songTime');
    if (savedTime && bgAudio.currentTime === 0) {
      bgAudio.currentTime = parseFloat(savedTime);
    }

    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Handled on first touch if autoplay restricted
      });
    }
  }

  resumeAudio();

  // Instant fallback for audio
  window.addEventListener('click', resumeAudio, { once: true });
  window.addEventListener('touchstart', resumeAudio, { once: true });

  // IMPORTANT: Stop the song when phone screen powers off or locks!
  document.addEventListener('visibilitychange', function () {
    if (document.hidden || document.visibilityState === 'hidden') {
      // Phone screen locked / powered off or tab hidden
      if (bgAudio && !bgAudio.paused) {
        bgAudio.pause();
        wasPlayingBeforeLock = true;
      }
    } else if (document.visibilityState === 'visible') {
      // Phone unlocked / screen turned back on
      if (bgAudio && wasPlayingBeforeLock) {
        bgAudio.play().catch(() => {});
      }
    }
  });

  window.addEventListener('pagehide', function () {
    if (bgAudio) bgAudio.pause();
  });

  // --- 2. Milky Way Galaxy Canvas Engine ---
  const canvas = document.getElementById('galaxyCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = [];
  const cosmicPetals = [];
  const shootingStars = [];

  // Cosmic Stars
  class GalaxyStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.baseAlpha = Math.random() * 0.7 + 0.3;
      this.twinkleSpeed = Math.random() * 0.03 + 0.01;
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
      ctx.globalAlpha = Math.max(0.1, alpha);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.size > 1.8 ? 8 : 0;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Floating Cosmic Sakura Petals
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

  // Shooting Stars
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

      // Glowing head
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFE082';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Seed galaxy elements
  const STAR_COUNT = 90;
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new GalaxyStar());
  }

  const PETAL_COUNT = 30;
  for (let i = 0; i < PETAL_COUNT; i++) {
    cosmicPetals.push(new CosmicPetal());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Stars
    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();
    }

    // Occasional natural shooting stars
    if (Math.random() < 0.007) {
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

    // Drifting petals
    for (let i = 0; i < cosmicPetals.length; i++) {
      cosmicPetals[i].update();
      cosmicPetals[i].draw();
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Save audio position before navigating back to index.html
  const returnBtn = document.querySelector('.btn-return');
  if (returnBtn) {
    returnBtn.addEventListener('click', function () {
      if (bgAudio) {
        sessionStorage.setItem('songTime', bgAudio.currentTime);
      }
    });
  }

})();
