/**
 * Media Loader Module
 * Automatically discovers and loads media files from images/, videos/, and songs/ folders
 * Supports nested subfolders via recursive scanning
 */

class MediaLoader {
    constructor() {
        // Supported file extensions by media type
        this.imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        this.videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        this.audioExtensions = ['.mp3', '.ogg', '.wav', '.flac', '.aac', '.m4a'];
        
        this.media = {
            images: [],
            videos: [],
            songs: []
        };
    }

    /**
     * Initialize media discovery
     * For file:// protocol: uses config.js (embedded media list)
     * For http(s): attempts manifest.json, then falls back to config.js
     */
    async init() {
        console.log('🎬 Initializing MediaLoader...');
        
        // First, try to use embedded config.js (works with file:// protocol)
        if (typeof MEDIA_CONFIG !== 'undefined') {
            console.log('⚙️ Using embedded MEDIA_CONFIG from config.js');
            this.loadFromConfig();
            console.log('✅ Media loaded from config:', this.media);
            return this.media;
        }
        
        // Fallback to manifest.json (for HTTP servers)
        console.log('📂 MEDIA_CONFIG not found. Trying manifest.json...');
        try {
            const success = await this.scanDirectories();
            
            if (!success) {
                console.warn('📋 Directory scanning failed. Attempting fallback manifest.json...');
                await this.loadManifest();
            }
        } catch (error) {
            console.error('❌ Media loading error:', error);
            await this.loadManifest();
        }
        
        console.log('✅ Media loaded:', this.media);
        return this.media;
    }

    /**
     * Load media from embedded MEDIA_CONFIG
     */
    loadFromConfig() {
        try {
            if (MEDIA_CONFIG.images && MEDIA_CONFIG.images.length > 0) {
                this.media.images = MEDIA_CONFIG.images;
                console.log(`✅ Loaded ${this.media.images.length} images from config`);
            }
            
            if (MEDIA_CONFIG.videos && MEDIA_CONFIG.videos.length > 0) {
                this.media.videos = MEDIA_CONFIG.videos;
                console.log(`✅ Loaded ${this.media.videos.length} videos from config`);
            }
            
            if (MEDIA_CONFIG.songs && MEDIA_CONFIG.songs.length > 0) {
                this.media.songs = MEDIA_CONFIG.songs;
                console.log(`✅ Loaded ${this.media.songs.length} songs from config`);
            }
        } catch (error) {
            console.error('❌ Error loading from config:', error);
        }
    }

    /**
     * Scan directories for media files
     * Uses fetch API to attempt directory listing
     */
    async scanDirectories() {
        let foundMedia = false;
        
        const baseDirs = {
            images: './images/',
            videos: './videos/',
            songs: './songs/'
        };
        
        for (const [type, dirPath] of Object.entries(baseDirs)) {
            try {
                const files = await this.scanDirectory(dirPath);
                if (files && files.length > 0) {
                    this.media[type] = files;
                    foundMedia = true;
                    console.log(`✅ Found ${files.length} ${type} in ${dirPath}`);
                }
            } catch (error) {
                console.warn(`⚠️ Could not scan ${type} directory:`, error.message);
            }
        }
        
        return foundMedia;
    }

    /**
     * Recursively scan a directory and its subdirectories
     * @param {string} dirPath - Path to scan
     * @param {string} relativePath - Relative path for nested folders
     * @returns {Promise<Array>} Array of file objects
     */
    async scanDirectory(dirPath, relativePath = '') {
        const files = [];
        
        try {
            // Fetch directory listing (works with HTTP servers)
            const response = await fetch(dirPath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const html = await response.text();
            
            // Parse HTML for file links (simple regex-based parsing)
            const fileRegex = /href="([^"]+?)"/g;
            let match;
            
            while ((match = fileRegex.exec(html)) !== null) {
                const fileName = match[1];
                
                // Skip parent directory links and special files
                if (fileName === '../' || fileName.startsWith('?') || fileName === '') {
                    continue;
                }
                
                // Check if it's a subdirectory (ends with /)
                if (fileName.endsWith('/')) {
                    // Recursively scan subdirectory
                    const subDirPath = `${dirPath}${fileName}`;
                    const subRelativePath = relativePath ? `${relativePath}${fileName}` : fileName;
                    const subFiles = await this.scanDirectory(subDirPath, subRelativePath);
                    files.push(...subFiles);
                } else {
                    // Check if file matches any supported extension
                    const fullPath = relativePath ? `${relativePath}${fileName}` : fileName;
                    const file = this.createFileObject(dirPath, fullPath, fileName);
                    if (file) {
                        files.push(file);
                    }
                }
            }
        } catch (error) {
            console.warn(`📁 Could not scan directory ${dirPath}:`, error.message);
            // Directory scanning failed, will use manifest fallback
            throw error;
        }
        
