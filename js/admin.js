// Admin Panel JavaScript

const ADMIN_PIN = '3272';
let currentPin = '';
let isAuthenticated = false;

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initializePinEntry();
    initializeAdminPanel();
});

// Check if user is already authenticated
function checkAuthentication() {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
        isAuthenticated = true;
        showAdminPanel();
    }
}

// Initialize PIN entry functionality
function initializePinEntry() {
    const pinButtons = document.querySelectorAll('.pin-btn');
    const clearBtn = document.querySelector('.clear-btn');
    const submitBtn = document.querySelector('.submit-btn');
    
    pinButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const digit = this.getAttribute('data-digit');
            
            if (digit) {
                addDigit(digit);
            } else if (this.classList.contains('clear-btn')) {
                clearPin();
            } else if (this.classList.contains('submit-btn')) {
                submitPin();
            }
        });
    });
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (!isAuthenticated) {
            if (e.key >= '0' && e.key <= '9') {
                addDigit(e.key);
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                clearPin();
            } else if (e.key === 'Enter') {
                submitPin();
            }
        }
    });
}

// Add digit to PIN
function addDigit(digit) {
    if (currentPin.length < 4) {
        currentPin += digit;
        updatePinDisplay();
    }
}

// Clear PIN
function clearPin() {
    currentPin = '';
    updatePinDisplay();
    hidePinError();
}

// Update PIN display
function updatePinDisplay() {
    for (let i = 1; i <= 4; i++) {
        const digitElement = document.getElementById(`digit-${i}`);
        if (i <= currentPin.length) {
            digitElement.textContent = '•';
            digitElement.classList.add('filled');
        } else {
            digitElement.textContent = '';
            digitElement.classList.remove('filled');
        }
    }
}

// Submit PIN
function submitPin() {
    if (currentPin.length !== 4) {
        showPinError('Please enter a 4-digit PIN');
        return;
    }
    
    if (currentPin === ADMIN_PIN) {
        isAuthenticated = true;
        sessionStorage.setItem('adminAuthenticated', 'true');
        showAdminPanel();
    } else {
        showPinError('Incorrect PIN. Please try again.');
        shakePinDisplay();
        clearPin();
    }
}

// Show PIN error
function showPinError(message) {
    const errorElement = document.getElementById('pin-error');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

// Hide PIN error
function hidePinError() {
    const errorElement = document.getElementById('pin-error');
    errorElement.classList.add('hidden');
}

// Shake PIN display for incorrect entry
function shakePinDisplay() {
    const pinDisplay = document.querySelector('.pin-display');
    pinDisplay.classList.add('shake');
    setTimeout(() => {
        pinDisplay.classList.remove('shake');
    }, 500);
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('pin-screen').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('revealed');
    
    // Load admin data
    loadAdminData();
}

// Initialize admin panel functionality
function initializeAdminPanel() {
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Tab switching
    initializeAdminTabs();
    
    // Form submissions
    initializeAdminForms();
    
    // Comment management
    initializeCommentManagement();
}

// Logout function
function logout() {
    isAuthenticated = false;
    sessionStorage.removeItem('adminAuthenticated');
    currentPin = '';
    updatePinDisplay();
    hidePinError();
    
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('pin-screen').classList.remove('hidden');
}

// Initialize admin tabs
function initializeAdminTabs() {
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button and corresponding tab
            this.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // Load tab-specific data
            loadTabData(targetTab);
        });
    });
}

// Initialize admin forms
function initializeAdminForms() {
    // Commission form
    const commissionForm = document.getElementById('commission-form');
    if (commissionForm) {
        commissionForm.addEventListener('submit', handleCommissionSubmit);
    }
    
    // Image upload form
    const imageUploadForm = document.getElementById('image-upload-form');
    if (imageUploadForm) {
        imageUploadForm.addEventListener('submit', handleImageUpload);
    }
}

// Handle commission form submission
async function handleCommissionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const commission = {
        title: formData.get('title'),
        artist: formData.get('artist'),
        description: formData.get('description'),
        status: formData.get('status')
    };
    
    try {
        if (typeof window.firebaseDB?.saveCommission === 'function') {
            await window.firebaseDB.saveCommission(commission);
        } else {
            // Fallback for demo mode
            console.log('Commission saved (demo):', commission);
        }
        
        showAdminMessage('Commission added successfully!', 'success');
        e.target.reset();
        
        // Refresh commission list if on queue page
        if (typeof window.commissionQueue?.loadCommissions === 'function') {
            window.commissionQueue.loadCommissions();
        }
        
    } catch (error) {
        console.error('Error saving commission:', error);
        showAdminMessage('Error saving commission. Please try again.', 'error');
    }
}

