// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize gallery functionality if on gallery page
    if (document.querySelector('.gallery-grid')) {
        initializeGallery();
    }
    
    // Initialize comment system if comments section exists
    if (document.querySelector('.comments-section')) {
        initializeComments();
    }
});

// Gallery functionality
function initializeGallery() {
    // NSFW blur toggle
    document.querySelectorAll('.nsfw-item').forEach(item => {
        const img = item.querySelector('img');
        const warning = item.querySelector('.nsfw-warning');
        
        if (img && warning) {
            item.addEventListener('click', function() {
                img.classList.toggle('unblurred');
                warning.classList.toggle('hidden');
            });
        }
    });
    
    // Image modal/lightbox
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
}

// Image modal functionality
function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <img src="${src}" alt="${alt}">
                <div class="modal-caption">${alt}</div>
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
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeImageModal();
    });
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
}

// Comments functionality
function initializeComments() {
    const commentForm = document.querySelector('.comment-form');
    const commentsList = document.querySelector('.comments-list');
    
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }
    
    loadComments();
}

async function handleCommentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const comment = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    };
    
    try {
        await saveComment(comment);
        e.target.reset();
        loadComments();
        showNotification('Comment added successfully!', 'success');
    } catch (error) {
        console.error('Error saving comment:', error);
        showNotification('Error saving comment. Please try again.', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Loading state management
function showLoading(element) {
    if (element) {
        element.innerHTML = '<div class="loading-spinner"></div>';
    }
}

function hideLoading(element, content) {
    if (element) {
        element.innerHTML = content || '';
    }
}

// Local storage helpers for offline functionality
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// Image loading with fallback
function loadImageWithFallback(img, fallbackSrc = 'images/placeholder.jpg') {
    img.addEventListener('error', function() {
        this.src = fallbackSrc;
    });
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Gallery image management
function updateImageGallery(galleryType, images) {
    const gallery = document.querySelector(`[data-gallery="${galleryType}"]`);
    if (!gallery) return;
    
    const grid = gallery.querySelector('.gallery-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    images.forEach(image => {
        const item = document.createElement('div');
        item.className = `gallery-item ${image.nsfw ? 'nsfw-item' : ''}`;
        
        item.innerHTML = `
            <img src="${image.url}" alt="${image.title}" ${image.nsfw ? 'class="nsfw-blur"' : ''}>
            ${image.nsfw ? '<div class="nsfw-warning">NSFW Content<br>Click to View</div>' : ''}
        `;
        
        grid.appendChild(item);
    });
    
    // Reinitialize gallery functionality
    initializeGallery();
}

// Recent image display
function displayRecentImage(containerId, image) {
    const container = document.getElementById(containerId);
    if (!container || !image) return;
    
    container.innerHTML = `
        <div class="recent-image">
            <h3>Latest Addition</h3>
            <div class="image-container">
                <img src="${image.url}" alt="${image.title}">
                <div class="image-info">
                    <h4>${image.title}</h4>
                    <p>Added: ${formatDate(image.dateAdded)}</p>
                </div>
            </div>
        </div>
    `;
}
