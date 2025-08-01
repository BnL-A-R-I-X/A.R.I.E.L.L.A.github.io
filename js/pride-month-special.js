/**
 * BNL Pride Month Special Features
 * Celebrating love, identity, and unity across the cosmos
 * Activates automatically in June or via admin override
 */

class PrideMonthSpecial {
    constructor() {
        this.isActive = false;
        this.currentDate = new Date();
        this.isPrideMonth = this.checkIfPrideMonth();
        this.adminOverride = localStorage.getItem('axiom-pride-month-override') === 'true';
        this.robotMessages = [
            "🏳️‍🌈 Pride Mode Activated — Welcome, Passenger!",
            "💖 Love is for Every Passenger in the Galaxy",
            "🌈 BNL Celebrates ALL Passengers — You Are Welcome Here",
            "🚀 From Earth to the Stars — Love Always Wins",
            "🤖 WALL·E Says: Love Makes the Universe Brighter",
            "🌟 EVE Protocol: Scanning for Love... FOUND EVERYWHERE!",
            "💫 Captain's Orders: Sail Under the Rainbow",
            "🎨 AUTO Directive: Celebrate Every Color of Humanity"
        ];
        this.tickerMessages = [
            "BNL — Bringing Every Color of the Galaxy Together Since 2057",
            "From the First Rainbow on Earth to the Stars Beyond — Love Always Wins",
            "USS Axiom Pride Voyage — Celebrating Love, Identity & Unity Across the Cosmos",
            "Captain's Order: This Month, We Sail Under a Rainbow",
            "Pride in the Stars — Every Passenger Matters — Every Love Story Counts",
            "BNL Fleet Directive: Love Has No Boundaries in Space or Time"
        ];
        this.prideColors = [
            '#e40303', // Red
            '#ff8c00', // Orange  
            '#ffed00', // Yellow
            '#008018', // Green
            '#004cff', // Blue
            '#732982'  // Purple
        ];
        this.currentColorIndex = 0;
        this.animationInterval = null;
        
        this.init();
    }

    checkIfPrideMonth() {
        const month = this.currentDate.getMonth() + 1; // JavaScript months are 0-indexed
        return month === 6; // June
    }

    init() {
        // Activate if it's Pride Month or admin override is enabled
        if (this.isPrideMonth || this.adminOverride) {
            this.activate();
        }
        
        console.log(`🏳️‍🌈 Pride Month System Status: ${this.isActive ? 'ACTIVE' : 'STANDBY'}`);
    }

    activate() {
        if (this.isActive) return;
        
        this.isActive = true;
        console.log('🌈 BNL PRIDE MONTH CELEBRATION ACTIVATED');
        
        // Apply rainbow theme
        this.applyPrideTheme();
        
        // Update BNL logo to Pride variant
        this.updateLogoToPride();
        
        // Show robot greeting
        this.showRobotGreeting();
        
        // Update status ticker
        this.updatePrideTicker();
        
        // Start background color animation
        this.startBackgroundAnimation();
        
        // Update page headers
        this.updatePrideHeaders();
        
        // Show activation notification
        this.showActivationNotification();
    }

    deactivate() {
        if (!this.isActive) return;
        
        this.isActive = false;
        console.log('🏳️‍🌈 Pride Month Celebration Deactivated');
        
        // Remove pride theme
        this.removePrideTheme();
        
        // Restore original logo
        this.restoreOriginalLogo();
        
        // Stop background animation
        this.stopBackgroundAnimation();
        
        // Restore original ticker
        this.restoreOriginalTicker();
        
        // Restore original headers
        this.restoreOriginalHeaders();
        
        // Clear admin override
        localStorage.removeItem('axiom-pride-month-override');
    }

