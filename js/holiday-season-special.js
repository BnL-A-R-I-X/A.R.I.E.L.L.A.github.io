/**
 * BNL Holiday Season Special Features
 * Special Holiday Season features for the Axiom OC Database
 * Activates automatically December 1 - January 5 or via admin override
 */

class HolidaySeasonSpecial {
    constructor() {
        this.isActive = false;
        this.currentDate = new Date();
        this.isHolidaySeason = this.checkIfHolidaySeason();
        this.adminOverride = localStorage.getItem('axiom-holiday-season-override') === 'true';
        this.holidayOverlay = null;
        this.snowfallInterval = null;
        this.holidayCommands = ['HOLIDAY', 'CHEER', 'COCOA', 'SNOW', 'FESTIVITIES'];
        
        this.holidayGreetings = [
            "From Saturn's rings to the Axiom's halls — Happy Holidays.",
            "Your cheer has been logged in the Passenger Festivity Record.",
            "Snowfall simulation commencing — enjoy your season aboard.",
            "BNL wishes you warmth across the cold void of space.",
            "Holiday protocols engaged — spreading joy galaxy-wide.",
            "Captain McCrea sends seasonal greetings from the bridge.",
            "AUTO has calculated optimal holiday happiness levels.",
            "EVE units report: Festive spirit detected ship-wide.",
            "WALL-E says: The best gift is friendship across the stars.",
            "MO units working overtime to keep holiday areas spotless.",
            "From every world, for every heart — BNL Holiday Greetings.",
            "Passenger morale at seasonal maximum — celebrations authorized.",
            "Holiday menu items now available in all dining sectors.",
            "Cultural celebration protocols active across all decks.",
            "Seasonal atmospheric controls creating perfect ambiance."
        ];

        this.cocoaFacts = [
            "Hot cocoa aboard the Axiom is synthesized from authentic Earth chocolate profiles.",
            "BNL sources cocoa flavor compounds from 12 different star systems.",
            "The Captain's favorite cocoa includes real marshmallows from the hydroponics bay.",
            "Holiday cocoa dispensers use gravity-fed mixing for authentic texture.",
            "AUTO has calculated the perfect cocoa-to-milk ratio: 73.6% optimal.",
            "EVE units prefer their cocoa with a hint of renewable energy flavor.",
            "WALL-E discovered cocoa by accident while sorting recyclables.",
            "The Grand Concourse has 47 different cocoa flavor variations.",
            "Passenger wellness studies show cocoa increases happiness by 23%.",
            "Holiday cocoa recipes date back to pre-exodus Earth traditions.",
            "The ship's cocoa reserves could last 847 years at current consumption.",
            "Robotic baristas can prepare cocoa in 143 different cultural styles.",
            "Zero-gravity cocoa requires special anti-float additives.",
            "The bridge crew gets premium cocoa with real whipped cream.",
            "Holiday cocoa ceremonies promote inter-passenger cultural exchange."
        ];
        
        this.init();
    }

    checkIfHolidaySeason() {
        const month = this.currentDate.getMonth() + 1; // JavaScript months are 0-indexed
        const day = this.currentDate.getDate();
        
        // December 1 - December 31
        if (month === 12 && day >= 1) return true;
        
        // January 1 - January 5
        if (month === 1 && day <= 5) return true;
        
        return false;
    }

    init() {
        // Activate if it's Holiday Season or admin override is enabled
        if (this.isHolidaySeason || this.adminOverride) {
            this.activate();
        }
        
        // Set up terminal commands for holiday features
        this.setupTerminalCommands();
        
        console.log(`🎄 Holiday Season System Status: ${this.isActive ? 'ACTIVE' : 'STANDBY'}`);
    }

    activate() {
        if (this.isActive) return;
        
        this.isActive = true;
        console.log('🎄 BNL HOLIDAY SEASON FESTIVITIES ACTIVATED');
        
        // Apply holiday theme
        this.applyHolidayTheme();
        
        // Add snowfall effect
        this.createSnowfallEffect();
        
        // Update status ticker
        this.updateStatusTicker();
        
        // Update page headers
        this.updateHolidayHeaders();
        
        // Add holiday greeting generator
        this.createHolidayGenerator();
        
        // Show activation notification
        this.showActivationNotification();
    }

