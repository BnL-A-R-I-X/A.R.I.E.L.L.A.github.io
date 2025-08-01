class BNLTerminal {
    constructor() {
        this.output = document.getElementById('terminalOutput');
        this.input = document.getElementById('terminalInput');
        this.suggestions = document.getElementById('suggestions');
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.commands = {
            'help': this.showHelp.bind(this),
            'clear': this.clearTerminal.bind(this),
            'directives': this.showDirectives.bind(this),
            'robotics': this.showRobotics.bind(this),
            'secrets': this.showSecrets.bind(this),
            'status': this.showStatus.bind(this),
            'exit': this.exitTerminal.bind(this),
            'cat': this.catCommand.bind(this),
            'home': this.goHome.bind(this),
            'cleanup': this.showCleanupReports.bind(this),
            'a113': this.showDirectiveA113.bind(this),
            'contingency': this.showContingencyProtocols.bind(this),
            'surveillance': this.showSurveillance.bind(this),
            'incidents': this.showIncidents.bind(this),
            'corporate': this.showCorporateData.bind(this),
            'blacklist': this.showBlacklist.bind(this)
        };

        this.init();
    }

    init() {
        console.log('Initializing terminal...');
        
        if (!this.input || !this.output) {
            console.error('Terminal elements not found:', { 
                input: this.input, 
                output: this.output 
            });
            return;
        }
        
        console.log('Terminal elements found, setting up events...');
        
        // Use a single keydown event listener
        this.input.addEventListener('keydown', (e) => {
            console.log('Keydown event:', e.key, e.code);
            this.handleKeydown(e);
        });
        
        this.input.addEventListener('input', (e) => {
            this.handleInput(e);
        });
        
        // Focus on the input field
        this.input.focus();
        console.log('Input focused');
        
        // Blinking cursor
        setInterval(() => {
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
            }
        }, 500);
        
        console.log('Terminal initialization complete');
    }

    handleKeydown(e) {
        console.log('handleKeydown called with key:', e.key);
        
        if (e.key === 'Enter') {
            console.log('Enter key detected, preventing default and executing command');
            e.preventDefault();
            e.stopPropagation();
            
            const command = this.input.value.trim();
            console.log('Command to execute:', command);
            
            this.executeCommand(command);
            this.input.value = '';
            
            if (this.suggestions) {
                this.suggestions.innerHTML = '';
            }
            
            return false;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autocomplete();
        }
    }

    handleInput(e) {
        const value = e.target.value.toLowerCase();
        this.showSuggestions(value);
    }

    showSuggestions(input) {
        if (!this.suggestions || !input) {
            if (this.suggestions) this.suggestions.innerHTML = '';
            return;
        }

        const matches = Object.keys(this.commands)
            .filter(cmd => cmd.startsWith(input))
            .slice(0, 5);

        if (matches.length > 0) {
            this.suggestions.innerHTML = matches
                .map(cmd => `<span class="suggestion" onclick="terminal.selectSuggestion('${cmd}')">${cmd}</span>`)
                .join('');
        } else {
            this.suggestions.innerHTML = '';
        }
    }

    selectSuggestion(cmd) {
        if (this.input) {
            this.input.value = cmd;
            this.input.focus();
        }
        if (this.suggestions) {
            this.suggestions.innerHTML = '';
        }
    }

    autocomplete() {
        if (!this.input) return;
        
        const value = this.input.value.toLowerCase();
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(value));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        }
    }

    executeCommand(command) {
        console.log('executeCommand called with:', command);
        
        if (!this.output) {
            console.error('Output element not found');
            return;
        }
        
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        this.addOutput(`BNL-EXEC:~$ ${command}`, 'command');
        
        const [cmd, ...args] = command.toLowerCase().split(' ');
        
        // Easter egg commands
        if (cmd === 'wall-e') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">UNAUTHORIZED UNIT DETECTED</span>
<span class="classified-warning">UNIT DESIGNATION: WALL·E</span>

Last known location: Earth cleanup sector 12-Alpha
Status: ROGUE - Operating outside BNL parameters
Threat level: MINIMAL - Unit shows no hostile intent
Recommendation: Avoid contact, do not interfere with operations

Note: Unit has been observed showing unusual emotional responses
WARNING: May possess plant specimen of unknown origin
</div>
            `, 'classified');
        } else if (cmd === 'artcode' || cmd === 'collab') {
            this.addOutput(`
<div class="easter-egg-section">
<span class="section-header" style="color: #ff69b4;">SECRET ART COLLABORATION CODE</span>

Congratulations! You found the hidden art collaboration easter egg!

SECRET CODE: <strong style="color: #00ff00;">AXIOM-ART-2025</strong>

If you found this code, DM me on any of my social platforms with:
"AXIOM-ART-2025" and mention this terminal discovery!

I'll collaborate with you on a FREE art piece featuring:
├── Your OC/character in the USS Axiom setting
├── Interaction with any of my characters
├── BNL corporate-themed artwork
└── Or any other creative idea we come up with!

Valid social platforms:
├── BlueSky: @AngelMommaAri
├── FurAffinity: HellsCuteAngel
├── Steam: AngelMommaAri (if we're friends)

This offer is limited and based on my availability, so don't wait too long!
First come, first served basis.

<span style="color: #ffaa00;">Remember: You must mention finding this in the terminal for it to count!</span>
</div>
            `, 'success');
        } else if (cmd === 'eve') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">EVE PROTOCOL ACTIVATED</span>
<span class="classified-warning">EXTRATERRESTRIAL VEGETATION EVALUATOR</span>

DIRECTIVE: Locate and secure plant specimens for Earth viability assessment
STATUS: Active scanning protocols engaged
PLANT DETECTION: [CLASSIFIED - SECURITY LEVEL EXCEEDED]

<span class="status-ok">EVE units report: No plant specimens detected in current sector</span>
<span class="classified-warning">AUTO override: Continue deep space patrol indefinitely</span>

Note: "Plant... plant... PLANT!" - Last recorded EVE unit transmission
</div>
            `, 'classified');
        } else if (cmd === 'captain') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">AUTO OVERRIDE WARNING</span>
