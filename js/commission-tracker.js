// Commission Tracker Management System
// Handles the commission tracking table in the private commission page
// Now powered by Firebase for persistent data storage

class CommissionTracker {
  constructor() {
    this.editingId = null;
    this.firebaseSystem = null;
    this.init();
  }

  init() {
    // Only initialize if we're authenticated
    if (sessionStorage.getItem('commission-access') === 'granted') {
      this.waitForFirebase();
    }
  }

  async waitForFirebase() {
    // Wait for Firebase commission system to be ready
    const checkFirebase = () => {
      if (window.firebaseCommissionSystem) {
        this.firebaseSystem = window.firebaseCommissionSystem;
        this.setupFirebaseListeners();
        this.setupEventListeners();
        this.renderTable();
        console.log('📋 Commission Tracker connected to Firebase');
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
        console.log(`🔄 Commission tracker received ${action} event`);
        this.renderTable();
      });
    }
  }

  setupEventListeners() {
    // Status filter
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('change', () => this.renderTable());
    }

    // Character filter
    const characterFilter = document.getElementById('character-filter');
    if (characterFilter) {
      characterFilter.addEventListener('change', () => this.renderTable());
    }

    // Form submission
    const form = document.getElementById('commission-data-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
  }

  renderTable() {
    const tableBody = document.getElementById('tracker-table-body');
    const emptyState = document.getElementById('tracker-empty');
    
    if (!tableBody || !this.firebaseSystem) return;

    // Get commissions from Firebase
    const allCommissions = this.firebaseSystem.getCommissions();

    // Apply filters
    const statusFilter = document.getElementById('status-filter')?.value || 'all';
    const characterFilter = document.getElementById('character-filter')?.value || 'all';

    let filteredCommissions = allCommissions.filter(comm => {
      let matchesStatus = statusFilter === 'all' || comm.status === statusFilter;
      let matchesCharacter = characterFilter === 'all' || 
        comm.characters.some(char => char.toLowerCase().includes(characterFilter.toLowerCase()));
      return matchesStatus && matchesCharacter;
    });

    if (filteredCommissions.length === 0) {
      tableBody.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    tableBody.innerHTML = filteredCommissions.map(commission => {
      return `
        <tr class="tracker-row status-${commission.status}" data-id="${commission.id}">
          <td class="commission-id">${commission.id}</td>
          <td class="commission-title">
            <div class="title-main">${commission.title}</div>
            ${commission.description ? `<div class="title-desc">${commission.description}</div>` : ''}
          </td>
          <td class="commission-characters">
            ${commission.characters.map(char => `<span class="char-tag">${char}</span>`).join('')}
          </td>
          <td class="commission-type">${commission.type}</td>
          <td class="status-cell">
            <select class="status-select" onchange="commissionTracker.updateStatus('${commission.id}', this.value)">
              ${this.getStatusOptions(commission.status)}
            </select>
          </td>
          <td class="progress-cell">
            <div class="progress-container">
              <input type="range" class="progress-slider" min="0" max="100" value="${commission.progress || 0}" 
                     onchange="commissionTracker.updateProgress('${commission.id}', this.value)">
              <span class="progress-value">${commission.progress || 0}%</span>
            </div>
          </td>
          <td class="artist-cell">${commission.artist || 'TBD'}</td>
          <td class="due-date">${commission.estimatedCompletion || 'TBD'}</td>
          <td class="public-toggle">
            <label class="toggle-switch">
              <input type="checkbox" ${commission.isPublic ? 'checked' : ''} 
                     onchange="commissionTracker.togglePublic('${commission.id}', this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </td>
          <td class="actions-cell">
            <button class="action-btn edit-btn" onclick="commissionTracker.editCommission('${commission.id}')">✏️</button>
            <button class="action-btn delete-btn" onclick="commissionTracker.deleteCommission('${commission.id}')">🗑️</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  getStatusOptions(currentStatus) {
    const statuses = [
      'planning', 'queued', 'in-progress', 'review', 'revisions', 
      'completed', 'delivered', 'on-hold', 'cancelled'
    ];
    
    return statuses.map(status => 
      `<option value="${status}" ${status === currentStatus ? 'selected' : ''}>${this.capitalizeStatus(status)}</option>`
    ).join('');
  }

  capitalizeStatus(status) {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  async updateStatus(commissionId, newStatus) {
    if (!this.firebaseSystem) return;

    try {
      await this.firebaseSystem.updateCommission(commissionId, { status: newStatus });
      console.log(`📊 Updated ${commissionId} status to ${newStatus}`);
    } catch (error) {
      console.error('❌ Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  }

  async updateProgress(commissionId, newProgress) {
    if (!this.firebaseSystem) return;

    try {
      await this.firebaseSystem.updateCommission(commissionId, { progress: parseInt(newProgress) });
      
      // Update the display immediately
      const progressValue = document.querySelector(`tr[data-id="${commissionId}"] .progress-value`);
      if (progressValue) {
        progressValue.textContent = `${newProgress}%`;
      }
      
      console.log(`📈 Updated ${commissionId} progress to ${newProgress}%`);
    } catch (error) {
      console.error('❌ Error updating progress:', error);
      alert('Failed to update progress. Please try again.');
    }
  }

  async togglePublic(commissionId, isPublic) {
    if (!this.firebaseSystem) return;

    try {
      await this.firebaseSystem.updateCommission(commissionId, { isPublic: isPublic });
      console.log(`👁️ ${commissionId} public visibility: ${isPublic}`);
    } catch (error) {
      console.error('❌ Error updating public visibility:', error);
      alert('Failed to update visibility. Please try again.');
    }
  }

  showAddForm() {
    this.editingId = null;
    this.resetForm();
    document.getElementById('form-title').textContent = 'Add New Commission';
    document.getElementById('commission-form').classList.remove('hidden');
    document.getElementById('comm-title').focus();
  }

  editCommission(commissionId) {
    if (!this.firebaseSystem) return;

    const commission = this.firebaseSystem.getCommissionById(commissionId);
    if (!commission) return;

    this.editingId = commissionId;
    this.populateForm(commission);
    document.getElementById('form-title').textContent = `Edit Commission: ${commission.id}`;
    document.getElementById('commission-form').classList.remove('hidden');
    document.getElementById('comm-title').focus();
  }

  populateForm(commission) {
    document.getElementById('comm-title').value = commission.title || '';
    document.getElementById('comm-type').value = commission.type || '';
    document.getElementById('comm-characters').value = commission.characters.join(', ') || '';
    document.getElementById('comm-artist').value = commission.artist || '';
    document.getElementById('comm-status').value = commission.status || 'planning';
    document.getElementById('comm-progress').value = commission.progress || 0;
    document.getElementById('comm-due-date').value = commission.estimatedCompletion || '';
    document.getElementById('comm-priority').value = commission.priority || 'normal';
    document.getElementById('comm-description').value = commission.description || '';
    document.getElementById('comm-notes').value = commission.notes || '';
    document.getElementById('comm-public').checked = commission.isPublic !== false;
  }

  resetForm() {
    document.getElementById('commission-data-form').reset();
    document.getElementById('comm-progress').value = 0;
    document.getElementById('comm-status').value = 'planning';
    document.getElementById('comm-priority').value = 'normal';
    document.getElementById('comm-public').checked = true;
  }

  hideForm() {
    document.getElementById('commission-form').classList.add('hidden');
    this.editingId = null;
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    
    if (!this.firebaseSystem) {
      alert('Database not ready. Please try again in a moment.');
      return;
    }

    const formData = {
      title: document.getElementById('comm-title').value,
      type: document.getElementById('comm-type').value,
      characters: document.getElementById('comm-characters').value.split(',').map(s => s.trim()),
      artist: document.getElementById('comm-artist').value || 'TBD',
      status: document.getElementById('comm-status').value,
      progress: parseInt(document.getElementById('comm-progress').value) || 0,
      estimatedCompletion: document.getElementById('comm-due-date').value || null,
      priority: document.getElementById('comm-priority').value,
      description: document.getElementById('comm-description').value,
      notes: document.getElementById('comm-notes').value,
      isPublic: document.getElementById('comm-public').checked
    };

    try {
      if (this.editingId) {
        // Update existing commission
        await this.firebaseSystem.updateCommission(this.editingId, formData);
        alert('✅ Commission updated successfully!');
      } else {
        // Add new commission
        await this.firebaseSystem.addCommission(formData);
        alert('✅ Commission added successfully!');
      }

      this.hideForm();
      
    } catch (error) {
      console.error('❌ Error saving commission:', error);
      alert('Failed to save commission. Please try again.');
    }
  }

  async deleteCommission(commissionId) {
    if (!this.firebaseSystem) return;

    const commission = this.firebaseSystem.getCommissionById(commissionId);
    if (!commission) return;

    const confirmDelete = confirm(`Delete commission "${commission.title}" (${commissionId})?\n\nThis action cannot be undone.`);
    if (confirmDelete) {
      try {
        await this.firebaseSystem.deleteCommission(commissionId);
        console.log(`🗑️ Deleted commission ${commissionId}`);
      } catch (error) {
        console.error('❌ Error deleting commission:', error);
        alert('Failed to delete commission. Please try again.');
      }
    }
  }

  refresh() {
    if (this.firebaseSystem) {
      this.firebaseSystem.loadCommissions();
      console.log('🔄 Commission tracker refreshed');
    }
  }
}

// Initialize tracker when page loads and user is authenticated
let commissionTracker;
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('commission-access') === 'granted') {
    commissionTracker = new CommissionTracker();
  }
});