// Handle image upload
async function handleImageUpload(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const imageFile = formData.get('image-file');
    
    if (!imageFile) {
        showAdminMessage('Please select an image file.', 'error');
        return;
    }
    
    const metadata = {
        title: formData.get('title'),
        character: formData.get('character'),
        category: formData.get('category'),
        nsfw: formData.get('nsfw') === 'on'
    };
    
    try {
        if (typeof window.uploadImageToGallery === 'function') {
            await window.uploadImageToGallery(imageFile, metadata);
        } else {
            // Demo mode - just show success
            console.log('Image uploaded (demo):', metadata);
        }
        
        showAdminMessage('Image uploaded successfully!', 'success');
        e.target.reset();
        updateGalleryStats();
        
    } catch (error) {
        console.error('Error uploading image:', error);
        showAdminMessage('Error uploading image. Please try again.', 'error');
    }
}

// Initialize comment management
function initializeCommentManagement() {
    const commentFilters = document.querySelectorAll('#comments-tab .filter-btn');
    
    commentFilters.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            commentFilters.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter comments
            const filter = this.getAttribute('data-filter');
            loadComments(filter);
        });
    });
}

// Load admin data
function loadAdminData() {
    loadComments('pending');
    loadArtSuggestions();
    updateGalleryStats();
}

// Load tab-specific data
function loadTabData(tab) {
    switch (tab) {
        case 'comments':
            loadComments('pending');
            break;
        case 'suggestions':
            loadArtSuggestions();
            break;
        case 'gallery':
            updateGalleryStats();
            break;
    }
}

// Load comments for admin management
async function loadComments(filter = 'pending') {
    const commentsList = document.getElementById('admin-comments-list');
    if (!commentsList) return;
    
    try {
        showLoading(commentsList);
        
        // This would typically load from Firebase with admin permissions
        // For now, we'll use demo data
        const comments = getDemoComments(filter);
        
        displayAdminComments(comments);
        
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsList.innerHTML = '<p class="error-message">Error loading comments.</p>';
    }
}

// Display comments in admin panel
function displayAdminComments(comments) {
    const commentsList = document.getElementById('admin-comments-list');
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">No comments found.</p>';
        return;
    }
    
    const commentsHTML = comments.map(comment => createAdminCommentHTML(comment)).join('');
    commentsList.innerHTML = commentsHTML;
    
    // Add event listeners for comment actions
    addCommentActionListeners();
}

// Create HTML for admin comment display
function createAdminCommentHTML(comment) {
    const formattedDate = formatDate(comment.createdAt || comment.timestamp);
    
    return `
        <div class="admin-comment-item" data-id="${comment.id}">
            <div class="admin-comment-header">
                <div class="admin-comment-meta">
                    <div class="admin-comment-author">${sanitizeHTML(comment.name)}</div>
                    <div class="admin-comment-date">${formattedDate}</div>
                    <div class="admin-comment-page">Page: ${comment.page}</div>
                </div>
                <div class="admin-comment-actions">
                    ${!comment.approved ? `
                        <button class="btn btn-primary approve-btn" data-id="${comment.id}">Approve</button>
                    ` : ''}
                    <button class="btn btn-secondary delete-btn" data-id="${comment.id}">Delete</button>
                </div>
            </div>
            
            <div class="admin-comment-message">
                ${sanitizeHTML(comment.message)}
            </div>
            
            <span class="admin-comment-status ${comment.approved ? 'approved' : 'pending'}">
                ${comment.approved ? 'Approved' : 'Pending'}
            </span>
        </div>
    `;
}

// Add event listeners for comment actions
function addCommentActionListeners() {
    // Approve buttons
    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const commentId = this.getAttribute('data-id');
            approveComment(commentId);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const commentId = this.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this comment?')) {
                deleteComment(commentId);
            }
        });
    });
}

// Approve comment
async function approveComment(commentId) {
    try {
        // This would update the comment in Firebase
        console.log('Approving comment:', commentId);
        
        showAdminMessage('Comment approved successfully!', 'success');
        
        // Refresh the comments list
        const activeFilter = document.querySelector('#comments-tab .filter-btn.active').getAttribute('data-filter');
        loadComments(activeFilter);
        
    } catch (error) {
        console.error('Error approving comment:', error);
        showAdminMessage('Error approving comment.', 'error');
    }
}

