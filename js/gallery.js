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

    files.forEach(file => {
        const img = document.createElement('img');
        img.src = path + file;
        img.alt = file;
        container.appendChild(img);
    });
}

/**
 * Loads all three galleries for a character page.
 * @param {string} basePath - Base path to the character's images folder.
 * @param {object} imageLists - Object containing refs, sfw, nsfw arrays.
 */
function loadCharacterGalleries(basePath, imageLists) {
    loadGallery(`${basePath}/refs/`, 'refs-gallery', imageLists.refs);
    loadGallery(`${basePath}/sfw/`, 'sfw-gallery', imageLists.sfw);
    loadGallery(`${basePath}/nsfw/`, 'nsfw-gallery', imageLists.nsfw);
}
