/**
 * Toggles NSFW gallery blur.
 */
function toggleNSFW() {
    const gallery = document.getElementById('nsfw-gallery');
    const btn = document.getElementById('nsfw-toggle-btn');
    
    if (gallery && btn) {
        if (gallery.classList.contains('nsfw-blur')) {
            gallery.classList.remove('nsfw-blur');
            btn.textContent = 'Hide NSFW';
        } else {
            gallery.classList.add('nsfw-blur');
            btn.textContent = 'Reveal NSFW';
        }
    }
}
