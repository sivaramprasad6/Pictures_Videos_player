/**
 * Hindu Wedding Slideshow - Main Application
 * Manages state, slideshow, audio playback, video player, and user interactions
 */

// ============================================
// STATE MANAGER
// ============================================

class AppState {
    constructor() {
        this.media = { images: [], videos: [], songs: [] };
        
        // Slideshow state
        this.currentImageIndex = 0;
        this.isImagePlaying = false;
        this.imageDuration = 3000; // milliseconds
        this.isImageShuffled = false;
        this.isImageLooping = true;
        this.imageOrder = []; // Shuffled order if needed
        
        // Audio state
        this.currentSongIndex = 0;
        this.isSongPlaying = false;
        this.isSongShuffled = false;
        this.repeatMode = 'all'; // 'all', 'one', 'none'
        this.volume = 0.7;
        this.isMuted = false;
        this.songOrder = []; // Shuffled order if needed
        
        // Video state
        this.currentVideoIndex = 0;
        this.wasImagePlayingBeforeVideo = false; // Track if we need to resume
        this.wasSongPlayingBeforeVideo = false; // Track if we need to resume
        
        // UI state
        this.isWelcomeScreenActive = true;
        this.slideShowTimer = null;
        this.autoAdvanceTimer = null;
    }

    /**
     * Load saved preferences from localStorage
     */
    loadPreferences() {
        try {
            const saved = localStorage.getItem('weddingSlideShowPrefs');
            if (saved) {
                const prefs = JSON.parse(saved);
                this.imageDuration = prefs.imageDuration || 3000;
                this.isImageLooping = prefs.isImageLooping !== false;
                this.repeatMode = prefs.repeatMode || 'all';
                this.volume = prefs.volume || 0.7;
                console.log('✅ Preferences loaded from localStorage');
            }
        } catch (error) {
            console.warn('⚠️ Could not load preferences:', error);
        }
    }

    /**
     * Save preferences to localStorage
     */
    savePreferences() {
        try {
            const prefs = {
                imageDuration: this.imageDuration,
                isImageLooping: this.isImageLooping,
                repeatMode: this.repeatMode,
                volume: this.volume
            };
            localStorage.setItem('weddingSlideShowPrefs', JSON.stringify(prefs));
        } catch (error) {
            console.warn('⚠️ Could not save preferences:', error);
        }
    }
}

// ============================================
// MAIN APPLICATION CLASS
// ============================================

