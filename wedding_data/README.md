# 🎉 Hindu Wedding Slideshow - Single-Page Web App

A beautiful, responsive, and accessible single-page web application for displaying wedding photos, videos, and music. Auto-discovers media from local folders, requires no backend server, and works with any static file hosting.

## 📋 Features

✅ **Welcome Screen** - Elegant opening with cultural tagline and Start button  
✅ **Image Slideshow** - Auto-play with fade transitions, 3s default (configurable)  
✅ **Slide Controls** - Play/Pause, Next, Previous, Shuffle, Loop, Custom Timing  
✅ **Audio Playlist** - Auto-discover songs, play/pause, volume, repeat modes, shuffle  
✅ **Video Player** - Gallery of videos, fullscreen support, pauses slideshow when playing  
✅ **Auto-Discovery** - Scans `images/`, `videos/`, `songs/` folders (including subfolders)  
✅ **Captions** - Optional JSON captions for images  
✅ **Hindu Wedding Theme** - Warm colors (saffron, maroon, gold), elegant typography  
✅ **Responsive Design** - Mobile, tablet, and desktop optimized  
✅ **Keyboard Navigation** - Space = Play/Pause, Arrows = Prev/Next, L = Loop, S = Shuffle, M = Mute  
✅ **Accessibility** - ARIA labels, semantic HTML, high contrast, screen-reader friendly  
✅ **Offline Ready** - No CDN dependencies, works entirely client-side  

---

## 🚀 Quick Start

### Prerequisites

- A web browser (Chrome, Firefox, Safari, Edge)
- Optional: Node.js with `npx` (for local HTTP server)

### Setup Steps

1. **Copy your media files to the folders:**
   ```
   wedding_data/
   ├── images/          ← Add JPG, PNG files here
   ├── videos/          ← Add MP4, WebM files here
   ├── songs/           ← Add MP3, OGG files here
   ├── index.html
   ├── styles.css
   ├── app.js
   └── media-loader.js
   ```

2. **Run a local HTTP server** (required due to browser security restrictions):

   **Option A: Using Node.js (recommended)**
   ```bash
   cd wedding_data
   npx http-server -p 8080
   ```
   Then open: `http://localhost:8080`

   **Option B: Using Python 3**
   ```bash
   cd wedding_data
   python -m http.server 8000
   ```
   Then open: `http://localhost:8000`

   **Option C: Using VS Code Live Server**
   - Install the "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

   **Option D: Using PHP**
   ```bash
   cd wedding_data
   php -S localhost:8000
   ```

3. **Open in browser** and click "Start" to begin the slideshow! 🎊

---

## 📁 File Structure

```
wedding_data/
│
├── index.html                 # Main HTML file (single entry point)
├── styles.css                # Theme, layout, responsive design (450+ lines)
├── app.js                    # Main application logic (700+ lines)
├── media-loader.js           # Media discovery and file scanning module
│
├── images/                   # Folder for wedding photos
│   ├── photo1.jpg
│   ├── photo1.json           # (Optional) Caption file for photo1
│   ├── subfolder/
│   │   └── photo2.jpg
│   └── ...
│
├── videos/                   # Folder for wedding videos
│   ├── ceremony.mp4
│   ├── reception.webm
│   └── ...
│
├── songs/                    # Folder for background music
│   ├── wedding_song.mp3
│   ├── classical/
│   │   └── instrumental.ogg
│   └── ...
│
└── README.md                 # This file
```

---

## 🎨 Customizing the App

### Change Couple's Names & Tagline

Edit `index.html` (lines 18-19):
```html
<h1 class="welcome-title">Celebrating Love and Tradition</h1>
<p class="welcome-couple">The Happy Couple</p>
```

### Change Theme Colors

Edit `styles.css` (lines 13-22):
```css
:root {
    --color-saffron: #FF9933;     /* Orange/yellow */
    --color-maroon: #800000;       /* Deep red */
    --color-gold: #FFD700;         /* Gold accents */
    --color-cream: #FFF8E7;        /* Warm background */
    /* ... more colors ... */
}
```

### Add Image Captions

Create a `.json` file with the same name as your image:

**photo1.jpg** → **photo1.json**
```json
{
    "caption": "The beautiful bride and groom"
}
```

Or with alternate field names:
```json
{
    "text": "Wedding ceremony"
}
```

### Change Default Slideshow Duration

Edit `app.js` (line 25):
```javascript
this.imageDuration = 5000; // 5 seconds instead of 3 seconds
```

Or use the dropdown in the UI after starting the slideshow.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Play / Pause slideshow |
| **→ (Right Arrow)** | Next image |
| **← (Left Arrow)** | Previous image |
| **L** | Toggle Loop mode |
| **S** | Toggle Shuffle |
| **M** | Mute / Unmute audio |
| **R** | Cycle Repeat mode (All → One → Off) |