// Delete comment
async function deleteComment(commentId) {
    try {
        // This would delete the comment from Firebase
        console.log('Deleting comment:', commentId);
        
        showAdminMessage('Comment deleted successfully!', 'success');
        
        // Refresh the comments list
        const activeFilter = document.querySelector('#comments-tab .filter-btn.active').getAttribute('data-filter');
        loadComments(activeFilter);
        
    } catch (error) {
        console.error('Error deleting comment:', error);
        showAdminMessage('Error deleting comment.', 'error');
    }
}

// Load art suggestions for admin
async function loadArtSuggestions() {
    const suggestionsList = document.getElementById('admin-suggestions-list');
    if (!suggestionsList) return;
    
    try {
        showLoading(suggestionsList);
        
        let suggestions = [];
        
        if (typeof window.firebaseDB?.getArtSuggestions === 'function') {
            suggestions = await window.firebaseDB.getArtSuggestions();
        } else {
            suggestions = getFromLocalStorage('artSuggestions') || [];
        }
        
        displayAdminSuggestions(suggestions);
        
    } catch (error) {
        console.error('Error loading art suggestions:', error);
        suggestionsList.innerHTML = '<p class="error-message">Error loading suggestions.</p>';
    }
}

// Display art suggestions in admin panel
function displayAdminSuggestions(suggestions) {
    const suggestionsList = document.getElementById('admin-suggestions-list');
    
    if (suggestions.length === 0) {
        suggestionsList.innerHTML = '<p class="no-suggestions">No art suggestions found.</p>';
        return;
    }
    
    const suggestionsHTML = suggestions.map(suggestion => createAdminSuggestionHTML(suggestion)).join('');
    suggestionsList.innerHTML = suggestionsHTML;
}

// Create HTML for admin suggestion display
function createAdminSuggestionHTML(suggestion) {
    const formattedDate = formatDate(suggestion.createdAt || suggestion.timestamp);
    
    return `
        <div class="admin-suggestion-item" data-id="${suggestion.id}">
            <div class="admin-suggestion-header">
                <h4 class="admin-suggestion-title">${sanitizeHTML(suggestion.title)}</h4>
                <span class="admin-suggestion-author">by ${sanitizeHTML(suggestion.name)}</span>
            </div>
            
            <div class="admin-suggestion-description">
                ${sanitizeHTML(suggestion.description)}
            </div>
            
            <div class="admin-suggestion-meta">
                ${suggestion.character ? `
                    <span class="admin-suggestion-character">${sanitizeHTML(suggestion.character)}</span>
                ` : ''}
                <span class="admin-suggestion-date">${formattedDate}</span>
            </div>
            
            <div class="admin-suggestion-actions">
                <button class="btn btn-primary" onclick="createCommissionFromSuggestion('${suggestion.id}')">
                    Create Commission
                </button>
                <button class="btn btn-secondary" onclick="deleteSuggestion('${suggestion.id}')">
                    Delete
                </button>
            </div>
        </div>
    `;
}

// Update gallery statistics
function updateGalleryStats() {
    // This would typically query the database for actual counts
    // For demo, we'll use placeholder values
    document.getElementById('sfw-count').textContent = '12';
    document.getElementById('nsfw-count').textContent = '8';
    document.getElementById('ref-count').textContent = '5';
}

// Show admin message
function showAdminMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the active tab
    const activeTab = document.querySelector('.admin-tab-content.active');
    if (activeTab) {
        activeTab.insertBefore(messageDiv, activeTab.firstChild);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }
}

// Demo data functions
function getDemoComments(filter) {
    const allComments = [
        {
            id: 'comment1',
            name: 'User1',
            message: 'Great artwork! Love the style.',
            page: '/ocs/ariella.html',
            approved: filter === 'approved' || filter === 'all',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
            id: 'comment2',
            name: 'ArtFan',
            message: 'Amazing commission queue! Can\'t wait to see more.',
            page: '/commission-queue.html',
            approved: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
    ];
    
    switch (filter) {
        case 'pending':
            return allComments.filter(c => !c.approved);
        case 'approved':
            return allComments.filter(c => c.approved);
        default:
            return allComments;
    }
}

// Global functions for suggestion actions
window.createCommissionFromSuggestion = function(suggestionId) {
    // Switch to commission tab and pre-fill form
    document.querySelector('[data-tab="commissions"]').click();
    
    // This would typically get the suggestion data and pre-fill the form
    showAdminMessage('Commission tab opened. Please fill in the details.', 'info');
};

window.deleteSuggestion = function(suggestionId) {
    if (confirm('Are you sure you want to delete this suggestion?')) {
        console.log('Deleting suggestion:', suggestionId);
        showAdminMessage('Suggestion deleted successfully!', 'success');
        loadArtSuggestions();
    }
};
