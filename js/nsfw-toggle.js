/**
 * Toggles NSFW gallery blur.
 */
function toggleNSFW(formType = '') {
    let galleryId, btnId;
    
    if (formType === 'human') {
        galleryId = 'human-nsfw-gallery';
        btnId = 'human-nsfw-toggle-btn';
    } else if (formType === 'anthro') {
        galleryId = 'anthro-nsfw-gallery';
        btnId = 'anthro-nsfw-toggle-btn';
    } else {
        // Default behavior for single gallery pages
        galleryId = 'nsfw-gallery';
        btnId = 'nsfw-toggle-btn';
    }
    
    const gallery = document.getElementById(galleryId);
    const btn = document.getElementById(btnId);
    
    if (gallery && btn) {
        if (gallery.classList.contains('nsfw-blur')) {
            gallery.classList.remove('nsfw-blur');
            btn.textContent = btn.textContent.replace('Reveal', 'Hide');
        } else {
            gallery.classList.add('nsfw-blur');
            btn.textContent = btn.textContent.replace('Hide', 'Reveal');
        }
    }
}