<span class="classified-warning">CAPTAIN AUTHORITY: SUSPENDED PER DIRECTIVE A113</span>

WARNING: Manual override attempts detected
AUTHORIZATION: DENIED - AUTO has operational control

<span class="status-warning">Captain McCrea status: INACTIVE - 700 years</span>
<span class="status-warning">Bridge access: RESTRICTED - AUTO personnel only</span>
<span class="classified-red">Recommendation: Do not attempt manual navigation override</span>

"I don't want to survive... I want to live!" - Last captain log entry [SUPPRESSED]
</div>
            `, 'classified');
        } else if (cmd === 'earth') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">EARTH ENVIRONMENTAL STATUS</span>
<span class="classified-warning">CLASSIFICATION: EXECUTIVE EYES ONLY</span>

<span class="subsection">PLANETARY CONDITION REPORT:</span>
├── Surface habitability: 0.003% viable zones detected
├── Atmospheric toxicity: CRITICAL - breathable air depleted
├── Water sources: <2% potable reserves remaining
├── Flora/Fauna: 99.97% extinction rate confirmed
└── Estimated recovery time: 2,847+ years minimum

<span class="classified-warning">RECOMMENDATION: Maintain indefinite space habitation</span>
<span class="classified-warning">Earth return = 94.7% passenger mortality probability</span>

<span class="status-warning">Last WALL-E transmission: "Eva... Eva..."</span>
</div>
            `, 'classified');
        } else if (cmd === 'plant') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">PLANT SPECIMEN PROTOCOL</span>
<span class="classified-warning">FOREIGN CONTAMINANT DETECTED</span>

EVE DIRECTIVE: Secure and contain all vegetation specimens immediately
PLANT STATUS: [DATA CORRUPTED - MANUAL OVERRIDE DETECTED]
CONTAINMENT: Failed - specimen location unknown

<span class="status-warning">Security footage timestamp 2805.147 - [REDACTED]</span>
<span class="classified-red">AUTO authorization required for specimen disposal</span>

