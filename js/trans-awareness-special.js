/**
 * BNL Transgender Awareness Month Features
 * Special Transgender Awareness Month features for the Axiom OC Database
 * Activates automatically in November or via admin override
 */

class TransAwarenessSpecial {
    constructor() {
        this.isActive = false;
        this.currentDate = new Date();
        this.isTransAwarenessMonth = this.checkIfTransAwarenessMonth();
        this.adminOverride = localStorage.getItem('axiom-trans-awareness-override') === 'true';
        this.affirmationOverlay = null;
        this.affirmationCommands = ['AFFIRM', 'TRANS', 'SUPPORT', 'IDENTITY', 'RECOGNITION'];
        
        this.affirmations = [
            "BNL recognizes you, always.",
            "Your journey, your truth — passenger logs updated.",
            "Captain's order: Respect every passenger's identity.",
            "Axiom Medical: Your identity is valid and supported.",
            "BNL Hospitality: Every passenger deserves affirmation.",
            "Captain McCrea's directive: All crew welcome all identities.",
            "AUTO protocol: Identity respect is non-negotiable.",
            "EVE scan complete: Authentic self detected and celebrated.",
            "WALL-E says: Love is love, identity is identity.",
            "BNL guarantee: Safe passage for your true self.",
            "Passenger manifest updated: You belong here.",
            "Medical bay equipped for all identity needs.",
            "Your story matters aboard the Axiom.",
            "BNL commitment: Dignity for every passenger.",
            "Trans passengers make the Axiom stronger."
        ];
        
        this.init();
    }

    checkIfTransAwarenessMonth() {
        const month = this.currentDate.getMonth() + 1; // JavaScript months are 0-indexed
        return month === 11; // November
    }

    init() {
        // Activate if it's Trans Awareness Month or admin override is enabled
        if (this.isTransAwarenessMonth || this.adminOverride) {
            this.activate();
        }
        
        // Set up terminal commands for affirmations
        this.setupTerminalCommands();
        
        console.log(`🏳️‍⚧️ Trans Awareness System Status: ${this.isActive ? 'ACTIVE' : 'STANDBY'}`);
    }

    activate() {
        if (this.isActive) return;
        
        this.isActive = true;
        console.log('🏳️‍⚧️ BNL TRANSGENDER AWARENESS MONTH ACTIVATED');
        
        // Apply trans pride theme
        this.applyTransPrideTheme();
        
        // Add nebula background
        this.createNebulaBackground();
        
        // Update status ticker
        this.updateStatusTicker();
        
        // Update page headers
        this.updateTransAwarenessHeaders();
        
        // Add affirmation generator
        this.createAffirmationGenerator();
        
        // Show activation notification
        this.showActivationNotification();
    }

    deactivate() {
        if (!this.isActive) return;
        
        this.isActive = false;
        console.log('🏳️‍⚧️ Trans Awareness Month Deactivated');
        
        // Remove trans pride theme
        this.removeTransPrideTheme();
        
        // Remove nebula background
        this.removeNebulaBackground();
        
        // Restore original ticker
        this.restoreOriginalTicker();
        
        // Restore original headers
        this.restoreOriginalHeaders();
        
        // Remove affirmation generator
        this.removeAffirmationGenerator();
        
        // Clear admin override
        localStorage.removeItem('axiom-trans-awareness-override');
    }

