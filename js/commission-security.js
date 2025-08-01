// Commission Security System
// Handles authentication for the private commission archive

class CommissionSecurity {
  constructor() {
    this.correctPin = '3272';
    this.maxAttempts = 3;
    this.attempts = 0;
    this.init();
  }

  init() {
    // Hide main content initially
    const mainContent = document.getElementById('main-content');
    const securityScreen = document.getElementById('security-screen');
    
    if (mainContent) mainContent.classList.add('hidden');
    if (securityScreen) securityScreen.classList.remove('hidden');

    // Bind event listeners
    this.bindEvents();

    // Check if already authenticated in this session
    if (sessionStorage.getItem('commission-access') === 'granted') {
      this.grantAccess();
    }
  }

  bindEvents() {
    const accessBtn = document.getElementById('access-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const pincodeInput = document.getElementById('pincode');
    const logoutBtn = document.getElementById('logout-btn');

    if (accessBtn) {
      accessBtn.addEventListener('click', () => this.validatePin());
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.cancelAccess());
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    if (pincodeInput) {
      // Allow Enter key to submit
      pincodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.validatePin();
        }
      });

      // Auto-focus the input
      pincodeInput.focus();
    }
  }

  validatePin() {
    const pincodeInput = document.getElementById('pincode');
    const enteredPin = pincodeInput.value.trim();

    if (enteredPin === this.correctPin) {
      this.grantAccess();
    } else {
      this.handleFailedAttempt();
    }
  }

  grantAccess() {
    // Store access in session storage
    sessionStorage.setItem('commission-access', 'granted');

    // Hide security screen and show main content
    const securityScreen = document.getElementById('security-screen');
    const mainContent = document.getElementById('main-content');

    if (securityScreen) {
      securityScreen.style.opacity = '0';
      setTimeout(() => {
        securityScreen.classList.add('hidden');
      }, 300);
    }

    if (mainContent) {
      setTimeout(() => {
        mainContent.classList.remove('hidden');
        mainContent.style.opacity = '0';
        setTimeout(() => {
          mainContent.style.opacity = '1';
        }, 100);
      }, 300);
    }

    // Log successful access (for debugging)
    console.log('🔒 Commission archive access granted');

    // Show success animation
    this.showAccessGranted();
  }

  showAccessGranted() {
    const securityPanel = document.querySelector('.security-panel');
    if (securityPanel) {
      securityPanel.style.borderColor = '#00ff00';
      securityPanel.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
    }
  }

  handleFailedAttempt() {
    this.attempts++;
    const pincodeInput = document.getElementById('pincode');

    // Clear the input
    if (pincodeInput) {
      pincodeInput.value = '';
      pincodeInput.style.borderColor = '#ff0000';
      pincodeInput.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
      
      // Reset visual feedback after a moment
      setTimeout(() => {
        pincodeInput.style.borderColor = '';
        pincodeInput.style.boxShadow = '';
      }, 1000);
    }

    // Show error message
    this.showSecurityAlert();

    // If too many attempts, redirect to home
    if (this.attempts >= this.maxAttempts) {
      this.securityLockout();
    }
  }

  showSecurityAlert() {
    const securityPanel = document.querySelector('.security-panel');
    if (securityPanel) {
      securityPanel.style.borderColor = '#ff0000';
      securityPanel.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
      
      setTimeout(() => {
        securityPanel.style.borderColor = '';
        securityPanel.style.boxShadow = '';
      }, 2000);
    }

    // Create temporary error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'security-error';
    errorMsg.innerHTML = `
      <p>❌ ACCESS DENIED</p>
      <p>Invalid security code. Attempt ${this.attempts}/${this.maxAttempts}</p>
    `;
    
    const accessForm = document.querySelector('.access-form');
    if (accessForm) {
      accessForm.appendChild(errorMsg);
      
      setTimeout(() => {
        if (errorMsg.parentNode) {
          errorMsg.parentNode.removeChild(errorMsg);
        }
      }, 3000);
    }
  }

  async securityLockout() {
    // Show lockout warning
    await customDialogs.securityAlert('🚨 SECURITY BREACH DETECTED\n\nToo many failed access attempts.\nRedirecting to home terminal for security review.');
    
    // Log security incident
    console.warn('🚨 Commission archive: Too many failed access attempts');
    
    // Redirect to home
    window.location.href = '../index.html';
  }

  async cancelAccess() {
    try {
      // Show cancellation message
      const confirmCancel = await customDialogs.confirm('Cancel access to commission archive?\n\nYou will be returned to the home terminal.', '🔒 BNL ACCESS CONTROL', 'Confirm Navigation');
      
      if (confirmCancel) {
        window.location.href = '../index.html';
      }
    } catch (error) {
      // User cancelled or closed dialog
      console.log('Cancel access dialog dismissed');
    }
  }

  async logout() {
    // Clear session storage
    sessionStorage.removeItem('commission-access');
    
    try {
      // Show logout confirmation
      const confirmLogout = await customDialogs.confirm('🔒 SECURITY LOGOUT\n\nEnd classified session and return to home terminal?', '🔒 BNL SECURITY LOGOUT', 'Session Management');
      
      if (confirmLogout) {
        window.location.href = '../index.html';
      }
    } catch (error) {
      // User cancelled logout
      console.log('Logout cancelled');
    }
  }
}

// Initialize security system when page loads
document.addEventListener('DOMContentLoaded', () => {
  new CommissionSecurity();
});

// Prevent back button access without authentication
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page loaded from cache, re-check authentication
    if (!sessionStorage.getItem('commission-access')) {
      window.location.reload();
    }
  }
});

// Clear access on tab close/refresh
window.addEventListener('beforeunload', () => {
  // Don't clear on refresh, only on actual navigation away
  // sessionStorage will handle this automatically
});