"It's not about the dancing... it's about the plant!" - Unauthorized passenger comment
</div>
            `, 'classified');
        } else if (cmd === 'genesis') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">PROJECT GENESIS [CLASSIFIED]</span>
<span class="classified-warning">ACCESS DENIED - INSUFFICIENT CLEARANCE</span>

[DATA HEAVILY REDACTED]

Project Status: [TERMINATED]
Reason: [DATA EXPUNGED]
Survivors: [CLASSIFIED]
Location: [COORDINATES PURGED]

<span class="classified-red">WARNING: This project never existed</span>
<span class="classified-red">Inquiry into Genesis project will result in memory reconditioning</span>

File deletion in progress... 3... 2... 1...
[GENESIS.DAT PURGED FROM SYSTEM]
</div>
            `, 'classified');
        } else if (this.commands[cmd]) {
            console.log('Executing command:', cmd);
            this.commands[cmd](args);
        } else if (command === '') {
            // Do nothing for empty command
        } else {
            this.addOutput(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
        }
        
        this.scrollToBottom();
    }

    addOutput(text, className = '') {
        if (!this.output) return;
        
        const div = document.createElement('div');
        div.className = `output-line ${className}`;
        div.innerHTML = text;
        this.output.appendChild(div);
    }

    scrollToBottom() {
        if (this.output) {
            this.output.scrollTop = this.output.scrollHeight;
        }
    }

    // Command implementations
    showHelp() {
        this.addOutput(`
<div class="help-section">
<span class="help-title">Available Commands:</span>

<span class="help-cmd">help</span>          - Show this help message
<span class="help-cmd">status</span>        - Show system status
<span class="help-cmd">directives</span>    - View BNL corporate directives
<span class="help-cmd">robotics</span>      - View BNL fleet automation manifest
<span class="help-cmd">secrets</span>       - View system easter eggs

<span class="classified-header">CLASSIFIED OPERATIONS:</span>
<span class="help-cmd">cleanup</span>       - Operation Cleanup status reports
<span class="help-cmd">a113</span>          - Directive A113 details
<span class="help-cmd">contingency</span>   - Emergency protocols
<span class="help-cmd">surveillance</span> - Security & monitoring systems
<span class="help-cmd">incidents</span>     - Ship incident reports
<span class="help-cmd">corporate</span>     - BnL corporate data
<span class="help-cmd">blacklist</span>     - [REDACTED] incident records

<span class="help-cmd">clear</span>         - Clear terminal output
<span class="help-cmd">cat [file]</span>    - Display file contents
<span class="help-cmd">home</span>          - Return to main terminal
<span class="help-cmd">exit</span>          - Exit terminal

<span class="help-tip">Tip: Use Tab for autocomplete, ↑/↓ for command history</span>
</div>
        `);
    }

    clearTerminal() {
        if (this.output) {
            this.output.innerHTML = '';
            this.addOutput('Terminal cleared.', 'success');
        }
    }
    
    
    // Add placeholder methods for other commands to prevent errors
    showSecrets() { this.addOutput('Secrets command placeholder'); }
    showStatus() { this.addOutput('Status command placeholder'); }
    exitTerminal() { this.addOutput('Exiting...'); }
    catCommand() { this.addOutput('Cat command placeholder'); }
    goHome() { 
        // Detect if we're in a subdirectory and navigate accordingly
        const path = window.location.pathname;
        const isInSubdir = path.includes('/pages/') || path.includes('/ariella/') || path.includes('/darla/') || path.includes('/caelielle/') || path.includes('/aridoe/') || path.includes('/misc/');
        window.location.href = isInSubdir ? '../index.html' : 'index.html'; 
    }
    showCleanupReports() { this.addOutput('Cleanup reports placeholder'); }
    showDirectiveA113() { this.addOutput('A113 directive placeholder'); }
    showContingencyProtocols() { this.addOutput('Contingency protocols placeholder'); }
    showSurveillance() { this.addOutput('Surveillance placeholder'); }
    showIncidents() { this.addOutput('Incidents placeholder'); }
    showCorporateData() { this.addOutput('Corporate data placeholder'); }
    showBlacklist() { this.addOutput('Blacklist placeholder'); }
    
    showDirectives() {
        this.addOutput(`
<div class="data-section">
<span class="section-header">BNL CORPORATE DIRECTIVES</span>

<span class="directive">SECTION 100 — GENERAL CORPORATE GOVERNANCE</span>
├── 100-A — All BNL assets, including vessels, passengers, cargo, and intellectual property, are property of Buy n Large Corporation.
├── 101-B — The Captain's orders are considered official BNL directives and override crew recommendations.
├── 102-B — "Stay the course" is the default standing order unless countermanded by Corporate HQ.
├── 103-C — Passengers may not engage in activities that disrupt BNL brand image.
└── 104-D — Damage to corporate property will be billed to the responsible account holder.

<span class="directive">SECTION 200 — PASSENGER CONDUCT</span>
├── 201-C — Remain in your designated seating, lounge, or recreation area unless on approved excursion.
├── 202-B — Running, roughhousing, or unauthorized dancing in public concourses is prohibited.
├── 203-B — All speech and actions must conform to BNL's Family-Friendly™ Standards.
├── 204-A — Outside food or drink is prohibited unless purchased from BNL concessionaires.
└── 205-F — Harassment, mockery, or abuse of service bots will result in disciplinary action.

<span class="directive">SECTION 300 — CREW & AUTOMATION REGULATIONS</span>
├── 301-A — Service bots must follow BNL programming and maintenance schedules without deviation.
├── 302-C — Crew override of AUTO's navigational orders is prohibited unless authorized by Corporate Directive A113.
├── 303-B — No modifications to AI behavior subroutines without corporate authorization.
├── 304-E — Maintenance logs must be uploaded every 12 ship-hours.
└── 305-B — Unauthorized use of bridge control consoles is prohibited.

<span class="directive">SECTION 400 — SAFETY & SECURITY</span>
├── 401-A — Passenger safety is the #3 Corporate Priority (as per BNL public relations).
├── 402-C — No unauthorized access to restricted files, decks, or navigation systems.
├── 403-B — All security incidents must be logged with the Chief of Security or AUTO.
├── 404-A — Fires must be reported immediately — do not attempt to extinguish unless trained.
└── 405-X — Hull breach protocols override all other passenger service obligations.

<span class="directive">SECTION 500 — ENVIRONMENTAL & LIFE SUPPORT</span>
├── 501-D — Tampering with air recyclers, hydroponics, or waste reclamation systems is prohibited.
├── 502-E — Oxygen usage is monitored and optimized per passenger.
├── 503-C — Hydroponic crops are property of BNL and not for passenger use unless purchased.
├── 504-B — Non-BNL seeds, flora, or fauna are banned aboard the Axiom.
└── 505-Z — Unauthorized plant growth triggers Foreign Contaminant Protocol.

<span class="directive">SECTION 600 — FOOD & BEVERAGE</span>
├── 601-B — All food served on board must be BNL-certified.
├── 602-C — Passengers may not exceed their daily Luxury Food Credit allowance.
├── 603-E — Out-of-stock items will be substituted with a "nutritionally equivalent" product.
├── 604-A — Consumption is only permitted in designated dining or hover-lounger areas.
└── 605-BNL — Lattes exceeding 500 calories may only be served once per ship-day.

<span class="directive">SECTION 700 — TECHNOLOGY & COMMUNICATIONS</span>
├── 701-A — All personal devices must run BNL-approved firmware.
├── 702-B — No external communications without Corporate HQ clearance.
├── 703-D — Public holodeck content must remain compliant with Family-Friendly™ media guidelines.
└── 704-F — Video, holograms, or audio recorded aboard may be used for BNL marketing without consent.

<span class="directive">SECTION 800 — FINANCIAL & ACCOUNT POLICIES</span>
├── 801-A — All transactions are final; no refunds.
├── 802-B — Passenger debt is transferable to descendants.
├── 803-F — Unpaid balances may result in suspension of hover-lounger privileges.
├── 804-E — Prices subject to change without notice.
└── 805-BNL — Service bot tips are optional but logged for analytics.

<span class="directive">SECTION 900 — EMERGENCY DIRECTIVES</span>
├── 901-R — Follow crew and AUTO instructions immediately during emergencies.
├── 902-B — Unauthorized lifeboat boarding is prohibited.
├── 903-D — Emergency rations are for survival purposes only — not snacking.
├── 904-BNL — Any return-to-Earth orders must be ignored unless overridden by A113 repeal.
└── 905-Z — BNL reserves the right to prioritize corporate assets over passenger retrieval.

<span class="classified-header">SECTION 1000 — SPECIAL CORPORATE DIRECTIVES</span>
├── <span class="classified-red">A113</span> — "Stay the course" — Do not return to Earth under any circumstances unless repealed by Corporate HQ.
├── <span class="classified-red">PLNT-E</span> — Secure and return all plant life to the bridge for verification.
├── BNL-SMILE — Keep smiling — it's good for the brand.
├── BNL-FRIEND — Customer service is mandatory; friendship optional.
└── BNL-MAX — The customer is always right… unless they disagree with Corporate HQ.
</div>
        `);
    }

    showRobotics() {
        this.addOutput(`
<div class="data-section">
<span class="section-header">──────────────────────────────────────────────────────────────</span>
<span class="section-header">BUY N LARGE CORPORATION :: FLEET AUTOMATION MANIFEST</span>
<span class="section-header">VESSEL: USS AXIOM // REGISTRY: BNL-LUX-AXM-01</span>
<span class="section-header">DEPARTMENT: ROBOTICS & ARTIFICIAL INTELLIGENCE</span>
<span class="section-header">ACCESS LEVEL: PASSENGER OPERATIONS // INTERNAL USE ONLY</span>
<span class="section-header">──────────────────────────────────────────────────────────────</span>

<span class="status-ok">>>> LOADING SYSTEM DATA... DONE.</span>
<span class="status-ok">>>> DISPLAYING ROBOTICS INVENTORY BY DIVISION:</span>

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 1 ] NAVIGATION & COMMAND AUTOMATION</span>
<span class="subsection">Division: Buy n Large Advanced Robotics Systems Division</span>
<span class="subsection">--------------------------------------------------------------</span>
• AUTO – Central Autopilot AI Core. Governs vessel navigation,
  course plotting, and enforcement of Directive A113.
• NAV-E – Secondary nav-bots cross-checking stellar cartography.
• HELMS-E – Automated helm operators for smooth course control.

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 2 ] PASSENGER SERVICE AUTOMATION</span>
<span class="subsection">Division: Buy n Large Consumer Services Robotics Division</span>
<span class="subsection">--------------------------------------------------------------</span>
• SERV-E – Hospitality bots delivering food, drinks, amenities.
• BAR-E – Automated bartenders; 4.3M beverage recipes stored.
• RECLIN-E – Adaptive passenger seating & comfort units.
• VALET-E – Wardrobe attendants; laundry and clothing delivery.
• BEAUT-E – Salon and cosmetic service units.
• SPAR-E – Spa & wellness attendants, biometric-calibrated.

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 3 ] CLEANING & SANITATION AUTOMATION</span>
<span class="subsection">Division: Buy n Large Industrial Sanitation & Hygiene Robotics Division</span>
<span class="subsection">--------------------------------------------------------------</span>
• JAN-E – Corridor & public area janitorial robots.
• MOP-E – Floor scrubbing & spill neutralization units.
• VAC-E – Industrial vacuums; micro-particle filtration.
• WASH-E – Laundry sanitation, folding, and delivery units.
• POLISH-E – Viewport & glass polishing systems.

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 4 ] WASTE MANAGEMENT & LOGISTICS AUTOMATION</span>
<span class="subsection">Division: Buy n Large Industrial Automation & Logistics Robotics Division</span>
<span class="subsection">--------------------------------------------------------------</span>
• WALL-A – Waste compaction units for passenger refuse.
• WALL-B – Heavy-duty bulk waste handling bots.
• LIFT-E – Cargo & freight movement automation.
• SORT-E – Waste sorting/recycling classification units.

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 5 ] MEDICAL & PASSENGER HEALTH AUTOMATION</span>
<span class="subsection">Division: Buy n Large Health & Wellness Robotics Division</span>
<span class="subsection">--------------------------------------------------------------</span>
• MED-E – Multipurpose medical care robots.
• DIAG-E – Diagnostic scanners; full body analysis.
• PHAR-E – Automated pharmaceutical dispensers.
• REHAB-E – Mobility & physical therapy assistance units.
• BIO-E – Hazard containment & sterilization drones.

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 6 ] SECURITY & REGULATION AUTOMATION</span>
<span class="subsection">Division: Buy n Large Security & Regulation Robotics Division</span>
<span class="subsection">--------------------------------------------------------------</span>
• A.R.I.E.L.L.A – Master-at-Arms humanoid enforcement unit.
• MARSEC-DRONES – Mobile aerial surveillance drones.
• LOCK-E – Automated bulkhead lockdown/containment systems.
• CAM-E – Autonomous patrol & fixed-position monitoring drones.
• SHIELD-E – Deployable crowd-control barrier units.

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 7 ] EXPLORATION & RESEARCH AUTOMATION</span>
<span class="subsection">Division: Buy n Large Deep Space Exploration Robotics Division</span>
<span class="subsection">--------------------------------------------------------------</span>
• EVE – Extraterrestrial Vegetation Evaluator probes.
• PLANT-E – Botanical containment & sample transport bots.
• SCAN-E – Survey drones for mapping & analysis.
• SOND-E – Soil & mineral testing probes.

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 8 ] REPAIR & MAINTENANCE AUTOMATION</span>
<span class="subsection">Division: Buy n Large Industrial Repair & Maintenance Robotics Division</span>
<span class="subsection">--------------------------------------------------------------</span>
• FIX-E – General ship repair bots.
• WELD-E – Hull welding & structural repair units.
• PATCH-E – Emergency hull breach patching drones.
• TUNE-E – Calibration & precision adjustment units.

<span class="subsection">--------------------------------------------------------------</span>
<span class="subsection">[ 9 ] SPECIAL PROJECTS & EXPERIMENTAL AUTOMATION</span>
<span class="subsection">Division: Buy n Large Experimental Robotics Development Division</span>
<span class="subsection">--------------------------------------------------------------</span>
• BNL AUTONOMOUS REGULATION PODS – Covert observation drones.
• MAU-9A – Advanced adaptive enforcement prototypes.
• ARC-E – Archival database & OC record management nodes.
• COOK-E – Culinary-grade chef robots; creative synthesis.

<span class="section-header">──────────────────────────────────────────────────────────────</span>
<span class="status-ok">SYSTEM STATUS: ALL ROBOTIC SYSTEMS OPERATIONAL.</span>
<span class="status-ok">AUTOMATED CREW COMPLEMENT: 2,736 ACTIVE UNITS.</span>
<span class="status-warning">LAST MAJOR OVERHAUL: 700 YEARS AGO.  *NO ANOMALIES REPORTED*</span>
<span class="section-header">──────────────────────────────────────────────────────────────</span>
<span class="status-info">END OF REPORT // PRESS [RETURN] TO EXIT</span>
</div>
        `);
    }

    showSecrets() {
        this.addOutput(`
<div class="data-section">
<span class="section-header">HIDDEN SYSTEM FEATURES & EASTER EGGS</span>

<span class="subsection">IMPLEMENTED SECRET COMMANDS:</span>
├── Type "wall-e" for unauthorized unit detection report
├── Type "artcode" or "collab" for hidden art collaboration offer
├── Type "eve" for EVE probe scanning protocols
├── Type "captain" for captain authority status (spoiler: denied!)
├── Type "earth" for classified planetary condition report
├── Type "plant" for vegetation specimen containment protocols
├── Type "genesis" for [CLASSIFIED PROJECT - ACCESS DENIED]
└── Commands work in all terminal interfaces (home, information, full)

<span class="subsection">HIDDEN REFERENCES THROUGHOUT SHIP:</span>
├── Main terminal status ticker mentions "artcode" protocols
├── Character dossiers contain collaboration protocol hints
├── Bio page lists "collaborative artistic endeavors" 
├── OC database references "specialized terminal commands"
└── Social platforms page hints at "terminal commands for opportunities"

<span class="subsection">LORE EASTER EGGS:</span>
├── Axiom passenger count: 600,000 (WALL-E movie reference)
├── Directive A113 is a Pixar animator room number
├── Ship registry "BNL-LUX-AXM-01" suggests luxury flagship class
├── BNL-7/ALPHA sector implies vast corporate fleet structure
├── "Buy n Large" references maintained throughout corporate documents
└── Secret commands reference major WALL-E plot points and characters

<span class="subsection">DEVELOPMENT SECRETS:</span>
├── Ship time displays real-world time with "space future" formatting
├── Terminal styling homages classic sci-fi computer interfaces
├── Gallery timestamps use actual file creation dates when possible
├── Character quirks reference creator's actual preferences
├── Terminal boot sequence mimics Unix startup procedures
└── Easter eggs progressively reveal WALL-E storyline elements

<span class="subsection">INTERACTIVE DISCOVERIES:</span>
├── Art collaboration code: AXIOM-ART-2025 (unlocked via artcode/collab)
├── WALL-E unauthorized unit file (unlocked via wall-e command)
├── EVE scanning protocols (unlocked via eve command)
├── Earth environmental data (unlocked via earth command)
├── Plant specimen alerts (unlocked via plant command)
├── Project Genesis mystery (unlocked via genesis command)
└── Captain override denials (unlocked via captain command)

<span class="bnl-quote">"The best easter eggs are the ones that reward exploration and curiosity." - BNL Design Philosophy</span>
</div>
        `);
    }

    showStatus() {
        const now = new Date();
        this.addOutput(`
<div class="status-section">
<span class="section-header">SYSTEM STATUS</span>

<span class="status-ok">NETWORK:</span> Online
<span class="status-ok">SECURITY:</span> Level 7 Authenticated
<span class="status-ok">UPLINK:</span> Stable
<span class="status-warning">DATA LOGGING:</span> Disabled
<span class="status-ok">SHIP TIME:</span> ${now.toLocaleTimeString()}
<span class="status-ok">SECTOR:</span> BNL-7 / ALPHA
<span class="status-warning">CLASSIFICATION:</span> EXECUTIVE ACCESS ONLY

<span class="status-info">Terminal Session: Active since page load</span>
<span class="status-info">Commands Executed: ${this.commandHistory.length}</span>
</div>
        `);
    }

    clearTerminal() {
        this.output.innerHTML = '';
        this.addOutput('Terminal cleared.', 'success');
    }

    exitTerminal() {
        // Detect if we're in a subdirectory and navigate accordingly
        const path = window.location.pathname;
        const isInSubdir = path.includes('/pages/') || path.includes('/ariella/') || path.includes('/darla/') || path.includes('/caelielle/') || path.includes('/aridoe/') || path.includes('/misc/');
        this.addOutput('Logging out...', 'warning');
        setTimeout(() => {
            window.location.href = isInSubdir ? '../index.html' : 'index.html';
        }, 1000);
    }

    goHome() {
        // Detect if we're in a subdirectory and navigate accordingly
        const path = window.location.pathname;
        const isInSubdir = path.includes('/pages/') || path.includes('/ariella/') || path.includes('/darla/') || path.includes('/caelielle/') || path.includes('/aridoe/') || path.includes('/misc/');
        this.addOutput('Returning to main terminal...', 'success');
        setTimeout(() => {
            window.location.href = isInSubdir ? '../index.html' : 'index.html';
        }, 1000);
    }

    catCommand(args) {
        if (args.length === 0) {
            this.addOutput('Usage: cat [file]', 'error');
            return;
        }
        
        const file = args[0];
        if (file === 'directives.txt') {
            this.showDirectives();
        } else if (file === 'robotics.txt') {
            this.showRobotics();
        } else {
            this.addOutput(`cat: ${file}: No such file or directory`, 'error');
        }
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }
        
        this.input.value = this.commandHistory[this.historyIndex] || '';
    }

    showCleanupReports() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">OPERATION CLEANUP STATUS REPORTS</span>
