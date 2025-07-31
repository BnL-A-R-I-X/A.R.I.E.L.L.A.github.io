/**
 * Toggles NSFW gallery blur.
 */
function toggleNSFW() {
    const nsfwGallery = document.getElementById('nsfw-gallery');
    const button = document.getElementById('nsfw-toggle-btn');

    if (!nsfwGallery) return;

    nsfwGallery.classList.toggle('revealed');

    if (nsfwGallery.classList.contains('revealed')) {
        button.textContent = "Hide NSFW";
    } else {
        button.textContent = "Reveal NSFW";
    }
}