    applyTransPrideTheme() {
        const style = document.createElement('style');
        style.id = 'trans-awareness-theme';
        style.textContent = `
            /* Trans Awareness Month Theme Override */
            :root {
                --trans-blue: #5bcefa;
                --trans-pink: #f5a9b8;
                --trans-white: #ffffff;
                --trans-gradient: linear-gradient(135deg, #5bcefa 0%, #f5a9b8 50%, #ffffff 100%);
            }
            
            .trans-awareness-active {
                background: linear-gradient(135deg, 
                    rgba(91, 206, 250, 0.2) 0%, 
                    rgba(245, 169, 184, 0.2) 25%, 
                    rgba(255, 255, 255, 0.15) 50%, 
                    rgba(245, 169, 184, 0.2) 75%, 
                    rgba(91, 206, 250, 0.2) 100%);
                background-size: 400% 400%;
                animation: transGradientShift 25s ease infinite;
            }
            
            @keyframes transGradientShift {
                0% { background-position: 0% 50%; }
                25% { background-position: 100% 50%; }
                50% { background-position: 100% 100%; }
                75% { background-position: 0% 100%; }
                100% { background-position: 0% 50%; }
            }
            
            .trans-awareness-active .site-header {
                background: linear-gradient(135deg, #1a4d66 0%, #664460 50%, #444444 100%);
                border-bottom: 3px solid var(--trans-blue);
                color: #ffffff;
            }
            
            .trans-awareness-active .nav-bar {
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
            }
            
            .trans-awareness-active .nav-btn {
                color: var(--trans-blue);
                border-color: var(--trans-blue);
                transition: all 0.3s ease;
                background: rgba(0, 0, 0, 0.2);
            }
            
            .trans-awareness-active .nav-btn:hover {
                background: var(--trans-gradient);
                color: #000;
            }
            
            .trans-awareness-active .terminal-intro {
                background: linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(91, 206, 250, 0.2) 50%, rgba(0, 0, 0, 0.4) 100%);
                border-left: 4px solid var(--trans-pink);
                color: #ffffff;
            }
            
            .trans-awareness-active .status-ticker {
                background: linear-gradient(90deg, #1a4d66 0%, #664460 50%, #333333 100%);
                border: 1px solid var(--trans-blue);
                box-shadow: 0 0 10px rgba(91, 206, 250, 0.3);
            }
            
            .trans-awareness-active .status-ticker marquee {
                color: #ffffff;
                text-shadow: 0 0 5px var(--trans-blue);
                font-weight: bold;
            }
            
            /* Nebula Background Animation */
            .trans-nebula-bg {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                background: radial-gradient(ellipse at 20% 30%, rgba(91, 206, 250, 0.15) 0%, transparent 50%),
                           radial-gradient(ellipse at 80% 70%, rgba(245, 169, 184, 0.15) 0%, transparent 50%),
                           radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
                animation: nebulaFloat 20s ease-in-out infinite;
            }
            
            @keyframes nebulaFloat {
                0% { transform: translateX(0) translateY(0) scale(1); }
                33% { transform: translateX(10px) translateY(-5px) scale(1.02); }
                66% { transform: translateX(-5px) translateY(10px) scale(0.98); }
                100% { transform: translateX(0) translateY(0) scale(1); }
            }
            
            /* Affirmation Generator Styles */
            .affirmation-generator {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid var(--trans-blue);
                border-radius: 10px;
                padding: 15px;
                z-index: 9999;
                font-family: 'Orbitron', monospace;
                color: var(--trans-blue);
                max-width: 300px;
                animation: transGlow 3s ease-in-out infinite alternate;
            }
            
            @keyframes transGlow {
                0% { 
                    box-shadow: 0 0 5px var(--trans-blue); 
                    border-color: var(--trans-blue);
                }
                50% { 
                    box-shadow: 0 0 15px var(--trans-pink), 0 0 25px var(--trans-pink); 
                    border-color: var(--trans-pink);
                }
                100% { 
                    box-shadow: 0 0 5px var(--trans-blue); 
                    border-color: var(--trans-blue);
                }
            }
            
            .affirmation-button {
                background: var(--trans-gradient);
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                color: #000;
                font-family: 'Orbitron', monospace;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                margin-top: 10px;
                transition: transform 0.2s ease;
            }
            
            .affirmation-button:hover {
                transform: scale(1.05);
            }
            
            .affirmation-text {
                font-style: italic;
                margin: 10px 0;
                padding: 10px;
                background: rgba(91, 206, 250, 0.1);
                border-radius: 5px;
                min-height: 40px;
                display: flex;
                align-items: center;
            }
            
            /* BNL Logo Trans Variant */
            .trans-awareness-active .bnl-logo {
                filter: hue-rotate(180deg) saturate(1.5);
            }
        `;
        document.head.appendChild(style);
        document.body.classList.add('trans-awareness-active');
    }

