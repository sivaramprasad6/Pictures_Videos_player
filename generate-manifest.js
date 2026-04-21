#!/usr/bin/env node

/**
 * Manifest Generator
 * Automatically generates manifest.json by scanning images/, videos/, and songs/ folders
 * Run: node generate-manifest.js
 */

const fs = require('fs');
const path = require('path');

const SUPPORTED_EXTENSIONS = {
    images: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    videos: ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'],
    songs: ['.mp3', '.ogg', '.wav', '.flac', '.aac', '.m4a']
};

const MEDIA_DIRS = {
    images: './wedding_data/images',
    videos: './wedding_data/videos',
    songs: './wedding_data/songs'
};

const OUTPUT_FILE = './wedding_data/manifest.json';

/**
 * Recursively scan directory for media files
 */
function scanDirectory(dir, mediaType) {
    const files = [];
    
    if (!fs.existsSync(dir)) {
        console.warn(`⚠️  Directory not found: ${dir}`);
        return files;
    }
    
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        const extensions = SUPPORTED_EXTENSIONS[mediaType] || [];
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                // Recursively scan subdirectories
                const subFiles = scanDirectory(fullPath, mediaType);
                files.push(...subFiles);
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (extensions.includes(ext)) {
                    // Store relative path from the media folder
                    const relativePath = path.relative(dir, fullPath).replace(/\\/g, '/');
                    files.push(relativePath);
                }
            }
        }
    } catch (error) {
        console.error(`❌ Error scanning ${dir}:`, error.message);
    }
    
    return files.sort();
}

/**
 * Generate and save manifest.json
 */
function generateManifest() {
    console.log('🔍 Scanning media directories...\n');
    
    const manifest = {
        images: scanDirectory(MEDIA_DIRS.images, 'images'),
        videos: scanDirectory(MEDIA_DIRS.videos, 'videos'),
        songs: scanDirectory(MEDIA_DIRS.songs, 'songs')
    };
    
    // Write manifest.json
    try {
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
        console.log(`✅ Manifest generated: ${OUTPUT_FILE}\n`);
        console.log(`📊 Summary:`);
        console.log(`   Images: ${manifest.images.length}`);
        console.log(`   Videos: ${manifest.videos.length}`);
        console.log(`   Songs:  ${manifest.songs.length}`);
    } catch (error) {
        console.error(`❌ Error writing manifest:`, error.message);
        process.exit(1);
    }
}

// Run generator
generateManifest();
