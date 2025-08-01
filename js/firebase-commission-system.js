/**
 * Firebase-powered Commission Tracking System
 * Integrates with existing AxiomOCDatabase Firebase setup
 * Provides persistent commission data storage and real-time sync
 */

class FirebaseCommissionSystem {
    constructor() {
        this.firebaseReady = false;
        this.commissions = [];
        this.futureArtists = [];
        this.listeners = [];
        
        this.initFirebase();
    }

    async initFirebase() {
        try {
            // Import Firebase modules
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, deleteDoc, updateDoc, addDoc, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            // Use the same Firebase config as the ranking system
            const firebaseConfig = {
                apiKey: "AIzaSyB-dsFpr790H-m020Ojubbr5I_qAMEIwiY",
                authDomain: "axiomocdatabase.firebaseapp.com",
                projectId: "axiomocdatabase",
                storageBucket: "axiomocdatabase.appspot.com",
                messagingSenderId: "849872728406",
                appId: "1:849872728406:web:cac277d51263cce20126f7",
                measurementId: "G-H2DQJGWTKQ"
            };

            // Initialize Firebase
            this.app = initializeApp(firebaseConfig);
            this.db = getFirestore(this.app);
            this.firebaseReady = true;

            // Store Firebase functions for later use
            this.firestore = {
                collection,
                doc,
                setDoc,
                getDoc,
                getDocs,
                onSnapshot,
                deleteDoc,
                updateDoc,
                addDoc,
                query,
                orderBy
            };

            console.log('🔥 Firebase Commission System connected successfully!');
            
            // Load existing commissions and future artists
            await this.loadCommissions();
            await this.loadFutureArtists();
            
            // Set up real-time listener
            this.setupRealtimeListener();
            
        } catch (error) {
            console.warn('❌ Firebase failed to load for commission system:', error);
            this.firebaseReady = false;
            this.fallbackToLocalStorage();
        }
    }

    async loadCommissions() {
        if (!this.firebaseReady) {
            console.warn('🔄 Firebase not ready, retrying in 1 second...');
            setTimeout(() => this.loadCommissions(), 1000);
            return;
        }

        try {
            console.log('🔄 Loading commissions from Firebase...');
            const commissionsRef = this.firestore.collection(this.db, 'commissions');
            
            // Try with and without orderBy to handle empty collections
            let querySnapshot;
            try {
                const q = this.firestore.query(commissionsRef, this.firestore.orderBy('createdAt', 'desc'));
                querySnapshot = await this.firestore.getDocs(q);
            } catch (orderError) {
                console.warn('📋 OrderBy failed, trying simple query:', orderError.message);
                querySnapshot = await this.firestore.getDocs(commissionsRef);
            }
            
            this.commissions = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                this.commissions.push({
                    id: doc.id,
                    ...data
                });
                console.log('📋 Loaded commission:', doc.id, data.title || data.artist || 'Untitled');
            });

