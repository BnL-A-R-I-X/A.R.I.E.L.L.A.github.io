// Commission Queue JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeCommissionQueue();
    initializeArtSuggestions();
    initializeFilters();
    
    // Load data
    loadCommissions();
    loadArtSuggestions();
    
    // Load comments for this page
    if (typeof window.loadComments === 'function') {
        window.loadComments();
    }
});

// Initialize commission queue functionality
function initializeCommissionQueue() {
    // Set up auto-refresh (every 5 minutes)
    setInterval(loadCommissions, 5 * 60 * 1000);
}

// Initialize art suggestions form
function initializeArtSuggestions() {
    const suggestionForm = document.getElementById('suggestion-form');
    
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', handleSuggestionSubmit);
    }
}

// Initialize filter functionality
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter commissions
            const filter = this.getAttribute('data-filter');
            filterCommissions(filter);
        });
    });
}

// Load commissions from database
async function loadCommissions() {
    const commissionList = document.getElementById('commission-list');
    if (!commissionList) return;
    
    try {
        showLoading(commissionList);
        
        let commissions = [];
        
        if (typeof window.firebaseDB?.getCommissions === 'function') {
            commissions = await window.firebaseDB.getCommissions();
        } else {
            // Fallback demo data
            commissions = getDemoCommissions();
        }
        
        displayCommissions(commissions);
        
    } catch (error) {
        console.error('Error loading commissions:', error);
        commissionList.innerHTML = '<p class="error-message">Error loading commissions. Please try again later.</p>';
    }
}

// Display commissions in the list
function displayCommissions(commissions) {
    const commissionList = document.getElementById('commission-list');
    
    if (commissions.length === 0) {
        commissionList.innerHTML = `
            <div class="no-commissions">
                <h3>No commissions in queue</h3>
                <p>Check back later for upcoming projects!</p>
            </div>
        `;
        return;
    }
    
    const commissionsHTML = commissions.map(commission => createCommissionHTML(commission)).join('');
    commissionList.innerHTML = commissionsHTML;
    
    // Add animation to new items
    setTimeout(() => {
        document.querySelectorAll('.commission-item').forEach(item => {
            item.classList.add('new');
        });
    }, 100);
}

// Create HTML for a single commission
function createCommissionHTML(commission) {
    const statusClass = commission.status.toLowerCase().replace(' ', '-');
    const progress = getProgressPercentage(commission.status);
    const formattedDate = formatDate(commission.createdAt || commission.updatedAt);
    
    return `
        <div class="commission-item ${statusClass}" data-status="${statusClass}">
            <div class="commission-header">
                <h3 class="commission-title">${sanitizeHTML(commission.title)}</h3>
                <span class="commission-status ${statusClass}">${commission.status}</span>
            </div>
            
            <div class="commission-meta">
                <span class="commission-artist">Artist: ${sanitizeHTML(commission.artist)}</span>
                <span class="commission-id">ID: #${commission.id?.slice(-6) || 'DEMO'}</span>
            </div>
            
            <div class="commission-description">
                ${sanitizeHTML(commission.description)}
            </div>
            
            ${progress > 0 ? `
                <div class="commission-progress">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            ` : ''}
            
            <div class="commission-date">
                ${commission.updatedAt ? 'Updated' : 'Added'}: ${formattedDate}
            </div>
        </div>
    `;
}

// Get progress percentage based on status
function getProgressPercentage(status) {
    switch (status.toLowerCase()) {
        case 'planning': return 15;
        case 'in progress': return 50;
        case 'completed': return 100;
        default: return 0;
    }
}

// Filter commissions by status
function filterCommissions(filter) {
    const commissionItems = document.querySelectorAll('.commission-item');
    
    commissionItems.forEach(item => {
        item.classList.add('filtering');
        
        setTimeout(() => {
            if (filter === 'all' || item.dataset.status === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        }, 150);
    });
}

// Handle art suggestion form submission
async function handleSuggestionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const suggestion = {
        name: formData.get('name'),
        email: formData.get('email'),
        title: formData.get('title'),
        description: formData.get('description'),
        character: formData.get('character'),
        timestamp: new Date().toISOString()
    };
    
    try {
        if (typeof window.firebaseDB?.saveArtSuggestion === 'function') {
            await window.firebaseDB.saveArtSuggestion(suggestion);
        } else {
            // Fallback - save to localStorage for demo
            saveToLocalStorage('artSuggestions', [
                ...getFromLocalStorage('artSuggestions') || [],
                { ...suggestion, id: Date.now().toString() }
            ]);
        }
        
        e.target.reset();
        showNotification('Art suggestion submitted successfully!', 'success');
        loadArtSuggestions();
        
    } catch (error) {
        console.error('Error saving art suggestion:', error);
        showNotification('Error submitting suggestion. Please try again.', 'error');
    }
}

// Load art suggestions
async function loadArtSuggestions() {
    const suggestionsDisplay = document.getElementById('suggestions-display');
    if (!suggestionsDisplay) return;
    
    try {
        showLoading(suggestionsDisplay);
        
        let suggestions = [];
        
        if (typeof window.firebaseDB?.getArtSuggestions === 'function') {
            suggestions = await window.firebaseDB.getArtSuggestions();
        } else {
            // Fallback demo data
            suggestions = getFromLocalStorage('artSuggestions') || getDemoSuggestions();
        }
        
        displayArtSuggestions(suggestions);
        
    } catch (error) {
        console.error('Error loading art suggestions:', error);
        suggestionsDisplay.innerHTML = '<p class="error-message">Error loading suggestions. Please try again later.</p>';
    }
}

