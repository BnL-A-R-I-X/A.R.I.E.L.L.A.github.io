/**
 * Firebase-powered Comment System for Character Pages
 * Integrates with existing Firebase ranking system
 */

class CharacterCommentSystem {
    constructor(characterId) {
        this.characterId = characterId;
        this.userIdKey = 'axiom-user-id';
        this.userNameKey = 'axiom-user-name';
        this.comments = [];
        this.firebaseReady = false;
        
        this.userId = this.getUserId();
        this.userName = this.getUserName();
        
        this.initFirebase();
    }

    async initFirebase() {
        try {
            // Import Firebase modules
            const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getFirestore, collection, doc, addDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            // Use existing Firebase app if available, otherwise create new one
            let app;
            const existingApps = getApps();
            if (existingApps.length > 0) {
                app = existingApps[0];
            } else {
                // Firebase configuration - same as ranking system
                const firebaseConfig = {
                    apiKey: "AIzaSyB-dsFpr790H-m020Ojubbr5I_qAMEIwiY",
                    authDomain: "axiomocdatabase.firebaseapp.com",
                    projectId: "axiomocdatabase",
                    storageBucket: "axiomocdatabase.appspot.com",
                    messagingSenderId: "849872728406",
                    appId: "1:849872728406:web:cac277d51263cce20126f7",
                    measurementId: "G-H2DQJGWTKQ"
                };
                app = initializeApp(firebaseConfig);
            }

            this.db = getFirestore(app);
            this.firebaseReady = true;

            // Load existing comments
            await this.loadComments();
            
            // Set up real-time listeners
            this.setupRealtimeListeners();
            
            console.log('💬 Comment system connected to Firebase!');
            this.init();
            
        } catch (error) {
            console.warn('❌ Comment system failed to load Firebase:', error);
            this.firebaseReady = false;
            this.init();
        }
    }

