/**
 * BNL Earth Day Environmental Awareness Override
 * Special Earth Day features for the Axiom OC Database
 * Activates automatically on April 22nd or via admin override
 */

class EarthDaySpecial {
    constructor() {
        this.isActive = false;
        this.currentDate = new Date();
        this.isEarthDay = this.checkIfEarthDay();
        this.adminOverride = localStorage.getItem('axiom-earth-day-override') === 'true';
        this.eveOverlay = null;
        this.plantCommands = ['PLANT', 'EVE', 'EARTH', 'GREEN', 'ENVIRONMENT'];
        
        this.init();
    }

    checkIfEarthDay() {
        const month = this.currentDate.getMonth() + 1; // JavaScript months are 0-indexed
        const day = this.currentDate.getDate();
        return month === 4 && day === 22; // April 22nd
    }

    init() {
        // Activate if it's Earth Day or admin override is enabled
        if (this.isEarthDay || this.adminOverride) {
            this.activate();
        }
        
        // Set up terminal commands for plant growth
        this.setupTerminalCommands();
        
        console.log(`🌱 Earth Day System Status: ${this.isActive ? 'ACTIVE' : 'STANDBY'}`);
    }

    activate() {
        if (this.isActive) return;
        
        this.isActive = true;
        console.log('🌍 BNL ENVIRONMENTAL AWARENESS OVERRIDE ACTIVATED');
        
        // Apply green theme
        this.applyGreenTheme();
        
        // Add EVE overlay
        this.createEVEOverlay();
        
        // Update status ticker
        this.updateStatusTicker();
        
        // Add plant animations
        this.addPlantAnimations();
        
        // Update page titles and headers
        this.updateEarthDayHeaders();
        
        // Show activation notification
        this.showActivationNotification();
    }

    deactivate() {
        if (!this.isActive) return;
        
        this.isActive = false;
        console.log('🌱 Earth Day Override Deactivated');
        
        // Remove green theme
        this.removeGreenTheme();
        
        // Remove EVE overlay
        this.removeEVEOverlay();
        
        // Restore original ticker
        this.restoreOriginalTicker();
        
        // Remove plant animations
        this.removePlantAnimations();
        
        // Restore original headers
        this.restoreOriginalHeaders();
        
        // Clear admin override
        localStorage.removeItem('axiom-earth-day-override');
    }