    deactivate() {
        if (!this.isActive) return;
        
        this.isActive = false;
        console.log('🎄 Holiday Season Deactivated');
        
        // Remove holiday theme
        this.removeHolidayTheme();
        
        // Remove snowfall effect
        this.removeSnowfallEffect();
        
        // Restore original ticker
        this.restoreOriginalTicker();
        
        // Restore original headers
        this.restoreOriginalHeaders();
        
        // Remove holiday generator
        this.removeHolidayGenerator();
        
        // Clear admin override
        localStorage.removeItem('axiom-holiday-season-override');
    }

    applyHolidayTheme() {
        const style = document.createElement('style');
        style.id = 'holiday-season-theme';
        style.textContent = `
            /* Holiday Season Theme Override */
            :root {
                --holiday-navy: #1a237e;
                --holiday-gold: #ffd700;
                --holiday-warm: #ff8f00;
                --holiday-light: #fff3e0;
                --holiday-gradient: linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #ffd700 100%);
                --holiday-accent: linear-gradient(45deg, #ffd700, #ff8f00);
            }
            
            .holiday-season-active {
                background: linear-gradient(135deg, rgba(26, 35, 126, 0.1) 0%, rgba(57, 73, 171, 0.1) 50%, rgba(255, 215, 0, 0.05) 100%);
            }
            
            .holiday-season-active .site-header {
                background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%);
                border-bottom: 3px solid var(--holiday-gold);
                box-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
            }
            
            .holiday-season-active .nav-bar {
                background: rgba(26, 35, 126, 0.15);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(255, 215, 0, 0.2);
            }
            
            .holiday-season-active .nav-btn {
                color: var(--holiday-gold);
                border-color: var(--holiday-gold);
                transition: all 0.3s ease;
            }
            
            .holiday-season-active .nav-btn:hover {
                background: var(--holiday-gradient);
                color: #000;
                box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
            }
            
            .holiday-season-active .terminal-intro {
                background: linear-gradient(90deg, rgba(26, 35, 126, 0.1) 0%, rgba(255, 215, 0, 0.1) 100%);
                border-left: 4px solid var(--holiday-warm);
            }
            
            .holiday-season-active .status-ticker {
                background: linear-gradient(90deg, #1a237e 0%, #283593 50%, #1a237e 100%);
                border: 1px solid var(--holiday-gold);
                box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
            }
            
            .holiday-season-active .status-ticker marquee {
                color: #ffffff;
                text-shadow: 0 0 8px var(--holiday-gold);
                font-weight: bold;
            }
            
            /* Snowfall Effect */
            .snowflake {
                position: fixed;
                top: -10px;
                color: #ffffff;
                font-size: 1em;
                pointer-events: none;
                z-index: 1;
                animation: snowfall linear infinite;
                opacity: 0.8;
                text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
            }
            
            @keyframes snowfall {
                0% {
                    transform: translateY(-100px) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.8;
                }
                90% {
                    opacity: 0.8;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
            
            /* Holiday Generator Styles */
            .holiday-generator {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid var(--holiday-gold);
                border-radius: 10px;
                padding: 15px;
                z-index: 9999;
                font-family: 'Orbitron', monospace;
                color: var(--holiday-gold);
                max-width: 350px;
                animation: holidayGlow 4s ease-in-out infinite alternate;
            }
            
            @keyframes holidayGlow {
                0% { 
                    box-shadow: 0 0 10px var(--holiday-gold); 
                    border-color: var(--holiday-gold);
                }
                50% { 
                    box-shadow: 0 0 20px var(--holiday-warm), 0 0 30px var(--holiday-warm); 
                    border-color: var(--holiday-warm);
                }
                100% { 
                    box-shadow: 0 0 10px var(--holiday-gold); 
                    border-color: var(--holiday-gold);
                }
            }
            
            .holiday-button {
                background: var(--holiday-gradient);
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                color: #000;
                font-family: 'Orbitron', monospace;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                margin: 5px 0;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .holiday-button:hover {
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
            }
            
            .holiday-text {
                font-style: italic;
                margin: 10px 0;
                padding: 10px;
                background: rgba(26, 35, 126, 0.2);
                border-radius: 5px;
                min-height: 40px;
                display: flex;
                align-items: center;
                border-left: 3px solid var(--holiday-gold);
            }
            
            /* BNL Logo Holiday Variant */
            .holiday-season-active .bnl-logo {
                filter: hue-rotate(200deg) saturate(1.3) brightness(1.2);
                animation: logoSparkle 3s ease-in-out infinite;
            }
            
            @keyframes logoSparkle {
                0%, 100% { filter: hue-rotate(200deg) saturate(1.3) brightness(1.2); }
                50% { filter: hue-rotate(200deg) saturate(1.3) brightness(1.5) drop-shadow(0 0 10px #ffd700); }
            }
            
            /* Holiday decorations for various elements */
            .holiday-season-active .character-card,
            .holiday-season-active .admin-btn,
            .holiday-season-active .nav-dropdown-item {
                border-color: rgba(255, 215, 0, 0.3);
            }
            
            .holiday-season-active .character-card:hover,
            .holiday-season-active .admin-btn:hover {
                box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
            }
        `;
        document.head.appendChild(style);
        document.body.classList.add('holiday-season-active');
    }

