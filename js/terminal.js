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
            'cat': this.catCommand
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
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(value));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        }
    }

    executeCommand(command) {
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        this.addOutput(`BNL-EXEC:~$ ${command}`, 'command');
        
        const [cmd, ...args] = command.toLowerCase().split(' ');
        
        if (this.commands[cmd]) {
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
<span class="help-cmd">directives</span>    - View BNL corporate directives
<span class="help-cmd">automation</span>    - View automation naming conventions
<span class="help-cmd">robotics</span>      - View BNL robotics naming protocol
<span class="help-cmd">technical</span>     - View technical specifications
<span class="help-cmd">secrets</span>       - View system easter eggs
<span class="help-cmd">status</span>        - Show system status
<span class="help-cmd">clear</span>         - Clear terminal output
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
<span class="section-header">🥚 SYSTEM EASTER EGGS & SECRETS</span>

<span class="subsection">HIDDEN ACCESS METHODS:</span>
└── Information Terminal: Accessible via "/pages/information.html"
└── Direct gallery access: "/[character]/images/[category]/[filename]"
└── Raw data files: "/[character]/gallery-data.js"

<span class="subsection">PERSONALITY QUIRKS (INTENTIONAL):</span>
├── A.R.I.E.L.L.A: Humor subroutines activate during low-stress periods
├── Darla: Secretly plants virtual seeds in ship computer systems
├── Caelielle: Favorite song "Fly Me to the Moon" triggers nostalgic protocols
└── Ari-Doe: Cocoa consumption counter increases even during system downtime

<span class="subsection">DEVELOPMENT SECRETS:</span>
├── Character cards: Hover effects inspired by holographic ID badges
├── Terminal styling: Homage to classic sci-fi computer interfaces
├── Status ticker: Contains references to character development lore
└── Ship time: Actually displays real-world UTC with "future space" labeling
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
}

// Initialize terminal when page loads
let terminal;
document.addEventListener('DOMContentLoaded', () => {
    terminal = new BNLTerminal();
});