    getUserId() {
        let userId = localStorage.getItem(this.userIdKey);
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(this.userIdKey, userId);
        }
        return userId;
    }

    getUserName() {
        let userName = localStorage.getItem(this.userNameKey);
        if (!userName) {
            // Generate a fun anonymous name
            const adjectives = ['Cosmic', 'Stellar', 'Quantum', 'Digital', 'Cyber', 'Neon', 'Plasma', 'Atomic', 'Galactic', 'Binary'];
            const nouns = ['Passenger', 'Traveler', 'Explorer', 'Navigator', 'Pilot', 'Wanderer', 'Observer', 'Voyager', 'Scout', 'Crew'];
            const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
            userName = `${randomAdjective}${randomNoun}`;
            localStorage.setItem(this.userNameKey, userName);
        }
        return userName;
    }

    async loadComments() {
        if (!this.firebaseReady) return;

        try {
            const { getDocs, collection, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            const commentsQuery = query(
                collection(this.db, 'character_comments', this.characterId, 'comments'),
                orderBy('timestamp', 'desc')
            );
            
            const commentsSnapshot = await getDocs(commentsQuery);
            
            this.comments = [];
            commentsSnapshot.forEach(doc => {
                this.comments.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
        } catch (error) {
            console.warn('Failed to load comments:', error);
        }
    }

    setupRealtimeListeners() {
        if (!this.firebaseReady) return;

        // Listen for new comments
        import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js').then(({ onSnapshot, collection, query, orderBy }) => {
            const commentsQuery = query(
                collection(this.db, 'character_comments', this.characterId, 'comments'),
                orderBy('timestamp', 'desc')
            );

            onSnapshot(commentsQuery, (snapshot) => {
                this.comments = [];
                snapshot.forEach(doc => {
                    this.comments.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                this.updateCommentsDisplay();
            });
        });
    }

    async addComment(commentText) {
        if (!commentText.trim()) return;

        const comment = {
            text: commentText.trim(),
            userId: this.userId,
            userName: this.userName,
            timestamp: Date.now(),
            characterId: this.characterId
        };

        if (!this.firebaseReady) {
            // Fallback: just add to local array
            comment.id = 'local_' + Date.now();
            this.comments.unshift(comment);
            this.updateCommentsDisplay();
            return;
        }

        try {
            const { addDoc, collection } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            await addDoc(collection(this.db, 'character_comments', this.characterId, 'comments'), comment);
            
            // Clear the input
            const commentInput = document.getElementById('comment-input');
            if (commentInput) {
                commentInput.value = '';
            }
            
        } catch (error) {
            console.error('Failed to add comment:', error);
            // Still add locally on error
            comment.id = 'local_' + Date.now();
            this.comments.unshift(comment);
            this.updateCommentsDisplay();
        }
    }

    init() {
        this.injectCommentSystem();
    }

    injectCommentSystem() {
        const container = this.findOrCreateContainer();
        if (!container) return;

        container.innerHTML = this.generateCommentHTML();
        this.attachEventListeners();
    }

    findOrCreateContainer() {
        // Look for existing container
        let container = document.getElementById('character-comments');
        
        if (!container) {
            // Create container and inject it into the page
            container = document.createElement('section');
            container.id = 'character-comments';
            container.className = 'comments-section';
            
            // Find a good place to insert it (after galleries, before footer)
            const footer = document.querySelector('.system-footer');
            if (footer) {
                footer.parentNode.insertBefore(container, footer);
            } else {
                // Fallback: append to main or body
                const main = document.querySelector('main') || document.body;
                main.appendChild(container);
            }
        }
        
        return container;
    }

    generateCommentHTML() {
        const connectionStatus = this.firebaseReady ? 
            '<span style="color: #66e0ff;">🔥 LIVE COMMENTS</span>' : 
            '<span style="color: #ffaa00;">📱 LOCAL ONLY</span>';

        return `
            <div class="comments-header">
                <h3>Crew Comments ${connectionStatus}</h3>
                <p class="comments-intro">
                    <strong>BNL CREW FEEDBACK TERMINAL:</strong> Share your thoughts about this character with other passengers. 
                    ${this.firebaseReady ? 
                        'Comments are <strong>synchronized</strong> across all terminals in real-time.' : 
                        'Comments stored locally only. Firebase connection unavailable.'
                    }
                </p>
            </div>

            <div class="comment-form">
                <div class="user-info">
                    <span class="user-label">Posting as:</span>
                    <span class="user-name">${this.userName}</span>
                    <button id="change-name-btn" class="change-name-btn">Change Name</button>
                </div>
                <div class="input-group">
                    <textarea 
                        id="comment-input" 
                        placeholder="Share your thoughts about this character..."
                        maxlength="500"
                        rows="3"
                    ></textarea>
                    <button id="submit-comment-btn" class="submit-btn">Post Comment</button>
                </div>
                <div class="character-counter">
                    <span id="char-count">0</span>/500 characters
                </div>
            </div>

            <div class="comments-list">
                ${this.comments.length > 0 ? 
                    this.comments.map(comment => this.generateCommentCard(comment)).join('') :
                    '<div class="no-comments">No comments yet. Be the first to share your thoughts!</div>'
                }
            </div>
        `;
    }

    generateCommentCard(comment) {
        const timeAgo = this.getTimeAgo(comment.timestamp);
        const isOwnComment = comment.userId === this.userId;
        
        return `
            <div class="comment-card ${isOwnComment ? 'own-comment' : ''}" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <span class="commenter-name">${comment.userName}</span>
                    <span class="comment-time">${timeAgo}</span>
                    ${isOwnComment ? '<span class="own-indicator">You</span>' : ''}
                </div>
                <div class="comment-text">${this.escapeHtml(comment.text)}</div>
            </div>
        `;
    }

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    attachEventListeners() {
        // Submit comment button
        const submitBtn = document.getElementById('submit-comment-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const input = document.getElementById('comment-input');
                if (input) {
                    this.addComment(input.value);
                }
            });
        }

        // Enter key to submit (Ctrl+Enter)
        const commentInput = document.getElementById('comment-input');
        if (commentInput) {
            commentInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.addComment(commentInput.value);
                }
            });

            // Character counter
            commentInput.addEventListener('input', () => {
                const charCount = document.getElementById('char-count');
                if (charCount) {
                    charCount.textContent = commentInput.value.length;
                    
                    // Change color near limit
                    if (commentInput.value.length > 450) {
                        charCount.style.color = '#ff6666';
                    } else if (commentInput.value.length > 400) {
                        charCount.style.color = '#ffaa00';
                    } else {
                        charCount.style.color = 'var(--text-secondary)';
                    }
                }
            });
        }

        // Change name button
        const changeNameBtn = document.getElementById('change-name-btn');
        if (changeNameBtn) {
            changeNameBtn.addEventListener('click', () => {
                this.promptChangeName();
            });
        }
    }

    async promptChangeName() {
        try {
            const newName = await customDialogs.prompt('Enter your new display name:', this.userName, '📝 CHANGE DISPLAY NAME', 'User Profile Settings');
            
            if (newName && newName.trim() && newName.trim() !== this.userName) {
                this.userName = newName.trim();
                localStorage.setItem(this.userNameKey, this.userName);
                this.injectCommentSystem(); // Refresh display
            }
        } catch (error) {
            // User cancelled
            console.log('Name change cancelled');
        }
    }

    updateCommentsDisplay() {
        const commentsList = document.querySelector('.comments-list');
        if (commentsList) {
            commentsList.innerHTML = this.comments.length > 0 ? 
                this.comments.map(comment => this.generateCommentCard(comment)).join('') :
                '<div class="no-comments">No comments yet. Be the first to share your thoughts!</div>';
        }
    }
}

// Auto-initialize on character pages
document.addEventListener('DOMContentLoaded', () => {
    // Try to detect character ID from URL or page
    let characterId = null;
    
    // Method 1: Check URL path
    const path = window.location.pathname;
    if (path.includes('/ariella/')) characterId = 'ariella';
    else if (path.includes('/aridoe/')) characterId = 'aridoe';
    else if (path.includes('/darla/')) characterId = 'darla';
    else if (path.includes('/caelielle/')) characterId = 'caelielle';
    else if (path.includes('/misc/')) characterId = 'misc';
    
    // Method 2: Check if there's a data attribute
    const characterElement = document.querySelector('[data-character-id]');
    if (characterElement) {
        characterId = characterElement.getAttribute('data-character-id');
    }
    
    // Initialize comment system if we found a character ID
    if (characterId) {
        window.characterComments = new CharacterCommentSystem(characterId);
    }
});

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterCommentSystem;
}
