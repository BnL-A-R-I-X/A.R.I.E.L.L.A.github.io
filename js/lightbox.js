/**
 * Simple Lightbox Viewer
 * Opens clicked gallery image in a fullscreen overlay.
 */

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Opens lightbox with image and removes any blur filters
     * @param {string} imageSrc - Source path of the image
     * @param {string} altText - Alt text for the image
     */
    function openLightbox(imageSrc, altText) {
        let lightbox = document.getElementById('lightbox');
        
        if (!lightbox) {
            // Create lightbox if it doesn't exist
            lightbox = document.createElement('div');
            lightbox.id = 'lightbox';
            lightbox.onclick = (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            };
            document.body.appendChild(lightbox);
        }
        
        // Create image element with no filters
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = altText;
        img.style.filter = 'none'; // Remove any blur or other filters
        img.style.maxWidth = '90%';
        img.style.maxHeight = '90%';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 0 20px rgba(0, 230, 255, 0.7)';
        img.style.transition = 'transform 0.2s ease';
        
        img.onmouseover = () => img.style.transform = 'scale(1.02)';
        img.onmouseout = () => img.style.transform = 'scale(1)';
        
        lightbox.innerHTML = '';
        lightbox.appendChild(img);
        lightbox.classList.add('active');
        
        // Prevent body scrolling when lightbox is open
        document.body.style.overflow = 'hidden';
    }

    /**
     * Closes the lightbox and restores body scrolling
     */
    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Initialize lightbox close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    // Close lightbox when clicking outside the image
    document.addEventListener('click', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && e.target === lightbox) {
            closeLightbox();
        }
    });

    document.querySelectorAll('.gallery-grid img').forEach(image => {
        image.addEventListener('click', () => {
            openLightbox(image.src, image.alt);
        });
    });
});
