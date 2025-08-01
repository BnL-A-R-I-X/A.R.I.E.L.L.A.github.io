/**
 * Commission Queue Viewer V2
 * Clean public interface for viewing commission queue
 */

class CommissionQueueV2 {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        
        // Wait for commission system to be ready and loaded
        const waitForSystemAndRender = () => {
            if (window.commissionSystemV2 && window.commissionSystemV2.firebaseReady) {
                console.log('📋 Commission system ready, rendering queue...');
                this.renderQueue();
                this.renderFutureArtists();
            } else {
                console.log('📋 Waiting for commission system to be ready...');
                setTimeout(waitForSystemAndRender, 1000);
            }
        };
        
        waitForSystemAndRender();
        
        console.log('📋 Commission Queue V2 initialized');
    }

    setupEventListeners() {
        // Wait for commission system to be ready before setting up listeners
        const waitForSystemAndSetupListeners = () => {
            if (window.commissionSystemV2 && window.commissionSystemV2.firebaseReady) {
                console.log('📋 Setting up commission system listeners...');
                window.commissionSystemV2.addListener((action) => {
                    console.log('📋 Commission system event:', action);
                    this.renderQueue();
                    this.renderFutureArtists();
                });
            } else {
                setTimeout(waitForSystemAndSetupListeners, 1000);
            }
        };
        
        waitForSystemAndSetupListeners();

        // Search functionality
        const searchInput = document.getElementById('queue-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Filter functionality
        const filterSelect = document.getElementById('queue-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => this.handleFilter(e.target.value));
        }
    }

    renderQueue() {
        const container = document.getElementById('commission-queue');
        if (!container) {
            console.warn('⚠️ Commission queue container not found');
            return;
        }

        console.log('🔄 Rendering commission queue...');

        if (!window.commissionSystemV2) {
            console.warn('⚠️ Commission system not available for queue');
            container.innerHTML = `
                <div class="system-not-ready">
                    <h3>⚠️ System Initializing</h3>
                    <p>Commission system is loading. Please wait a moment and try refreshing.</p>
                    <button onclick="location.reload()" class="retry-btn">🔄 Refresh Page</button>
                </div>
            `;
            return;
        }

        if (!window.commissionSystemV2.firebaseReady) {
            container.innerHTML = `
                <div class="system-not-ready">
                    <h3>🔄 Connecting to Database</h3>
                    <p>Establishing connection to the commission database...</p>
                    <button onclick="refreshQueue()" class="retry-btn">🔄 Retry Connection</button>
                </div>
            `;
            return;
        }

        const commissions = window.commissionSystemV2.getPublicCommissions();
        console.log(`📋 Found ${commissions.length} public commissions to display`);
        
        if (commissions.length === 0) {
            container.innerHTML = `
                <div class="empty-queue">
                    <h3>🎨 No Public Commissions</h3>
                    <p>The commission queue is currently empty or all commissions are set to private.</p>
                    <p><small>If you expect to see commissions here, try clicking "Refresh Queue" above.</small></p>
                </div>
            `;
            return;
        }

        // Group by status
        const grouped = this.groupCommissionsByStatus(commissions);
        
        let html = '';
        
        // Render each status group
        if (grouped.planning.length > 0) {
            html += this.renderStatusSection('📋 Planning', grouped.planning, 'planning');
        }
        
        if (grouped['in-progress'].length > 0) {
            html += this.renderStatusSection('🎨 In Progress', grouped['in-progress'], 'in-progress');
        }
        
        if (grouped.completed.length > 0) {
            html += this.renderStatusSection('✅ Completed', grouped.completed, 'completed');
        }

        container.innerHTML = html;
    }

    groupCommissionsByStatus(commissions) {
        return commissions.reduce((groups, commission) => {
            const status = commission.status || 'planning';
            if (!groups[status]) groups[status] = [];
            groups[status].push(commission);
            return groups;
        }, {
            planning: [],
            'in-progress': [],
            completed: []
        });
    }

    renderStatusSection(title, commissions, status) {
        const cardsHTML = commissions.map(commission => this.renderQueueCard(commission)).join('');
        
        return `
            <div class="queue-section" data-status="${status}">
                <h2 class="section-title">${title} <span class="count">(${commissions.length})</span></h2>
                <div class="queue-grid">
                    ${cardsHTML}
                </div>
            </div>
        `;
    }

    renderQueueCard(commission) {
        const system = window.commissionSystemV2;
        
        return `
            <div class="queue-card" data-status="${commission.status}">
                <div class="card-header">
                    <h3 class="commission-title">${this.escapeHtml(commission.title)}</h3>
                    <div class="commission-status status-${commission.status}">
                        ${system.formatStatus(commission.status)}
                    </div>
                </div>
                
                <div class="card-body">
                    <div class="commission-info">
                        <div class="info-item">
                            <span class="label">Artist:</span>
                            <span class="value">${this.escapeHtml(commission.artist)}</span>
                        </div>
                        
                        <div class="info-item">
                            <span class="label">Character:</span>
                            <span class="value">${this.escapeHtml(commission.character)}</span>
                        </div>
                        
                        ${commission.additionalCharacters ? `
                        <div class="info-item">
                            <span class="label">Additional:</span>
                            <span class="value">${this.escapeHtml(commission.additionalCharacters)}</span>
                        </div>
                        ` : ''}
                        
                        <div class="info-item">
                            <span class="label">Type:</span>
                            <span class="value">${this.escapeHtml(commission.type)}</span>
                        </div>
                        
                        ${commission.dateCommissioned ? `
                        <div class="info-item">
                            <span class="label">Commissioned:</span>
                            <span class="value">${system.formatDate(commission.dateCommissioned)}</span>
                        </div>
                        ` : ''}
                        
                        ${commission.cost && commission.cost > 0 ? `
                        <div class="info-item">
                            <span class="label">Value:</span>
                            <span class="value">${system.formatCost(commission.cost)}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    ${commission.description ? `
                    <div class="commission-description">
                        <h4>Description</h4>
                        <p>${this.escapeHtml(commission.description)}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    handleSearch(query) {
        const cards = document.querySelectorAll('.queue-card');
        const searchTerm = query.toLowerCase().trim();
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const shouldShow = !searchTerm || text.includes(searchTerm);
            card.style.display = shouldShow ? 'block' : 'none';
        });
        
        this.updateSectionCounts();
    }

    handleFilter(status) {
        const sections = document.querySelectorAll('.queue-section');
        
        sections.forEach(section => {
            if (status === 'all' || section.dataset.status === status) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    updateSectionCounts() {
        const sections = document.querySelectorAll('.queue-section');
        
        sections.forEach(section => {
            const visibleCards = section.querySelectorAll('.queue-card:not([style*="display: none"])');
            const countElement = section.querySelector('.count');
            if (countElement) {
                countElement.textContent = `(${visibleCards.length})`;
            }
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public method to refresh the queue
    refresh() {
        this.renderQueue();
        this.renderFutureArtists();
    }

    renderFutureArtists() {
        const container = document.getElementById('future-artists-table');
        if (!container) {
            console.warn('⚠️ Future artists container not found');
            return;
        }

        if (!window.commissionSystemV2) {
            container.innerHTML = `
                <div class="loading-message">
                    <h3>⏳ Commission system loading...</h3>
                    <p>Please wait while the system initializes.</p>
                </div>
            `;
            return;
        }

        if (!window.commissionSystemV2.firebaseReady) {
            container.innerHTML = `
                <div class="loading-message">
                    <h3>🔄 Connecting to Database</h3>
                    <p>Establishing connection to load future artists...</p>
                </div>
            `;
            return;
        }

        const publicArtists = window.commissionSystemV2.getPublicFutureArtists();
        console.log(`🎨 Found ${publicArtists.length} public future artists to display`);
        
        if (publicArtists.length === 0) {
            container.innerHTML = `
                <div class="empty-future-artists">
                    <h3>🎨 No Future Artists</h3>
                    <p>No artists are currently listed in the public future commission wishlist.</p>
                    <p><small>If you expect to see artists here, try refreshing the queue above.</small></p>
                </div>
            `;
            return;
        }

        const artistsHTML = publicArtists.map(artist => this.renderFutureArtistCard(artist)).join('');
        
        container.innerHTML = `
            <div class="future-artists-grid">
                ${artistsHTML}
            </div>
        `;
    }

    renderFutureArtistCard(artist) {
        return `
            <div class="future-artist-card">
                <div class="artist-header">
                    <h3 class="artist-name">${this.escapeHtml(artist.artistName)}</h3>
                    <div class="artist-priority priority-${artist.priority}">
                        ${this.formatPriority(artist.priority)}
                    </div>
                </div>
                
                <div class="artist-info">
                    ${artist.platform ? `
                    <div class="artist-info-item">
                        <span class="label">Platform</span>
                        <span class="value">${this.escapeHtml(artist.platform)}</span>
                    </div>
                    ` : ''}
                    
                    ${artist.handle ? `
                    <div class="artist-info-item">
                        <span class="label">Handle</span>
                        <span class="value">${this.escapeHtml(artist.handle)}</span>
                    </div>
                    ` : ''}
                    
                    ${artist.style ? `
                    <div class="artist-info-item">
                        <span class="label">Style</span>
                        <span class="value">${this.escapeHtml(artist.style)}</span>
                    </div>
                    ` : ''}
                    
                    ${artist.commissionType ? `
                    <div class="artist-info-item">
                        <span class="label">Commission Type</span>
                        <span class="value">${this.escapeHtml(artist.commissionType)}</span>
                    </div>
                    ` : ''}
                    
                    ${artist.estimatedCost ? `
                    <div class="artist-info-item">
                        <span class="label">Estimated Cost</span>
                        <span class="value">${this.escapeHtml(artist.estimatedCost)}</span>
                    </div>
                    ` : ''}
                    
                    <div class="artist-info-item">
                        <span class="label">Status</span>
                        <span class="value">
                            <span class="artist-status status-${artist.status}">
                                ${this.formatArtistStatus(artist.status)}
                            </span>
                        </span>
                    </div>
                    
                    ${artist.website ? `
                    <div class="artist-info-item">
                        <span class="label">Portfolio</span>
                        <span class="value">
                            <a href="${this.escapeHtml(artist.website)}" target="_blank" rel="noopener noreferrer">
                                View Portfolio 🔗
                            </a>
                        </span>
                    </div>
                    ` : ''}
                </div>
                
                ${artist.notes ? `
                <div class="artist-notes">
                    <p>${this.escapeHtml(artist.notes)}</p>
                </div>
                ` : ''}
            </div>
        `;
    }

    formatPriority(priority) {
        const priorityMap = {
            'high': '🔥 High',
            'medium': '⭐ Medium',
            'low': '📋 Low',
            'someday': '💤 Someday'
        };
        return priorityMap[priority] || priority;
    }

    formatArtistStatus(status) {
        const statusMap = {
            'researching': '🔍 Researching',
            'planning': '📋 Planning',
            'ready': '✅ Ready',
            'contacted': '📧 Contacted',
            'commissioned': '🎨 Commissioned'
        };
        return statusMap[status] || status;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.commissionQueueV2 = new CommissionQueueV2();
});