    applyGreenTheme() {
        const style = document.createElement('style');
        style.id = 'earth-day-theme';
        style.textContent = `
            /* Earth Day Green Theme Override */
            :root {
                --primary-green: #00ff41;
                --eco-green: #32cd32;
                --forest-green: #228b22;
                --leaf-green: #9acd32;
            }
            
            .earth-day-active {
                filter: hue-rotate(90deg) saturate(1.2);
            }
            
            .earth-day-active .site-header {
                background: linear-gradient(135deg, #1a4f3a 0%, #2d7a2d 100%);
            }
            
            .earth-day-active .nav-bar {
                background: rgba(50, 205, 50, 0.1);
                backdrop-filter: blur(10px);
            }
            
            .earth-day-active .nav-btn {
                color: var(--primary-green);
                border-color: var(--primary-green);
            }
            
            .earth-day-active .nav-btn:hover {
                background: rgba(50, 205, 50, 0.2);
            }
            
            .earth-day-active .terminal-intro {
                background: linear-gradient(90deg, rgba(50, 205, 50, 0.1) 0%, rgba(0, 255, 65, 0.1) 100%);
                border-left: 4px solid var(--eco-green);
            }
            
            .earth-day-active .status-ticker {
                background: var(--forest-green);
            }
            
            /* Floating plants animation */
            .floating-plant {
                position: fixed;
                pointer-events: none;
                z-index: 1;
                font-size: 24px;
                animation: floatUp 8s linear infinite;
                opacity: 0.7;
            }
            
            @keyframes floatUp {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% { opacity: 0.7; }
                90% { opacity: 0.7; }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }
            
            /* EVE Overlay Styles */
            .eve-overlay {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid var(--primary-green);
                border-radius: 10px;
                padding: 15px;
                z-index: 9999;
                font-family: 'Orbitron', monospace;
                color: var(--primary-green);
                max-width: 300px;
                animation: eveGlow 2s ease-in-out infinite alternate;
            }
            
            @keyframes eveGlow {
                0% { box-shadow: 0 0 5px var(--primary-green); }
                100% { box-shadow: 0 0 20px var(--primary-green), 0 0 30px var(--primary-green); }
            }
            
            .eve-scanner {
                width: 100%;
                height: 4px;
                background: rgba(0, 255, 65, 0.3);
                margin: 10px 0;
                position: relative;
                overflow: hidden;
            }
            
            .eve-scanner::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, var(--primary-green), transparent);
                animation: eveScan 3s linear infinite;
            }
            
            @keyframes eveScan {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Plant growth animation */
            .plant-growth {
                position: fixed;
                bottom: -50px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 48px;
                z-index: 9999;
                animation: plantGrow 4s ease-out forwards;
            }
            
            @keyframes plantGrow {
                0% {
                    transform: translateX(-50%) scale(0) rotate(-180deg);
                    bottom: -50px;
                    opacity: 0;
                }
                50% {
                    transform: translateX(-50%) scale(1.2) rotate(0deg);
                    bottom: 50%;
                    opacity: 1;
                }
                100% {
                    transform: translateX(-50%) scale(1) rotate(0deg);
                    bottom: 50%;
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.classList.add('earth-day-active');
    }

    removeGreenTheme() {
        const style = document.getElementById('earth-day-theme');
        if (style) style.remove();
        document.body.classList.remove('earth-day-active');
    }

    createEVEOverlay() {
        this.eveOverlay = document.createElement('div');
        this.eveOverlay.className = 'eve-overlay';
        this.eveOverlay.innerHTML = `
            <div style="text-align: center; margin-bottom: 10px;">
                <strong>🤖 E.V.E EARTH SCAN</strong>
            </div>
            <div class="eve-scanner"></div>
            <div id="eve-status">SCANNING FOR VEGETATION...</div>
            <div style="font-size: 12px; margin-top: 10px; opacity: 0.8;">
                DIRECTIVE: EARTH DAY PROTOCOL
            </div>
        `;
        document.body.appendChild(this.eveOverlay);
        
        // Simulate EVE scanning process
        setTimeout(() => {
            document.getElementById('eve-status').innerHTML = `
                ✅ VEGETATION DETECTED<br>
                🌱 LIFE CONFIRMED<br>
                🌍 EARTH STATUS: HEALING<br>
                <div style="color: var(--leaf-green); margin-top: 8px;">
                    HAPPY EARTH DAY!
                </div>
            `;
        }, 3000);
    }

    removeEVEOverlay() {
        if (this.eveOverlay) {
            this.eveOverlay.remove();
            this.eveOverlay = null;
        }
    }

    updateStatusTicker() {
        const ticker = document.querySelector('.status-ticker marquee');
        if (ticker) {
            ticker.setAttribute('data-original', ticker.innerHTML);
            ticker.innerHTML = `
                🌍 BNL ENVIRONMENTAL DIRECTIVE 04-22: Earth Day Protocol Active — 
                Plant life restoration in progress — 
                EVE units report: VEGETATION THRIVING — 
                Celebrate the planet. Reduce waste. Plant something today. — 
                The future is green 🌱
            `;
        }
    }

    restoreOriginalTicker() {
        const ticker = document.querySelector('.status-ticker marquee');
        if (ticker && ticker.getAttribute('data-original')) {
            ticker.innerHTML = ticker.getAttribute('data-original');
        }
    }

    addPlantAnimations() {
        const plants = ['🌱', '🌿', '🍃', '🌳', '🌲', '🌴', '🌾', '🌺', '🌸', '🌼'];
        
        setInterval(() => {
            if (!this.isActive) return;
            
            const plant = document.createElement('div');
            plant.className = 'floating-plant';
            plant.textContent = plants[Math.floor(Math.random() * plants.length)];
            plant.style.left = Math.random() * 100 + 'vw';
            plant.style.animationDelay = Math.random() * 2 + 's';
            
            document.body.appendChild(plant);
            
            // Remove after animation
            setTimeout(() => {
                if (plant.parentNode) plant.remove();
            }, 8000);
        }, 2000);
    }

    removePlantAnimations() {
        const plants = document.querySelectorAll('.floating-plant');
        plants.forEach(plant => plant.remove());
    }

    updateEarthDayHeaders() {
        // Update header text
        const headerTitle = document.querySelector('.site-header h1');
        if (headerTitle) {
            headerTitle.setAttribute('data-original', headerTitle.textContent);
            headerTitle.innerHTML = headerTitle.innerHTML.replace('USS AXIOM', '🌍 USS AXIOM EARTH DAY');
        }
        
        // Update terminal intro
        const terminalIntro = document.querySelector('.terminal-intro p strong');
        if (terminalIntro) {
            terminalIntro.setAttribute('data-original', terminalIntro.textContent);
            terminalIntro.textContent = 'BNL EARTH DAY NOTICE:';
        }
    }

    restoreOriginalHeaders() {
        const headerTitle = document.querySelector('.site-header h1');
        if (headerTitle && headerTitle.getAttribute('data-original')) {
            headerTitle.textContent = headerTitle.getAttribute('data-original');
        }
        
        const terminalIntro = document.querySelector('.terminal-intro p strong');
        if (terminalIntro && terminalIntro.getAttribute('data-original')) {
            terminalIntro.textContent = terminalIntro.getAttribute('data-original');
        }
    }

    setupTerminalCommands() {
        // Listen for terminal commands on any input fields
        document.addEventListener('keyup', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                const value = e.target.value.toUpperCase();
                if (this.plantCommands.includes(value)) {
                    this.triggerPlantGrowth();
                    e.target.value = '';
                }
            }
        });
        
        // Also add a hidden terminal command input
        this.createHiddenTerminal();
    }

    createHiddenTerminal() {
        // Add terminal command info to pages
        const terminalHint = document.createElement('div');
        terminalHint.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: var(--primary-green, #00ff41);
            padding: 8px 12px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 1000;
            opacity: 0.7;
        `;
        terminalHint.innerHTML = '💡 Try typing: PLANT, EVE, or EARTH';
        terminalHint.id = 'terminal-hint';
        
        if (this.isActive) {
            document.body.appendChild(terminalHint);
        }
    }

