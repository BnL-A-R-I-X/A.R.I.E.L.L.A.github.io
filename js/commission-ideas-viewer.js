/**
 * Commission Ideas Viewer
 * Password-protected viewer for commission ideas
 */

class CommissionIdeasViewer {
    constructor() {
        this.isAuthenticated = false;
        this.correctPassword = "AxiomCreative2025";
        this.init();
    }

    init() {
        this.createPasswordPrompt();
        
        // Listen for commission system changes
        if (window.commissionSystemV2) {
            window.commissionSystemV2.addListener((action) => {
                if (this.isAuthenticated && (action === 'added' || action === 'updated' || action === 'deleted')) {
                    this.loadIdeas();
                }
            });
        }
        
        console.log('🔒 Commission Ideas Viewer initialized');
    }

    createPasswordPrompt() {
        const container = document.getElementById('ideas-section');
        if (!container) return;

        container.innerHTML = `
            <div class="ideas-header">
                <h2>💡 Commission Ideas</h2>
                <p class="ideas-subtitle">Protected area for viewing commission concepts and planning materials</p>
            </div>
            
            <div class="password-prompt" id="password-prompt">
                <div class="password-container">
                    <h3>🔐 Access Required</h3>
                    <p>This section contains private commission ideas and planning materials.</p>
                    <div class="password-form">
                        <input type="password" id="ideas-password" placeholder="Enter access code..." autocomplete="off">
                        <button onclick="commissionIdeasViewer.authenticate()" class="btn-authenticate">Access Ideas</button>
                    </div>
                    <p class="password-hint">Hint: Something warm and cozy... 🍫</p>
                </div>
            </div>
            
            <div class="ideas-content" id="ideas-content" style="display: none;">
                <!-- Ideas will be loaded here after authentication -->
            </div>
        `;

        // Add enter key listener for password input
        const passwordInput = document.getElementById('ideas-password');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.authenticate();
                }
            });
            passwordInput.focus();
        }
    }

    authenticate() {
        const passwordInput = document.getElementById('ideas-password');
        const enteredPassword = passwordInput ? passwordInput.value : '';

        if (enteredPassword === this.correctPassword) {
            this.isAuthenticated = true;
            this.showIdeas();
            this.showNotification('Access granted! Welcome to the ideas vault 🎨', 'success');
        } else {
            passwordInput.value = '';
            passwordInput.classList.add('error-shake');
            setTimeout(() => passwordInput.classList.remove('error-shake'), 500);
            this.showNotification('Incorrect access code. Try again! 🤔', 'error');
        }
    }

    showIdeas() {
        const promptDiv = document.getElementById('password-prompt');
        const contentDiv = document.getElementById('ideas-content');
        
        if (promptDiv) promptDiv.style.display = 'none';
        if (contentDiv) contentDiv.style.display = 'block';

        this.loadIdeas();
    }

    loadIdeas() {
        if (!window.commissionSystemV2) {
            document.getElementById('ideas-content').innerHTML = `
                <div class="no-ideas">
                    <h3>System Not Available</h3>
                    <p>Commission system is not loaded.</p>
                </div>
            `;
            return;
        }

        const ideas = window.commissionSystemV2.getCommissionIdeas();
        const contentDiv = document.getElementById('ideas-content');

        if (ideas.length === 0) {
            contentDiv.innerHTML = `
                <div class="no-ideas">
                    <h3>🎨 No Ideas Yet</h3>
                    <p>No commission ideas are currently in planning phase.</p>
                    <p><em>Ideas will appear here when commissions are added with "Planning" status.</em></p>
                </div>
            `;
            return;
        }

        const ideasHTML = ideas.map(idea => this.renderIdeaCard(idea)).join('');
        
        contentDiv.innerHTML = `
            <div class="ideas-grid">
                ${ideasHTML}
            </div>
            <div class="ideas-footer">
                <p>💡 These are commission concepts in the planning stage</p>
                <button onclick="commissionIdeasViewer.logout()" class="btn-logout">🔒 Hide Ideas</button>
            </div>
        `;
    }

    renderIdeaCard(idea) {
        const system = window.commissionSystemV2;
        
        return `
            <div class="idea-card">
                <div class="idea-header">
                    <h3>${this.escapeHtml(idea.title)}</h3>
                    <div class="idea-status">💭 Concept</div>
                </div>
                
                ${idea.attachedImage ? `
                <div class="idea-image">
                    <img src="${idea.attachedImage}" alt="Idea Preview" class="idea-preview">
                    <button onclick="commissionIdeasViewer.downloadIdeaImage('${idea.id}')" class="btn-download-idea">
                        💾 Download
                    </button>
                </div>
                ` : ''}
                
                <div class="idea-details">
                    <div class="detail-item">
                        <span class="label">Character:</span>
                        <span class="value">${this.escapeHtml(idea.character)}</span>
                    </div>
                    
                    ${idea.additionalCharacters ? `
                    <div class="detail-item">
                        <span class="label">Additional:</span>
                        <span class="value">${this.escapeHtml(idea.additionalCharacters)}</span>
                    </div>
                    ` : ''}
                    
                    <div class="detail-item">
                        <span class="label">Type:</span>
                        <span class="value">${this.escapeHtml(idea.type)}</span>
                    </div>
                    
                    ${idea.cost && idea.cost > 0 ? `
                    <div class="detail-item">
                        <span class="label">Estimated Cost:</span>
                        <span class="value">${system.formatCost(idea.cost)}</span>
                    </div>
                    ` : ''}
                    
                    ${idea.description ? `
                    <div class="idea-description">
                        <h4>Concept Description</h4>
                        <p>${this.escapeHtml(idea.description)}</p>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    downloadIdeaImage(id) {
        const success = window.commissionSystemV2.downloadCommissionImage(id);
        if (!success) {
            this.showNotification('No image attached to this idea', 'error');
        } else {
            this.showNotification('Image download started!', 'success');
        }
    }

    logout() {
        this.isAuthenticated = false;
        this.createPasswordPrompt();
        this.showNotification('Ideas hidden. Access code required to view again.', 'info');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Public method to refresh ideas
    refresh() {
        if (this.isAuthenticated) {
            this.loadIdeas();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const ideasSection = document.getElementById('ideas-section');
    if (ideasSection) {
        window.commissionIdeasViewer = new CommissionIdeasViewer();
    }
});