---

## 🎬 Supported File Formats

### Images
- JPG / JPEG
- PNG
- GIF
- WebP

### Videos
- MP4 (H.264 codec)
- WebM
- OGG (Theora codec)
- MOV (on Safari)

### Audio
- MP3
- OGG / Ogg Vorbis
- WAV
- FLAC
- AAC
- M4A (iTunes)

**Note:** Browser support varies. MP4 video and MP3 audio work on all modern browsers.

---

## 🧪 Testing Checklist

### Core Features
- [ ] Welcome screen displays with Start button
- [ ] After clicking Start, first image appears with 3s auto-advance
- [ ] Play/Pause controls work correctly
- [ ] Next/Previous buttons advance images
- [ ] Duration selector (1s, 3s, 5s, custom) changes timing
- [ ] Shuffle randomizes image order
- [ ] Loop toggle wraps around vs. stops at end
- [ ] Images fade in smoothly

### Audio Features
- [ ] Song list populates from `songs/` folder
- [ ] Clicking a song plays it immediately
- [ ] Play/Pause controls song playback
- [ ] Next/Previous buttons advance through playlist
- [ ] Volume slider adjusts audio level
- [ ] Mute button silences audio
- [ ] Repeat cycle toggles (All → One → Off)
- [ ] Shuffle randomizes playlist

### Video Features
- [ ] Video list populates from `videos/` folder
- [ ] Clicking video starts playback and pauses slideshow
- [ ] Video player overlay appears
- [ ] Close button dismisses video
- [ ] After video ends, slideshow resumes
- [ ] Native video controls work (play, seek, fullscreen, volume)

### Responsive Design
- [ ] **Mobile (portrait 320px):** Stacked layout, touch-friendly buttons
- [ ] **Tablet (landscape 768px):** Side-by-side layout readable
- [ ] **Desktop (1200px+):** Full UI with sidebar, optimal spacing
- [ ] Text is readable at all sizes
- [ ] Images/videos scale properly

### Accessibility
- [ ] **Keyboard navigation:** Tab focuses all controls
- [ ] **Keyboard shortcuts:** Space, arrows, L, S, M, R work
- [ ] **ARIA labels:** All buttons have descriptive labels
- [ ] **Screen reader:** VoiceOver/NVDA announce slide count, song title, buttons
- [ ] **Focus indicators:** Blue outline shows active element
- [ ] **Color contrast:** Text readable on background (WCAG AA)
- [ ] **Reduced motion:** Respects `prefers-reduced-motion` preference

### Graceful Fallbacks
- [ ] With **only images:** Slideshow works, song/video sections hidden
- [ ] With **only songs:** Player works, slideshow hidden, image counter shows "0"
- [ ] With **only videos:** Gallery visible, slideshow hidden
- [ ] With **no media:** Friendly message displayed, no errors in console
- [ ] **Unsupported file format:** Silently skipped, other files still load

### Performance
- [ ] With **100+ images:** Slideshow smooth, no memory growth
- [ ] **Next image preloads** before current image finishes
- [ ] **Rapid button clicks** don't cause visual glitches
- [ ] **Song list scrolls** smoothly with many songs
- [ ] **Low bandwidth test** (3G throttle): Page loads, images progressive

### Browser Compatibility
- [ ] ✅ Chrome 90+
- [ ] ✅ Firefox 88+
- [ ] ✅ Safari 14+
- [ ] ✅ Edge 90+
- [ ] ✅ Mobile browsers (Safari iOS, Chrome Android)

---

## 🔧 Troubleshooting

### "No media found" message
**Problem:** Images, videos, or songs not appearing.

**Solution:**
1. Verify files are in correct folders: `images/`, `videos/`, `songs/`
2. Check file extensions are lowercase (`.jpg` not `.JPG`)
3. Open browser console (F12 → Console tab)
4. Look for error messages
5. If directory scanning fails, create `manifest.json` (see below)

### Directory Listing Not Working (Static Hosts)
**Problem:** Files not discovered on some static hosting (GitHub Pages, Netlify, etc.).

**Solution:** Create a `manifest.json` file in `wedding_data/`:
```json
{
    "images": [
        "photo1.jpg",
        "photo2.jpg",
        "subfolder/photo3.jpg"
    ],
    "videos": [
        "ceremony.mp4",
        "reception.webm"
    ],
    "songs": [
        "background.mp3",
        "song2.ogg"
    ]
}
```

The app will automatically fall back to this manifest if directory listing fails.

### Audio/Video Not Playing
**Problem:** Player loads but no sound/video.