    removeHolidayTheme() {
        const style = document.getElementById('holiday-season-theme');
        if (style) style.remove();
        document.body.classList.remove('holiday-season-active');
    }

    createSnowfallEffect() {
        // Create snowflakes periodically
        this.snowfallInterval = setInterval(() => {
            if (!this.isActive) {
                clearInterval(this.snowfallInterval);
                return;
            }
            
            const snowflakes = ['❄', '❅', '❆', '✦', '✧', '⋆'];
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = (Math.random() * 3 + 5) + 's';
            snowflake.style.fontSize = (Math.random() * 0.8 + 0.8) + 'em';
            
            document.body.appendChild(snowflake);
            
            // Remove after animation
            setTimeout(() => {
                if (snowflake.parentNode) snowflake.remove();
            }, 8000);
        }, 300);
    }

    removeSnowfallEffect() {
        if (this.snowfallInterval) {
            clearInterval(this.snowfallInterval);
            this.snowfallInterval = null;
        }
        
        const snowflakes = document.querySelectorAll('.snowflake');
        snowflakes.forEach(snowflake => snowflake.remove());
    }

    updateStatusTicker() {
        const ticker = document.querySelector('.status-ticker marquee');
        if (ticker) {
            ticker.setAttribute('data-original', ticker.innerHTML);
            
            // Get current page to customize message
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            let holidayMessage = this.getHolidayMessage(currentPage);
            
            ticker.innerHTML = holidayMessage;
        }
        
        // Also update other status elements
        this.updateStatusElements();
    }
    
