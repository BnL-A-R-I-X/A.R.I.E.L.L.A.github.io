// Gallery-specific JavaScript functionality

// Gallery tab switching
document.addEventListener('DOMContentLoaded', function() {
    initializeGalleryTabs();
});

function initializeGalleryTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            galleryTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button and corresponding tab
            this.classList.add('active');
            document.getElementById(`${targetTab}-gallery`).classList.add('active');
            
            // Load gallery content if not already loaded
            loadGalleryContent(targetTab);
        });
    });
}

// Initialize character gallery
function initializeCharacterGallery(characterName) {
    // Load recent image
    loadRecentImage(characterName);
    
    // Load default gallery (SFW)
    loadGalleryContent('sfw', characterName);
    
    // Initialize comments
    if (typeof window.loadComments === 'function') {
        window.loadComments();
    }
}

// Load recent image for character
async function loadRecentImage(character) {
    const container = document.getElementById(`recent-${character}`);
    if (!container) return;
    
    try {
        if (typeof window.firebaseDB?.getRecentImage === 'function') {
            const recentImage = await window.firebaseDB.getRecentImage(character);
            
            if (recentImage) {
                displayRecentImage(`recent-${character}`, recentImage);
            } else {
                container.innerHTML = `
                    <div class="recent-image">
                        <h3>Latest Addition</h3>
                        <p class="no-recent">No images uploaded yet.</p>
                    </div>
                `;
            }
        } else {
            // Fallback for offline/demo mode
            container.innerHTML = `
                <div class="recent-image">
                    <h3>Latest Addition</h3>
                    <div class="image-container">
                        <div class="image-placeholder">Recent ${character} Art</div>
                        <div class="image-info">
                            <h4>Sample ${character} Artwork</h4>
                            <p>Added: ${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading recent image:', error);
        container.innerHTML = `
            <div class="recent-image">
                <h3>Latest Addition</h3>
                <p class="error-message">Error loading recent image.</p>
            </div>
        `;
    }
}

// Load gallery content
async function loadGalleryContent(category, character = null) {
    // If no character specified, try to get from current page
    if (!character) {
        character = getCurrentCharacter();
    }
    
    const gallery = document.querySelector(`[data-gallery="${category}"]`);
    if (!gallery) return;
    
    const grid = gallery.querySelector('.gallery-grid');
    if (!grid) return;
    
    // Show loading state
    showLoading(grid);
    
    try {
        if (typeof window.firebaseDB?.getGalleryImages === 'function') {
            const images = await window.firebaseDB.getGalleryImages(character, category);
            updateImageGallery(category, images);
        } else {
            // Fallback demo content
            loadDemoGalleryContent(category, grid);
        }
    } catch (error) {
        console.error(`Error loading ${category} gallery:`, error);
        grid.innerHTML = '<p class="error-message">Error loading gallery. Please try again later.</p>';
    }
}

// Load demo content for offline/demo mode
function loadDemoGalleryContent(category, grid) {
    const demoImages = {
        sfw: [
            { title: 'Portrait Study', url: 'images/demo/sfw1.jpg', nsfw: false },
            { title: 'Character Design', url: 'images/demo/sfw2.jpg', nsfw: false },
            { title: 'Scene Illustration', url: 'images/demo/sfw3.jpg', nsfw: false }
        ],
        nsfw: [
            { title: 'Adult Art 1', url: 'images/demo/nsfw1.jpg', nsfw: true },
            { title: 'Adult Art 2', url: 'images/demo/nsfw2.jpg', nsfw: true }
        ],
        reference: [
            { title: 'Character Sheet', url: 'images/demo/ref1.jpg', nsfw: false },
            { title: 'Color Reference', url: 'images/demo/ref2.jpg', nsfw: false }
        ]
    };
    
    const images = demoImages[category] || [];
    updateGalleryGrid(grid, images);
}

// Update gallery grid with images
function updateGalleryGrid(grid, images) {
    if (images.length === 0) {
        grid.innerHTML = '<p class="no-images">No images in this gallery yet.</p>';
        return;
    }
    
    grid.innerHTML = '';
    
    images.forEach(image => {
        const item = document.createElement('div');
        item.className = `gallery-item ${image.nsfw ? 'nsfw-item' : ''}`;
        
        item.innerHTML = `
            <img src="${image.url}" alt="${image.title}" ${image.nsfw ? 'class="nsfw-blur"' : ''} loading="lazy">
            ${image.nsfw ? '<div class="nsfw-warning">NSFW Content<br>Click to View</div>' : ''}
        `;
        
        grid.appendChild(item);
    });
    
    // Initialize gallery interactions
    initializeGalleryInteractions(grid);
}

// Initialize gallery interactions (NSFW blur, modal, etc.)
function initializeGalleryInteractions(container) {
    // NSFW blur toggle
    container.querySelectorAll('.nsfw-item').forEach(item => {
        const img = item.querySelector('img');
        const warning = item.querySelector('.nsfw-warning');
        
        if (img && warning) {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                img.classList.toggle('unblurred');
                warning.classList.toggle('hidden');
            });
        }
    });
    
    // Image modal for non-NSFW or unblurred images
    container.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', function(e) {
            // Only open modal if image is not blurred
            if (!this.classList.contains('nsfw-blur') || this.classList.contains('unblurred')) {
                e.stopPropagation();
                openImageModal(this.src, this.alt);
            }
        });
    });
}

// Get current character from URL or page
function getCurrentCharacter() {
    const path = window.location.pathname;
    if (path.includes('ariella')) {
        return 'ariella';
    } else if (path.includes('other-ocs')) {
        return 'other-ocs';
    }
    return 'unknown';
}

// Enhanced image modal with navigation
function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop">
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <img src="${src}" alt="${alt}" loading="lazy">
                <div class="modal-caption">${alt}</div>
                <div class="modal-actions">
                    <button class="modal-download btn btn-secondary" onclick="downloadImage('${src}', '${alt}')">
                        Download
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal events
    modal.querySelector('.modal-close').addEventListener('click', closeImageModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', function(e) {
        if (e.target === this) closeImageModal();
    });
    
    // Close on escape key
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    // Animate modal in
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.classList.add('closing');
        setTimeout(() => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Download image function
function downloadImage(src, filename) {
    const link = document.createElement('a');
    link.href = src;
    link.download = filename.replace(/\s+/g, '_') + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Gallery upload function (for admin use)
async function uploadImageToGallery(imageFile, metadata) {
    try {
        // This would typically upload to a cloud storage service
        // For GitHub Pages, we'll use a local directory structure
        
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('metadata', JSON.stringify(metadata));
        
        // Save metadata to Firebase
        if (typeof window.firebaseDB?.saveImageMetadata === 'function') {
            await window.firebaseDB.saveImageMetadata({
                ...metadata,
                url: `images/gallery/${metadata.character}/${metadata.category}/${imageFile.name}`,
                filename: imageFile.name,
                size: imageFile.size,
                type: imageFile.type
            });
        }
        
        showNotification('Image uploaded successfully!', 'success');
        
        // Reload the gallery
        loadGalleryContent(metadata.category, metadata.character);
        
    } catch (error) {
        console.error('Error uploading image:', error);
        showNotification('Error uploading image. Please try again.', 'error');
    }
}

// Lazy loading implementation for gallery images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
}

// Gallery search and filter functionality
function initializeGallerySearch() {
    const searchInput = document.getElementById('gallery-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            const alt = img ? img.alt.toLowerCase() : '';
            
            if (alt.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Touch/swipe support for mobile galleries
function initializeTouchSupport() {
    let startX, startY, isDown = false;
    
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDown = true;
        });
        
        item.addEventListener('touchmove', function(e) {
            if (!isDown) return;
            e.preventDefault();
        });
        
        item.addEventListener('touchend', function(e) {
            if (!isDown) return;
            isDown = false;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // If it's more of a tap than a swipe
            if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
                this.click();
            }
        });
    });
}

// Initialize all gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    initializeGallerySearch();
    initializeTouchSupport();
});

// Make functions available globally
window.initializeCharacterGallery = initializeCharacterGallery;
window.loadGalleryContent = loadGalleryContent;
window.uploadImageToGallery = uploadImageToGallery;
