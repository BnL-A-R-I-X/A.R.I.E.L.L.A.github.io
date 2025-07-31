// Commission Queue System
// Handles displaying active commissions on the public queue page
// Now powered by Firebase for real-time data sync

class CommissionQueue {
  constructor() {
    this.updateInterval = null;
    this.firebaseSystem = null;
    this.init();
  }

  init() {
    this.waitForFirebase();
  }

  async waitForFirebase() {
    // Wait for Firebase commission system to be ready
    const checkFirebase = () => {
      if (window.firebaseCommissionSystem) {
        this.firebaseSystem = window.firebaseCommissionSystem;
        this.setupFirebaseListeners();
        this.renderTable();
        this.updateStats();
        this.loadRecentUpdates();
        console.log('📋 Commission Queue connected to Firebase');
        
        // Set up periodic updates (less frequent since we have real-time)
        this.updateInterval = setInterval(() => {
          this.updateStats();
          this.loadRecentUpdates();
        }, 60000); // Update every minute
      } else {
        setTimeout(checkFirebase, 100);
      }
    };
    checkFirebase();
  }

  setupFirebaseListeners() {
    if (this.firebaseSystem) {
      // Listen for commission data changes
      this.firebaseSystem.addListener((action, commissions) => {
        console.log(`🔄 Commission queue received ${action} event`);
        this.renderTable();
        this.updateStats();
        this.loadRecentUpdates();
      });
    }
  }

  renderTable() {
    const tableBody = document.getElementById('commission-table-body');
    const emptyState = document.getElementById('empty-queue');
    
    if (!tableBody || !this.firebaseSystem) return;

    // Filter to only show public commissions
    const publicCommissions = this.firebaseSystem.getPublicCommissions();

    if (publicCommissions.length === 0) {
      tableBody.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    tableBody.innerHTML = publicCommissions.map(commission => {
      return `
        <tr class="commission-row status-${commission.status}" data-id="${commission.id}">
          <td class="queue-id">${commission.id}</td>
          <td class="commission-title">
            <div class="title-main">${commission.title}</div>
            ${commission.description ? `<div class="title-desc">${commission.description}</div>` : ''}
          </td>
          <td class="characters">
            ${commission.characters.map(char => `<span class="character-tag">${char}</span>`).join('')}
          </td>
          <td class="commission-type">${commission.type}</td>
          <td class="status-cell">
            <span class="status-badge status-${commission.status}">
              ${this.formatStatus(commission.status)}
            </span>
          </td>
          <td class="progress-cell">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${commission.progress || 0}%"></div>
              <span class="progress-text">${commission.progress || 0}%</span>
            </div>
          </td>
          <td class="completion-date">
            ${commission.estimatedCompletion ? this.formatDate(commission.estimatedCompletion) : 'TBD'}
          </td>
          <td class="artist-name">${commission.artist || 'Pending'}</td>
        </tr>
      `;
    }).join('');
  }

  formatStatus(status) {
    const statusMap = {
      'planning': '📋 Planning',
      'queued': '⏳ Queued',
      'in-progress': '🎨 In Progress',
      'review': '👀 Review',
      'revisions': '✏️ Revisions',
      'completed': '✅ Completed',
      'delivered': '📦 Delivered',
      'on-hold': '⏸️ On Hold',
      'cancelled': '❌ Cancelled'
    };
    return statusMap[status] || status;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  updateStats() {
    if (!this.firebaseSystem) return;

    const stats = this.firebaseSystem.getPublicStatusCounts();
    
    const totalElement = document.getElementById('total-queue');
    const inProgressElement = document.getElementById('in-progress');
    const waitingElement = document.getElementById('waiting');
    const completedElement = document.getElementById('completed');

    if (totalElement) totalElement.textContent = stats.total;
    if (inProgressElement) inProgressElement.textContent = stats.inProgress;
    if (waitingElement) waitingElement.textContent = stats.waiting;
    if (completedElement) completedElement.textContent = stats.completed;
  }

  loadRecentUpdates() {
    const updatesList = document.getElementById('updates-list');
    if (!updatesList || !this.firebaseSystem) return;

    // Get recent updates from public commissions
    const publicCommissions = this.firebaseSystem.getPublicCommissions();
    const recentUpdates = publicCommissions
      .filter(comm => comm.lastUpdate)
      .sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate))
      .slice(0, 5)
      .map(comm => ({
        date: comm.lastUpdate,
        message: `${comm.title} - ${this.formatStatus(comm.status)} (${comm.progress || 0}% complete)`
      }));

    if (recentUpdates.length === 0) {
      updatesList.innerHTML = '<div class="no-updates">No recent updates available.</div>';
      return;
    }

    updatesList.innerHTML = recentUpdates.map(update => `
      <div class="update-item">
        <div class="update-date">${this.formatDate(update.date)}</div>
        <div class="update-message">${update.message}</div>
      </div>
    `).join('');
  }

  refresh() {
    if (this.firebaseSystem) {
      // Firebase automatically syncs, but we can force a refresh
      this.firebaseSystem.loadCommissions();
      console.log('🔄 Commission queue refreshed');
    }
  }
}

// Initialize queue system when page loads
let commissionQueue;
document.addEventListener('DOMContentLoaded', () => {
  commissionQueue = new CommissionQueue();
});

// Clean up interval on page unload
window.addEventListener('beforeunload', () => {
  if (commissionQueue && commissionQueue.updateInterval) {
    clearInterval(commissionQueue.updateInterval);
  }
});