    applyPrideTheme() {
        const style = document.createElement('style');
        style.id = 'pride-month-theme';
        style.textContent = `
            /* Pride Month Rainbow Theme */
            :root {
                --pride-red: #e40303;
                --pride-orange: #ff8c00;
                --pride-yellow: #ffed00;
                --pride-green: #008018;
                --pride-blue: #004cff;
                --pride-purple: #732982;
                --pride-gradient: linear-gradient(45deg, 
                    var(--pride-red) 0%, 
                    var(--pride-orange) 16.66%, 
                    var(--pride-yellow) 33.33%, 
                    var(--pride-green) 50%, 
                    var(--pride-blue) 66.66%, 
                    var(--pride-purple) 83.33%, 
                    var(--pride-red) 100%);
                --pride-gradient-subtle: linear-gradient(45deg, 
                    rgba(228, 3, 3, 0.1) 0%, 
                    rgba(255, 140, 0, 0.1) 16.66%, 
                    rgba(255, 237, 0, 0.1) 33.33%, 
                    rgba(0, 128, 24, 0.1) 50%, 
                    rgba(0, 76, 255, 0.1) 66.66%, 
                    rgba(115, 41, 130, 0.1) 83.33%, 
                    rgba(228, 3, 3, 0.1) 100%);
            }
            
            .pride-month-active {
                background: var(--pride-gradient-subtle);
                background-size: 200% 200%;
                animation: prideGradientShift 15s ease infinite;
            }
            
            @keyframes prideGradientShift {
                0% { background-position: 0% 50%; }
                25% { background-position: 100% 50%; }
                50% { background-position: 100% 100%; }
                75% { background-position: 0% 100%; }
                100% { background-position: 0% 50%; }
            }
            
            .pride-month-active .site-header {
                background: linear-gradient(135deg, 
                    rgba(228, 3, 3, 0.2) 0%, 
                    rgba(255, 140, 0, 0.2) 20%, 
                    rgba(255, 237, 0, 0.2) 40%, 
                    rgba(0, 128, 24, 0.2) 60%, 
                    rgba(0, 76, 255, 0.2) 80%, 
                    rgba(115, 41, 130, 0.2) 100%);
                border-bottom: 3px solid transparent;
                border-image: var(--pride-gradient) 1;
            }
            
            .pride-month-active .nav-bar {
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(10px);
                border-bottom: 2px solid transparent;
                border-image: var(--pride-gradient) 1;
            }
            
            .pride-month-active .nav-btn {
                background: var(--pride-gradient-subtle);
                color: #ffffff;
                border: 1px solid transparent;
                border-image: var(--pride-gradient) 1;
                transition: all 0.3s ease;
            }
            
            .pride-month-active .nav-btn:hover {
                background: var(--pride-gradient);
                color: #000000;
                font-weight: bold;
                transform: scale(1.05);
            }
            
            .pride-month-active .terminal-intro {
                background: var(--pride-gradient-subtle);
                border-left: 4px solid var(--pride-red);
                border-image: var(--pride-gradient) 1;
            }
            
            .pride-month-active .status-ticker {
                background: var(--pride-gradient);
                animation: prideTickerGlow 3s ease-in-out infinite alternate;
            }
            
            @keyframes prideTickerGlow {
                0% { box-shadow: 0 0 10px rgba(228, 3, 3, 0.5); }
                100% { box-shadow: 0 0 20px rgba(115, 41, 130, 0.8); }
            }
            
            /* Robot Greeting Overlay */
            .robot-greeting {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                border: 3px solid transparent;
                border-image: var(--pride-gradient) 1;
                border-radius: 15px;
                padding: 30px;
                text-align: center;
                z-index: 10000;
                font-family: 'Orbitron', monospace;
                color: #ffffff;
                max-width: 400px;
                animation: robotGreetingPulse 2s ease-in-out infinite alternate;
            }
            
            @keyframes robotGreetingPulse {
                0% { 
                    box-shadow: 0 0 20px rgba(228, 3, 3, 0.5);
                    border-image: linear-gradient(45deg, var(--pride-red), var(--pride-orange), var(--pride-yellow)) 1;
                }
                50% { 
                    box-shadow: 0 0 30px rgba(0, 128, 24, 0.7);
                    border-image: linear-gradient(45deg, var(--pride-green), var(--pride-blue), var(--pride-purple)) 1;
                }
                100% { 
                    box-shadow: 0 0 20px rgba(115, 41, 130, 0.5);
                    border-image: var(--pride-gradient) 1;
                }
            }
            
            .robot-greeting h2 {
                background: var(--pride-gradient);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 15px;
                font-size: 24px;
            }
            
            /* Pride logo styles */
            .pride-logo {
                filter: hue-rotate(0deg) saturate(1.5) brightness(1.1);
                animation: prideLogo 8s ease-in-out infinite;
            }
            
            @keyframes prideLogo {
                0% { filter: hue-rotate(0deg) saturate(1.5) brightness(1.1); }
                16.66% { filter: hue-rotate(30deg) saturate(1.5) brightness(1.1); }
                33.33% { filter: hue-rotate(60deg) saturate(1.5) brightness(1.1); }
                50% { filter: hue-rotate(120deg) saturate(1.5) brightness(1.1); }
                66.66% { filter: hue-rotate(240deg) saturate(1.5) brightness(1.1); }
                83.33% { filter: hue-rotate(280deg) saturate(1.5) brightness(1.1); }
                100% { filter: hue-rotate(360deg) saturate(1.5) brightness(1.1); }
            }
            
            /* Rainbow text effects */
            .pride-text {
                background: var(--pride-gradient);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                background-size: 200% 200%;
                animation: prideTextShift 4s ease infinite;
            }
            
            @keyframes prideTextShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            /* Floating hearts animation */
            .floating-heart {
                position: fixed;
                pointer-events: none;
                z-index: 1;
                font-size: 20px;
                animation: floatHeart 6s linear infinite;
                opacity: 0.8;
            }
            
            @keyframes floatHeart {
                0% {
                    transform: translateY(100vh) rotate(0deg) scale(0.5);
                    opacity: 0;
                }
                10% { opacity: 0.8; }
                90% { opacity: 0.8; }
                100% {
                    transform: translateY(-100px) rotate(360deg) scale(1.2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.classList.add('pride-month-active');
    }

    removePrideTheme() {
        const style = document.getElementById('pride-month-theme');
        if (style) style.remove();
        document.body.classList.remove('pride-month-active');
    }

    updateLogoToPride() {
        const logos = document.querySelectorAll('.bnl-logo');
        logos.forEach(logo => {
            logo.classList.add('pride-logo');
            logo.setAttribute('data-original-alt', logo.alt);
            logo.alt = logo.alt + ' (Pride Month Edition)';
        });
    }

    restoreOriginalLogo() {
        const logos = document.querySelectorAll('.bnl-logo');
        logos.forEach(logo => {
            logo.classList.remove('pride-logo');
            const originalAlt = logo.getAttribute('data-original-alt');
            if (originalAlt) {
                logo.alt = originalAlt;
            }
        });
    }

    showRobotGreeting() {
        const greeting = this.robotMessages[Math.floor(Math.random() * this.robotMessages.length)];
        
        const greetingElement = document.createElement('div');
        greetingElement.className = 'robot-greeting';
        greetingElement.innerHTML = `
            <h2>🤖 BNL ROBOT GREETING</h2>
            <p style="font-size: 18px; margin: 15px 0;">${greeting}</p>
            <p style="font-size: 14px; opacity: 0.8;">
                Happy Pride Month from the USS Axiom crew!
            </p>
        `;
        
        document.body.appendChild(greetingElement);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (greetingElement.parentNode) {
                greetingElement.style.animation = 'fadeOut 0.5s ease-out forwards';
                setTimeout(() => greetingElement.remove(), 500);
            }
        }, 4000);
        
        // Add fadeOut animation
        if (!document.getElementById('fadeout-style')) {
            const fadeStyle = document.createElement('style');
            fadeStyle.id = 'fadeout-style';
            fadeStyle.textContent = `
                @keyframes fadeOut {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(fadeStyle);
        }
    }