**Possible causes:**
- Browser doesn't support codec (e.g., Safari doesn't support WebM)
- CORS/HTTPS issue (serve over HTTP for local testing)
- File corrupt or incomplete

**Solution:**
- Convert files to compatible format (MP4 for video, MP3 for audio)
- Check browser console for errors
- Test file plays standalone in browser

### Slideshow Stops After Video
**Problem:** After playing video, slideshow doesn't resume.

**Solution:** This is current behavior (by design). User must click Play button to resume.  
To auto-resume, edit `app.js` line ~730 in `onVideoEnded()` function.

### localStorage Errors
**Problem:** "QuotaExceededError" saving preferences.

**Solution:**
- Clear browser cache
- Use private/incognito window
- The app will still function, preferences just won't persist

---

## 📱 Deployment Tips

### Self-Hosted Server
```bash
# Clone or download wedding_data folder
# Install Node.js (https://nodejs.org/)
npm install -g http-server

# From wedding_data folder:
http-server -p 8080

# Open browser: http://localhost:8080
```

### GitHub Pages
1. Create a GitHub repository
2. Upload `wedding_data/` folder contents
3. Go to **Settings** → **GitHub Pages**
4. Select **main** branch as source
5. Site will be live at: `https://yourusername.github.io/repo-name/wedding_data/`
6. Create `manifest.json` for media (GitHub Pages doesn't support directory listing)

### Netlify
1. Create a free Netlify account
2. Deploy: `netlify deploy --prod --dir=wedding_data`
3. Site live at: `your-site.netlify.app`
4. Create `manifest.json` for media

### Vercel
1. Push code to GitHub
2. Import repo in Vercel
3. Set deploy directory to `wedding_data`
4. Site live automatically

---

## 🎨 Hindu Wedding Theme Explanation

The color scheme uses traditional Indian wedding colors:

- **Saffron (#FF9933)** — Represents prosperity and fertility  
- **Maroon (#800000)** — Represents passion and celebration  
- **Gold (#FFD700)** — Represents auspiciousness and richness  
- **Cream (#FFF8E7)** — Warm, welcoming background  

Typography combines:
- **Serif font (Playfair Display)** for elegant headers  
- **Sans-serif (Open Sans)** for readable UI  

Decorative elements include subtle gold borders and warm gradients.

---

## 🚀 Optional Enhancements

These are nice-to-have features that can be added later:

1. **EXIF Date Sorting**
   - Read capture date from image EXIF data
   - Sort timeline chronologically
   - Requires: `exif-js` library

2. **Drag-and-Drop Media Upload**
   - Allow users to upload files during playback
   - Store in browser's IndexedDB
   - Useful for live events

3. **Transition Effects**
   - Add selectable transitions: fade, slide, zoom
   - User can choose favorite from dropdown

4. **Mandala Decorations Toggle**
   - Optional decorative border with mandala patterns
   - Can be toggled on/off in UI

5. **Dark Mode**
   - Toggle dark/light theme
   - Save preference to localStorage

6. **QR Code Share**
   - Generate QR code linking to slideshow
   - Share wedding link easily

---

## 📚 Code Architecture

### `media-loader.js` (150 lines)
- `MediaLoader` class handles all media discovery
- `scanDirectories()` - Fetch-based directory listing
- `loadManifest()` - Fallback for static hosts
- Helper methods for file filtering and caption loading

### `app.js` (700 lines)
- `AppState` - Centralized state management
- `WeddingSlideshow` - Main app class
- Methods organized by feature: slideshow, audio, video, keyboard
- Event listener setup and handlers

### `styles.css` (450 lines)
- CSS variables for theme colors
- Semantic component-based styling
- Responsive grid/flexbox layouts
- Mobile-first media queries
- Accessibility features (focus indicators, reduced-motion)

### `index.html` (200 lines)
- Semantic HTML structure (`<header>`, `<main>`, `<aside>`, `<section>`)
- ARIA labels and roles for accessibility
- Hidden elements for audio/video (managed by JS)
- Clean DOM tree for easy manipulation

---

## 🤝 Contributing

To improve this project:
1. Test on different browsers and devices
2. Report bugs with browser/OS details
3. Suggest features for optional enhancements

---

## 📝 License

This project is open-source and free to use for personal and commercial wedding slideshows.

---

## 💝 Credits

Created with ❤️ for celebrating love and tradition in Hindu weddings.

Inspired by traditional Indian wedding aesthetics and modern web accessibility standards.

---

## 🎊 Enjoy Your Wedding Slideshow!

Questions or issues? Check the **Troubleshooting** section above or open an issue.

Wishing you joy and celebration! 🎉💒🎵📸
