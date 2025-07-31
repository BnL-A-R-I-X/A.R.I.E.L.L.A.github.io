class HomeTerminal {
    constructor() {
        this.output = document.getElementById('homeTerminalOutput');
        this.input = document.getElementById('homeTerminalInput');
        this.suggestions = document.getElementById('homeSuggestions');
        
        this.commands = {
            'help': this.showHelp,
            'status': this.showStatus,
            'directives': this.showDirectives,
            'clear': this.clearTerminal,
            'full': this.openFullTerminal
        };

        this.init();
    }

    init() {
        if (!this.input) return;
        
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('input', (e) => this.handleInput(e));
        
        // Blinking cursor
        setInterval(() => {
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
            }
        }, 500);
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.executeCommand(this.input.value.trim());
            this.input.value = '';
            this.suggestions.innerHTML = '';
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
            .slice(0, 3);

        if (matches.length > 0) {
            this.suggestions.innerHTML = matches
                .map(cmd => `<span class="suggestion" onclick="homeTerminal.selectSuggestion('${cmd}')">${cmd}</span>`)
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
        this.addOutput(`BNL-EXEC:~$ ${command}`, 'command');
        
        const cmd = command.toLowerCase();
        
        if (this.commands[cmd]) {
            this.commands[cmd].call(this);
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

    showHelp() {
        this.addOutput(`
<div class="help-section">
<span class="help-title">Available Commands:</span>

<span class="help-cmd">help</span>       - Show this help message
<span class="help-cmd">status</span>     - Show system status
<span class="help-cmd">directives</span> - View corporate directives (preview)
<span class="help-cmd">clear</span>      - Clear terminal output
<span class="help-cmd">full</span>       - Open full information terminal

<span class="help-tip">For complete access, use the 'full' command or <a href="pages/information.html" class="terminal-link">click here</a></span>
</div>
        `);
    }

    showStatus() {
        const now = new Date();
        this.addOutput(`
<div class="status-section">
<span class="section-header">📊 SYSTEM STATUS</span>

<span class="status-ok">NETWORK:</span> Online
<span class="status-ok">SHIP STATUS:</span> Operational
<span class="status-ok">SHIP TIME:</span> ${now.toLocaleTimeString()}
<span class="status-ok">SECTOR:</span> BNL-7 / ALPHA
<span class="status-ok">PASSENGERS:</span> All characters accounted for
<span class="status-info">Terminal: Home interface active</span>
</div>
        `);
    }

    showDirectives() {
        this.addOutput(`
<div class="data-section">
<span class="section-header">📋 BNL CORPORATE DIRECTIVES (PREVIEW)</span>

<span class="directive">DIRECTIVE 1024-B: PASSENGER SAFETY PROTOCOLS</span>
└── All passenger records must be maintained in perpetuity
└── Character documentation serves dual purpose: entertainment & monitoring

<span class="directive">DIRECTIVE 402-C: INFORMATION SECURITY</span>
└── Personnel files classified above civilian clearance levels
└── Creator access limited to designated Creative Officers only

<span class="help-tip">For complete directive list, use command 'full' or visit the <a href="pages/information.html" class="terminal-link">full terminal</a></span>
</div>
        `);
    }

    clearTerminal() {
        this.output.innerHTML = `
<div class="boot-sequence">
    <div class="boot-line">Terminal cleared.</div>
    <div class="boot-line help">Type 'help' for available commands.</div>
</div>
        `;
    }

    openFullTerminal() {
        this.addOutput('Redirecting to full information terminal...', 'success');
        setTimeout(() => {
            window.location.href = 'pages/information.html';
        }, 1000);
    }
}

// Clear function for the close button
function clearHomeTerminal() {
    const output = document.getElementById('homeTerminalOutput');
    const input = document.getElementById('homeTerminalInput');
    
    if (output) {
        output.innerHTML = `
<div class="boot-sequence">
    <div class="boot-line">Terminal reset.</div>
    <div class="boot-line help">Type 'help' for available commands.</div>
</div>
        `;
    }
    
    if (input) {
        input.value = '';
    }
}

// Initialize terminal when page loads
let homeTerminal;
document.addEventListener('DOMContentLoaded', () => {
    homeTerminal = new HomeTerminal();
});