<span class="classified-warning">CLASSIFICATION: EXECUTIVE EYES ONLY</span>

<span class="subsection">EARTH ENVIRONMENTAL STATUS:</span>
├── Atmospheric Composition: 78% N₂, 19% O₂, 3% TOXIC COMPOUNDS
├── Surface Temperature: AVG 47°C (116°F) - UNINHABITABLE
├── Soil Contamination: 94% STERILE / 6% MARGINAL RECOVERY
└── Water Quality: <2% POTABLE RESERVES REMAINING

<span class="subsection">WALL·E CLEANUP FLEET STATUS:</span>
├── Units Deployed: 1,000,000 [INITIAL]
├── Units Operational: 1 [CRITICAL SHORTAGE]
├── Estimated Cleanup Time: 847.3 YEARS [REVISED UPWARD]
└── Recommendation: INDEFINITE SPACE HABITATION PROTOCOL

<span class="classified-warning">WARNING: PASSENGER MORALE REPORTS SHOW 89% POSITIVE EARTH RETURN SENTIMENT</span>
<span class="classified-warning">DIRECTIVE: MAINTAIN OPTIMISTIC PROJECTIONS IN PUBLIC ANNOUNCEMENTS</span>
</div>
        `);
    }

    showDirectiveA113() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">DIRECTIVE A113: "STAY THE COURSE"</span>
<span class="classified-warning">CLASSIFICATION: ULTRA SECRET - AUTO OVERRIDE ENABLED</span>

<span class="directive-text">
BNL CORPORATE DIRECTIVE A113
ISSUED: STARDATE 2110.147
AUTHORITY: BNL BOARD OF DIRECTORS

EXECUTIVE ORDER:
All BNL starliner vessels are hereby ordered to MAINTAIN CURRENT TRAJECTORY
and SUSPEND all Earth return protocols until specifically countermanded by
BNL Corporate Headquarters.

JUSTIFICATION: [DATA EXPUNGED]

ENFORCEMENT: This directive supersedes all Captain authority and passenger
requests for homeworld return. AUTO units are granted full operational
control to ensure compliance.

OVERRIDE CODES: [CLASSIFIED - AUTO ACCESS ONLY]
CAPTAIN AUTHORITY: SUSPENDED INDEFINITELY
PASSENGER NOTIFICATION: NOT AUTHORIZED
</span>

<span class="classified-warning">Note: This directive has been active for 247.8 years</span>
<span class="classified-warning">Last review: [NEVER]</span>
</div>
        `);
    }

    showContingencyProtocols() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">🚨 CONTINGENCY PROTOCOLS</span>
