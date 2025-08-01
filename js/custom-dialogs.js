/**
 * Custom Dialog System for BNL/Axiom Theme
 * Replaces browser dialogs with themed, consistent modals
 */

class CustomDialogs {
  constructor() {
    this.createDialogHTML();
    this.setupEventListeners();
  }

  createDialogHTML() {
    // Remove existing dialog container if it exists
    const existing = document.getElementById('custom-dialog-container');
    if (existing) {
      existing.remove();
    }

    // Determine the correct path to assets based on current location
    const currentPath = window.location.pathname;
    let logoPath = 'assets/logos/axiom.png';
    
    // If we're in a subfolder, go up one level
    if (currentPath.includes('/pages/') || currentPath.includes('/ariella/') || 
        currentPath.includes('/darla/') || currentPath.includes('/caelielle/') || 
        currentPath.includes('/aridoe/') || currentPath.includes('/misc/')) {
      logoPath = '../assets/logos/axiom.png';
    }

    const dialogHTML = `
      <div id="custom-dialog-container" class="dialog-overlay" style="display: none;">
        <div class="dialog-panel">
          <div class="dialog-header">
            <img src="${logoPath}" alt="BNL Logo" class="dialog-logo">
            <h1 id="dialog-title">🔒 BNL SYSTEM DIALOG</h1>
            <p id="dialog-subtitle" class="dialog-subtitle">System Message</p>
          </div>
          
          <div class="dialog-content">
            <p id="dialog-message" class="dialog-message"></p>
            <div id="dialog-input-container" class="dialog-input-container" style="display: none;">
              <label id="dialog-input-label" class="dialog-input-label">Input:</label>
              <input type="text" id="dialog-input" class="dialog-input" placeholder="">
            </div>
          </div>
          
          <div class="dialog-buttons">
            <button id="dialog-confirm" class="dialog-button confirm-button">CONFIRM</button>
            <button id="dialog-cancel" class="dialog-button cancel-button" style="display: none;">CANCEL</button>
          </div>
          
          <div class="dialog-notice">
            <p>⚠️ BNL SYSTEM INTERFACE</p>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', dialogHTML);
  }

  setupEventListeners() {
    const container = document.getElementById('custom-dialog-container');
    const confirmBtn = document.getElementById('dialog-confirm');
    const cancelBtn = document.getElementById('dialog-cancel');
    const input = document.getElementById('dialog-input');

    // Close on overlay click
    container.addEventListener('click', (e) => {
      if (e.target === container) {
        this.hideDialog();
        if (this.currentReject) {
          this.currentReject(false);
        }
      }
    });

    // Confirm button
    confirmBtn.addEventListener('click', () => {
      const inputValue = input.value;
      this.hideDialog();
      if (this.currentResolve) {
        this.currentResolve(this.dialogType === 'prompt' ? inputValue : true);
      }
    });

    // Cancel button
    cancelBtn.addEventListener('click', () => {
      this.hideDialog();
      if (this.currentReject) {
        this.currentReject(false);
      }
    });

    // Enter key handling
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        confirmBtn.click();
      }
    });

    // Escape key handling
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && container.style.display !== 'none') {
        cancelBtn.click();
      }
    });
  }

  showDialog() {
    const container = document.getElementById('custom-dialog-container');
    container.style.display = 'flex';
    
    // Focus input if it's visible
    const input = document.getElementById('dialog-input');
    if (input.style.display !== 'none') {
      setTimeout(() => input.focus(), 100);
    }
  }

  hideDialog() {
    const container = document.getElementById('custom-dialog-container');
    container.style.display = 'none';
    
    // Clear input
    const input = document.getElementById('dialog-input');
    input.value = '';
  }

  // Custom Alert
  alert(message, title = '🔒 BNL SYSTEM ALERT', subtitle = 'System Notification') {
    return new Promise((resolve) => {
      this.dialogType = 'alert';
      this.currentResolve = resolve;
      this.currentReject = null;

      document.getElementById('dialog-title').textContent = title;
      document.getElementById('dialog-subtitle').textContent = subtitle;
      document.getElementById('dialog-message').textContent = message;
      document.getElementById('dialog-input-container').style.display = 'none';
      document.getElementById('dialog-cancel').style.display = 'none';
      document.getElementById('dialog-confirm').textContent = 'ACKNOWLEDGE';

      this.showDialog();
    });
  }

  // Custom Confirm
  confirm(message, title = '🔒 BNL SECURITY CONFIRMATION', subtitle = 'Action Confirmation Required') {
    return new Promise((resolve, reject) => {
      this.dialogType = 'confirm';
      this.currentResolve = resolve;
      this.currentReject = reject;

      document.getElementById('dialog-title').textContent = title;
      document.getElementById('dialog-subtitle').textContent = subtitle;
      document.getElementById('dialog-message').textContent = message;
      document.getElementById('dialog-input-container').style.display = 'none';
      document.getElementById('dialog-cancel').style.display = 'inline-block';
      document.getElementById('dialog-confirm').textContent = 'CONFIRM';

      this.showDialog();
    });
  }

  // Custom Prompt
  prompt(message, defaultValue = '', title = '🔒 BNL DATA INPUT', subtitle = 'Information Required') {
    return new Promise((resolve, reject) => {
      this.dialogType = 'prompt';
      this.currentResolve = resolve;
      this.currentReject = reject;

      document.getElementById('dialog-title').textContent = title;
      document.getElementById('dialog-subtitle').textContent = subtitle;
      document.getElementById('dialog-message').textContent = message;
      document.getElementById('dialog-input-container').style.display = 'block';
      document.getElementById('dialog-input').value = defaultValue;
      document.getElementById('dialog-input').placeholder = defaultValue;
      document.getElementById('dialog-cancel').style.display = 'inline-block';
      document.getElementById('dialog-confirm').textContent = 'SUBMIT';

      this.showDialog();
    });
  }

  // Specialized dialogs for different contexts
  securityAlert(message) {
    return this.alert(message, '🚨 BNL SECURITY ALERT', 'Security Protocol Activated');
  }

  commissionDialog(message, type = 'alert') {
    const title = '💼 COMMISSION SYSTEM';
    const subtitle = 'Commission Management Interface';
    
    if (type === 'confirm') {
      return this.confirm(message, title, subtitle);
    } else if (type === 'prompt') {
      return this.prompt(message, '', title, subtitle);
    } else {
      return this.alert(message, title, subtitle);
    }
  }

  rankingDialog(message, type = 'alert') {
    const title = '📊 RANKING SYSTEM';
    const subtitle = 'Character Rating Interface';
    
    if (type === 'confirm') {
      return this.confirm(message, title, subtitle);
    } else {
      return this.alert(message, title, subtitle);
    }
  }
}

// Initialize the custom dialog system
const customDialogs = new CustomDialogs();

// Override global functions to use custom dialogs
window.alert = (message) => customDialogs.alert(message);
window.confirm = (message) => customDialogs.confirm(message);
window.prompt = (message, defaultValue) => customDialogs.prompt(message, defaultValue);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CustomDialogs;
}