class WeddingSlideshow {
    constructor() {
        this.state = new AppState();
        this.state.loadPreferences();
        
        // DOM Elements
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.slideshowContainer = document.getElementById('slideshowContainer');
        this.startBtn = document.getElementById('startBtn');
        
        // Slideshow elements
        this.currentImage = document.getElementById('currentImage');
        this.imageCaption = document.getElementById('imageCaption');
        this.currentImageIndex = document.getElementById('currentImageIndex');
        this.totalImages = document.getElementById('totalImages');
        this.durationSelect = document.getElementById('durationSelect');
        this.customDuration = document.getElementById('customDuration');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.loopBtn = document.getElementById('loopBtn');
        this.imageSlideshowSection = document.getElementById('imageSlideshowSection');
        this.noImagesMsg = document.getElementById('noImagesMsg');
        this.fullscreenImageBtn = document.getElementById('fullscreenImageBtn');
        this.fullscreenImageModal = document.getElementById('fullscreenImageModal');
        this.fullscreenImageCloseBtn = document.getElementById('fullscreenImageCloseBtn');
        this.fullscreenImageContent = document.getElementById('fullscreenImageContent');
        this.fullscreenImageCaption = document.getElementById('fullscreenImageCaption');
        
        // Audio elements
        this.audioPlayer = document.getElementById('audioPlayer');
        this.songPlayPauseBtn = document.getElementById('songPlayPauseBtn');
        this.songPrevBtn = document.getElementById('songPrevBtn');
        this.songNextBtn = document.getElementById('songNextBtn');
        this.songShuffleBtn = document.getElementById('songShuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.muteBtn = document.getElementById('muteBtn');
        this.currentSongTitle = document.getElementById('currentSongTitle');
        this.songDuration = document.getElementById('songDuration');
        this.songCurrentTime = document.getElementById('songCurrentTime');
        this.songProgressBar = document.getElementById('songProgressBar');
        this.songList = document.getElementById('songList');
        this.songSection = document.getElementById('songSection');
        this.noSongsMsg = document.getElementById('noSongsMsg');
        
        // Video elements
        this.videoPlayer = document.getElementById('videoPlayer');
        this.videoOverlay = document.getElementById('videoOverlay');
        this.closeVideoBtn = document.getElementById('closeVideoBtn');
        this.fullscreenVideoBtn = document.getElementById('fullscreenVideoBtn');
        this.videoList = document.getElementById('videoList');
        this.videoSection = document.getElementById('videoSection');
        this.noVideosMsg = document.getElementById('noVideosMsg');
        
        // Other
        this.loadingIndicator = document.getElementById('loadingIndicator');
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('🎬 Initializing Wedding Slideshow App...');
        
        // Show loading indicator
        this.loadingIndicator.classList.add('active');
        
        try {
            // Load media files
            this.state.media = await mediaLoader.init();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Populate UI with media
            this.populateUI();
            
            // Setup initial state
            this.setupInitialState();
            
            console.log('✅ Wedding Slideshow App initialized');
        } catch (error) {
            console.error('❌ Initialization error:', error);
        } finally {
            this.loadingIndicator.classList.remove('active');
        }
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Welcome screen
        this.startBtn.addEventListener('click', () => this.startSlideshow());
        
        // Slideshow controls
        this.playPauseBtn.addEventListener('click', () => this.toggleImagePlayback());
        this.prevBtn.addEventListener('click', () => this.previousImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());
        this.shuffleBtn.addEventListener('click', () => this.toggleImageShuffle());
        this.loopBtn.addEventListener('click', () => this.toggleImageLoop());
        this.fullscreenImageBtn.addEventListener('click', () => this.toggleFullscreenImage());
        
        // Duration controls
        this.durationSelect.addEventListener('change', (e) => this.changeDuration(e));
        this.customDuration.addEventListener('change', (e) => this.setCustomDuration(e));
        
        // Audio controls
        this.songPlayPauseBtn.addEventListener('click', () => this.toggleSongPlayback());
        this.songPrevBtn.addEventListener('click', () => this.previousSong());
        this.songNextBtn.addEventListener('click', () => this.nextSong());
        this.songShuffleBtn.addEventListener('click', () => this.toggleSongShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeatMode());
        this.volumeSlider.addEventListener('change', (e) => this.setVolume(e));
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        this.songProgressBar.addEventListener('change', (e) => this.seekSong(e));
        
        // Audio events
        this.audioPlayer.addEventListener('ended', () => this.onSongEnded());
        this.audioPlayer.addEventListener('timeupdate', () => this.updateSongProgress());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateSongDuration());
        
        // Video controls
        this.closeVideoBtn.addEventListener('click', () => this.closeVideo());
        this.fullscreenVideoBtn.addEventListener('click', () => this.toggleFullscreenVideo());
        this.videoPlayer.addEventListener('ended', () => this.onVideoEnded());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Click outside video overlay to close
        this.videoOverlay.addEventListener('click', (e) => {
            if (e.target === this.videoOverlay) {
                this.closeVideo();
            }
        });
        
        // Fullscreen image modal
        this.fullscreenImageCloseBtn.addEventListener('click', () => this.closeFullscreenImage());
        this.fullscreenImageModal.addEventListener('click', (e) => {
            if (e.target === this.fullscreenImageModal) {
                this.closeFullscreenImage();
            }
        });
    }

