# ✨ Propose Your Crush 🌸

> *A dreamy, cute, and aesthetic interactive proposal website designed to melt hearts.*  
> Built completely from scratch with pure HTML, CSS, and JavaScript. Zero external dependencies, no names, and no heavy clichés.

---

## 🌟 Highlights & Features

- **🎵 Continuous, Seamless Background Music (`song.m4a`)**:
  - Direct, bulletproof HTML5 audio playback of the romantic melody ("Likhe Jo Khat Tujhe") at a comfortable medium volume (45%).
  - **Single-Page Architecture**: Transitions seamlessly from proposal to celebration and into the secret gift galaxy **without the song ever stopping or restarting from the beginning**.
  - **Phone Screen Off / Lock Protection**: Automatically pauses the music when the phone screen is turned off or locked (`visibilitychange` API), and resumes playback when unlocked!

- **🙈 Playful Evasive "No" Button**:
  - The "No" button playfully dodges away whenever the cursor or finger gets close, teasing her with adorable messages (*"Oops, too slow! 🙈"*, *"Try the pink one! 👉💖"*, *"Destiny says click Yes! 🌸✨"*).
  - Each dodge makes the **"Yes" button grow larger and glow warmer**, making it impossible to resist.

- **💖 Official Cutest Couple Keepsake Pass & Interactive Flip Notes**:
  - A beautifully designed couple pass with cute bunny art and non-refundable lifetime validity.
  - Interactive flip-cards revealing sweet surprises (Sweet Craving Pass, Comfort Pass, Our Songs).

- **🎁 Adorable Bouncing Gift Emoji Button**:
  - An irresistible, cute bouncing gift emoji button (`🎁`) with a glowing halo and sparkling stars.
  - No clunky blue text or underlines—just an inviting, pulsing gift box waiting to be tapped!

- **🌌 Living Botanical Bloom & Milky Way Galaxy**:
  - When she taps `🎁`, the screen smoothly dims into deep space, then slowly illuminates with glowing starlight, shifting nebulae, and cosmic dust.
  - **Botanical Growth from Seed**: A radiant celestial seed descends and touches the cosmic plane with a golden ripple, sprouting organic emerald vines and leaves.
  - **Three Breathtaking Flowers**:
    - **Velvet Rose**: Unfurls layer-by-layer from a spiraling bud into full lush crimson/pink petals.
    - **Luminous Celestial Lotus**: Opens majestically with crystalline pearlescent petals and a glowing golden stamen.
    - **Silk Wild Poppy**: Graceful, fluttering coral/scarlet petals dancing in the cosmic breeze.
  - **Living Animations That Never Stop**: The flowers continuously breathe and sway, releasing floating stardust spores while shooting stars streak across the Milky Way sky!

- **📱 100% Responsive**:
  - Tested and rock-solid on both laptops (no top-clipping) and mobile smartphones (iOS Safari & Android Chrome).

---

## 🚀 Live Demo

The website is hosted on GitHub Pages:  
👉 **[https://bhuwan077.github.io/propose-your-crush/](https://bhuwan077.github.io/propose-your-crush/)**

---

## 💻 Running Locally

No Node.js or build steps required! Simply open the file:

1. Clone or download the repository.
2. Double-click **`index.html`** to open it directly in any modern browser.

Or run a quick local server:
```bash
# Python 3
python -m http.server 3000
```
Then visit `http://localhost:3000`.

---

## 🎨 Customization Guide

### 1. Change the Music
Open `script.js` and update the YouTube video ID at the top:
```javascript
const YOUTUBE_VIDEO_ID = '6DJxr_GOiHc'; // Replace with any YouTube Video ID
```

### 2. Customize the Phrasing
Open `index.html` and customize the text inside the `.proposal-text`, `.question-heading`, or the polaroid quote in `.polaroid-quote`.

### 3. Add Custom Teasing Quotes
Open `script.js` and modify the `hoverPhrases` list:
```javascript
const hoverPhrases = [
  "Hovering away~ 🌸",
  "Still floating! ✨",
  "Almost got me! 🙈",
  "Nuh-uh, can't touch this! 🐰"
];
```

---

## 🛠️ Built With

- **HTML5** — Semantic layout & inline responsive SVG illustrations.
- **CSS3** — Custom properties, pastel gradients, glassmorphism (`backdrop-filter`), keyframe animations.
- **JavaScript (Vanilla)** — 2D Canvas particle engine, YouTube IFrame API, Web Audio API, and spring-like evasive physics.

---

## 📜 License

Distributed under the **MIT License**. Feel free to use, customize, and share it with someone special! 🌸✨