// Display art suggestions
function displayArtSuggestions(suggestions) {
    const suggestionsDisplay = document.getElementById('suggestions-display');
    
    if (suggestions.length === 0) {
        suggestionsDisplay.innerHTML = '<p class="no-suggestions">No suggestions yet. Be the first to suggest an artwork!</p>';
        return;
    }
    
    const suggestionsHTML = suggestions.map(suggestion => createSuggestionHTML(suggestion)).join('');
    suggestionsDisplay.innerHTML = suggestionsHTML;
    
    // Add animation to new items
    setTimeout(() => {
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.classList.add('new');
        });
    }, 100);
}

// Create HTML for a single suggestion
function createSuggestionHTML(suggestion) {
    const formattedDate = formatDate(suggestion.createdAt || suggestion.timestamp);
    
    return `
        <div class="suggestion-item">
            <div class="suggestion-header">
                <h4 class="suggestion-title">${sanitizeHTML(suggestion.title)}</h4>
                <span class="suggestion-author">by ${sanitizeHTML(suggestion.name)}</span>
            </div>
            
            <div class="suggestion-description">
                ${sanitizeHTML(suggestion.description)}
            </div>
            
            ${suggestion.character ? `
                <span class="suggestion-character">${sanitizeHTML(suggestion.character)}</span>
            ` : ''}
            
            <div class="suggestion-date">
                Suggested: ${formattedDate}
            </div>
        </div>
    `;
}

// Demo data functions
function getDemoCommissions() {
    return [
        {
            id: 'demo1',
            title: 'Ariella Portrait Commission',
            artist: 'PixelMaster',
            description: 'A detailed portrait of Ariella in her signature outfit, featuring dynamic lighting and a mystical background.',
            status: 'In Progress',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
            id: 'demo2',
            title: 'Character Reference Sheet',
            artist: 'ArtisanDraw',
            description: 'Complete reference sheet showing multiple angles and expression variations for a new OC design.',
            status: 'Planning',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
            id: 'demo3',
            title: 'Fantasy Scene Illustration',
            artist: 'DreamCanvas',
            description: 'Epic fantasy scene featuring multiple characters in an enchanted forest setting with magical effects.',
            status: 'Completed',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
    ];
}

function getDemoSuggestions() {
    return [
        {
            id: 'suggestion1',
            name: 'ArtLover123',
            title: 'Ariella in Winter Setting',
            description: 'Would love to see Ariella in a beautiful winter landscape with snow falling around her!',
            character: 'ariella',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'suggestion2',
            name: 'FantasyFan',
            title: 'Group Art with All OCs',
            description: 'It would be amazing to see all your original characters together in one piece, maybe having a party or adventure!',
            character: 'other',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
}

// Search functionality for commissions
function initializeCommissionSearch() {
    const searchInput = document.getElementById('commission-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const commissionItems = document.querySelectorAll('.commission-item');
        
        commissionItems.forEach(item => {
            const title = item.querySelector('.commission-title').textContent.toLowerCase();
            const description = item.querySelector('.commission-description').textContent.toLowerCase();
            const artist = item.querySelector('.commission-artist').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm) || artist.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Sort commissions
function sortCommissions(sortBy) {
    const commissionList = document.getElementById('commission-list');
    const items = Array.from(commissionList.querySelectorAll('.commission-item'));
    
    items.sort((a, b) => {
        switch (sortBy) {
            case 'date':
                const dateA = new Date(a.querySelector('.commission-date').textContent.split(': ')[1]);
                const dateB = new Date(b.querySelector('.commission-date').textContent.split(': ')[1]);
                return dateB - dateA;
            case 'title':
                const titleA = a.querySelector('.commission-title').textContent;
                const titleB = b.querySelector('.commission-title').textContent;
                return titleA.localeCompare(titleB);
            case 'status':
                const statusOrder = { 'planning': 0, 'in-progress': 1, 'completed': 2 };
                const statusA = statusOrder[a.dataset.status] || 0;
                const statusB = statusOrder[b.dataset.status] || 0;
                return statusA - statusB;
            default:
                return 0;
        }
    });
    
    // Clear and re-append sorted items
    commissionList.innerHTML = '';
    items.forEach(item => commissionList.appendChild(item));
}

// Export functions for admin use
window.commissionQueue = {
    loadCommissions,
    loadArtSuggestions,
    filterCommissions,
    sortCommissions
};

// Auto-refresh indicator
function showRefreshIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'refresh-indicator';
    indicator.innerHTML = '🔄 Refreshing...';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        if (indicator.parentNode) {
            document.body.removeChild(indicator);
        }
    }, 2000);
}

// Add refresh indicator styles to the page
const refreshStyle = document.createElement('style');
refreshStyle.textContent = `
    .refresh-indicator {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-red);
        color: var(--primary-white);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); }
        to { transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(refreshStyle);
