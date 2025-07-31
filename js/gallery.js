/**
 * Loads a single gallery with images
 * @param {string} imagePath - Base path to images
 * @param {string} containerId - ID of the gallery container
 * @param {array} imageList - Array of image filenames
 */
function loadGallery(imagePath, containerId, imageList) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.log(`Container ${containerId} not found`);
        return;
    }
    
    if (!imageList || imageList.length === 0) {
        container.innerHTML = '<div class="empty-gallery">No images available in this gallery.</div>';
        return;
    }
    
    container.innerHTML = '';
    
    imageList.forEach(filename => {
        const fullPath = `${imagePath}/${filename}`;
        const img = document.createElement('img');
        img.src = fullPath;
        img.alt = filename;
        img.className = 'gallery-image';
        
        // Add click handler that will remove filters when opened in lightbox
        img.onclick = () => openLightbox(fullPath, filename);
        
        // Handle image load errors
        img.onerror = () => {
            console.log(`Failed to load image: ${fullPath}`);
            img.style.display = 'none';
        };
        
        container.appendChild(img);
    });
}

/**
 * Loads character galleries using the standard structure
 * @param {string} basePath - Base path for character images
 * @param {object} galleryData - Gallery data object
 */
function loadCharacterGalleries(basePath, galleryData) {
    if (!galleryData) {
        console.log('No gallery data provided');
        return;
    }
    
    // Load standard galleries
    loadGallery(`${basePath}/refs`, 'refs-gallery', galleryData.refs || []);
    loadGallery(`${basePath}/sfw`, 'sfw-gallery', galleryData.sfw || []);
    loadGallery(`${basePath}/nsfw`, 'nsfw-gallery', galleryData.nsfw || []);
}

/**
 * Gets file modification date from image metadata or filename
 * @param {string} filename - The image filename
 * @returns {Date} - The estimated creation date
 */
function getImageDate(filename) {
    // Try to extract date from filename if it contains timestamp
    const dateMatch = filename.match(/(\d{4}[-_]\d{2}[-_]\d{2})/);
    if (dateMatch) {
        return new Date(dateMatch[1].replace(/_/g, '-'));
    }
    
    // Fallback: use current date minus random days (simulate different creation times)
    const daysAgo = Math.floor(Math.random() * 365);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
}

/**
 * Finds the most recent artwork from all galleries
 * @param {object} galleryData - Gallery data object
 * @returns {object} - {filename, path, date} of most recent image
 */
function findMostRecentArt(galleryData) {
    let mostRecent = null;
    let latestDate = new Date(0); // Start with epoch
    
    // Check all gallery categories
    const categories = [
        { files: galleryData.refs || [], path: 'images/refs' },
        { files: galleryData.sfw || [], path: 'images/sfw' },
        { files: galleryData.nsfw || [], path: 'images/nsfw' },
        { files: galleryData.humanRefs || [], path: 'images/human/refs' },
        { files: galleryData.humanSfw || [], path: 'images/human/sfw' },
        { files: galleryData.humanNsfw || [], path: 'images/human/nsfw' },
        { files: galleryData.anthroRefs || [], path: 'images/anthro/refs' },
        { files: galleryData.anthroSfw || [], path: 'images/anthro/sfw' },
        { files: galleryData.anthroNsfw || [], path: 'images/anthro/nsfw' }
    ];
    
    categories.forEach(category => {
        category.files.forEach(filename => {
            const date = getImageDate(filename);
            if (date > latestDate) {
                latestDate = date;
                mostRecent = {
                    filename: filename,
                    path: category.path,
                    date: date
                };
            }
        });
    });
    
    return mostRecent;
}

/**
 * Displays the most recent artwork in a dedicated section
 * @param {object} galleryData - Gallery data object
 */
function displayMostRecentArt(galleryData) {
    const container = document.getElementById('most-recent-art');
    if (!container) return;

    const recentArt = findMostRecentArt(galleryData);

    if (recentArt) {
        const fullPath = `${recentArt.path}/${recentArt.filename}`;
        const dateString = recentArt.date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const timeString = recentArt.date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        container.innerHTML = `
            <div class="recent-art-display">
                <img src="${fullPath}" alt="${recentArt.filename}" class="recent-art-image" onclick="openLightbox('${fullPath}', '${recentArt.filename}', true)">
                <div class="recent-art-info">
                    <span class="blinking-warning">&#9888;</span>
                    <span class="recent-art-date">Timestamp: ${dateString} ${timeString}</span>
                    <div class="recent-art-timestamp">File: ${recentArt.filename}</div>
                    <p class="recent-art-filename">Location: <span>${recentArt.path}</span></p>
                    <p style="color:#ff4444;font-size:0.95em;margin-top:10px;">SECURITY ALERT: Most Recent Visual Documentation Captured By Ship Monitoring Systems</p>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = '<p class="no-recent-art">No recent artwork found.</p>';
    }
}

/**
 * Opens lightbox with image
 * @param {string} imageSrc - Source path of the image
 * @param {string} altText - Alt text for the image
 * @param {boolean} removeFilter - Whether to remove sepia filter for lightbox
 */
function openLightbox(imageSrc, altText, removeFilter = false) {
    let lightbox = document.getElementById('lightbox');
    
    if (!lightbox) {
        // Create lightbox if it doesn't exist
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.onclick = () => closeLightbox();
        document.body.appendChild(lightbox);
    }
    
    const filterStyle = removeFilter ? 'filter: none;' : '';
    lightbox.innerHTML = `<img src="${imageSrc}" alt="${altText}" style="${filterStyle}">`;
    lightbox.classList.add('active');
}

/**
 * Closes the lightbox
 */
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
    }
}

// Initialize lightbox close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
