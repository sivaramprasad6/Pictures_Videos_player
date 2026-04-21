# Quick Start Guide - No Server Required

## Problem Solved ✅
- **Media Loading Without Server**: Uses `manifest.json` to work locally (no HTTP server needed)
- **Fullscreen Images**: Slideshow continues running while viewing fullscreen
- **Auto-start Songs**: Songs automatically start when images begin playing
- **Video Thumbnails**: Preview images generated from video files
- **Continuous Looping**: Both images and songs loop automatically

## Setup Instructions

### Option 1: Automatic Manifest Generation (Recommended)

1. Open your terminal/command prompt
2. Navigate to the Pictures_Videos_player folder:
   ```bash
   cd Pictures_Videos_player
   ```

3. Run the manifest generator:
   ```bash
   node generate-manifest.js
   ```

4. The script will scan your `wedding_data/images`, `wedding_data/videos`, and `wedding_data/songs` folders and automatically create `wedding_data/manifest.json`

5. Open `wedding_data/index.html` directly in your browser (no server needed!)

### Option 2: Manual Manifest Creation

If the automatic script doesn't work, manually create `wedding_data/manifest.json`:

```json
{
  "images": [
    "photo1.jpg",
    "photo2.jpg",
    "subfolder/photo3.png"
  ],
  "videos": [
    "video1.mp4",
    "video2.webm"
  ],
  "songs": [
    "song1.mp3",
    "song2.ogg"
  ]
}
```

**Note**: Paths are relative to the `images/`, `videos/`, and `songs/` folders respectively.

## Features

### Image Slideshow
- ▶ Play/Pause
- ⬅ Previous / Next ➡
- 🔀 Shuffle mode
- 🔁 Loop on/off
- ⛶ Fullscreen view (continues playing)
- Adjustable timing: 1s, 3s, 5s, or custom

### Audio Player
- Songs auto-start when images play
- 🎵 Song playlist
- Previous/Next navigation
- 🔀 Shuffle playlist
- 🔂 Repeat modes (All / One / Off)
- 🔊 Volume control with mute

### Video Gallery
- 📺 Video thumbnails generated from video files
- Click to play in fullscreen overlay
- Native video controls

### Keyboard Shortcuts
- `Space` - Play/Pause images
- `→` / `←` - Next/Previous image
- `L` - Toggle loop
- `S` - Toggle shuffle
- `M` - Mute/Unmute
- `R` - Change repeat mode
- `F` - Fullscreen
- `Esc` - Exit fullscreen

## Smart TV / Offline Playback

This app works perfectly on Smart TVs and offline devices:

1. **Copy the entire `wedding_data` folder** to your USB or device
2. Open `index.html` directly in the browser
3. Everything works without internet or server!

## Troubleshooting

### Images/Videos/Songs Not Loading
- Make sure files are in the correct folders:
  - Images → `wedding_data/images/`
  - Videos → `wedding_data/videos/`
  - Songs → `wedding_data/songs/`
- Run `node generate-manifest.js` again to regenerate manifest
- Check that `manifest.json` exists in `wedding_data/` folder

### Manifest Generator Not Working
- Make sure you have Node.js installed: `node --version`
- Run from the `Pictures_Videos_player` directory (not inside wedding_data)
- Check that the folders exist and have media files

### Fullscreen Images Not Updating
- Keyboard shortcuts work: use `→` / `←` to navigate while in fullscreen
- Close and reopen fullscreen to sync with slideshow

## File Structure
```
wedding_data/
  ├── index.html
  ├── app.js
  ├── media-loader.js
  ├── styles.css
  ├── manifest.json (auto-generated)
  ├── images/
  │   ├── photo1.jpg
  │   ├── photo2.jpg
  │   └── ...
  ├── videos/
  │   ├── video1.mp4
  │   └── ...
  └── songs/
      ├── song1.mp3
      └── ...
```

## Requirements
- Any modern browser (Chrome, Firefox, Safari, Edge)
- No internet connection needed
- No server required

Enjoy your wedding slideshow! 🎉