    updatePrideTicker() {
        const ticker = document.querySelector('.status-ticker marquee');
        if (ticker) {
            ticker.setAttribute('data-original', ticker.innerHTML);
            const randomMessage = this.tickerMessages[Math.floor(Math.random() * this.tickerMessages.length)];
            ticker.innerHTML = `
                🏳️‍🌈 ${randomMessage} — 
                Pride Month 2025 — Love Wins in Every Galaxy — 
                BNL Fleet: United in Diversity — 
                Every Passenger's Story Matters 💖
            `;
        }
    }

    restoreOriginalTicker() {
        const ticker = document.querySelector('.status-ticker marquee');
        if (ticker && ticker.getAttribute('data-original')) {
            ticker.innerHTML = ticker.getAttribute('data-original');
        }
    }

    startBackgroundAnimation() {
        // Add floating hearts
        this.animationInterval = setInterval(() => {
            if (!this.isActive) return;
            
            const hearts = ['💖', '🏳️‍🌈', '💕', '🌈', '💜', '💙', '💚', '💛', '🧡', '❤️'];
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDelay = Math.random() * 2 + 's';
            heart.style.color = this.prideColors[Math.floor(Math.random() * this.prideColors.length)];
            
            document.body.appendChild(heart);
            
            // Remove after animation
            setTimeout(() => {
                if (heart.parentNode) heart.remove();
            }, 6000);
        }, 1500);
    }

    stopBackgroundAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        // Remove existing floating hearts
        const hearts = document.querySelectorAll('.floating-heart');
        hearts.forEach(heart => heart.remove());
    }

    updatePrideHeaders() {
        // Update header text
        const headerTitle = document.querySelector('.site-header h1');
        if (headerTitle) {
            headerTitle.setAttribute('data-original', headerTitle.textContent);
            headerTitle.classList.add('pride-text');
            headerTitle.innerHTML = headerTitle.innerHTML.replace('USS AXIOM', '🏳️‍🌈 USS AXIOM PRIDE');
        }
        
        // Update terminal intro
        const terminalIntro = document.querySelector('.terminal-intro p strong');
        if (terminalIntro) {
            terminalIntro.setAttribute('data-original', terminalIntro.textContent);
            terminalIntro.innerHTML = '🌈 BNL PRIDE MONTH NOTICE:';
        }
    }

    restoreOriginalHeaders() {
        const headerTitle = document.querySelector('.site-header h1');
        if (headerTitle && headerTitle.getAttribute('data-original')) {
            headerTitle.textContent = headerTitle.getAttribute('data-original');
            headerTitle.classList.remove('pride-text');
        }
        
        const terminalIntro = document.querySelector('.terminal-intro p strong');
        if (terminalIntro && terminalIntro.getAttribute('data-original')) {
            terminalIntro.textContent = terminalIntro.getAttribute('data-original');
        }
    }

    showActivationNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 3px solid transparent;
            border-image: var(--pride-gradient) 1;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            z-index: 10000;
            font-family: 'Orbitron', monospace;
            animation: prideNotificationFade 5s ease-in-out forwards;
        `;
        
        notification.innerHTML = `
            <h2 style="background: var(--pride-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-top: 0;">
                🏳️‍🌈 PRIDE MONTH ACTIVATED
            </h2>
            <p style="color: white;">USS Axiom Celebrates Love & Identity</p>
            <p style="font-size: 14px; opacity: 0.8; color: white;">Happy Pride Month from the BNL Fleet!</p>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes prideNotificationFade {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
            style.remove();
        }, 5000);
    }

    // Admin functions
    static enableTestMode() {
        localStorage.setItem('axiom-pride-month-override', 'true');
        window.location.reload();
    }

    static disableTestMode() {
        localStorage.removeItem('axiom-pride-month-override');
        window.location.reload();
    }

    static isTestModeActive() {
        return localStorage.getItem('axiom-pride-month-override') === 'true';
    }

    // Trigger random robot greeting
    triggerRobotGreeting() {
        this.showRobotGreeting();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.prideMonthSpecial = new PrideMonthSpecial();
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.PrideMonthSpecial = PrideMonthSpecial;
}