    /**
     * Populate UI elements (song list, video list, etc.)
     */
    populateUI() {
        // Populate song list
        if (this.state.media.songs.length > 0) {
            this.noSongsMsg.classList.add('hidden');
            this.songList.innerHTML = '';
            
            this.state.media.songs.forEach((song, index) => {
                const div = document.createElement('div');
                div.className = 'song-item';
                div.textContent = song.name;
                div.setAttribute('data-index', index);
                div.setAttribute('role', 'option');
                div.addEventListener('click', () => this.playSongByIndex(index));
                this.songList.appendChild(div);
            });
        } else {
            this.noSongsMsg.classList.remove('hidden');
            this.songSection.style.display = 'none';
        }
        
        // Populate video list with thumbnails
        if (this.state.media.videos.length > 0) {
            this.noVideosMsg.classList.add('hidden');
            this.videoList.innerHTML = '';
            
            this.state.media.videos.forEach((video, index) => {
                const div = document.createElement('div');
                div.className = 'video-item';
                div.setAttribute('data-index', index);
                div.setAttribute('role', 'option');
                div.addEventListener('click', () => this.playVideoByIndex(index));
                
                // Create thumbnail container
                const thumbnailContainer = document.createElement('div');
                thumbnailContainer.className = 'video-thumbnail-container';
                
                // Add thumbnail image (will be loaded asynchronously)
                const thumbnail = document.createElement('img');
                thumbnail.className = 'video-thumbnail';
                thumbnail.alt = `${video.name} thumbnail`;
                
                // Try to generate thumbnail from video
                this.generateVideoThumbnail(video.path, thumbnail);
                
                // Add play icon overlay
                const playIcon = document.createElement('div');
                playIcon.className = 'video-play-icon';
                playIcon.textContent = '▶';
                
                thumbnailContainer.appendChild(thumbnail);
                thumbnailContainer.appendChild(playIcon);
                div.appendChild(thumbnailContainer);
                
                // Add video name
                const name = document.createElement('div');
                name.className = 'video-name';
                name.textContent = video.name;
                div.appendChild(name);
                
                this.videoList.appendChild(div);
                console.log(`📹 Video item created: ${video.name} (${video.path})`);
            });
        } else {
            this.noVideosMsg.classList.remove('hidden');
        }
        
        // Update image counter
        this.totalImages.textContent = this.state.media.images.length;
    }
    
    /**
     * Generate thumbnail from video file
     * @param {string} videoPath - Path to video file
     * @param {HTMLImageElement} imgElement - Image element to set thumbnail to
     */
    generateVideoThumbnail(videoPath, imgElement) {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let thumbnailGenerated = false;
        
        video.addEventListener('loadedmetadata', () => {
            // Seek to 1 second or 25% of video length (whichever is smaller)
            const seekTime = Math.min(1, video.duration * 0.25);
            console.log(`📹 Generating thumbnail for ${videoPath} at ${seekTime}s`);
            video.currentTime = seekTime;
        }, { once: true });
        
        video.addEventListener('seeked', () => {
            if (!thumbnailGenerated && video.readyState >= 2) {
                try {
                    thumbnailGenerated = true;
                    canvas.width = video.videoWidth || 320;
                    canvas.height = video.videoHeight || 180;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    imgElement.src = canvas.toDataURL('image/png');
                    console.log(`✅ Thumbnail generated for ${videoPath}`);
                } catch (e) {
                    console.warn(`⚠️ Could not draw canvas for ${videoPath}:`, e);
                    this.setVideoPlaceholder(imgElement);
                }
            }
        }, { once: true });
        
        video.addEventListener('error', (e) => {
            console.warn(`⚠️ Could not load video ${videoPath}:`, e);
            this.setVideoPlaceholder(imgElement);
        }, { once: true });
        
        video.addEventListener('canplay', () => {
            if (!thumbnailGenerated) {
                try {
                    thumbnailGenerated = true;
                    canvas.width = video.videoWidth || 320;
                    canvas.height = video.videoHeight || 180;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    imgElement.src = canvas.toDataURL('image/png');
                    console.log(`✅ Thumbnail generated for ${videoPath} (canplay)`);
                } catch (e) {
                    console.warn(`⚠️ Could not draw on canplay for ${videoPath}:`, e);
                    this.setVideoPlaceholder(imgElement);
                }
            }
        }, { once: true });
        
        // Add crossorigin attribute for CORS
        video.crossOrigin = 'anonymous';
        video.src = videoPath;
        video.load();
    }

