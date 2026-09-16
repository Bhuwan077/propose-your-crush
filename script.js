/**
 * Cute Aesthetic Proposal Website
 * - YouTube Music Player Integration (https://www.youtube.com/watch?v=6DJxr_GOiHc)
 * - Hovering Evasive "No" Button (glides and bobs gently, stays in clear view!)
 * - Breathtaking Flowers & Stars Canvas with "Twin Celestial Stars" & "Living Eternal Garden"
 * - Stage management for proposal & celebration
 */

(function () {
  'use strict';

  // --- 1. YouTube Player & Audio System ---
  const YOUTUBE_VIDEO_ID = '6DJxr_GOiHc';
  let ytPlayer = null;
  let isYtReady = false;
  let isPlaying = false;
  let hasUserInteracted = false;

  const musicWidget = document.getElementById('musicPlayerWidget');
  const playIcon = document.getElementById('playIcon');
  const musicStatus = document.getElementById('musicStatus');
  const vinylDisc = document.getElementById('vinylDisc');

  // Load YouTube IFrame Player API
  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('ytPlayer', {
      height: '180',
      width: '180',
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 0,
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

  function onPlayerReady(event) {
    isYtReady = true;
    if (ytPlayer && ytPlayer.setVolume) {
      ytPlayer.setVolume(85);
    }
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      setMusicPlayingUI(true);
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
      setMusicPlayingUI(false);
    }
  }

  function setMusicPlayingUI(playing) {
    isPlaying = playing;
    if (musicWidget) {
      if (playing) {
        musicWidget.classList.add('playing');
        if (playIcon) playIcon.textContent = '❚❚';
        if (musicStatus) musicStatus.textContent = 'Now Playing 🎶';
      } else {
        musicWidget.classList.remove('playing');
        if (playIcon) playIcon.textContent = '▶';
        if (musicStatus) musicStatus.textContent = 'Tap to play music 🎶';
      }
    }
  }

  function startMusic() {
    if (isYtReady && ytPlayer && ytPlayer.playVideo) {
      try {
        ytPlayer.playVideo();
        setMusicPlayingUI(true);
      } catch (e) {
        playFallbackChime();
      }
    } else {
      playFallbackChime();
    }
  }

  function toggleMusic() {
    if (isYtReady && ytPlayer) {
      if (isPlaying) {
        ytPlayer.pauseVideo();
        setMusicPlayingUI(false);
      } else {
        ytPlayer.playVideo();
        setMusicPlayingUI(true);
      }
    } else {
      playFallbackChime();
    }
  }

  // Auto-start music on first touch or click anywhere
  function handleFirstInteraction() {
    if (!hasUserInteracted) {
      hasUserInteracted = true;
      startMusic();
    }
  }
  window.addEventListener('click', handleFirstInteraction, { once: true });
  window.addEventListener('touchstart', handleFirstInteraction, { once: true });

  if (musicWidget) {
    musicWidget.addEventListener('click', (e) => {
      e.stopPropagation();
      hasUserInteracted = true;
      toggleMusic();
    });
  }

  // Web Audio chime fallback & sound effects
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
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const notes = [659.25, 880, 987.77, 1174.66, 1318.51];
      const freq = notes[Math.floor(Math.random() * notes.length)];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  }

  function playPopSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  function playFallbackChime() {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.0);
        }, idx * 120);
      });
    } catch (e) {}
  }

  // --- 2. The Living Garden & Canvas Particle Engine ---
  const canvas = document.getElementById('magicCanvas');
  const ctx = canvas.getContext('2d');
  const livingGarden = document.getElementById('livingGarden');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  let isYesHovered = false;
  let celebrationMode = false;

  // Twin Celestial Stars ("living together till the end")
  let twinStarAngle = 0;

  // Soft romantic pastel palette
  const petalColors = [
    { fill: '#FFAEC0', border: '#FF8DA1' }, // Sakura blush
    { fill: '#FFCCD7', border: '#FFAEC0' }, // Rose pink
    { fill: '#FFDEE9', border: '#FFC6FF' }, // Soft lilac pink
    { fill: '#FFF1C5', border: '#FFE599' }, // Warm butter
    { fill: '#BEE1E6', border: '#A9D6E5' }, // Soft celestial blue
    { fill: '#D8F3DC', border: '#B7E4C7' }  // Fresh spring mint
  ];

  class FlowerParticle {
    constructor(isBurst = false, originX = null, originY = null) {
      this.reset(isBurst, originX, originY);
    }

    reset(isBurst = false, originX = null, originY = null) {
      this.isBurst = isBurst;
      // 50% realistic Sakura/Rose blossoms, 35% Golden Stars, 15% floating Petals
      const rand = Math.random();
      this.kind = rand < 0.5 ? 'blossom' : rand < 0.85 ? 'star' : 'petal';
      this.colorObj = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.radius = Math.random() * 8 + (this.kind === 'star' ? 5 : 7);
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.035;
      this.alpha = isBurst ? 1 : Math.random() * 0.55 + 0.45;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.04 + 0.02;

      if (isBurst) {
        this.x = originX !== null ? originX : width / 2;
        this.y = originY !== null ? originY : height / 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 2.5;
        this.gravity = 0.16;
        this.decay = Math.random() * 0.012 + 0.008;
      } else {
        this.x = Math.random() * width;
        this.y = Math.random() * height - 40;
        this.vx = (Math.random() - 0.5) * 1.4;
        this.vy = Math.random() * 1.2 + 0.6;
        this.gravity = 0;
        this.decay = 0;
      }
    }

    update() {
      const speedMult = isYesHovered ? 2.6 : celebrationMode ? 1.8 : 1.0;
      this.rotation += this.rotSpeed * speedMult;
      this.twinklePhase += this.twinkleSpeed;

      if (this.isBurst) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.985;
        this.alpha -= this.decay;
        return this.alpha > 0;
      } else {
        this.x += this.vx * speedMult + Math.sin(this.y * 0.012) * 0.6;
        this.y += this.vy * speedMult;

        if (this.y > height + 25) {
          this.y = -25;
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
      ctx.rotate(this.rotation);

      const twinkleAlpha = Math.max(0.15, Math.min(1, this.alpha * (0.8 + 0.25 * Math.sin(this.twinklePhase))));
      ctx.globalAlpha = twinkleAlpha;

      if (this.kind === 'blossom') {
        this.drawBlossom();
      } else if (this.kind === 'star') {
        this.drawCelestialStar();
      } else {
        this.drawPetal();
      }

      ctx.restore();
    }

    drawBlossom() {
      const r = this.radius;
      // 5 Heart-shaped Sakura petals
      ctx.fillStyle = this.colorObj.fill;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-r * 0.5, -r * 0.5, -r * 0.5, -r * 1.1, 0, -r * 1.3);
        ctx.bezierCurveTo(r * 0.5, -r * 1.1, r * 0.5, -r * 0.5, 0, 0);
        ctx.fill();
        ctx.restore();
      }
      // Warm golden glowing center
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = '#FFE599';
      ctx.fill();
    }

    drawCelestialStar() {
      const r = this.radius;
      ctx.fillStyle = '#FFE599';
      ctx.shadowColor = '#FFAEC0';
      ctx.shadowBlur = isYesHovered ? 14 : 8;

      // 4-pointed radiant diamond star
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const outerAngle = (i * Math.PI) / 2;
        const innerAngle = outerAngle + Math.PI / 4;
        ctx.lineTo(Math.cos(outerAngle) * r * 1.3, Math.sin(outerAngle) * r * 1.3);
        ctx.lineTo(Math.cos(innerAngle) * r * 0.35, Math.sin(innerAngle) * r * 0.35);
      }
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    drawPetal() {
      const r = this.radius;
      ctx.fillStyle = this.colorObj.fill;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.6, r * 1.15, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw Twin Celestial Stars dancing together in the sky
  function drawTwinCelestialStars() {
    twinStarAngle += isYesHovered ? 0.04 : 0.018;
    const centerX = width * 0.5;
    const centerY = height * 0.18;
    const orbitRadius = isYesHovered ? 55 : 45;

    const star1X = centerX + Math.cos(twinStarAngle) * orbitRadius;
    const star1Y = centerY + Math.sin(twinStarAngle) * (orbitRadius * 0.4);

    const star2X = centerX + Math.cos(twinStarAngle + Math.PI) * orbitRadius;
    const star2Y = centerY + Math.sin(twinStarAngle + Math.PI) * (orbitRadius * 0.4);

    // Glowing connection beam (symbol of living together till the end)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(star1X, star1Y);
    ctx.lineTo(star2X, star2Y);
    ctx.strokeStyle = 'rgba(255, 225, 175, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();

    // Draw Star 1 (Golden Sun Star)
    drawIndividualStar(star1X, star1Y, '#FFE066', 10);
    // Draw Star 2 (Blush Starlight)
    drawIndividualStar(star2X, star2Y, '#FFAEC0', 10);
    ctx.restore();
  }

  function drawIndividualStar(x, y, color, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = isYesHovered ? 20 : 12;

    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const outerAngle = (i * Math.PI) / 2;
      const innerAngle = outerAngle + Math.PI / 4;
      ctx.lineTo(Math.cos(outerAngle) * size, Math.sin(outerAngle) * size);
      ctx.lineTo(Math.cos(innerAngle) * (size * 0.3), Math.sin(innerAngle) * (size * 0.3));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Seed base ambient particles
  const BASE_PARTICLE_COUNT = 60;
  for (let i = 0; i < BASE_PARTICLE_COUNT; i++) {
    particles.push(new FlowerParticle());
  }

  // Continuous extra blossoming during Yes hover
  function spawnHoverBlooms() {
    if (!isYesHovered) return;
    const yesBtn = document.getElementById('yesBtn');
    if (!yesBtn) return;
    const rect = yesBtn.getBoundingClientRect();
    const spawnX = rect.left + Math.random() * rect.width;
    const spawnY = rect.top + Math.random() * rect.height;

    for (let i = 0; i < 4; i++) {
      const p = new FlowerParticle(true, spawnX, spawnY);
      p.vy = -(Math.random() * 6 + 2);
      p.vx = (Math.random() - 0.5) * 6;
      p.decay = Math.random() * 0.01 + 0.007;
      particles.push(p);
    }
  }

  function triggerCelebrationBurst(count = 160, originX = null, originY = null) {
    for (let i = 0; i < count; i++) {
      particles.push(new FlowerParticle(true, originX, originY));
    }
  }

  // Animation Loop
  let lastHoverSpawn = 0;
  function animate(timestamp) {
    ctx.clearRect(0, 0, width, height);

    // Render Twin Stars
    drawTwinCelestialStars();

    if (isYesHovered && timestamp - lastHoverSpawn > 50) {
      spawnHoverBlooms();
      lastHoverSpawn = timestamp;
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const isAlive = p.update();
      if (!isAlive) {
        particles.splice(i, 1);
      } else {
        p.draw();
      }
    }

    while (particles.filter((p) => !p.isBurst).length < BASE_PARTICLE_COUNT) {
      particles.push(new FlowerParticle());
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // --- 3. Evasive "No" Button (Gently hovers & stays visible!) ---
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const dodgeToast = document.getElementById('dodgeToast');

  const hoverPhrases = [
    "Hovering away~ 🌸",
    "Still floating! ✨",
    "Almost got me! 🙈",
    "Nuh-uh, can't touch this! 🐰",
    "I like floating right here! 💫",
    "Psst... the pink button is cuter! 👉💖",
    "Two stars says click Yes! ⭐",
    "Destiny has other plans! 🌸✨"
  ];

  let dodgeCount = 0;
  let currentDx = 0;
  let currentDy = 0;

  function hoverDodgeNoButton(e) {
    if (celebrationMode) return;
    playPopSound();

    dodgeCount++;

    // Calculate a gentle offset that keeps the button comfortably inside the card
    // Alternates sides so it hovers back and forth playfully in front of her!
    const direction = (dodgeCount % 2 === 1) ? 1 : -1;
    const offsetMagnitudeX = Math.floor(Math.random() * 35) + 65; // 65px to 100px
    const offsetMagnitudeY = (Math.random() - 0.5) * 50;          // -25px to +25px

    currentDx = direction * offsetMagnitudeX;
    currentDy = offsetMagnitudeY;

    // Apply via CSS variables for smooth floating translation
    noBtn.style.setProperty('--dx', `${currentDx}px`);
    noBtn.style.setProperty('--dy', `${currentDy}px`);

    // Show cute hover message
    const phrase = hoverPhrases[(dodgeCount - 1) % hoverPhrases.length];
    if (dodgeToast) {
      dodgeToast.textContent = phrase;
      dodgeToast.classList.add('show');
    }

    // Warmly grow the Yes button
    const yesScale = Math.min(1.5, 1 + dodgeCount * 0.06);
    if (yesBtn) {
      yesBtn.style.transform = `scale(${yesScale})`;
    }

    // Spawn 6 cute golden sparkle stars around the button
    const rect = noBtn.getBoundingClientRect();
    triggerCelebrationBurst(6, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  if (noBtn) {
    // Hover / Touch avoidance
    noBtn.addEventListener('mouseenter', hoverDodgeNoButton);
    noBtn.addEventListener('mouseover', hoverDodgeNoButton);
    noBtn.addEventListener('pointerenter', hoverDodgeNoButton);
    noBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      hoverDodgeNoButton(e);
    }, { passive: false });

    // Block clicking directly
    noBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hoverDodgeNoButton(e);
    });
  }

  // Gentle proximity check: if cursor gets within 60px of the button, glide smoothly
  let lastProximityCheck = 0;
  window.addEventListener('mousemove', (e) => {
    if (!noBtn || celebrationMode) return;
    const now = Date.now();
    if (now - lastProximityCheck < 120) return;

    const rect = noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    if (dist < 65) {
      lastProximityCheck = now;
      hoverDodgeNoButton(e);
    }
  });

  // --- 4. "Yes" Button Hover & Acceptance ---
  if (yesBtn) {
    yesBtn.addEventListener('mouseenter', () => {
      isYesHovered = true;
      playSparkleSound();
      if (livingGarden) livingGarden.classList.add('bloomed');
    });

    yesBtn.addEventListener('mouseleave', () => {
      if (!celebrationMode) {
        isYesHovered = false;
        if (livingGarden) livingGarden.classList.remove('bloomed');
      }
    });

    yesBtn.addEventListener('click', () => {
      celebrationMode = true;
      isYesHovered = false;

      // Start music if not started yet
      startMusic();

      // Living garden stays permanently bloomed!
      if (livingGarden) livingGarden.classList.add('bloomed');

      // Grand celebration explosion
      const rect = yesBtn.getBoundingClientRect();
      triggerCelebrationBurst(180, rect.left + rect.width / 2, rect.top + rect.height / 2);

      // Transition smoothly to celebration stage
      const proposalStage = document.getElementById('proposalStage');
      const celebrationStage = document.getElementById('celebrationStage');

      if (proposalStage && celebrationStage) {
        proposalStage.classList.remove('active');
        setTimeout(() => {
          celebrationStage.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 220);
      }
    });
  }

  // --- 5. Stage 2 Buttons (Celebration Actions) ---
  const sendFlowerBtn = document.getElementById('sendFlowerBtn');
  if (sendFlowerBtn) {
    sendFlowerBtn.addEventListener('click', () => {
      playSparkleSound();
      const rect = sendFlowerBtn.getBoundingClientRect();
      triggerCelebrationBurst(80, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  const replayBtn = document.getElementById('replayBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      celebrationMode = false;
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
      if (livingGarden) {
        livingGarden.classList.remove('bloomed');
      }

      const proposalStage = document.getElementById('proposalStage');
      const celebrationStage = document.getElementById('celebrationStage');
      if (celebrationStage && proposalStage) {
        celebrationStage.classList.remove('active');
        setTimeout(() => {
          proposalStage.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 200);
      }
    });
  }

  // Cursor sparkle follower
  const cursorSparkle = document.getElementById('cursorSparkle');
  let cursorTimer = null;
  window.addEventListener('mousemove', (e) => {
    if (!cursorSparkle) return;
    cursorSparkle.style.opacity = '0.7';
    cursorSparkle.style.left = e.clientX + 'px';
    cursorSparkle.style.top = e.clientY + 'px';

    clearTimeout(cursorTimer);
    cursorTimer = setTimeout(() => {
      cursorSparkle.style.opacity = '0';
    }, 1200);
  });

})();
