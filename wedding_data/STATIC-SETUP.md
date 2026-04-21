# 🎉 Running Without a Server (Static File Access)

If you want to open `index.html` directly in your browser **without running a server**, follow these steps:

## Method 1: Using the Manifest Generator (Recommended) ⭐

1. **Open** `manifest-generator.html` in your browser:
   - Double-click the file, or
   - Drag it into your browser window

2. **Select Your Files:**
   - Click "Select Image Files" and choose all your wedding photos
   - Click "Select Video Files" and choose all your videos
   - Click "Select Audio Files" and choose all your songs

3. **Generate & Copy:**
   - Click "Generate manifest.json"
   - Click "Copy to Clipboard"

4. **Create manifest.json File:**
   - Open a text editor (Notepad, VS Code, etc.)
   - Paste the JSON content
   - Save as `manifest.json` in the `wedding_data/` folder
   - ⚠️ **Important:** Must be named `manifest.json` (exact spelling)

5. **Open the Slideshow:**
   - Double-click `index.html` (or drag into browser)
   - Click "Start" to begin! 🎊

---

## Method 2: Manual manifest.json Creation

If you prefer to create it manually:

1. **Create a new file** named `manifest.json` in `wedding_data/` folder

2. **Copy this template:**
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
           "classical_song.ogg"
       ]
   }
   ```

3. **Replace with your file names:**
   - List every image file in the `images/` folder
   - List every video file in the `videos/` folder
   - List every song file in the `songs/` folder
   - If files are in subfolders, use: `subfolder/filename.ext`

4. **Save and open** `index.html` in your browser

---

## ⚙️ How It Works

When you open `index.html` directly (file:// protocol):
- The app detects it's running on file://
- It automatically loads media from `manifest.json`
- Directory scanning is disabled (browser security)

When you use a server (HTTP):
- The app scans directories automatically
- manifest.json is optional (nice-to-have backup)
- Faster media discovery

---

## 🎬 Supported File Formats

### Images
- JPG, JPEG
- PNG
- GIF
- WebP

### Videos
- MP4 (recommended)
- WebM
- OGG

### Audio
- MP3 (recommended)
- OGG
- WAV
- FLAC
- AAC
- M4A

---

## 🎯 Tips

✅ **Always include file extensions** (.jpg, .mp4, .mp3)  
✅ **Use forward slashes** for subfolder paths: `subfolder/file.jpg`  
✅ **Don't edit** `manifest.json` by hand if possible - use the generator  
✅ **Check browser console** (F12) for error messages  
✅ **If nothing appears**, open console and look for manifest loading errors  

---

## 🚀 Keyboard Shortcuts (Now with Fullscreen!)

| Key | Action |
|-----|--------|
| **Space** | Play / Pause slideshow |
| **→** | Next image |
| **←** | Previous image |
| **F** | 🖼️ **Fullscreen image** (NEW!) |
| **L** | Toggle Loop |
| **S** | Toggle Shuffle |
| **M** | Mute audio |
| **R** | Cycle Repeat mode |
| **Esc** | Exit fullscreen |

---

## ❓ Troubleshooting

### "No images found" message
- Check `manifest.json` exists in `wedding_data/` folder
- Verify spelling of file names match exactly
- Open browser console (F12) for detailed error messages

### Files not showing up
- Make sure `manifest.json` lists the correct file names
- Check file extensions are lowercase (.jpg not .JPG)
- Verify paths: `images/photo.jpg` not `images\\photo.jpg`

### Video/Audio not playing
- Check file format is supported (MP4, MP3, WebM, OGG)
- Try converting with free tools:
  - Images: Use Paint, Preview, or online converters
  - Video: Use FFmpeg or online converters
  - Audio: Use Audacity or online converters

### Browser says "No such file or directory"
- The app is trying to find manifest.json
- Create the file or use the manifest generator
- Exact filename: `manifest.json` (all lowercase)

---

## 💡 Pro Tip

For the best experience, use a **local HTTP server**:

```bash
cd wedding_data
python -m http.server 8080
```

Then open: `http://localhost:8080`

This enables:
- ✅ Automatic directory scanning
- ✅ No need for manifest.json
- ✅ Better performance
- ✅ Server-like deployment preview

---

**Questions?** Check the main [README.md](./README.md) for more help!

**Enjoy your wedding slideshow! 🎊💍🎵📸**