    getHolidayMessage(page) {
        const messages = {
            'index.html': `
                🎄 BNL HOLIDAY SEASON: Passenger Cultural Celebration Initiative active ship-wide — 
                From Every World, For Every Heart — 
                Snowfall simulation active in all passenger lounges — 
                Captain's Holiday Toast, Observation Deck, December 24, 2000 Hours — 
                Gift Exchange Program enrollments close December 15 🎁
            `,
            'bio.html': `
                🎄 PERSONNEL UPDATE: Creator celebrating interstellar festivities — 
                BNL Passenger Hospitality Division spreading seasonal cheer — 
                Cultural celebration protocols active for all crew members — 
                Seasonal atmospheric controls creating perfect holiday ambiance ❄️
            `,
            'ocs.html': `
                🎄 CHARACTER DATABASE: Holiday character showcase featuring festive designs — 
                All OCs participating in seasonal celebration programs — 
                Vote for your favorite holiday-themed character — 
                Cultural diversity celebrated across all character archives 🎁
            `,
            'rankings.html': `
                🎄 RANKING SYSTEM: Holiday bonus points for seasonal character designs — 
                Festive characters spreading cheer through the rankings — 
                Cultural celebration votes now being tallied — 
                Holiday spirit rankings updated daily ❄️
            `,
            'commissions.html': `
                🎄 COMMISSION QUEUE: Holiday-themed artwork priority processing — 
                Seasonal commissions celebrating cultural diversity — 
                All digital art powered by holiday cheer — 
                Creating festive beauty across the galaxy 🎁
            `,
            'upcoming-commissions.html': `
                🎄 UPCOMING WORK: Holiday season commissions now accepting — 
                Festive artwork prioritized in celebration queue — 
                Every pixel painted with seasonal warmth — 
                Cultural celebration art for passengers galaxy-wide ❄️
            `,
            'socials.html': `
                🎄 SOCIAL NETWORKS: Holiday celebrations across all platforms — 
                Share your seasonal art and cultural traditions — 
                Connect with fellow celebrants across the stars — 
                Cultural exchange for the holiday season 🎁
            `,
            'information.html': `
                🎄 SYSTEM INFO: Holiday celebration protocols engaged ship-wide — 
                Cultural Outreach Division coordinating festivities — 
                Environmental Atmospherics generating seasonal ambiance — 
                Information systems spreading holiday cheer ❄️
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
                SECTOR: <strong>🎄 CELEBRATION DECK</strong> |
                UPLINK: <strong>FESTIVE NETWORK</strong> |
                HOLIDAY STATUS: <strong>ACTIVE</strong>
            `;
        }
        
        // Update security level indicators
        const statusElements = document.querySelectorAll('.status');
        statusElements.forEach(status => {
            if (status.innerHTML.includes('SECURITY LEVEL: GREEN')) {
                status.setAttribute('data-original', status.innerHTML);
                status.innerHTML = status.innerHTML.replace(
                    'SECURITY LEVEL: GREEN', 
                    'SECURITY LEVEL: 🎄 CELEBRATION'
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

    updateHolidayHeaders() {
        // Update header title
        const headerTitle = document.querySelector('.site-header h1');
        if (headerTitle) {
            headerTitle.setAttribute('data-original', headerTitle.textContent);
            headerTitle.innerHTML = headerTitle.innerHTML.replace('USS AXIOM', '🎄 USS AXIOM HOLIDAY');
        }
        
        // Update terminal intro with holiday message
        const terminalIntro = document.querySelector('.terminal-intro p');
        if (terminalIntro) {
            const strongElement = terminalIntro.querySelector('strong');
            if (strongElement) {
                strongElement.setAttribute('data-original', strongElement.textContent);
                strongElement.textContent = 'BNL HOLIDAY CELEBRATION NOTICE:';
            }
            
            // Store original and update with Holiday message
            terminalIntro.setAttribute('data-original', terminalIntro.innerHTML);
            terminalIntro.innerHTML = `
                <strong>BNL HOLIDAY CELEBRATION NOTICE:</strong> The USS Axiom proudly hosts the 
                <em>BNL Passenger Cultural Celebration Initiative — Holiday Edition</em>. Our 
                <strong>Passenger Hospitality & Cultural Outreach Division</strong> coordinates galaxy-spanning 
                festivities for passengers of all backgrounds. The <strong>Environmental Atmospherics Division</strong> 
                has generated seasonal snowfall simulations in public lounges. 
                From Every World, For Every Heart — Happy Holidays! 🎄❄️
            `;
            terminalIntro.style.background = 'linear-gradient(90deg, rgba(26, 35, 126, 0.15) 0%, rgba(255, 215, 0, 0.1) 100%)';
            terminalIntro.style.borderLeft = '4px solid var(--holiday-warm)';
            terminalIntro.style.color = '#fff3e0';
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

    createHolidayGenerator() {
        this.holidayOverlay = document.createElement('div');
        this.holidayOverlay.className = 'holiday-generator';
        this.holidayOverlay.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong>🎄 BNL FESTIVITIES</strong>
                <button id="holiday-close-btn" style="
                    background: transparent; 
                    border: 1px solid var(--holiday-gold); 
                    color: var(--holiday-gold); 
                    cursor: pointer; 
                    padding: 2px 6px; 
                    border-radius: 3px;
                    font-family: 'Orbitron', monospace;
                    font-size: 12px;
                ">✕</button>
            </div>
            <div class="holiday-text" id="holiday-display">
                Welcome to the BNL Holiday Season! Click below for festive greetings.
            </div>
            <button class="holiday-button" id="generate-greeting">
                🎁 Holiday Greeting
            </button>
            <button class="holiday-button" id="dispense-cocoa">
                ☕ Digital Cocoa Dispenser
            </button>
            <div style="font-size: 10px; margin-top: 8px; opacity: 0.7; text-align: center;">
                💡 Try typing: HOLIDAY, CHEER, COCOA, SNOW
            </div>
        `;
        document.body.appendChild(this.holidayOverlay);
        
        // Add button functionality
        document.getElementById('generate-greeting').addEventListener('click', () => {
            this.generateHolidayGreeting();
        });
        
        document.getElementById('dispense-cocoa').addEventListener('click', () => {
            this.dispenseCocoa();
        });
        
        document.getElementById('holiday-close-btn').addEventListener('click', () => {
            this.removeHolidayGenerator();
        });
    }

    removeHolidayGenerator() {
        if (this.holidayOverlay) {
            this.holidayOverlay.remove();
            this.holidayOverlay = null;
        }
    }

    generateHolidayGreeting() {
        const randomGreeting = this.holidayGreetings[Math.floor(Math.random() * this.holidayGreetings.length)];
        const display = document.getElementById('holiday-display');
        if (display) {
            display.innerHTML = `"${randomGreeting}"`;
            display.style.background = 'rgba(255, 215, 0, 0.2)';
            display.style.borderLeft = '3px solid var(--holiday-gold)';
            
            // Reset background after a moment
            setTimeout(() => {
                display.style.background = 'rgba(26, 35, 126, 0.2)';
                display.style.borderLeft = '3px solid var(--holiday-gold)';
            }, 3000);
        }
    }

    dispenseCocoa() {
        const randomFact = this.cocoaFacts[Math.floor(Math.random() * this.cocoaFacts.length)];
        const display = document.getElementById('holiday-display');
        if (display) {
            display.innerHTML = `☕ <strong>Cocoa Dispensed!</strong><br><em>"${randomFact}"</em>`;
            display.style.background = 'rgba(255, 143, 0, 0.2)';
            display.style.borderLeft = '3px solid var(--holiday-warm)';
            
            // Reset background after a moment
            setTimeout(() => {
                display.style.background = 'rgba(26, 35, 126, 0.2)';
                display.style.borderLeft = '3px solid var(--holiday-gold)';
            }, 4000);
        }
    }

    setupTerminalCommands() {
        // Listen for terminal commands on any input fields
        document.addEventListener('keyup', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                const value = e.target.value.toUpperCase();
                if (this.holidayCommands.includes(value)) {
                    if (value === 'COCOA') {
                        this.dispenseCocoa();
                    } else {
                        this.generateHolidayGreeting();
                    }
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
            color: var(--holiday-gold);
            padding: 30px;
            border-radius: 10px;
            border: 2px solid var(--holiday-gold);
            text-align: center;
            z-index: 10000;
            font-family: 'Orbitron', monospace;
            animation: fadeInOut 5s ease-in-out forwards;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
        `;
        
        notification.innerHTML = `
            <h2 style="margin-top: 0; background: var(--holiday-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                🎄 BNL HOLIDAY SEASON ACTIVE
            </h2>
            <p>Passenger Cultural Celebration Initiative</p>
            <p style="font-size: 14px; opacity: 0.8;">From Every World, For Every Heart</p>
            <div style="margin-top: 15px;">❄️ 🎁 ⭐ 🎄 ⭐ 🎁 ❄️</div>
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
        localStorage.setItem('axiom-holiday-season-override', 'true');
        window.location.reload();
    }

    static disableTestMode() {
        localStorage.removeItem('axiom-holiday-season-override');
        window.location.reload();
    }

    static isTestModeActive() {
        return localStorage.getItem('axiom-holiday-season-override') === 'true';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.holidaySeasonSpecial = new HolidaySeasonSpecial();
});

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.HolidaySeasonSpecial = HolidaySeasonSpecial;
}
