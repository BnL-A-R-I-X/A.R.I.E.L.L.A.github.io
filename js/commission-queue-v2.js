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
        
        // Wait for commission system to be ready
        if (window.commissionSystemV2) {
            this.renderQueue();
        } else {
            // Wait for system to load
            const checkSystem = setInterval(() => {
                if (window.commissionSystemV2) {
                    clearInterval(checkSystem);
                    this.renderQueue();
                }
            }, 100);
        }
        
        console.log('📋 Commission Queue V2 initialized');
    }

    setupEventListeners() {
        // Listen for commission system changes
        if (window.commissionSystemV2) {
            window.commissionSystemV2.addListener(() => {
                this.renderQueue();
            });
        }

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
        if (!container || !window.commissionSystemV2) return;

        const commissions = window.commissionSystemV2.getPublicCommissions();
        
        if (commissions.length === 0) {
            container.innerHTML = `
                <div class="empty-queue">
                    <h3>🎨 No Public Commissions</h3>
                    <p>The commission queue is currently empty or all commissions are set to private.</p>
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
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.commissionQueueV2 = new CommissionQueueV2();
});
