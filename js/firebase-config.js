// Firebase configuration and database functions
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-dsFpr790H-m020Ojubbr5I_qAMEIwiY",
  authDomain: "axiomocdatabase.firebaseapp.com",
  projectId: "axiomocdatabase",
  storageBucket: "axiomocdatabase.firebasestorage.app",
  messagingSenderId: "849872728406",
  appId: "1:849872728406:web:cac277d51263cce20126f7",
  measurementId: "G-H2DQJGWTKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Commission Queue Functions
export async function saveCommission(commission) {
    try {
        const docRef = await addDoc(collection(db, 'commissions'), {
            ...commission,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('Commission saved with ID: ', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error adding commission: ', error);
        throw error;
    }
}

export async function getCommissions() {
    try {
        const q = query(
            collection(db, 'commissions'),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const commissions = [];
        
        querySnapshot.forEach((doc) => {
            commissions.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return commissions;
    } catch (error) {
        console.error('Error getting commissions: ', error);
        throw error;
    }
}

// Comments Functions
export async function saveComment(comment) {
    try {
        const docRef = await addDoc(collection(db, 'comments'), {
            ...comment,
            createdAt: new Date(),
            approved: false // Comments need approval
        });
        console.log('Comment saved with ID: ', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error adding comment: ', error);
        throw error;
    }
}

export async function getComments(page) {
    try {
        const q = query(
            collection(db, 'comments'),
            where('page', '==', page),
            where('approved', '==', true),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const comments = [];
        
        querySnapshot.forEach((doc) => {
            comments.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return comments;
    } catch (error) {
        console.error('Error getting comments: ', error);
        throw error;
    }
}

// Art Suggestions Functions
export async function saveArtSuggestion(suggestion) {
    try {
        const docRef = await addDoc(collection(db, 'artSuggestions'), {
            ...suggestion,
            createdAt: new Date(),
            status: 'pending'
        });
        console.log('Art suggestion saved with ID: ', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error adding art suggestion: ', error);
        throw error;
    }
}

export async function getArtSuggestions() {
    try {
        const q = query(
            collection(db, 'artSuggestions'),
            orderBy('createdAt', 'desc'),
            limit(20)
        );
        const querySnapshot = await getDocs(q);
        const suggestions = [];
        
        querySnapshot.forEach((doc) => {
            suggestions.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return suggestions;
    } catch (error) {
        console.error('Error getting art suggestions: ', error);
        throw error;
    }
}

// Gallery Functions (for managing image metadata)
export async function saveImageMetadata(imageData) {
    try {
        const docRef = await addDoc(collection(db, 'gallery'), {
            ...imageData,
            uploadedAt: new Date()
        });
        console.log('Image metadata saved with ID: ', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error saving image metadata: ', error);
        throw error;
    }
}

export async function getGalleryImages(character, category) {
    try {
        const q = query(
            collection(db, 'gallery'),
            where('character', '==', character),
            where('category', '==', category),
            orderBy('uploadedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const images = [];
        
        querySnapshot.forEach((doc) => {
            images.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return images;
    } catch (error) {
        console.error('Error getting gallery images: ', error);
        throw error;
    }
}

export async function getRecentImage(character) {
    try {
        const q = query(
            collection(db, 'gallery'),
            where('character', '==', character),
            orderBy('uploadedAt', 'desc'),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data()
            };
        }
        
        return null;
    } catch (error) {
        console.error('Error getting recent image: ', error);
        throw error;
    }
}

// Make functions available globally
window.firebaseDB = {
    saveCommission,
    getCommissions,
    saveComment,
    getComments,
    saveArtSuggestion,
    getArtSuggestions,
    saveImageMetadata,
    getGalleryImages,
    getRecentImage
};

// Update main.js functions to use Firebase
window.saveComment = saveComment;
window.loadComments = async function() {
    const commentsList = document.querySelector('.comments-list');
    if (!commentsList) return;
    
    try {
        showLoading(commentsList);
        const comments = await getComments(window.location.pathname);
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
            return;
        }
        
        const commentsHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${sanitizeHTML(comment.name)}</span>
                    <span class="comment-date">${formatDate(comment.createdAt.toDate())}</span>
                </div>
                <div class="comment-message">${sanitizeHTML(comment.message)}</div>
            </div>
        `).join('');
        
        commentsList.innerHTML = commentsHTML;
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsList.innerHTML = '<p class="error-message">Error loading comments. Please try again later.</p>';
    }
};
