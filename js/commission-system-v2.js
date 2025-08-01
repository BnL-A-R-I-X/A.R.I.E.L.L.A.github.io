/**
 * Commission System V2 - Complete Rebuild
 * Clean, modern commission tracking system for the Axiom OC Database
 */

class CommissionSystemV2 {
    constructor() {
        this.commissions = [];
        this.storageKey = 'axiom-commissions-v2';
        this.listeners = [];
        this.init();
    }

    init() {
        this.loadCommissions();
        console.log('🎨 Commission System V2 initialized');
        console.log('📊 Loaded commissions:', this.commissions.length);
        
        // Emit initialization event
        setTimeout(() => {
            this.notifyListeners('initialized');
        }, 100);
    }

    // ===== DATA MANAGEMENT =====
    
    loadCommissions() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.commissions = stored ? JSON.parse(stored) : [];
            this.notifyListeners('loaded');
        } catch (error) {
            console.error('Failed to load commissions:', error);
            this.commissions = [];
        }
    }

    saveCommissions() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.commissions));
            this.notifyListeners('saved');
        } catch (error) {
            console.error('Failed to save commissions:', error);
        }
    }

    // ===== COMMISSION CRUD =====

    addCommission(data) {
        const commission = {
            id: this.generateId(),
            ...this.sanitizeCommissionData(data),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.commissions.push(commission);
        this.saveCommissions();
        this.notifyListeners('added', commission);
        return commission;
    }

    updateCommission(id, data) {
        const index = this.commissions.findIndex(c => c.id === id);
        if (index === -1) return null;

        this.commissions[index] = {
            ...this.commissions[index],
            ...this.sanitizeCommissionData(data),
            updatedAt: new Date().toISOString()
        };

        this.saveCommissions();
        this.notifyListeners('updated', this.commissions[index]);
        return this.commissions[index];
    }

    deleteCommission(id) {
        const index = this.commissions.findIndex(c => c.id === id);
        if (index === -1) return false;

        const deleted = this.commissions.splice(index, 1)[0];
        this.saveCommissions();
        this.notifyListeners('deleted', deleted);
        return true;
    }

    getCommission(id) {
        return this.commissions.find(c => c.id === id);
    }

    getAllCommissions() {
        return [...this.commissions];
    }

    getPublicCommissions() {
        return this.commissions.filter(c => c.isPublic !== false);
    }

    // ===== UTILITY METHODS =====

    sanitizeCommissionData(data) {
        return {
            title: this.sanitizeString(data.title) || 'Untitled Commission',
            artist: this.sanitizeString(data.artist) || 'TBD',
            dateCommissioned: data.dateCommissioned || null,
            cost: this.sanitizeCost(data.cost),
            character: this.sanitizeString(data.character) || 'Not specified',
            additionalCharacters: this.sanitizeString(data.additionalCharacters) || '',
            type: this.sanitizeString(data.type) || 'General',
            status: this.sanitizeStatus(data.status),
            description: this.sanitizeString(data.description) || '',
            notes: this.sanitizeString(data.notes) || '',
            isPublic: data.isPublic !== false,
            attachedImage: data.attachedImage || null,
            attachedImageName: data.attachedImageName || null
        };
    }

    sanitizeString(str) {
        if (typeof str !== 'string') return '';
        return str.trim().slice(0, 1000); // Limit length
    }

    sanitizeCost(cost) {
        if (typeof cost === 'number') return cost;
        if (typeof cost === 'string') {
            const num = parseFloat(cost.replace(/[$,]/g, ''));
            return isNaN(num) ? 0 : num;
        }
        return 0;
    }

    sanitizeStatus(status) {
        const validStatuses = ['planning', 'in-progress', 'completed'];
        return validStatuses.includes(status) ? status : 'planning';
    }

    generateId() {
        return 'comm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // ===== EVENT SYSTEM =====

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners(action, data = null) {
        this.listeners.forEach(callback => {
            try {
                callback(action, data, this.commissions);
            } catch (error) {
                console.error('Listener error:', error);
            }
        });
    }

    // ===== FORMATTING HELPERS =====

    formatCost(cost) {
        const num = typeof cost === 'number' ? cost : parseFloat(cost) || 0;
        return '$' + num.toFixed(2);
    }

    formatDate(dateString) {
        if (!dateString) return 'Not set';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
    }

    formatStatus(status) {
        const statusMap = {
            'planning': '📋 Planning',
            'in-progress': '🎨 In Progress',
            'completed': '✅ Completed'
        };
        return statusMap[status] || status;
    }

    // ===== STATISTICS =====

    getStats() {
        const total = this.commissions.length;
        const byStatus = this.commissions.reduce((acc, comm) => {
            acc[comm.status] = (acc[comm.status] || 0) + 1;
            return acc;
        }, {});

        const totalCost = this.commissions.reduce((sum, comm) => sum + (comm.cost || 0), 0);

        return {
            total,
            planning: byStatus.planning || 0,
            inProgress: byStatus['in-progress'] || 0,
            completed: byStatus.completed || 0,
            totalCost: this.formatCost(totalCost)
        };
    }

    // ===== IMPORT/EXPORT =====

    exportData() {
        return JSON.stringify(this.commissions, null, 2);
    }

    importData(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            if (!Array.isArray(imported)) throw new Error('Invalid data format');

            // Validate and sanitize imported data
            const sanitized = imported.map(item => ({
                id: this.generateId(), // Generate new IDs
                ...this.sanitizeCommissionData(item),
                createdAt: item.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }));

            this.commissions = [...this.commissions, ...sanitized];
            this.saveCommissions();
            this.notifyListeners('imported');
            return sanitized.length;
        } catch (error) {
            console.error('Import failed:', error);
            throw error;
        }
    }

    // ===== SEARCH & FILTER =====

    searchCommissions(query) {
        if (!query) return this.commissions;
        
        const searchTerm = query.toLowerCase();
        return this.commissions.filter(comm =>
            comm.title.toLowerCase().includes(searchTerm) ||
            comm.artist.toLowerCase().includes(searchTerm) ||
            comm.character.toLowerCase().includes(searchTerm) ||
            comm.description.toLowerCase().includes(searchTerm)
        );
    }

    filterCommissions(filters) {
        return this.commissions.filter(comm => {
            if (filters.status && comm.status !== filters.status) return false;
            if (filters.character && comm.character !== filters.character) return false;
            if (filters.artist && comm.artist !== filters.artist) return false;
            if (filters.type && comm.type !== filters.type) return false;
            if (filters.isPublic !== undefined && comm.isPublic !== filters.isPublic) return false;
            return true;
        });
    }

    // ===== COMMISSION IDEAS =====

    getCommissionIdeas() {
        return this.commissions.filter(c => c.status === 'planning');
    }

    // ===== IMAGE HANDLING =====

    downloadCommissionImage(id) {
        const commission = this.getCommission(id);
        if (!commission || !commission.attachedImage) {
            console.warn('No image attached to commission');
            return false;
        }

        try {
            // Create download link
            const link = document.createElement('a');
            link.href = commission.attachedImage;
            link.download = commission.attachedImageName || `${commission.title}_idea.jpg`;
            link.click();
            return true;
        } catch (error) {
            console.error('Failed to download image:', error);
            return false;
        }
    }

    processImageFile(file) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                reject(new Error('Please select a valid image file'));
                return;
            }

            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                reject(new Error('Image file must be less than 5MB'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                resolve({
                    data: e.target.result,
                    name: file.name,
                    size: file.size,
                    type: file.type
                });
            };
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(file);
        });
    }
}

// Initialize global instance
window.commissionSystemV2 = new CommissionSystemV2();

console.log('📋 Commission System V2 loaded successfully');
