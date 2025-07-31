/**
 * Simple Lightbox Viewer
 * Opens clicked gallery image in a fullscreen overlay.
 */

document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    document.body.appendChild(lightbox);

    const img = document.createElement('img');
    lightbox.appendChild(img);

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });

    document.querySelectorAll('.gallery-grid img').forEach(image => {
        image.addEventListener('click', () => {
            img.src = image.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scrolling
        });
    });
});