        return files;
    }

    /**
     * Create a standardized file object
     * @param {string} dirPath - Directory path (images/, videos/, songs/)
     * @param {string} relativePath - Relative path within directory (including subdirs)
     * @param {string} fileName - File name only
     * @returns {Object|null} File object or null if unsupported
     */
    createFileObject(dirPath, relativePath, fileName) {
        const ext = this.getExtension(fileName).toLowerCase();
        
        let type = null;
        if (this.imageExtensions.includes(ext)) {
            type = 'image';
        } else if (this.videoExtensions.includes(ext)) {
            type = 'video';
        } else if (this.audioExtensions.includes(ext)) {
            type = 'audio';
        }
        
        if (!type) {
            return null; // Unsupported file type
        }
        
        const fullPath = `${dirPath}${relativePath}`;
        const name = fileName.replace(ext, ''); // Remove extension for display
        
        return {
            path: fullPath,
            name: name,
            fileName: fileName,
            extension: ext,
            type: type,
            duration: null // Will be populated later for audio/video
        };
    }

    /**
     * Get file extension
     * @param {string} fileName - File name
     * @returns {string} Extension including dot (e.g., '.jpg')
     */
    getExtension(fileName) {
        const lastDot = fileName.lastIndexOf('.');
        return lastDot === -1 ? '' : fileName.substring(lastDot);
    }

    /**
     * Load fallback manifest.json if directory scanning fails
     * Manifest structure: { images: [...], videos: [...], songs: [...] }
     * 
     * For file:// protocol users: Helper function to generate manifest.json:
     * Run this in browser console:
     * mediaLoader.generateManifestHelper()
     */
    async loadManifest() {
        try {
            console.log('📋 Loading manifest.json...');
            // Add cache busting parameter to force fresh load
            const response = await fetch('./manifest.json?v=' + Date.now());
            
            if (!response.ok) {
                throw new Error('manifest.json not found');
            }
            
            const manifest = await response.json();
            
            // Process manifest entries
            if (manifest.images && manifest.images.length > 0) {
                this.media.images = manifest.images.map(path => ({
                    path: `./images/${path}`,
                    name: path.replace(/\.[^/.]+$/, ''),
                    fileName: path,
                    extension: this.getExtension(path),
                    type: 'image'
                }));
                console.log(`✅ Loaded ${this.media.images.length} images from manifest`);
            }
            
            if (manifest.videos && manifest.videos.length > 0) {
                this.media.videos = manifest.videos.map(path => ({
                    path: `./videos/${path}`,
                    name: path.replace(/\.[^/.]+$/, ''),
                    fileName: path,
                    extension: this.getExtension(path),
                    type: 'video'
                }));
                console.log(`✅ Loaded ${this.media.videos.length} videos from manifest`);
            }
            
            if (manifest.songs && manifest.songs.length > 0) {
                this.media.songs = manifest.songs.map(path => ({
                    path: `./songs/${path}`,
                    name: path.replace(/\.[^/.]+$/, ''),
                    fileName: path,
                    extension: this.getExtension(path),
                    type: 'audio'
                }));
                console.log(`✅ Loaded ${this.media.songs.length} songs from manifest`);
            }
            
            console.log('✅ Manifest loaded successfully');
        } catch (error) {
            console.warn('⚠️ manifest.json not found:', error.message);
            console.log('📝 For static file (file://) access, please create manifest.json');
            console.log('💡 Use mediaLoader.generateManifestHelper() in console to create one');
        }
    }

    /**
     * Helper function for users on file:// protocol
     * Generate manifest.json template based on folder structure
     * Run in browser console: mediaLoader.generateManifestHelper()
     */
    generateManifestHelper() {
        const manifest = {
            images: [
                "sample-1.jpg",
                "sample-2.jpg",
                "sample-3.jpg"
            ],
            videos: [
                "sample-video-1.mp4",
                "sample-video-2.webm"
            ],
            songs: [
                "sample-song-1.mp3",
                "sample-song-2.ogg"
            ]
        };
        
        console.log('%c=== MANIFEST.JSON TEMPLATE ===', 'font-size: 14px; font-weight: bold; color: #FF9933;');
        console.log('%cCopy the JSON below and create a "manifest.json" file in wedding_data/ folder:', 'font-size: 12px; color: #800000;');
        console.log('%c' + JSON.stringify(manifest, null, 2), 'font-family: monospace; background: #f5f5f5; padding: 10px;');
        console.log('%cThen list your actual files inside each array:', 'font-size: 12px; color: #800000; margin-top: 10px;');
        console.log('%cExample: "images": ["photo1.jpg", "photo2.jpg", "subfolder/photo3.jpg"]', 'font-size: 11px; color: #666;');
        
        // Also log to alert for visibility
        alert('Check console (F12) for manifest.json template');
    }

    /**
     * Load captions for an image from a JSON file (optional)
     * Expects a JSON file with same name as image (e.g., image.jpg -> image.json)
     * @param {string} imagePath - Path to image
     * @returns {Promise<string>} Caption text or empty string
     */
    async loadCaption(imagePath) {
        try {
            const captionPath = imagePath.replace(/\.[^/.]+$/, '.json');
            const response = await fetch(captionPath);
            
            if (!response.ok) {
                return ''; // No caption file, return empty string
            }
            
            const data = await response.json();
            return data.caption || data.text || '';
        } catch (error) {
            // Caption file not found or invalid JSON, silently skip
            return '';
        }
    }

    /**
     * Get audio/video duration
     * Creates a temporary element to extract duration metadata
     * @param {string} path - Media file path
     * @param {string} type - 'audio' or 'video'
     * @returns {Promise<number>} Duration in seconds
     */
    async getDuration(path, type) {
        return new Promise((resolve) => {
            const element = type === 'audio' 
                ? new Audio(path) 
                : document.createElement('video');
            
            element.onloadedmetadata = () => {
                resolve(element.duration || 0);
            };
            
            element.onerror = () => {
                console.warn(`⚠️ Could not load duration for ${path}`);
                resolve(0);
            };
            
            element.src = path;
            if (type === 'video') {
                element.load();
            }
        });
    }

    /**
     * Format time in MM:SS format
     * @param {number} seconds - Duration in seconds
     * @returns {string} Formatted time (e.g., "3:45")
     */
    static formatTime(seconds) {
        if (!seconds || seconds === 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Shuffle array (Fisher-Yates algorithm)
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled copy of array
     */
    static shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Create global instance
const mediaLoader = new MediaLoader();