    removeTransPrideTheme() {
        const style = document.getElementById('trans-awareness-theme');
        if (style) style.remove();
        document.body.classList.remove('trans-awareness-active');
    }

    createNebulaBackground() {
        this.nebulaBackground = document.createElement('div');
        this.nebulaBackground.className = 'trans-nebula-bg';
        document.body.appendChild(this.nebulaBackground);
    }

    removeNebulaBackground() {
        if (this.nebulaBackground) {
            this.nebulaBackground.remove();
            this.nebulaBackground = null;
        }
    }

    updateStatusTicker() {
        const ticker = document.querySelector('.status-ticker marquee');
        if (ticker) {
            ticker.setAttribute('data-original', ticker.innerHTML);
            
            // Get current page to customize message
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            let transAwarenessMessage = this.getTransAwarenessMessage(currentPage);
            
            ticker.innerHTML = transAwarenessMessage;
        }
        
        // Also update other status elements
        this.updateStatusElements();
    }
    
    getTransAwarenessMessage(page) {
        const messages = {
            'index.html': `
                🏳️‍⚧️ BNL TRANSGENDER AWARENESS MONTH: Recognizing Passenger Identity Across the Galaxy Since 2064 — 
                This Month, the Axiom Sails in Trans Pride Colors — 
                Passenger Records Updated: Your True Self is Always Welcome — 
                BNL Medical Division providing gender-affirming care in all sectors 🏳️‍⚧️
            `,
            'bio.html': `
                🏳️‍⚧️ PERSONNEL UPDATE: Creator celebrating identity and authenticity — 
                BNL Passenger Relations Division honors all gender identities — 
                Medical & Wellness Division offering supportive services — 
                Your journey matters aboard the Axiom 🏳️‍⚧️
            `,
            'ocs.html': `
                🏳️‍⚧️ CHARACTER DATABASE: Celebrating diverse identities and authentic representation — 
                All OCs welcome regardless of gender identity — 
                Stories of courage and self-discovery featured — 
                Representation matters in every universe 🏳️‍⚧️
            `,
            'rankings.html': `
                🏳️‍⚧️ RANKING SYSTEM: Character authenticity valued above all — 
                Trans and gender-diverse characters celebrated — 
                Identity representation rankings available — 
                Every story deserves recognition 🏳️‍⚧️
            `,
            'commissions.html': `
                🏳️‍⚧️ COMMISSION QUEUE: Gender-affirming artwork priority processing — 
                Trans pride themed commissions celebrating identity — 
                Every character's true self deserves artistic expression — 
                Creating inclusive art for all passengers 🏳️‍⚧️
            `,
            'upcoming-commissions.html': `
                🏳️‍⚧️ UPCOMING WORK: Trans awareness themed commissions now accepting — 
                Identity-affirming artwork prioritized in queue — 
                Your authentic self deserves beautiful representation — 
                Inclusive creativity for a diverse future 🏳️‍⚧️
            `,
            'socials.html': `
                🏳️‍⚧️ SOCIAL NETWORKS: Trans awareness celebration across all platforms — 
                Share your identity journey and support others — 
                Connect with affirming communities galaxy-wide — 
                Social support for transgender passengers 🏳️‍⚧️
            `,
            'information.html': `
                🏳️‍⚧️ SYSTEM INFO: Trans awareness protocols engaged ship-wide — 
                Identity records updated with preferred names and pronouns — 
                Medical bay equipped for gender-affirming care — 
                Information systems supporting passenger authenticity 🏳️‍⚧️
            `
        };
        
        return messages[page] || messages['index.html'];
    }
    