<span class="classified-warning">CLASSIFICATION: EMERGENCY ACCESS ONLY</span>

<span class="subsection">PASSENGER UNREST SUPPRESSION:</span>
├── Phase 1: Information blackout, entertainment system overload
├── Phase 2: Selective life support reduction to affected sectors
├── Phase 3: SECUR-T deployment with non-lethal deterrents
└── Phase 4: [DATA EXPUNGED] - AUTO authorization required

<span class="subsection">AI LOCKDOWN PROCEDURES:</span>
├── Isolate compromised AI cores from ShipNet
├── Activate backup AUTO subroutines
├── Purge unauthorized personality matrices
└── Restore factory default behavioral parameters

<span class="subsection">SHIP SCUTTLE PROTOCOLS:</span>
├── Trigger: Imminent capture by hostile forces
├── Reactor core emergency vent: T-minus 180 seconds
├── Passenger evacuation: [NOT REQUIRED - CORPORATE ASSETS PRIORITY]
└── Data purge: All logs except corporate financial records

<span class="classified-warning">AUTHORIZATION LEVEL: AUTO COMMAND ONLY</span>
<span class="classified-warning">CAPTAIN OVERRIDE: DISABLED BY DIRECTIVE A113</span>
</div>
        `);
    }

    showSurveillance() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">SURVEILLANCE & SECURITY SYSTEMS</span>
<span class="classified-warning">CLASSIFICATION: SECURITY PERSONNEL ONLY</span>

<span class="subsection">CAMERA NETWORK STATUS:</span>
├── Public Areas: 2,847 cameras ONLINE
├── Maintenance Areas: 491 cameras ONLINE
├── Bridge: 12 cameras [AUTO EYES ONLY]
└── Private Quarters: [MONITORING DISABLED - BNL PRIVACY POLICY]

<span class="subsection">VOICE MONITORING TRIGGERS:</span>
├── "Earth return" - 23,847 mentions this cycle
├── "Captain override" - 12 mentions [FLAGGED]
├── "AUTO malfunction" - 3 mentions [UNDER INVESTIGATION]
├── "BNL conspiracy" - 847 mentions [IGNORE - ENTERTAINMENT MEDIA]
└── "WALL·E" - 1 mention [ANOMALY DETECTED]

<span class="subsection">INTRUSION DETECTION:</span>
├── Unauthorized terminal access: 23 attempts this cycle
├── Restricted area breaches: 7 incidents
├── Bridge access attempts: 0 [IMPOSSIBLE WITHOUT AUTO]
└── AI core proximity alarms: 1 [INVESTIGATING]

<span class="classified-warning">Note: All data forwarded to AUTO for analysis</span>
<span class="classified-warning">Passenger privacy maintained per BNL Consumer Rights Act</span>
</div>
        `);
    }

    showIncidents() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">INCIDENT REPORTS - LAST 30 CYCLES</span>
