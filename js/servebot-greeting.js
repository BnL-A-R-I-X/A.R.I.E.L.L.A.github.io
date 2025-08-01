/**
 * SERV-E Bot Welcome Greeting
 * Cute welcome popup for the USS Axiom homepage
 */

class ServeBot {
    constructor() {
        this.hasShownWelcome = false;
        this.init();
    }

    init() {
        // Check if user has seen the greeting recently (within 1 hour)
        const lastGreeting = localStorage.getItem('servebot-last-greeting');
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        if (!lastGreeting || (Date.now() - parseInt(lastGreeting)) > oneHour) {
            // Show greeting after a short delay
            setTimeout(() => {
                this.showWelcomeGreeting();
            }, 1500);
        }

        console.log('🤖 SERV-E Bot initialized');
    }

    showWelcomeGreeting() {
        if (this.hasShownWelcome) return;
        this.hasShownWelcome = true;

        // Store timestamp
        localStorage.setItem('servebot-last-greeting', Date.now().toString());

        // Create the popup
        const popup = this.createPopup();
        document.body.appendChild(popup);

        // Animate in
        setTimeout(() => {
            popup.classList.add('show');
        }, 100);

        // Auto-dismiss after 8 seconds
        setTimeout(() => {
            this.dismissPopup(popup);
        }, 8000);
    }

    createPopup() {
        const popup = document.createElement('div');
        popup.className = 'servebot-popup';
        popup.id = 'servebot-welcome';

        const greetings = [
            "Welcome aboard the USS Axiom!",
            "Greetings, passenger!",
            "Hello there, crew member!",
            "Welcome to the Axiom Terminal!",
            "Salutations, fellow space traveler!"
        ];

        const tips = [
            "Did you know? You can access special content with terminal commands!",
            "Pro tip: Check the commission queue for the latest artwork updates!",
            "Fun fact: This terminal has hidden easter eggs waiting to be discovered!",
            "Helpful hint: The admin panel contains useful passwords and PINs!",
            "Secret tip: Try exploring different sections for special surprises!"
        ];

        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];

        popup.innerHTML = `
            <div class="servebot-container">
                <div class="servebot-header">
                    <div class="servebot-avatar">
                        <div class="servebot-body">
                            <div class="servebot-eye left"></div>
                            <div class="servebot-eye right"></div>
                            <div class="servebot-mouth"></div>
                        </div>
                        <div class="servebot-wheels">
                            <div class="wheel left"></div>
                            <div class="wheel right"></div>
                        </div>
                    </div>
                    <div class="servebot-info">
                        <h3>SERV-E Unit #427</h3>
                        <p class="servebot-subtitle">Ship Service Assistant</p>
                    </div>
                    <button class="servebot-close" onclick="serveBot.dismissPopup(document.getElementById('servebot-welcome'))">✕</button>
                </div>
                
                <div class="servebot-content">
                    <div class="greeting-text">
                        <p class="main-greeting">${randomGreeting}</p>
                        <p class="helpful-tip">${randomTip}</p>
                    </div>
                    
                    <div class="servebot-actions">
                        <button onclick="serveBot.exploreOCs()" class="action-btn primary">
                            👥 Explore OCs
                        </button>
                        <button onclick="serveBot.checkQueue()" class="action-btn secondary">
                            🎨 View Commissions
                        </button>
                        <button onclick="serveBot.dismissPopup(document.getElementById('servebot-welcome'))" class="action-btn tertiary">
                            ✨ Continue Exploring
                        </button>
                    </div>
                </div>
                
                <div class="servebot-footer">
                    <p>🚀 Have a wonderful stay aboard the USS Axiom!</p>
                </div>
            </div>
        `;

        return popup;
    }

    exploreOCs() {
        this.dismissPopup(document.getElementById('servebot-welcome'));
        setTimeout(() => {
            window.location.href = 'pages/ocs.html';
        }, 300);
    }

    checkQueue() {
        this.dismissPopup(document.getElementById('servebot-welcome'));
        setTimeout(() => {
            window.location.href = 'pages/upcoming-commissions-v2.html';
        }, 300);
    }

    dismissPopup(popup) {
        if (!popup) return;
        
        popup.classList.add('dismiss');
        setTimeout(() => {
            if (popup && popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 400);
    }

    // Manual trigger for testing
    showGreeting() {
        this.hasShownWelcome = false;
        localStorage.removeItem('servebot-last-greeting');
        this.showWelcomeGreeting();
    }
}

// Initialize when DOM is ready (only on home page)
document.addEventListener('DOMContentLoaded', () => {
    // Only show on homepage
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        window.serveBot = new ServeBot();
    }
});

// Make available globally for testing
if (typeof window !== 'undefined') {
    window.ServeBot = ServeBot;
}