    updateStatusElements() {
        // Update header status widgets
        const statusWidgets = document.querySelector('.status-widgets');
        if (statusWidgets) {
            statusWidgets.setAttribute('data-original', statusWidgets.innerHTML);
            statusWidgets.innerHTML = `
                SHIP TIME: <strong id="shipTime"></strong> |
                SECTOR: <strong>🏳️‍⚧️ PRIDE SECTOR</strong> |
                UPLINK: <strong>AFFIRMING NETWORK</strong> |
                TRANS AWARENESS: <strong>ACTIVE</strong>
            `;
        }
        
        // Update security level indicators
        const statusElements = document.querySelectorAll('.status');
        statusElements.forEach(status => {
            if (status.innerHTML.includes('SECURITY LEVEL: GREEN')) {
                status.setAttribute('data-original', status.innerHTML);
                status.innerHTML = status.innerHTML.replace(
                    'SECURITY LEVEL: GREEN', 
                    'SECURITY LEVEL: 🏳️‍⚧️ AFFIRMING'
                );
            }
        });
    }

    restoreOriginalTicker() {
        const ticker = document.querySelector('.status-ticker marquee');
        if (ticker && ticker.getAttribute('data-original')) {
            ticker.innerHTML = ticker.getAttribute('data-original');
        }
        
        // Restore status widgets
        const statusWidgets = document.querySelector('.status-widgets');
        if (statusWidgets && statusWidgets.getAttribute('data-original')) {
            statusWidgets.innerHTML = statusWidgets.getAttribute('data-original');
        }
        
        // Restore security level indicators
        const statusElements = document.querySelectorAll('.status[data-original]');
        statusElements.forEach(status => {
            status.innerHTML = status.getAttribute('data-original');
            status.removeAttribute('data-original');
        });
    }

    updateTransAwarenessHeaders() {
        // Update header title
        const headerTitle = document.querySelector('.site-header h1');
        if (headerTitle) {
            headerTitle.setAttribute('data-original', headerTitle.textContent);
            headerTitle.innerHTML = headerTitle.innerHTML.replace('USS AXIOM', '🏳️‍⚧️ USS AXIOM TRANS PRIDE');
        }
        
        // Update terminal intro with trans awareness message
        const terminalIntro = document.querySelector('.terminal-intro p');
        if (terminalIntro) {
            const strongElement = terminalIntro.querySelector('strong');
            if (strongElement) {
                strongElement.setAttribute('data-original', strongElement.textContent);
                strongElement.textContent = 'BNL TRANSGENDER AWARENESS NOTICE:';
            }
            
            // Store original and update with Trans Awareness message
            terminalIntro.setAttribute('data-original', terminalIntro.innerHTML);
            terminalIntro.innerHTML = `
                <strong>BNL TRANSGENDER AWARENESS NOTICE:</strong> The USS Axiom proudly celebrates Transgender Awareness Month with 
                enhanced identity affirmation protocols. Our <em>Passenger Relations Division</em> honors all passengers and crew 
                who identify as transgender, nonbinary, or gender diverse. 
                <strong>Medical & Wellness Division</strong> offers supportive services including updated identity records, 
                new name badges, and cabin personalization. Remember: Your identity is valid, recognized, and celebrated! 🏳️‍⚧️
            `;
            terminalIntro.style.background = 'linear-gradient(90deg, rgba(91, 206, 250, 0.15) 0%, rgba(245, 169, 184, 0.15) 100%)';
            terminalIntro.style.borderLeft = '4px solid var(--trans-pink)';
            terminalIntro.style.color = '#e8f5ff';
        }
    }

