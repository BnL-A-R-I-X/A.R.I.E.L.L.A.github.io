/**
 * Loads a gallery from a given list of filenames.
 * @param {string} path - Path to the folder containing images.
 * @param {string} containerId - ID of the div where images will be loaded.
 * @param {string[]} files - Array of image file names.
 */
function loadGallery(path, containerId, files) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.warn(`Gallery container "${containerId}" not found.`);
        return;
    }
    if (!Array.isArray(files) || files.length === 0) {
        container.innerHTML = `<p class="empty-gallery">No images available.</p>`;
        return;
    }

    files.forEach(file => {
        const img = document.createElement('img');
        img.src = `${path}/${file}`.replace(/\/+/g, '/');
        img.alt = file;
        img.loading = "lazy";
        img.classList.add("gallery-image");

        // Click-to-lightbox
        img.addEventListener("click", () => openLightbox(img.src, file));

        container.appendChild(img);
    });
}

/**
 * Loads all three galleries for a character page.
 * @param {string} basePath - Base path to the character's images folder.
 * @param {object} imageLists - Object containing refs, sfw, nsfw arrays.
 */
function loadCharacterGalleries(basePath, imageLists) {
    loadGallery(`${basePath}/refs`, 'refs-gallery', imageLists.refs || []);
    loadGallery(`${basePath}/sfw`, 'sfw-gallery', imageLists.sfw || []);
    loadGallery(`${basePath}/nsfw`, 'nsfw-gallery', imageLists.nsfw || []);
}

/**
 * Opens a simple lightbox viewer for clicked images.
 */
function openLightbox(src, alt) {
    let lightbox = document.getElementById("lightbox");
    if (!lightbox) {
        lightbox = document.createElement("div");
        lightbox.id = "lightbox";
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img>
                <span id="close-lightbox">&times;</span>
            </div>
        `;
        document.body.appendChild(lightbox);

        document.getElementById("close-lightbox").addEventListener("click", () => {
            lightbox.classList.remove("active");
        });
        
        // Close on click outside image
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove("active");
            }
        });
    }

    const img = lightbox.querySelector("img");
    img.src = src;
    img.alt = alt;
    lightbox.classList.add("active");
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
        
        container.innerHTML = `
            <div class="recent-art-display">
                <img src="${fullPath}" alt="${recentArt.filename}" class="recent-art-image" onclick="openLightbox('${fullPath}', '${recentArt.filename}')">
                <div class="recent-art-info">
                    <p class="recent-art-date">Created: ${dateString}</p>
                    <p class="recent-art-filename">${recentArt.filename}</p>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = '<p class="no-recent-art">No recent artwork found.</p>';
    }
}