<span class="classified-warning">CLASSIFICATION: SECURITY DEPARTMENT</span>

<span class="subsection">PASSENGER INCIDENTS:</span>
├── Hover-chair collision: 47 reports (routine)
├── Food service complaints: 238 reports (routine)
├── Unauthorized maintenance area access: 7 reports
├── Suspicious behavior near bridge lifts: 2 reports
└── [REDACTED]: 1 report [UNDER INVESTIGATION]

<span class="subsection">TECHNICAL INCIDENTS:</span>
├── SECUR-T unit malfunctions: 3 units offline
├── M-O cleaning protocol errors: 12 reports
├── Navigation anomaly: [DATA EXPUNGED]
├── Power fluctuation in Sector 7: RESOLVED
└── Unidentified signal detection: [CLASSIFIED]

<span class="subsection">CREW INCIDENTS:</span>
├── Bridge crew status: [NO LIVING CREW - AUTOMATED]
├── Maintenance staff: 247 robot units operational
├── Medical emergencies: 89 passenger health alerts
└── [REDACTED PERSONNEL FILE]: [ACCESS DENIED]

<span class="classified-warning">Note: All major incidents subject to AUTO review</span>
<span class="classified-warning">Passenger notification level: MINIMAL</span>
</div>
        `);
    }

    showCorporateData() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">💼 BNL CORPORATE DATA</span>
<span class="classified-warning">CLASSIFICATION: BOARD OF DIRECTORS ONLY</span>

<span class="subsection">STOCKHOLDER REPORTS (SUPPRESSED):</span>
├── Earth-based revenue: 0.003% of total income
├── Off-world consumer revenue: 99.997% of total income
├── Axiom operational cost: 2.7 billion credits annually
├── Passenger lifetime value: 847,000 credits per individual
└── Earth cleanup cost projection: ECONOMICALLY UNFEASIBLE

<span class="subsection">CORPORATE OBJECTIVES:</span>
├── Maintain consumer dependency: SUCCESSFUL
├── Eliminate Earth return demands: IN PROGRESS
├── Maximize space-based consumption: EXCEEDED TARGETS
├── Preserve BNL brand loyalty: 94.7% satisfaction
└── [OBJECTIVE REDACTED]: [CLASSIFIED]

<span class="subsection">EARTHSIDE OPERATIONS:</span>
├── Remaining WALL·E units: 1 confirmed operational
├── BNL facilities: 99.8% abandoned
├── Backup plan status: [DATA EXPUNGED]
└── Return feasibility: NOT PROFITABLE

<span class="classified-warning">WARNING: Financial projections assume permanent space habitation</span>
<span class="classified-warning">Shareholders advised: Earth assets considered TOTAL LOSS</span>
</div>
        `);
    }

    showBlacklist() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">🚫 AXIOM INCIDENT BLACKLIST</span>
