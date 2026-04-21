# Pictures & Videos Player - Hindu Wedding Slideshow

A beautiful, responsive, and accessible single-page web application for displaying wedding photos, videos, and music.

## 🚀 Quick Start

All files are in the `wedding_data/` folder. To get started:

1. Add your media files to:
   - `wedding_data/images/` - Wedding photos (JPG, PNG)
   - `wedding_data/videos/` - Wedding videos (MP4, WebM)
   - `wedding_data/songs/` - Background music (MP3, OGG)

2. Start a local HTTP server from the `wedding_data` folder:
   ```bash
   cd wedding_data
   python -m http.server 8080
   ```

3. Open in browser: `http://localhost:8080`

## 📖 Full Documentation

See **[wedding_data/README.md](./wedding_data/README.md)** for:
- Complete feature list
- Setup instructions for all platforms
- Keyboard shortcuts
- Customization guide
- Deployment options
- Troubleshooting guide

## 📋 Features

✨ Welcome screen with cultural tagline  
🖼️ Auto-discovering image slideshow  
🎵 Audio playlist with full controls  
🎬 Video gallery with overlay player  
⌨️ Keyboard navigation (Space, Arrows, L, S, M, R)  
♿ Accessible (ARIA labels, semantic HTML)  
📱 Responsive (mobile, tablet, desktop)  
💍 Hindu wedding theme (saffron, maroon, gold)  
🌍 Offline-ready, no dependencies  

## 📁 Project Structure

```
Pictures_Videos_player/
├── wedding_data/          # Main application
│   ├── index.html         # Entry point
│   ├── app.js             # Main logic
│   ├── styles.css         # Styling
│   ├── media-loader.js    # Media discovery
│   ├── README.md          # Detailed docs
│   ├── images/            # Add wedding photos
│   ├── videos/            # Add wedding videos
│   └── songs/             # Add background music
├── README.md              # This file
├── .gitignore             # Git ignore rules
└── plan.md                # Implementation plan
```

## 🎨 Customization

- **Couple's names**: Edit `wedding_data/index.html` line 19
- **Theme colors**: Edit `wedding_data/styles.css` lines 13-22
- **Tagline**: Edit `wedding_data/index.html` line 18
- **Image captions**: Create `image.json` alongside image file

## 📞 Support

For detailed help, see [wedding_data/README.md - Troubleshooting](./wedding_data/README.md#-troubleshooting-1)

---

**Happy celebrations! 🎉💒🎵📸**