    triggerPlantGrowth() {
        console.log('🌱 Plant growth command activated!');
        
        const plant = document.createElement('div');
        plant.className = 'plant-growth';
        plant.innerHTML = '🌱';
        document.body.appendChild(plant);
        
        // Show message
        setTimeout(() => {
            plant.innerHTML = `
                <div style="text-align: center; color: var(--primary-green, #00ff41); font-family: 'Orbitron', monospace;">
                    🌱<br>
                    <div style="font-size: 16px; margin-top: 10px;">
                        BNL ANNOUNCEMENT:<br>
                        Directive A113 temporarily suspended.<br>
                        Life detected. Celebrate Earth Day!
                    </div>
                </div>
            `;
        }, 2000);
        
        // Remove after showing
        setTimeout(() => {
            if (plant.parentNode) plant.remove();
        }, 6000);
    }

    showActivationNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: var(--primary-green, #00ff41);
            padding: 30px;
            border-radius: 10px;
            border: 2px solid var(--primary-green, #00ff41);
            text-align: center;
            z-index: 10000;
            font-family: 'Orbitron', monospace;
            animation: fadeInOut 4s ease-in-out forwards;
        `;
        
        notification.innerHTML = `
            <h2 style="margin-top: 0;">🌍 EARTH DAY PROTOCOL ACTIVE</h2>
            <p>BNL Environmental Awareness Override Initiated</p>
            <p style="font-size: 14px; opacity: 0.8;">Happy Earth Day from the USS Axiom!</p>
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
        }, 4000);
    }

    // Admin functions
    static enableTestMode() {
        localStorage.setItem('axiom-earth-day-override', 'true');
        window.location.reload();
    }

    static disableTestMode() {
        localStorage.removeItem('axiom-earth-day-override');
        window.location.reload();
    }

    static isTestModeActive() {
        return localStorage.getItem('axiom-earth-day-override') === 'true';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.earthDaySpecial = new EarthDaySpecial();
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.EarthDaySpecial = EarthDaySpecial;
}
