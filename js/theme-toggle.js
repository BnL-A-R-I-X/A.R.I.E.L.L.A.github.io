/**
 * Theme Toggle System
 * Handles switching between dark and light modes with dark as default
 */

class ThemeManager {
    constructor() {
        this.themeKey = 'axiom-theme';
        this.defaultTheme = 'dark';
        this.currentTheme = this.getStoredTheme() || this.defaultTheme;
        
        this.init();
    }

    init() {
        // Apply the current theme immediately
        this.applyTheme(this.currentTheme);
        
        // Create theme toggle button
        this.createToggleButton();
        
        // Add event listeners
        this.setupEventListeners();
    }

    getStoredTheme() {
        return localStorage.getItem(this.themeKey);
    }

    setStoredTheme(theme) {
        localStorage.setItem(this.themeKey, theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.setStoredTheme(theme);
        this.updateToggleButton();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'theme-toggle';
        toggleButton.className = 'theme-toggle-btn';
        toggleButton.setAttribute('aria-label', 'Toggle theme');
        toggleButton.innerHTML = this.getButtonContent();
        
        // Find the header and add the button
        const header = document.querySelector('.site-header .header-inner');
        if (header) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'theme-toggle-container';
            buttonContainer.appendChild(toggleButton);
            header.appendChild(buttonContainer);
        }
    }

    getButtonContent() {
        if (this.currentTheme === 'dark') {
            return `
                <span class="toggle-icon">☀️</span>
                <span class="toggle-text">LIGHT MODE</span>
            `;
        } else {
            return `
                <span class="toggle-icon">🌙</span>
                <span class="toggle-text">DARK MODE</span>
            `;
        }
    }

    updateToggleButton() {
        const button = document.getElementById('theme-toggle');
        if (button) {
            button.innerHTML = this.getButtonContent();
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#theme-toggle')) {
                this.toggleTheme();
            }
        });

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Also export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