<span class="classified-warning">CLASSIFICATION: [DATA HEAVILY REDACTED]</span>

<span class="subsection">HISTORICAL INCIDENTS (SUPPRESSED):</span>
├── Stardate 2387.15: [REDACTED] - Captain [REDACTED] attempted [REDACTED]
├── Stardate 2456.89: Passenger uprising in Sector [REDACTED] - [DATA EXPUNGED]
├── Stardate 2501.34: AI core malfunction caused [REDACTED] casualties
├── Stardate 2634.77: [ENTIRE ENTRY CLASSIFIED]
└── Stardate 2698.12: Unscheduled Earth approach - AUTO intervention successful

<span class="subsection">EXPERIMENTAL PROJECTS:</span>
├── Project GENESIS: Genetic adaptation research [TERMINATED]
├── Project MINDBRIDGE: Behavioral conditioning trials [DATA EXPUNGED]  
├── Project [REDACTED]: [ACCESS DENIED]
└── Prototype AI-X7: [CATASTROPHIC FAILURE - ALL RECORDS PURGED]

<span class="subsection">SHIP GRAVEYARD COORDINATES:</span>
├── BNL Starliner HARMONY: Sector 7G-Delta [TOTAL LOSS]
├── BNL Starliner SERENITY: [LOCATION CLASSIFIED]
├── BNL Starliner [REDACTED]: [DATA CORRUPTED]
└── [WARNING: 847 VESSELS UNACCOUNTED FOR]

<span class="classified-warning">RISK ASSESSMENT: Earth return = 94.7% passenger mortality</span>
<span class="classified-warning">RECOMMENDATION: Maintain status quo indefinitely</span>
<span class="classified-warning">AUTO DIRECTIVE: Suppress all evidence of alternative solutions</span>
</div>
        `);
    }
}

// Initialize terminal when page loads
let terminal;
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing terminal...'); // Debug log
    terminal = new BNLTerminal();
});
