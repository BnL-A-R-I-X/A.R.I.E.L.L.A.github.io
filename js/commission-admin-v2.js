/**
 * Commission Admin Interface V2
 * Modern, clean admin interface for the rebuilt commission system
 */

class CommissionAdminV2 {
    constructor() {
        this.currentEditId = null;
        this.searchQuery = '';
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCommissionSystemListener();
        
        // Wait for commission system to be ready, then render
        if (window.commissionSystemV2) {
            this.renderCommissions();
            this.updateStats();
        } else {
            // Wait for system to load
            const checkSystem = setInterval(() => {
                if (window.commissionSystemV2) {
                    clearInterval(checkSystem);
                    this.renderCommissions();
                    this.updateStats();
                }
            }, 100);
        }
        
        console.log('🔧 Commission Admin V2 initialized');
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('commission-form-v2');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Image upload handling
        const imageInput = document.getElementById('ideaImage');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        // Search
        const searchInput = document.getElementById('search-commissions');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Filter
        const filterSelect = document.getElementById('filter-status');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => this.handleFilter(e.target.value));
        }

        // Clear form button
        const clearBtn = document.getElementById('clear-form');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearForm());
        }

        // Export/Import
        const exportBtn = document.getElementById('export-commissions');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportCommissions());
        }

        const importBtn = document.getElementById('import-commissions');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importCommissions());
        }
    }

    setupCommissionSystemListener() {
        if (window.commissionSystemV2) {
            window.commissionSystemV2.addListener((action, data) => {
                this.renderCommissions();
                this.updateStats();
                
                if (action === 'added') {
                    this.showNotification('Commission added successfully!', 'success');
                    this.clearForm();
                } else if (action === 'updated') {
                    this.showNotification('Commission updated successfully!', 'success');
                } else if (action === 'deleted') {
                    this.showNotification('Commission deleted successfully!', 'success');
                }
            });
        }
    }

    // ===== FORM HANDLING =====

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Convert checkbox to boolean
        data.isPublic = formData.has('isPublic');

        // Add image data if available
        if (this.currentImageData) {
            data.attachedImage = this.currentImageData.data;
            data.attachedImageName = this.currentImageData.name;
        }

        try {
            if (this.currentEditId) {
                window.commissionSystemV2.updateCommission(this.currentEditId, data);
                this.currentEditId = null;
                this.updateFormButtonText('Add Commission');
            } else {
                window.commissionSystemV2.addCommission(data);
            }
        } catch (error) {
            this.showNotification('Error saving commission: ' + error.message, 'error');
        }
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) {
            this.currentImageData = null;
            this.updateImagePreview(null);
            return;
        }

        window.commissionSystemV2.processImageFile(file)
            .then(imageData => {
                this.currentImageData = imageData;
                this.updateImagePreview(imageData);
                this.showNotification('Image uploaded successfully!', 'success');
            })
            .catch(error => {
                this.showNotification('Image upload failed: ' + error.message, 'error');
                e.target.value = ''; // Clear the input
                this.currentImageData = null;
                this.updateImagePreview(null);
            });
    }

    updateImagePreview(imageData) {
        const preview = document.getElementById('image-preview');
        if (!preview) return;

        if (imageData) {
            preview.innerHTML = `
                <div class="image-preview-container">
                    <img src="${imageData.data}" alt="Idea Preview" class="preview-image">
                    <div class="image-info">
                        <span class="filename">${imageData.name}</span>
                        <span class="filesize">${(imageData.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button type="button" class="remove-image" onclick="commissionAdminV2.removeImage()">✕</button>
                </div>
            `;
        } else {
            preview.innerHTML = '<div class="no-image">No image attached</div>';
        }
    }

    removeImage() {
        this.currentImageData = null;
        const imageInput = document.getElementById('ideaImage');
        if (imageInput) imageInput.value = '';
        this.updateImagePreview(null);
    }

    clearForm() {
        const form = document.getElementById('commission-form-v2');
        if (form) {
            form.reset();
            this.currentEditId = null;
            this.currentImageData = null;
            this.updateImagePreview(null);
            this.updateFormButtonText('Add Commission');
        }
    }

    updateFormButtonText(text) {
        const submitBtn = document.querySelector('#commission-form-v2 button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = text;
        }
    }

    // ===== RENDERING =====

    renderCommissions() {
        const container = document.getElementById('commissions-list');
        if (!container) return;

        let commissions = window.commissionSystemV2.getAllCommissions();
        
        // Apply search filter
        if (this.searchQuery) {
            commissions = window.commissionSystemV2.searchCommissions(this.searchQuery);
        }

        // Apply status filter
        if (this.currentFilter !== 'all') {
            commissions = commissions.filter(c => c.status === this.currentFilter);
        }

        if (commissions.length === 0) {
            container.innerHTML = '<div class="no-commissions">No commissions found</div>';
            return;
        }

        const commissionsHTML = commissions.map(commission => this.renderCommissionCard(commission)).join('');
        container.innerHTML = commissionsHTML;
    }

    renderCommissionCard(commission) {
        const system = window.commissionSystemV2;
        
        return `
            <div class="commission-card" data-id="${commission.id}">
                <div class="commission-header">
                    <h3>${this.escapeHtml(commission.title)}</h3>
                    <div class="commission-status status-${commission.status}">
                        ${system.formatStatus(commission.status)}
                    </div>
                </div>
                
                <div class="commission-details">
                    <div class="detail-row">
                        <span class="label">Artist:</span>
                        <span class="value">${this.escapeHtml(commission.artist)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Character:</span>
                        <span class="value">${this.escapeHtml(commission.character)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Type:</span>
                        <span class="value">${this.escapeHtml(commission.type)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Cost:</span>
                        <span class="value">${system.formatCost(commission.cost)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Date:</span>
                        <span class="value">${system.formatDate(commission.dateCommissioned)}</span>
                    </div>
                    ${commission.additionalCharacters ? `
                    <div class="detail-row">
                        <span class="label">Additional:</span>
                        <span class="value">${this.escapeHtml(commission.additionalCharacters)}</span>
                    </div>
                    ` : ''}
                    ${commission.description ? `
                    <div class="detail-row">
                        <span class="label">Description:</span>
                        <span class="value">${this.escapeHtml(commission.description)}</span>
                    </div>
                    ` : ''}
                    ${commission.notes ? `
                    <div class="detail-row">
                        <span class="label">Notes:</span>
                        <span class="value">${this.escapeHtml(commission.notes)}</span>
                    </div>
                    ` : ''}
                    <div class="detail-row">
                        <span class="label">Visibility:</span>
                        <span class="value">${commission.isPublic ? '👁️ Public' : '🔒 Private'}</span>
                    </div>
                    ${commission.attachedImage ? `
                    <div class="detail-row">
                        <span class="label">Idea Image:</span>
                        <span class="value">
                            <button onclick="commissionAdminV2.downloadImage('${commission.id}')" class="btn-download">
                                💾 Download ${commission.attachedImageName || 'Image'}
                            </button>
                        </span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="commission-actions">
                    <button onclick="commissionAdminV2.editCommission('${commission.id}')" class="btn-edit">
                        ✏️ Edit
                    </button>
                    <button onclick="commissionAdminV2.deleteCommission('${commission.id}')" class="btn-delete">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    }

    updateStats() {
        const statsContainer = document.getElementById('commission-stats');
        if (!statsContainer) return;

        const stats = window.commissionSystemV2.getStats();
        
        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.planning}</div>
                <div class="stat-label">Planning</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.inProgress}</div>
                <div class="stat-label">In Progress</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.completed}</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalCost}</div>
                <div class="stat-label">Total Value</div>
            </div>
        `;
    }

    // ===== COMMISSION ACTIONS =====

    editCommission(id) {
        const commission = window.commissionSystemV2.getCommission(id);
        if (!commission) return;

        // Populate form with commission data
        const form = document.getElementById('commission-form-v2');
        if (!form) return;

        // Fill form fields
        form.title.value = commission.title || '';
        form.artist.value = commission.artist || '';
        form.dateCommissioned.value = commission.dateCommissioned || '';
        form.cost.value = commission.cost || '';
        form.character.value = commission.character || '';
        form.additionalCharacters.value = commission.additionalCharacters || '';
        form.type.value = commission.type || '';
        form.status.value = commission.status || 'planning';
        form.description.value = commission.description || '';
        form.notes.value = commission.notes || '';
        form.isPublic.checked = commission.isPublic !== false;

        // Handle existing image
        if (commission.attachedImage) {
            this.currentImageData = {
                data: commission.attachedImage,
                name: commission.attachedImageName || 'existing_image.jpg',
                size: 0,
                type: 'image/jpeg'
            };
            this.updateImagePreview(this.currentImageData);
        } else {
            this.currentImageData = null;
            this.updateImagePreview(null);
        }

        this.currentEditId = id;
        this.updateFormButtonText('Update Commission');

        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
    }

    deleteCommission(id) {
        const commission = window.commissionSystemV2.getCommission(id);
        if (!commission) return;

        if (confirm(`Are you sure you want to delete "${commission.title}"?`)) {
            window.commissionSystemV2.deleteCommission(id);
        }
    }

    downloadImage(id) {
        const success = window.commissionSystemV2.downloadCommissionImage(id);
        if (!success) {
            this.showNotification('No image attached to this commission', 'error');
        }
    }

    // ===== SEARCH & FILTER =====

    handleSearch(query) {
        this.searchQuery = query.trim();
        this.renderCommissions();
    }

    handleFilter(filter) {
        this.currentFilter = filter;
        this.renderCommissions();
    }

    // ===== IMPORT/EXPORT =====

    exportCommissions() {
        try {
            const data = window.commissionSystemV2.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `axiom-commissions-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            this.showNotification('Commissions exported successfully!', 'success');
        } catch (error) {
            this.showNotification('Export failed: ' + error.message, 'error');
        }
    }

    importCommissions() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const count = window.commissionSystemV2.importData(e.target.result);
                    this.showNotification(`Successfully imported ${count} commissions!`, 'success');
                } catch (error) {
                    this.showNotification('Import failed: ' + error.message, 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    // ===== UTILITIES =====

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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.commissionAdminV2 = new CommissionAdminV2();
});