            console.log(`📋 Successfully loaded ${this.commissions.length} commissions from Firebase`);
            this.notifyListeners('load');
            
        } catch (error) {
            console.error('❌ Error loading commissions from Firebase:', error);
            console.log('💾 Falling back to local storage...');
            this.fallbackToLocalStorage();
        }
    }

    setupRealtimeListener() {
        if (!this.firebaseReady) {
            console.warn('🔄 Firebase not ready for realtime listener, retrying in 2 seconds...');
            setTimeout(() => this.setupRealtimeListener(), 2000);
            return;
        }

        try {
            console.log('👂 Setting up realtime listener...');
            const commissionsRef = this.firestore.collection(this.db, 'commissions');
            
            // Try with and without orderBy to handle empty collections
            let query;
            try {
                query = this.firestore.query(commissionsRef, this.firestore.orderBy('createdAt', 'desc'));
            } catch (orderError) {
                console.warn('📋 OrderBy not available, using simple query for listener');
                query = commissionsRef;
            }
            
            const unsubscribe = this.firestore.onSnapshot(query, (snapshot) => {
                console.log('🔄 Real-time commission update received, changes:', snapshot.docChanges().length);
                
                this.commissions = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    this.commissions.push({
                        id: doc.id,
                        ...data
                    });
                });
                
                console.log(`� Real-time update: ${this.commissions.length} commissions`);
                this.notifyListeners('update');
            }, (error) => {
                console.error('❌ Real-time listener error:', error);
            });

            // Store unsubscribe function for cleanup
            this.unsubscribe = unsubscribe;
            console.log('✅ Real-time listener established successfully');
            
        } catch (error) {
            console.error('❌ Failed to setup real-time listener:', error);
        }
    }

    async addCommission(commissionData) {
        if (!this.firebaseReady) {
            console.warn('🔄 Firebase not ready, using local storage for commission');
            return this.addCommissionLocal(commissionData);
        }

        try {
            // Add timestamps and preserve original field names for compatibility
            const timestamp = new Date().toISOString();
            const commission = {
                title: commissionData.title || 'Untitled Commission',
                artist: commissionData.artist || 'TBD',
                // Preserve both old and new field names for compatibility
                dateCommissioned: commissionData.dateCommissioned || timestamp.split('T')[0],
                description: commissionData.description || 'No description',
                character: commissionData.character || 'Not specified',
                additionalCharacters: commissionData.additionalCharacters || '',
                cost: commissionData.cost || '$0.00',
                type: commissionData.type || 'General',
                status: commissionData.status || 'planning',
                notes: commissionData.notes || '',
                progress: commissionData.progress || 0,
                isPublic: commissionData.isPublic !== false,
                createdAt: timestamp,
                updatedAt: timestamp,
                // Include image data if provided
                attachedImage: commissionData.attachedImage || null,
                attachedImageName: commissionData.attachedImageName || null
            };

            console.log('💾 Adding commission to Firebase:', commission.title);
            const docRef = await this.firestore.addDoc(
                this.firestore.collection(this.db, 'commissions'),
                commission
            );

            console.log('✅ Commission added to Firebase with ID:', docRef.id);
            
            // Force reload to ensure UI is updated
            await this.loadCommissions();
            
            return docRef.id;
            
        } catch (error) {
            console.error('❌ Error adding commission to Firebase:', error);
            console.log('💾 Falling back to local storage...');
            return this.addCommissionLocal(commissionData);
        }
    }

    async updateCommission(commissionId, updates) {
        if (!this.firebaseReady) {
            return this.updateCommissionLocal(commissionId, updates);
        }

        try {
            const commissionRef = this.firestore.doc(this.db, 'commissions', commissionId);
            
            // Preserve both field name formats for compatibility
            const normalizedUpdates = { ...updates };
            
            // Ensure both field name formats exist
            if (updates.dateOfCommission) {
                normalizedUpdates.date = updates.dateOfCommission;
                normalizedUpdates.dateOfCommission = updates.dateOfCommission;
            }
            if (updates.date) {
                normalizedUpdates.dateOfCommission = updates.date;
                normalizedUpdates.date = updates.date;
            }
            if (updates.descriptionOfCommission) {
                normalizedUpdates.description = updates.descriptionOfCommission;
                normalizedUpdates.descriptionOfCommission = updates.descriptionOfCommission;
            }
            if (updates.description) {
                normalizedUpdates.descriptionOfCommission = updates.description;
                normalizedUpdates.description = updates.description;
            }
            if (updates.characters && Array.isArray(updates.characters)) {
                normalizedUpdates.character = updates.characters.join(', ');
                normalizedUpdates.characters = updates.characters;
            }
            if (updates.character && typeof updates.character === 'string') {
                normalizedUpdates.characters = [updates.character];
                normalizedUpdates.character = updates.character;
            }
            
            const updateData = {
                ...normalizedUpdates,
                updatedAt: new Date().toISOString()
            };

            await this.firestore.updateDoc(commissionRef, updateData);
            console.log('✅ Commission updated in Firebase:', commissionId, updateData);
            return true;
            
        } catch (error) {
            console.error('❌ Error updating commission in Firebase:', error);
            console.log('💾 Falling back to local storage...');
            return this.updateCommissionLocal(commissionId, updates);
        }
    }

    async deleteCommission(commissionId) {
        if (!this.firebaseReady) {
            return this.deleteCommissionLocal(commissionId);
        }

        try {
            await this.firestore.deleteDoc(this.firestore.doc(this.db, 'commissions', commissionId));
            console.log('🗑️ Commission deleted from Firebase:', commissionId);
            return true;
            
        } catch (error) {
            console.error('❌ Error deleting commission:', error);
            return this.deleteCommissionLocal(commissionId);
        }
    }

    // Local storage fallback methods
    fallbackToLocalStorage() {
        console.log('📦 Using localStorage fallback for commissions');
        const stored = localStorage.getItem('axiom-commissions');
        if (stored) {
            try {
                this.commissions = JSON.parse(stored);
            } catch (e) {
                this.commissions = [];
            }
        }
        this.notifyListeners('load');
    }

    addCommissionLocal(commissionData) {
        const timestamp = new Date().toISOString().split('T')[0];
        const commission = {
            id: 'COMM-' + Date.now(),
            ...commissionData,
            // Ensure both field name formats are preserved
            dateCommissioned: commissionData.dateCommissioned || commissionData.dateOfCommission || timestamp,
            dateOfCommission: commissionData.dateOfCommission || commissionData.dateCommissioned || timestamp,
            description: commissionData.description || commissionData.descriptionOfCommission || 'No description',
            descriptionOfCommission: commissionData.descriptionOfCommission || commissionData.description || 'No description',
            characters: commissionData.characters || (commissionData.character ? [commissionData.character] : ['Not specified']),
            progress: commissionData.progress || 0,
            isPublic: commissionData.isPublic !== false,
            lastUpdate: new Date().toISOString().split('T')[0]
        };
        
        this.commissions.unshift(commission);
        this.saveToLocalStorage();
        this.notifyListeners('add');
        return commission.id;
    }

    updateCommissionLocal(commissionId, updates) {
        const index = this.commissions.findIndex(c => c.id === commissionId);
        if (index !== -1) {
            this.commissions[index] = {
                ...this.commissions[index],
                ...updates,
                lastUpdate: new Date().toISOString().split('T')[0]
            };
            this.saveToLocalStorage();
            this.notifyListeners('update');
            return true;
        }
        return false;
    }

    deleteCommissionLocal(commissionId) {
        const index = this.commissions.findIndex(c => c.id === commissionId);
        if (index !== -1) {
            this.commissions.splice(index, 1);
            this.saveToLocalStorage();
            this.notifyListeners('delete');
            return true;
        }
        return false;
    }

    saveToLocalStorage() {
        localStorage.setItem('axiom-commissions', JSON.stringify(this.commissions));
    }

    // Event system for UI updates
    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners(action) {
        this.listeners.forEach(callback => {
            try {
                callback(action, this.commissions);
            } catch (error) {
                console.error('❌ Listener error:', error);
            }
        });
    }

    // Utility methods
    getCommissions() {
        return this.commissions;
    }

    getPublicCommissions() {
        return this.commissions.filter(c => c.isPublic !== false);
    }

    getCommissionById(id) {
        return this.commissions.find(c => c.id === id);
    }

    generateCommissionId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `COMM-${timestamp}-${random}`;
    }

    // Status management
    getStatusCounts() {
        const counts = {
            total: this.commissions.length,
            planning: 0,
            queued: 0,
            'in-progress': 0,
            review: 0,
            revisions: 0,
            completed: 0,
            delivered: 0,
            'on-hold': 0,
            cancelled: 0
        };

        this.commissions.forEach(commission => {
            if (counts.hasOwnProperty(commission.status)) {
                counts[commission.status]++;
            }
        });

        return counts;
    }

    getPublicStatusCounts() {
        const publicCommissions = this.getPublicCommissions();
        return {
            total: publicCommissions.length,
            inProgress: publicCommissions.filter(c => ['in-progress', 'review', 'revisions'].includes(c.status)).length,
            waiting: publicCommissions.filter(c => ['planning', 'queued'].includes(c.status)).length,
            completed: publicCommissions.filter(c => ['completed', 'delivered'].includes(c.status)).length
        };
    }

    // === COMPATIBILITY METHODS FOR ADMIN INTERFACE ===
    
    // Alias for getCommissions to match localStorage system
    getAllCommissions() {
        return this.getCommissions();
    }

    // Alias for getCommissionById to match localStorage system  
    getCommission(id) {
        return this.getCommissionById(id);
    }

    // Get stats in format expected by admin interface
    getStats() {
        const counts = this.getStatusCounts();
        
        // Calculate total cost
        const totalCost = this.commissions.reduce((sum, commission) => {
            const cost = typeof commission.cost === 'number' ? commission.cost : parseFloat(commission.cost) || 0;
            return sum + cost;
        }, 0);
        
        return {
            total: counts.total,
            planning: counts.planning,
            inProgress: counts['in-progress'] + counts.review + counts.revisions,
            completed: counts.completed + counts.delivered,
            onHold: counts['on-hold'],
            cancelled: counts.cancelled,
            totalCost: this.formatCost(totalCost)
        };
    }

    // Basic search functionality
    searchCommissions(query) {
        if (!query || query.trim() === '') {
            return this.getAllCommissions();
        }
        
        const lowerQuery = query.toLowerCase();
        return this.commissions.filter(commission => {
            return (
                (commission.artist && commission.artist.toLowerCase().includes(lowerQuery)) ||
                (commission.description && commission.description.toLowerCase().includes(lowerQuery)) ||
                (commission.character && commission.character.toLowerCase().includes(lowerQuery)) ||
                (commission.type && commission.type.toLowerCase().includes(lowerQuery))
            );
        });
    }

    // Formatting methods needed by admin interface
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
            'planning': 'Planning',
            'in-progress': 'In Progress',
            'review': 'Review',
            'completed': 'Completed',
            'on-hold': 'On Hold',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    }

    // Image processing placeholder (Firebase doesn't store files the same way)
    async processImageFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve({
                    data: e.target.result,
                    name: file.name,
                    size: file.size
                });
            };
            reader.readAsDataURL(file);
        });
    }

    // Export data functionality
    exportData() {
        const data = {
            commissions: this.getAllCommissions(),
            exportDate: new Date().toISOString(),
            source: 'firebase-commission-system',
            version: '2.0'
        };
        return JSON.stringify(data, null, 2);
    }

    // Import data functionality
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            let imported = 0;
            
            if (data.commissions && Array.isArray(data.commissions)) {
                data.commissions.forEach(commission => {
                    // Remove ID to allow Firebase to generate new ones
                    const { id, ...commissionData } = commission;
                    this.addCommission(commissionData);
                    imported++;
                });
            }
            
            return imported;
        } catch (error) {
            console.error('Import error:', error);
            return 0;
        }
    }

    // Download commission image placeholder
    downloadCommissionImage(id) {
        const commission = this.getCommission(id);
        if (commission && commission.attachedImage) {
            const link = document.createElement('a');
            link.href = commission.attachedImage;
            link.download = commission.attachedImageName || `commission-${id}-image.jpg`;
            link.click();
            return true;
        }
        return false;
    }

    // Cleanup
    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        this.listeners = [];
    }

    // ===== FUTURE ARTISTS FUNCTIONALITY =====
    
    async loadFutureArtists() {
        if (!this.firebaseReady) {
            console.warn('🔄 Firebase not ready for future artists, retrying in 1 second...');
            setTimeout(() => this.loadFutureArtists(), 1000);
            return;
        }

        try {
            console.log('🔄 Loading future artists from Firebase...');
            const artistsRef = this.firestore.collection(this.db, 'futureArtists');
            
            // Try with and without orderBy to handle empty collections
            let querySnapshot;
            try {
                const q = this.firestore.query(artistsRef, this.firestore.orderBy('dateAdded', 'desc'));
                querySnapshot = await this.firestore.getDocs(q);
            } catch (orderError) {
                console.warn('🎨 OrderBy failed for artists, trying simple query:', orderError.message);
                querySnapshot = await this.firestore.getDocs(artistsRef);
            }
            
            this.futureArtists = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                this.futureArtists.push({
                    id: doc.id,
                    ...data
                });
                console.log('🎨 Loaded future artist:', doc.id, data.artistName || 'Unnamed Artist');
            });

            console.log(`🎨 Successfully loaded ${this.futureArtists.length} future artists from Firebase`);
            this.notifyListeners('load-artists');
            
        } catch (error) {
            console.error('❌ Error loading future artists from Firebase:', error);
            // Initialize empty array on error
            this.futureArtists = [];
        }
    }

    async addFutureArtist(artistData) {
        if (!this.firebaseReady) {
            console.warn('🔄 Firebase not ready, cannot add future artist');
            return false;
        }

        try {
            const timestamp = new Date().toISOString();
            const artist = {
                artistName: artistData.artistName || 'Unknown Artist',
                platform: artistData.platform || 'Unknown',
                handle: artistData.handle || '',
                website: artistData.website || '',
                style: artistData.style || '',
                commissionType: artistData.commissionType || 'Any',
                estimatedCost: artistData.estimatedCost || '',
                priority: artistData.priority || 'medium',
                notes: artistData.notes || '',
                status: artistData.status || 'planning',
                isPublic: artistData.isPublic !== false,
                dateAdded: timestamp,
                updatedAt: timestamp
            };

            console.log('💾 Adding future artist to Firebase:', artist.artistName);
            const docRef = await this.firestore.addDoc(
                this.firestore.collection(this.db, 'futureArtists'),
                artist
            );

            console.log('✅ Future artist added to Firebase with ID:', docRef.id);
            
            // Force reload to ensure UI is updated
            await this.loadFutureArtists();
            
            return docRef.id;
            
        } catch (error) {
            console.error('❌ Error adding future artist to Firebase:', error);
            return false;
        }
    }

    async updateFutureArtist(artistId, updates) {
        if (!this.firebaseReady) {
            console.warn('🔄 Firebase not ready, cannot update future artist');
            return false;
        }

        try {
            const artistRef = this.firestore.doc(this.db, 'futureArtists', artistId);
            
            const updateData = {
                ...updates,
                updatedAt: new Date().toISOString()
            };

            await this.firestore.updateDoc(artistRef, updateData);
            console.log('✅ Future artist updated in Firebase:', artistId, updateData);
            
            // Force reload to ensure UI is updated
            await this.loadFutureArtists();
            
            return true;
            
        } catch (error) {
            console.error('❌ Error updating future artist in Firebase:', error);
            return false;
        }
    }

    async deleteFutureArtist(artistId) {
        if (!this.firebaseReady) {
            console.warn('🔄 Firebase not ready, cannot delete future artist');
            return false;
        }

        try {
            await this.firestore.deleteDoc(this.firestore.doc(this.db, 'futureArtists', artistId));
            console.log('🗑️ Future artist deleted from Firebase:', artistId);
            
            // Force reload to ensure UI is updated
            await this.loadFutureArtists();
            
            return true;
            
        } catch (error) {
            console.error('❌ Error deleting future artist:', error);
            return false;
        }
    }

    // Utility methods for future artists
    getFutureArtists() {
        return this.futureArtists;
    }

    getPublicFutureArtists() {
        return this.futureArtists.filter(artist => artist.isPublic !== false);
    }

    getFutureArtistById(id) {
        return this.futureArtists.find(artist => artist.id === id);
    }

    generateArtistId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ARTIST-${timestamp}-${random}`;
    }
}

// Global instance
let firebaseCommissionSystem;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (!firebaseCommissionSystem) {
        firebaseCommissionSystem = new FirebaseCommissionSystem();
    }
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.FirebaseCommissionSystem = FirebaseCommissionSystem;
    window.firebaseCommissionSystem = firebaseCommissionSystem;
}