    /**
     * Set video placeholder when thumbnail generation fails
     * @param {HTMLImageElement} imgElement - Image element
     */
    setVideoPlaceholder(imgElement) {
        // Create a nice placeholder SVG with play button
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#660000;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#330000;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect fill="url(#grad)" width="320" height="180"/>
                <circle cx="160" cy="90" r="45" fill="rgba(255,153,51,0.8)"/>
                <polygon points="145,70 145,110 185,90" fill="white"/>
            </svg>
        `;
        imgElement.src = 'data:image/svg+xml;base64,' + btoa(svg);
        console.log(`📹 Using placeholder for video thumbnail`);
    }

    /**
     * Setup initial state after media is loaded
     */
    setupInitialState() {
        // Setup image order
        this.resetImageOrder();
        
        // Setup song order
        this.resetSongOrder();
        
        // Display first image if available
        if (this.state.media.images.length > 0) {
            this.displayImage(0);
        } else {
            this.noImagesMsg.classList.remove('hidden');
        }
        
        // Load first song metadata if available
        if (this.state.media.songs.length > 0) {
            this.state.volume = parseFloat(this.volumeSlider.value) / 100;
            this.audioPlayer.volume = this.state.volume;
        }
    }

    /**
     * Start the slideshow after welcome screen
     */
    startSlideshow() {
        console.log('▶️ Starting slideshow...');
        this.state.isWelcomeScreenActive = false;
        this.welcomeScreen.classList.add('hidden');
        this.slideshowContainer.classList.remove('hidden');
        
        // Auto-start images if available
        if (this.state.media.images.length > 0) {
            this.toggleImagePlayback();
        }
    }

    // ============================================
    // SLIDESHOW FUNCTIONS
    // ============================================

    /**
     * Display image at given index
     * @param {number} index - Image index
     */
    async displayImage(index) {
        if (this.state.media.images.length === 0) return;
        
        // Wrap index
        const maxIndex = this.state.media.images.length - 1;
        if (index < 0) index = this.state.isImageLooping ? maxIndex : 0;
        if (index > maxIndex) index = this.state.isImageLooping ? 0 : maxIndex;
        
        this.state.currentImageIndex = index;
        const actualIndex = this.state.isImageShuffled 
            ? this.state.imageOrder[index] 
            : index;
        const image = this.state.media.images[actualIndex];
        
        // Update display
        this.currentImage.src = image.path;
        this.currentImage.alt = image.name;
        this.currentImageIndex.textContent = index + 1;
        
        // Load and display caption if available
        const caption = await mediaLoader.loadCaption(image.path);
        this.imageCaption.textContent = caption || image.name;
        
        // Update fullscreen image if it's open
        if (!this.fullscreenImageModal.classList.contains('hidden')) {
            this.updateFullscreenImage();
        }
        
        // Preload next image
        this.preloadNextImage();
    }

    /**
     * Preload the next image for faster transition
     */
    preloadNextImage() {
        const nextIndex = this.state.currentImageIndex + 1;
        if (nextIndex < this.state.media.images.length) {
            const nextImage = this.state.media.images[nextIndex];
            const img = new Image();
            img.src = nextImage.path;
        }
    }

    /**
     * Toggle slideshow play/pause
     */
    toggleImagePlayback() {
        this.state.isImagePlaying = !this.state.isImagePlaying;
        this.updatePlayPauseButton();
        
        if (this.state.isImagePlaying) {
            this.startAutoAdvance();
            // Auto-start songs when images start playing
            if (this.state.media.songs.length > 0 && !this.state.isSongPlaying) {
                this.toggleSongPlayback();
            }
        } else {
            this.stopAutoAdvance();
            // Pause songs when pausing images
            if (this.state.isSongPlaying) {
                this.audioPlayer.pause();
                this.state.isSongPlaying = false;
                this.updateSongPlayPauseButton();
            }
        }
    }

    /**
     * Auto-advance to next image on timer
     */
    startAutoAdvance() {
        this.stopAutoAdvance(); // Clear any existing timer
        
        this.state.autoAdvanceTimer = setInterval(() => {
            this.nextImage();
        }, this.state.imageDuration);
        
        console.log(`⏱️ Auto-advance started (${this.state.imageDuration}ms)`);
    }

    /**
     * Stop auto-advance timer
     */
    stopAutoAdvance() {
        if (this.state.autoAdvanceTimer) {
            clearInterval(this.state.autoAdvanceTimer);
            this.state.autoAdvanceTimer = null;
        }
    }

    /**
     * Display next image
     */
    nextImage() {
        if (this.state.media.images.length === 0) return;
        this.displayImage(this.state.currentImageIndex + 1);
    }

    /**
     * Display previous image
     */
    previousImage() {
        if (this.state.media.images.length === 0) return;
        this.displayImage(this.state.currentImageIndex - 1);
    }

    /**
     * Toggle shuffle mode
     */
    toggleImageShuffle() {
        this.state.isImageShuffled = !this.state.isImageShuffled;
        this.shuffleBtn.setAttribute('aria-pressed', this.state.isImageShuffled);
        
        if (this.state.isImageShuffled) {
            this.state.imageOrder = MediaLoader.shuffle([...Array(this.state.media.images.length).keys()]);
            console.log('🔀 Shuffle ON');
        } else {
            this.resetImageOrder();
            console.log('🔀 Shuffle OFF');
        }
        
        this.displayImage(0);
    }

    /**
     * Toggle loop mode
     */
    toggleImageLoop() {
        this.state.isImageLooping = !this.state.isImageLooping;
        this.loopBtn.setAttribute('aria-pressed', this.state.isImageLooping);
        console.log(`🔁 Loop ${this.state.isImageLooping ? 'ON' : 'OFF'}`);
        this.state.savePreferences();
    }

    /**
     * Reset image order to sequential
     */
    resetImageOrder() {
        this.state.imageOrder = Array.from({length: this.state.media.images.length}, (_, i) => i);
    }

    /**
     * Change image display duration
     * @param {Event} e - Select change event
     */
    changeDuration(e) {
        const value = e.target.value;
        
        if (value === 'custom') {
            this.customDuration.classList.remove('hidden');
            this.customDuration.focus();
        } else {
            this.customDuration.classList.add('hidden');
            this.state.imageDuration = parseInt(value);
            
            // Restart auto-advance with new duration
            if (this.state.isImagePlaying) {
                this.stopAutoAdvance();
                this.startAutoAdvance();
            }
            
            console.log(`⏱️ Duration changed to ${this.state.imageDuration}ms`);
            this.state.savePreferences();
        }
    }

    /**
     * Set custom duration from input
     * @param {Event} e - Input change event
     */
    setCustomDuration(e) {
        const seconds = parseInt(e.target.value) || 1;
        this.state.imageDuration = seconds * 1000;
        
        // Restart auto-advance with new duration
        if (this.state.isImagePlaying) {
            this.stopAutoAdvance();
            this.startAutoAdvance();
        }
        
        console.log(`⏱️ Custom duration set to ${seconds}s`);
        this.state.savePreferences();
    }

    /**
     * Update play/pause button state
     */
    updatePlayPauseButton() {
        if (this.state.isImagePlaying) {
            this.playPauseBtn.textContent = '⏸ Pause';
            this.playPauseBtn.setAttribute('aria-pressed', 'true');
        } else {
            this.playPauseBtn.textContent = '▶ Play';
            this.playPauseBtn.setAttribute('aria-pressed', 'false');
        }
    }

    // ============================================
    // AUDIO FUNCTIONS
    // ============================================

    /**
     * Toggle song playback
     */
    toggleSongPlayback() {
        if (this.state.media.songs.length === 0) return;
        
        if (this.state.isSongPlaying) {
            this.audioPlayer.pause();
            this.state.isSongPlaying = false;
        } else {
            // Load song if not loaded
            if (!this.audioPlayer.src || !this.audioPlayer.src.includes(this.state.media.songs[this.state.currentSongIndex].path)) {
                this.loadSong(this.state.currentSongIndex);
            }
            this.audioPlayer.play().catch(error => console.warn('⚠️ Audio play failed:', error));
            this.state.isSongPlaying = true;
        }
        
        this.updateSongPlayPauseButton();
    }

    /**
     * Load song at index
     * @param {number} index - Song index
     */
    loadSong(index) {
        if (index < 0 || index >= this.state.media.songs.length) return;
        
        this.state.currentSongIndex = index;
        const song = this.state.media.songs[index];
        
        this.audioPlayer.src = song.path;
        this.currentSongTitle.textContent = song.name;
        
        // Update song list highlight
        document.querySelectorAll('.song-item').forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Play song by index
     * @param {number} index - Song index
     */
    playSongByIndex(index) {
        this.loadSong(index);
        this.audioPlayer.play().catch(error => console.warn('⚠️ Audio play failed:', error));
        this.state.isSongPlaying = true;
        this.updateSongPlayPauseButton();
    }

    /**
     * Next song
     */
    nextSong() {
        if (this.state.media.songs.length === 0) return;
        
        let nextIndex = this.state.currentSongIndex + 1;
        if (nextIndex >= this.state.media.songs.length) {
            nextIndex = 0;
        }
        
        if (this.state.isSongShuffled) {
            nextIndex = this.state.songOrder[nextIndex];
        }
        
        this.loadSong(nextIndex);
        if (this.state.isSongPlaying) {
            this.audioPlayer.play();
        }
    }

    /**
     * Previous song
     */
    previousSong() {
        if (this.state.media.songs.length === 0) return;
        
        let prevIndex = this.state.currentSongIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.state.media.songs.length - 1;
        }
        
        if (this.state.isSongShuffled) {
            prevIndex = this.state.songOrder[prevIndex];
        }
        
        this.loadSong(prevIndex);
        if (this.state.isSongPlaying) {
            this.audioPlayer.play();
        }
    }

    /**
     * Song ended handler
     */
    onSongEnded() {
        if (this.state.repeatMode === 'one') {
            this.audioPlayer.currentTime = 0;
            this.audioPlayer.play();
        } else if (this.state.repeatMode === 'all') {
            this.nextSong();
        } else {
            this.state.isSongPlaying = false;
            this.updateSongPlayPauseButton();
        }
    }

    /**
     * Toggle shuffle for songs
     */
    toggleSongShuffle() {
        this.state.isSongShuffled = !this.state.isSongShuffled;
        this.songShuffleBtn.setAttribute('aria-pressed', this.state.isSongShuffled);
        
        if (this.state.isSongShuffled) {
            this.state.songOrder = MediaLoader.shuffle([...Array(this.state.media.songs.length).keys()]);
            console.log('🔀 Song Shuffle ON');
        } else {
            this.resetSongOrder();
            console.log('🔀 Song Shuffle OFF');
        }
    }

    /**
     * Reset song order to sequential
     */
    resetSongOrder() {
        this.state.songOrder = Array.from({length: this.state.media.songs.length}, (_, i) => i);
    }

    /**
     * Toggle repeat mode: all -> one -> none -> all
     */
    toggleRepeatMode() {
        const modes = ['all', 'one', 'none'];
        const currentIndex = modes.indexOf(this.state.repeatMode);
        this.state.repeatMode = modes[(currentIndex + 1) % modes.length];
        
        const modeText = {
            'all': '🔂 All',
            'one': '🔁 One',
            'none': '➡️ Off'
        };
        
        this.repeatBtn.textContent = modeText[this.state.repeatMode];
        console.log(`🔄 Repeat mode: ${this.state.repeatMode}`);
        this.state.savePreferences();
    }

    /**
     * Set volume
     * @param {Event} e - Slider change event
     */
    setVolume(e) {
        const volume = parseInt(e.target.value) / 100;
        this.state.volume = volume;
        this.audioPlayer.volume = volume;
        
        if (volume > 0 && this.state.isMuted) {
            this.state.isMuted = false;
            this.updateMuteButton();
        }
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        this.state.isMuted = !this.state.isMuted;
        
        if (this.state.isMuted) {
            this.audioPlayer.volume = 0;
        } else {
            this.audioPlayer.volume = this.state.volume;
        }
        
        this.updateMuteButton();
    }

    /**
     * Update mute button display
     */
    updateMuteButton() {
        if (this.state.isMuted) {
            this.muteBtn.textContent = '🔇 Unmute';
            this.muteBtn.setAttribute('aria-pressed', 'true');
        } else {
            this.muteBtn.textContent = '🔊 Mute';
            this.muteBtn.setAttribute('aria-pressed', 'false');
        }
    }

    /**
     * Update song play/pause button
     */
    updateSongPlayPauseButton() {
        if (this.state.isSongPlaying) {
            this.songPlayPauseBtn.textContent = '⏸ Pause';
            this.songPlayPauseBtn.setAttribute('aria-pressed', 'true');
        } else {
            this.songPlayPauseBtn.textContent = '▶ Play';
            this.songPlayPauseBtn.setAttribute('aria-pressed', 'false');
        }
    }

    /**
     * Seek to time in song
     * @param {Event} e - Progress bar change event
     */
    seekSong(e) {
        const duration = this.audioPlayer.duration;
        const time = (parseInt(e.target.value) / 100) * duration;
        this.audioPlayer.currentTime = time;
    }

    /**
     * Update song progress bar
     */
    updateSongProgress() {
        if (!this.audioPlayer.duration) return;
        
        const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
        this.songProgressBar.value = progress;
        this.songCurrentTime.textContent = MediaLoader.formatTime(this.audioPlayer.currentTime);
    }

    /**
     * Update song duration display
     */
    updateSongDuration() {
        this.songDuration.textContent = MediaLoader.formatTime(this.audioPlayer.duration);
    }

    // ============================================
    // VIDEO FUNCTIONS
    // ============================================

    /**
     * Play video by index
     * @param {number} index - Video index
     */
    playVideoByIndex(index) {
        if (index < 0 || index >= this.state.media.videos.length) return;
        
        this.state.currentVideoIndex = index;
        const video = this.state.media.videos[index];
        
        // Save state before stopping
        this.state.wasImagePlayingBeforeVideo = this.state.isImagePlaying;
        this.state.wasSongPlayingBeforeVideo = this.state.isSongPlaying;
        
        // Stop slideshow
        if (this.state.isImagePlaying) {
            this.state.isImagePlaying = false;
            this.stopAutoAdvance();
            this.updatePlayPauseButton();
        }
        
        // Stop songs
        if (this.state.isSongPlaying) {
            this.audioPlayer.pause();
            this.state.isSongPlaying = false;
            this.updateSongPlayPauseButton();
        }
        
        // Close fullscreen image if open
        if (!this.fullscreenImageModal.classList.contains('hidden')) {
            this.closeFullscreenImage();
        }
        
        // Load and play video
        this.videoPlayer.src = video.path;
        this.videoOverlay.classList.remove('hidden');
        this.videoPlayer.play().catch(error => console.warn('⚠️ Video play failed:', error));
    }

    /**
     * Close video player
     */
    closeVideo() {
        this.videoOverlay.classList.add('hidden');
        this.videoPlayer.pause();
        this.videoPlayer.currentTime = 0;
    }

    /**
     * Video ended handler
     */
    onVideoEnded() {
        this.closeVideo();
        
        // Resume slideshow and songs if they were playing before video
        if (this.state.wasImagePlayingBeforeVideo) {
            this.state.isImagePlaying = true;
            this.updatePlayPauseButton();
            this.startAutoAdvance();
        }
        
        if (this.state.wasSongPlayingBeforeVideo) {
            this.audioPlayer.play().catch(error => console.warn('⚠️ Audio resume failed:', error));
            this.state.isSongPlaying = true;
            this.updateSongPlayPauseButton();
        }
    }

    // ============================================
    // FULLSCREEN FUNCTIONS
    // ============================================

    /**
     * Toggle fullscreen for current image
     */
    toggleFullscreenImage() {
        if (this.state.media.images.length === 0) return;
        
        const actualIndex = this.state.isImageShuffled 
            ? this.state.imageOrder[this.state.currentImageIndex] 
            : this.state.currentImageIndex;
        const image = this.state.media.images[actualIndex];
        
        this.fullscreenImageContent.src = image.path;
        this.fullscreenImageContent.alt = image.name;
        this.fullscreenImageCaption.textContent = image.name;
        
        this.fullscreenImageModal.classList.remove('hidden');
        this.fullscreenImageModal.classList.add('active');
        
        // Keep slideshow running during fullscreen
        console.log('🖼️ Fullscreen image opened');
    }

    /**
     * Close fullscreen image
     */
    closeFullscreenImage() {
        this.fullscreenImageModal.classList.add('hidden');
        this.fullscreenImageModal.classList.remove('active');
        console.log('🖼️ Fullscreen image closed');
    }

    /**
     * Toggle fullscreen for video using Fullscreen API
     */
    async toggleFullscreenVideo() {
        try {
            if (document.fullscreenElement) {
                // Exit fullscreen
                await document.exitFullscreen();
            } else {
                // Enter fullscreen
                await this.videoPlayer.requestFullscreen();
            }
        } catch (error) {
            console.warn('⚠️ Fullscreen not available:', error);
            // Fallback: Let native video controls handle it
        }
    }

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardShortcuts(e) {
        if (this.state.isWelcomeScreenActive) return;
        
        // Allow Escape key to close fullscreen
        if (e.code === 'Escape') {
            if (!this.fullscreenImageModal.classList.contains('hidden')) {
                this.closeFullscreenImage();
            }
            return;
        }
        
        // Handle navigation in fullscreen
        const isFullscreenActive = !this.fullscreenImageModal.classList.contains('hidden');
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.toggleImagePlayback();
                break;
            case 'ArrowRight':
                this.nextImage();
                if (isFullscreenActive) {
                    // Update fullscreen image when navigating
                    setTimeout(() => this.updateFullscreenImage(), 0);
                }
                break;
            case 'ArrowLeft':
                this.previousImage();
                if (isFullscreenActive) {
                    // Update fullscreen image when navigating
                    setTimeout(() => this.updateFullscreenImage(), 0);
                }
                break;
            case 'KeyL':
                this.toggleImageLoop();
                break;
            case 'KeyS':
                this.toggleImageShuffle();
                break;
            case 'KeyM':
                this.toggleMute();
                break;
            case 'KeyR':
                this.toggleRepeatMode();
                break;
            case 'KeyF':
                e.preventDefault();
                // Toggle fullscreen based on what's currently visible
                if (!this.videoOverlay.classList.contains('hidden')) {
                    this.toggleFullscreenVideo();
                } else {
                    this.toggleFullscreenImage();
                }
                break;
        }
    }
    
    /**
     * Update fullscreen image to match current slideshow image
     */
    updateFullscreenImage() {
        if (this.state.media.images.length === 0) return;
        
        const actualIndex = this.state.isImageShuffled 
            ? this.state.imageOrder[this.state.currentImageIndex] 
            : this.state.currentImageIndex;
        const image = this.state.media.images[actualIndex];
        
        this.fullscreenImageContent.src = image.path;
        this.fullscreenImageContent.alt = image.name;
        this.fullscreenImageCaption.textContent = image.name;
    }
}

// ============================================
// INITIALIZE APP
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 DOM loaded, initializing app...');
    window.app = new WeddingSlideshow();
    window.app.init();
});
