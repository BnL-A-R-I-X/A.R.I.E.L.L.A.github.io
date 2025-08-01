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
      const primaryChar = commission.character || (commission.characters && commission.characters[0]) || 'Unknown';
      const additionalChars = commission.characters ? commission.characters.slice(1) : [];
      
      return `
        <tr class="commission-row status-${commission.status}" data-id="${commission.id}">
          <td class="artist-name">${commission.artist || 'TBD'}</td>
          <td class="commission-date">
            ${commission.dateOfCommission ? this.formatDate(commission.dateOfCommission) : 'TBD'}
          </td>
          <td class="commission-description">
            <div class="description-main">${commission.descriptionOfCommission || commission.description || 'No description'}</div>
          </td>
          <td class="commission-cost cost-display">
            ${this.formatCostDisplay(commission.cost)}
          </td>
          <td class="commission-type">${commission.type || 'General'}</td>
          <td class="status-cell">
            <span class="status-badge status-${commission.status}">
              ${this.formatStatus(commission.status)}
            </span>
          </td>
          <td class="characters">
            <span class="character-primary">${primaryChar}</span>
            ${additionalChars.length > 0 ? `<span class="character-additional"> +${additionalChars.join(', ')}</span>` : ''}
          </td>
        </tr>
      `;
    }).join('');
  }

  formatStatus(status) {
    const statusMap = {
      'planning': '📋 Planning',
      'in-progress': '🎨 In Progress', 
      'completed': '✅ Completed'
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

  formatCostDisplay(cost) {
    if (!cost && cost !== 0) return '$0.00';
    
    const numCost = typeof cost === 'string' ? parseFloat(cost.replace(/[$,]/g, '')) : cost;
    if (isNaN(numCost)) return '$0.00';
    
    return '$' + numCost.toFixed(2);
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
        message: `${comm.descriptionOfCommission || comm.description || 'Commission'} - ${this.formatStatus(comm.status)}`
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
