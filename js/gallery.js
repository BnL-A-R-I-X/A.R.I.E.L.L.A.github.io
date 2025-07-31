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

        img.onerror = function() {
            this.style.display = 'none';
            console.warn(`Failed to load image: ${this.src}`);
        };

        img.addEventListener("click", () => openLightbox(img.src, file));
        container.appendChild(img);
    });
}

/**
 * Loads all galleries for a character page - all images in single directory
 * @param {string} basePath - Base path to the character's images folder.
 * @param {object} imageLists - Object containing refs, sfw, nsfw arrays.
 */
function loadCharacterGalleries(basePath, imageLists) {
    // Load all from single images directory
    loadGallery(basePath, 'refs-gallery', imageLists.refs || []);
    loadGallery(basePath, 'sfw-gallery', imageLists.sfw || []);
    loadGallery(basePath, 'nsfw-gallery', imageLists.nsfw || []);
}

/**
 * Opens a simple lightbox viewer for clicked images.
 */
function openLightbox(src, alt) {
    let lightbox = document.getElementById("lightbox");
    if (!lightbox) {
        lightbox = document.createElement("div");
        lightbox.id = "lightbox";
        lightbox.innerHTML = `<img><span id="close-lightbox">&times;</span>`;
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

    lightbox.querySelector("img").src = src;
    lightbox.querySelector("img").alt = alt;
    lightbox.classList.add("active");
}
