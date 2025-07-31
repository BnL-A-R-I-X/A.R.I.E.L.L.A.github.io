class FullTerminal {
    constructor() {
        this.output = document.getElementById('terminalOutput');
        this.input = document.getElementById('terminalInput');
        this.suggestions = document.getElementById('suggestions');
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.commands = {
            'help': () => this.showHelp(),
            'clear': () => this.clearTerminal(),
            'status': () => this.showStatus(),
            'exit': () => this.exitTerminal(),
            'home': () => this.goHome(),
            'artcode': () => this.showArtCode(),
            'collab': () => this.showArtCode(),
            'directives': () => this.showDirectives(),
            'automation': () => this.showAutomation(),
            'robotics': () => this.showRobotics(),
            'technical': () => this.showTechnical(),
            'secrets': () => this.showSecrets()
        };

        this.init();
    }

    init() {
        console.log('Full terminal initializing...');
        
        if (!this.input || !this.output) {
            console.error('Terminal elements not found');
            return;
        }
        
        // Add event listeners
        this.input.addEventListener('keydown', (e) => {
            console.log('Key pressed:', e.key);
            if (e.key === 'Enter') {
                e.preventDefault();
                const command = this.input.value.trim();
                console.log('Executing:', command);
                this.executeCommand(command);
                this.input.value = '';
            }
        });
        
        // Focus input
        this.input.focus();
        
        console.log('Full terminal initialized');
    }

    executeCommand(command) {
        this.commandHistory.push(command);
        this.addOutput(`BNL-EXEC:~$ ${command}`, 'command');
        
        const cmd = command.toLowerCase();
        
        if (this.commands[cmd]) {
            this.commands[cmd]();
        } else if (command === '') {
            // Do nothing
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
<span class="help-cmd">artcode</span>       - Special collaboration feature
<span class="help-cmd">clear</span>         - Clear terminal output
<span class="help-cmd">home</span>          - Return to main terminal
<span class="help-cmd">exit</span>          - Exit terminal

<span class="help-tip">Tip: Try typing 'artcode' for a special surprise!</span>
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
<span class="status-ok">SHIP TIME:</span> ${now.toLocaleTimeString()}
<span class="status-ok">SECTOR:</span> BNL-7 / ALPHA
<span class="status-warning">CLASSIFICATION:</span> EXECUTIVE ACCESS ONLY

<span class="status-info">Terminal: Full access mode</span>
<span class="status-info">Commands Executed: ${this.commandHistory.length}</span>
</div>
        `);
    }

    showArtCode() {
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
</div>
        `);
    }

    showSecrets() {
        this.addOutput(`
<div class="data-section">
<span class="section-header">🥚 HIDDEN SYSTEM FEATURES & EASTER EGGS</span>

<span class="subsection">SECRET ACCESS CODES:</span>
├── Type "artcode" or "collab" for special collaboration offer
├── Click the BNL logo 10 times for hidden message
├── Version number in footer links to classified terminal
└── Hold Shift+Ctrl+Alt+D on any page for debug mode

<span class="subsection">DEVELOPMENT SECRETS:</span>
├── Ship time actually syncs to creator's timezone
├── Camera feed placeholder shows space footage on loop
├── Security alerts reference real system maintenance times
└── Terminal boot sequence mimics actual Unix startup

<span class="bnl-quote">"The best easter eggs are the ones hidden in plain sight." - BNL Design Philosophy</span>
</div>
        `);
    }

    clearTerminal() {
        this.output.innerHTML = '';
        this.addOutput('Terminal cleared.', 'success');
    }

    exitTerminal() {
        this.addOutput('Exiting terminal...', 'warning');
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
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating full terminal...');
    new FullTerminal();
});
