# ✨ Propose Your Crush 🌸

> *A dreamy, cute, and aesthetic interactive proposal website designed to melt hearts.*  
> Built completely from scratch with pure HTML, CSS, and JavaScript. Zero external dependencies, no names, and no heavy clichés.

---

## 🌟 Highlights & Features

- **🌸 Living Eternal Garden & Twin Celestial Stars**:
  - Twin celestial stars dance in an infinite orbital constellation in the sky.
  - An enchanted botanical garden at the bottom with vines and blossoms rooted side by side, symbolizing *"living together till the end"*.
  - Hovering on **Yes** causes the garden to bloom in real time with fluttering cherry blossoms, soft roses, and golden starlight.

- **🙈 The Hovering Evasive "No" Button**:
  - The "No" button constantly floats and bobs gently like a little balloon.
  - When the cursor or finger gets close, it smoothly glides out of reach within the card area and playfully teases her (*"Hovering away~ 🌸"*, *"Almost got me! 🙈"*, *"Nuh-uh, can't touch this! 🐰"*).
  - Every time she chases "No", the **"Yes" button dynamically grows larger and glows warmer**, making it impossible to resist!

- **🎵 Integrated YouTube Music Player**:
  - Floating aesthetic pastel music widget with an animated spinning vinyl record and flower center.
  - Seamlessly streams and loops your chosen romantic melody ([YouTube Track](https://www.youtube.com/watch?v=6DJxr_GOiHc)) on first interaction or tap.
  - Graceful Web Audio chime fallback if YouTube is unavailable.

- **🎉 Heartwarming Acceptance Climax**:
  - Accepting "Yes" triggers a full-screen explosion of 180+ pastel flower petals, chamomile, and sparkling stars.
  - Reveals an adorable celebratory dancing bunny mascot holding a bouquet.
  - Aesthetic tilted Polaroid keepsake with sweet promises (*Sweet Treats, Good Playlists, 100% Comfort, Unlimited Smiles*).

- **📱 Fully Responsive**:
  - Looks breathtaking on desktop, tablets, and smartphones (iOS Safari & Android Chrome supported).

---

## 🚀 Live Demo & 1-Click Hosting

You can host this website completely **FREE** in under 1 minute:

### Option A: GitHub Pages (Recommended)
1. Go to your repository **Settings** on GitHub.
2. Under the **Code and automation** section, click **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/(root)`, then click **Save**.
4. Within seconds, your live link will be ready at:
   ```text
   https://<your-username>.github.io/<repository-name>/
   ```

### Option B: Netlify Drop
1. Visit [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop this folder directly into the browser window.
3. You get an instant HTTPS URL to share!

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
