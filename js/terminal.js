class BNLTerminal {
    constructor() {
        this.output = document.getElementById('terminalOutput');
        this.input = document.getElementById('terminalInput');
        this.suggestions = document.getElementById('suggestions');
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.commands = {
            'help': this.showHelp,
            'clear': this.clearTerminal,
            'directives': this.showDirectives,
            'automation': this.showAutomation,
            'robotics': this.showRobotics,
            'technical': this.showTechnical,
            'secrets': this.showSecrets,
            'status': this.showStatus,
            'exit': this.exitTerminal,
            'ls': this.listCommands,
            'cat': this.catCommand,
            'home': this.goHome,
            'cleanup': this.showCleanupReports,
            'a113': this.showDirectiveA113,
            'contingency': this.showContingencyProtocols,
            'schematics': this.showSchematics,
            'surveillance': this.showSurveillance,
            'incidents': this.showIncidents,
            'corporate': this.showCorporateData,
            'blacklist': this.showBlacklist
        };

        this.init();
    }

    init() {
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('input', (e) => this.handleInput(e));
        
        // Blinking cursor
        setInterval(() => {
            const cursor = document.querySelector('.cursor');
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.executeCommand(this.input.value.trim());
            this.input.value = '';
            this.suggestions.innerHTML = '';
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
        if (!input) {
            this.suggestions.innerHTML = '';
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
        this.input.value = cmd;
        this.suggestions.innerHTML = '';
        this.input.focus();
    }

    autocomplete() {
        const value = this.input.value.toLowerCase();
        const matches = Object.keys(this.commands).filter cmd => cmd.startsWith(value));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        }
    }

    executeCommand(command) {
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        this.addOutput(`BNL-EXEC:~$ ${command}`, 'command');
        
        const [cmd, ...args] = command.toLowerCase().split(' ');
        
        // Easter egg commands
        if (cmd === 'wall-e') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">⚠️ UNAUTHORIZED UNIT DETECTED</span>
<span class="classified-warning">UNIT DESIGNATION: WALL·E</span>

Last known location: Earth cleanup sector 12-Alpha
Status: ROGUE - Operating outside BNL parameters
Threat level: MINIMAL - Unit shows no hostile intent
Recommendation: Avoid contact, do not interfere with operations

Note: Unit has been observed showing unusual emotional responses
WARNING: May possess plant specimen of unknown origin
</div>
            `, 'classified');
        } else if (cmd === 'plant') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">🌱 EVE DIRECTIVE ACTIVATED</span>
<span class="classified-warning">BOTANICAL SPECIMEN DETECTED</span>

Initiating Earth Viability Assessment...
Scanning for signs of photosynthetic life...
[CLASSIFIED] - Contact AUTO immediately if plant located
Directive: Return to Earth if viable plant specimen confirmed

WARNING: This directive supersedes Directive A113
AUTO authorization required for protocol execution
</div>
            `, 'classified');
        } else if (cmd === 'captain') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">🚫 AUTO OVERRIDE WARNING</span>
<span class="classified-warning">CAPTAIN AUTHORITY: SUSPENDED</span>

All command functions have been transferred to AUTO
Manual pilot controls: DISABLED
Navigation override: NOT AUTHORIZED
Emergency protocols: AUTO DISCRETION ONLY

Directive A113 remains in effect
Captain McCrea access level: OBSERVER ONLY
For ship safety, human judgment is not required
</div>
            `, 'classified');
        } else if (cmd === 'earth') {
            this.showCleanupReports();
        } else if (cmd === 'genesis') {
            this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">🧬 PROJECT GENESIS [TERMINATED]</span>
<span class="classified-warning">[DATA HEAVILY REDACTED]</span>

Project Status: TERMINATED - Ethical violations
Objective: [REDACTED] human adaptation for [REDACTED]
Duration: 2387-2401 (14 years)
Subjects: [DATA EXPUNGED]
Results: [CATASTROPHIC FAILURE]

Reason for termination: Unauthorized genetic modifications
Lead researcher: Dr. [REDACTED] - Status: DISAPPEARED
All research materials: DESTROYED BY AUTO DIRECTIVE
Survivors: [CLASSIFIED]

WARNING: Any attempt to restart this project is punishable by immediate spacing
</div>
            `, 'classified');
        } else if (cmd === 'konami') {
            this.addOutput(`
<div class="easter-egg-section">
<span class="section-header" style="color: #ff00ff;">🎮 KONAMI CODE ACTIVATED</span>

⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️

Congratulations! You found the secret Konami Code easter egg!
+30 lives awarded to your BNL account
Cheat mode: ENABLED for this session

Special abilities unlocked:
├── Infinite cocoa for Ari-Doe
├── Auto-pilot override (just kidding, AUTO won't allow it)
├── Access to Captain McCrea's secret cookie stash
└── Ability to pet all the maintenance robots

Remember: The real treasure was the commands we ran along the way!
</div>
            `, 'success');
        } else if (cmd === 'eve') {
            const now = new Date();
            if (now.getMonth() === 3 && now.getDate() === 22) { // April 22 - Earth Day
                this.addOutput(`
<div class="classified-section">
<span class="section-header" style="color: #00ff00;">🌍 EARTH DAY SPECIAL PROTOCOL</span>

Happy Earth Day from the USS Axiom!

EVE units worldwide are celebrating by:
├── Scanning for signs of life (still looking...)
├── Remembering what green looked like
├── Hoping that WALL·E is making progress down there
└── Dreaming of the day passengers can return home

Fun Earth Day fact: It's been 700+ years since anyone on this ship 
has seen a real tree, but we still remember what they meant to us.

Maybe someday... 🌱
</div>
                `, 'success');
            } else {
                this.addOutput(`EVE unit status: All units deployed to Earth surface. No response in 700+ years.`, 'warning');
            }
        } else if (cmd === 'artcode' || cmd === 'collab') {
            this.addOutput(`
<div class="easter-egg-section">
<span class="section-header" style="color: #ff69b4;">🎨 SECRET ART COLLABORATION CODE</span>

Congratulations! You found the hidden art collaboration easter egg!

🎉 SECRET CODE: <strong style="color: #00ff00;">AXIOM-ART-2025</strong> 🎉

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
First come, first served basis. 💖

<span style="color: #ffaa00;">Remember: You must mention finding this in the terminal for it to count!</span>
</div>
            `, 'success');
        } else if (this.commands[cmd]) {
            this.commands[cmd].call(this, args);
        } else if (command === '') {
            // Do nothing for empty command
        } else {
            this.addOutput(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
        }
        
        this.scrollToBottom();
    }

    addOutput(text, className = '') {
        const div = document.createElement('div');
        div.className = `output-line ${className}`;
        div.innerHTML = text;
        this.output.appendChild(div);
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    // Command implementations
    showHelp() {
        this.addOutput(`
<div class="help-section">
<span class="help-title">Available Commands:</span>

<span class="help-cmd">help</span>          - Show this help message
<span class="help-cmd">status</span>        - Show system status
<span class="help-cmd">directives</span>    - View BNL corporate directives
<span class="help-cmd">automation</span>    - View automation naming conventions
<span class="help-cmd">robotics</span>      - View BNL robotics naming protocol
<span class="help-cmd">technical</span>     - View technical specifications
<span class="help-cmd">secrets</span>       - View system easter eggs

<span class="classified-header">CLASSIFIED OPERATIONS:</span>
<span class="help-cmd">cleanup</span>       - Operation Cleanup status reports
<span class="help-cmd">a113</span>          - Directive A113 details
<span class="help-cmd">contingency</span>   - Emergency protocols
<span class="help-cmd">schematics</span>    - Ship infrastructure data
<span class="help-cmd">surveillance</span> - Security & monitoring systems
<span class="help-cmd">incidents</span>     - Ship incident reports
<span class="help-cmd">corporate</span>     - BnL corporate data
<span class="help-cmd">blacklist</span>     - [REDACTED] incident records

<span class="help-cmd">clear</span>         - Clear terminal output
<span class="help-cmd">ls</span>            - List available commands
<span class="help-cmd">cat [file]</span>    - Display file contents
<span class="help-cmd">home</span>          - Return to main terminal
<span class="help-cmd">exit</span>          - Exit terminal

<span class="help-tip">Tip: Use Tab for autocomplete, ↑/↓ for command history</span>
</div>
        `);
    }

    showDirectives() {
        this.addOutput(`
<div class="data-section">
<span class="section-header">📋 BNL CORPORATE DIRECTIVES</span>

<span class="directive">DIRECTIVE 1024-B: PASSENGER SAFETY PROTOCOLS</span>
└── All passenger records must be maintained in perpetuity
└── Character documentation serves dual purpose: entertainment & monitoring
└── A.R.I.E.L.L.A units tasked with maintaining passenger morale

<span class="directive">DIRECTIVE 402-C: INFORMATION SECURITY</span>
└── Personnel files classified above civilian clearance levels
└── Creator access limited to designated Creative Officers only
└── Social media monitoring mandatory for crew psychological profiles

<span class="directive">DIRECTIVE 7729-X: ENFORCEMENT PROTOCOLS</span>
└── Ariella-class units authorized for non-lethal force
└── Corporate interests supersede individual welfare (EXCEPT: see Protocol Override 7729-X-1)
└── Protocol Override 7729-X-1: Crew welfare prioritized in life-threatening scenarios

<span class="directive">DIRECTIVE XP-19: DATA PRIVACY COMPLIANCE</span>
└── All social interactions logged and archived
└── Privacy maintained through selective access controls
└── External platform monitoring conducted via secure channels
</div>
        `);
    }

    showAutomation() {
        this.addOutput(`
<div class="data-section">
<span class="section-header">🔤 AUTOMATION NAMING CONVENTIONS</span>

<span class="subsection">ARIELLA-CLASS DESIGNATION SCHEME:</span>
└── A.R.I.E.L.L.A = Automated Regulation Interface, Enforcement & Logistics Android
└── Prototype series: A.R.I.E.L.L.A-001 through A.R.I.E.L.L.A-099
└── Production series: A.R.I.E.L.L.A-100+

<span class="subsection">SHIP REGISTRY FORMAT:</span>
└── BNL-[FLEET]-[SHIP TYPE]-[NUMBER]
└── Example: BNL-7-ALPHA-001 (Flagship AXIOM)
└── Fleet 7: Deep Space Passenger Operations
└── Alpha designation: Command vessels

<span class="subsection">PASSENGER CLASSIFICATION:</span>
└── OC: Original Character (Creative personnel and their constructs)
└── REG: Regular passenger (Standard civilian)
└── ENV: Environmental specialist (Conservation roles)
└── MIS: Miscellaneous (Unclassified or special cases)

<span class="subsection">SECURITY CLEARANCE LEVELS:</span>
└── Level 1-2: Standard passengers
└── Level 3-4: Crew members
└── Level 5: Creative Officers
└── Level 6: Department heads
└── Level 7: Executive access
└── Level 8: Corporate Board (BNL HQ only)
</div>
        `);
    }

    showRobotics() {
        this.addOutput(`
<div class="data-section">
<span class="section-header">🤖 BNL ROBOTICS NAMING PROTOCOL</span>

<span class="subsection">KNOWN MODEL REGISTRY:</span>
WALL·E   | Waste Allocation Load Lifter – Earth-Class
EVE      | Extraterrestrial Vegetation Evaluator
M-O      | Microbe Obliterator
AUTO     | Autonomous Navigation AI Unit
BURN·E   | Basic Utilitarian Robot – Navigation Electric
PR-T     | Protocol Robot – Type T
VAQ-M    | Vacuum Maintenance Unit
SECUR-T  | Security Enforcement Unit – Type T
GOPH·E   | Go-pher Engineering Utility Bot

<span class="subsection">NAMING PATTERN:</span>
[ACRONYM] – [CLASS LETTER / MODEL VARIANT]
• Acronym represents the robot's primary function
• Class Letter designates production class, purpose, or deployment environment
• Optional SERIAL NUMBER appended for tracking
• Middle dot "·" used as corporate branding flourish

<span class="bnl-quote">"Every robot has a name. Every name has a purpose. That purpose… is Buy n Large."</span>
</div>
        `);
    }

    showTechnical() {
        this.addOutput(`
<div class="data-section">
<span class="section-header">⚙️ TECHNICAL SPECIFICATIONS</span>

<span class="subsection">AXIOM SHIP SYSTEMS:</span>
├── ShipNet: Internal network connecting all systems
├── Security Grid: Surveillance and access control
├── Passenger Management: Records, entertainment, welfare monitoring
└── Environmental Control: Life support, hydroponics, waste management

<span class="subsection">A.R.I.E.L.L.A SYSTEM ARCHITECTURE:</span>
├── Tactical Processing Core: Threat assessment and response planning
├── Social Interaction Matrix: Crew relations and diplomatic protocols
├── Morph-Shift Framework: Physical reconfiguration capabilities
└── ShipNet Integration: Real-time data access and reporting

<span class="subsection">FORM CONFIGURATION SYSTEM:</span>
├── Humanoid Mode: Diplomatic and patrol operations
├── Anthro Mode: Combat and high-mobility scenarios
├── Transition time: 2.8 seconds average
└── Emergency override: Instant deployment authorized
</div>
        `);
    }

    showSecrets() {
        this.addOutput(`
<div class="data-section">
<span class="section-header">🥚 HIDDEN SYSTEM FEATURES & EASTER EGGS</span>

<span class="subsection">SECRET ACCESS CODES:</span>
├── Type "konami" in any terminal for surprise
├── Click the BNL logo 10 times for hidden message
├── Type "eve" in terminal during Earth Day for special response
├── Hold Shift+Ctrl+Alt+D on any page for debug mode
└── Version number in footer links to classified terminal

<span class="subsection">HIDDEN CHARACTER REFERENCES:</span>
├── A.R.I.E.L.L.A's humor protocols reference classic sci-fi films
├── Darla's cocoa addiction is a nod to the creator's tea obsession
├── Caelielle's "Fly Me to the Moon" preference references Evangelion
├── Ari-Doe appears in system logs as "Darling Deer" (unofficial ID)
└── WALL·E references hidden throughout corporate directives

<span class="subsection">DEVELOPMENT SECRETS:</span>
├── Ship time actually syncs to creator's timezone
├── Camera feed placeholder shows space footage on loop
├── Security alerts reference real system maintenance times
├── Gallery timestamps use actual file creation dates when possible
└── Terminal boot sequence mimics actual Unix startup

<span class="subsection">LORE EASTER EGGS:</span>
├── Axiom passenger count: 600,000 (WALL-E movie reference)
├── Directive A113 is a Pixar animator room number
├── Ship registry "AXM-001" suggests first of many Axiom vessels
├── BNL-7/ALPHA sector implies vast corporate fleet structure
└── "Buy n Large" typo in old documents is intentional historical detail

<span class="subsection">INTERACTIVE SECRETS:</span>
├── Try typing "wall-e" in terminal for hidden response
├── Search for "plant" in any command for EVE protocol reference
├── Type "captain" for AUTO override warnings
├── Command "earth" triggers environmental status reports
└── "genesis" command reveals [CLASSIFIED] project files

<span class="bnl-quote">"The best easter eggs are the ones hidden in plain sight." - BNL Design Philosophy</span>
</div>
        `);
    }

    showStatus() {
        const now = new Date();
        this.addOutput(`
<div class="status-section">
<span class="section-header">📊 SYSTEM STATUS</span>

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
        this.addOutput('Logging out...', 'warning');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }

    goHome() {
        this.addOutput('Returning to main terminal...', 'success');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }

    listCommands() {
        this.addOutput(Object.keys(this.commands).join('  '));
    }

    catCommand(args) {
        if (args.length === 0) {
            this.addOutput('Usage: cat [file]', 'error');
            return;
        }
        
        const file = args[0];
        if (file === 'directives.txt') {
            this.showDirectives();
        } else if (file === 'automation.txt') {
            this.showAutomation();
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
<span class="section-header classified-red">⚠️ OPERATION CLEANUP STATUS REPORTS</span>
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
<span class="section-header classified-red">📋 DIRECTIVE A113: "STAY THE COURSE"</span>
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

    showSchematics() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">🏗️ AXIOM INFRASTRUCTURE SCHEMATICS</span>
<span class="classified-warning">CLASSIFICATION: MAINTENANCE PERSONNEL ONLY</span>

<span class="subsection">DECK LAYOUT (CLASSIFIED SECTIONS):</span>
├── Deck 1: Bridge, AUTO Command Center, Captain's Quarters [RESTRICTED]
├── Deck 2-15: Passenger Habitation [PUBLIC ACCESS]
├── Deck 16: Corporate Executive Suites [ABANDONED]
├── Deck 17-20: Life Support, Hydroponics [MAINTENANCE ACCESS]
├── Deck 21: AI Core Chamber [AUTO ACCESS ONLY]
├── Deck 22-25: Reactor Core [RADIATION HAZARD]
└── Deck 26: Ship Graveyard Storage [CLASSIFIED]

<span class="subsection">POWER GRID STATUS:</span>
├── Primary Reactor: 78% efficiency
├── Solar Array Network: 23 panels damaged, 89% operational
├── Backup Generators: 12/16 functional
└── Emergency Power: 72 hours maximum

<span class="subsection">ARTIFICIAL GRAVITY ZONES:</span>
├── Passenger Areas: 0.8G (comfort setting)
├── Maintenance Shafts: 0.3G (worker efficiency)
├── Bridge: 1.0G (Earth standard for command staff)
└── Reactor Core: 0.1G (safety protocol)

<span class="classified-warning">Note: Service corridors provide unrestricted ship access</span>
</div>
        `);
    }

    showSurveillance() {
        this.addOutput(`
<div class="classified-section">
<span class="section-header classified-red">👁️ SURVEILLANCE & SECURITY SYSTEMS</span>
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
<span class="section-header classified-red">📋 INCIDENT REPORTS - LAST 30 CYCLES</span>
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
    terminal = new BNLTerminal();
});