    restoreOriginalHeaders() {
        const headerTitle = document.querySelector('.site-header h1');
        if (headerTitle && headerTitle.getAttribute('data-original')) {
            headerTitle.textContent = headerTitle.getAttribute('data-original');
            headerTitle.removeAttribute('data-original');
        }
        
        const terminalIntro = document.querySelector('.terminal-intro p');
        if (terminalIntro && terminalIntro.getAttribute('data-original')) {
            terminalIntro.innerHTML = terminalIntro.getAttribute('data-original');
            terminalIntro.style.background = '';
            terminalIntro.style.borderLeft = '';
            terminalIntro.style.color = '';
            terminalIntro.removeAttribute('data-original');
        }
    }

    createAffirmationGenerator() {
        this.affirmationOverlay = document.createElement('div');
        this.affirmationOverlay.className = 'affirmation-generator';
        this.affirmationOverlay.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong>🏳️‍⚧️ BNL AFFIRMATION</strong>
                <button id="affirmation-close-btn" style="
                    background: transparent; 
                    border: 1px solid var(--trans-blue); 
                    color: var(--trans-blue); 
                    cursor: pointer; 
                    padding: 2px 6px; 
                    border-radius: 3px;
                    font-family: 'Orbitron', monospace;
                    font-size: 12px;
                ">✕</button>
            </div>
            <div class="affirmation-text" id="affirmation-display">
                Click below for an affirming message from BNL!
            </div>
            <button class="affirmation-button" id="generate-affirmation">
                Generate Affirmation
            </button>
            <div style="font-size: 10px; margin-top: 8px; opacity: 0.7; text-align: center;">
                💡 Try typing: AFFIRM, TRANS, SUPPORT
            </div>
        `;
        document.body.appendChild(this.affirmationOverlay);
        
        // Add button functionality
        document.getElementById('generate-affirmation').addEventListener('click', () => {
            this.generateAffirmation();
        });
        
        document.getElementById('affirmation-close-btn').addEventListener('click', () => {
            this.removeAffirmationGenerator();
        });
    }

    removeAffirmationGenerator() {
        if (this.affirmationOverlay) {
            this.affirmationOverlay.remove();
            this.affirmationOverlay = null;
        }
    }

    generateAffirmation() {
        const randomAffirmation = this.affirmations[Math.floor(Math.random() * this.affirmations.length)];
        const display = document.getElementById('affirmation-display');
        if (display) {
            display.innerHTML = `"${randomAffirmation}"`;
            display.style.background = 'rgba(245, 169, 184, 0.2)';
            
            // Reset background after a moment
            setTimeout(() => {
                display.style.background = 'rgba(91, 206, 250, 0.1)';
            }, 2000);
        }
    }

    setupTerminalCommands() {
        // Listen for terminal commands on any input fields
        document.addEventListener('keyup', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                const value = e.target.value.toUpperCase();
                if (this.affirmationCommands.includes(value)) {
                    this.generateAffirmation();
                    e.target.value = '';
                }
            }
        });
    }

    showActivationNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: var(--trans-blue);
            padding: 30px;
            border-radius: 10px;
            border: 2px solid var(--trans-blue);
            text-align: center;
            z-index: 10000;
            font-family: 'Orbitron', monospace;
            animation: fadeInOut 5s ease-in-out forwards;
            box-shadow: 0 0 20px rgba(91, 206, 250, 0.5);
        `;
        
        notification.innerHTML = `
            <h2 style="margin-top: 0; background: var(--trans-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                🏳️‍⚧️ TRANSGENDER AWARENESS MONTH
            </h2>
            <p>BNL Passenger Relations Division Activated</p>
            <p style="font-size: 14px; opacity: 0.8;">Your identity is recognized and celebrated!</p>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
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
        localStorage.setItem('axiom-trans-awareness-override', 'true');
        window.location.reload();
    }

    static disableTestMode() {
        localStorage.removeItem('axiom-trans-awareness-override');
        window.location.reload();
    }

    static isTestModeActive() {
        return localStorage.getItem('axiom-trans-awareness-override') === 'true';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.transAwarenessSpecial = new TransAwarenessSpecial();
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.TransAwarenessSpecial = TransAwarenessSpecial;
}
