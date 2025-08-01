// Commission Gallery System
// Handles displaying commission ideas for each character

class CommissionGallery {
  constructor() {
    this.characters = ['ariella', 'aridoe', 'darla', 'caelielle'];
    this.commissionData = {};
    this.init();
  }

  init() {
    // Only initialize if we're on the commission page and authenticated
    if (sessionStorage.getItem('commission-access') === 'granted') {
      this.loadCommissionData();
      this.setupGalleries();
    }
  }

  loadCommissionData() {
    // Load data from commission-data.js if available
    if (typeof window.commissionData !== 'undefined') {
      this.commissionData = window.commissionData;
    } else {
      // Fallback data structure
      this.commissionData = {
        ariella: {
          ideas: []
        },
        aridoe: {
          ideas: []
        },
        darla: {
          ideas: []
        },
        caelielle: {
          ideas: []
        }
      };
    }
  }

  setupGalleries() {
    this.characters.forEach(character => {
      const gallery = document.getElementById(`${character}-commissions`);
      if (gallery) {
        this.renderGallery(character, gallery);
      }
    });
  }

  renderGallery(character, galleryElement) {
    const characterData = this.commissionData[character];
    
    if (!characterData || characterData.ideas.length === 0) {
      // Keep the placeholder content
      return;
    }

    // Clear placeholder content
    galleryElement.innerHTML = '';

    // Create gallery grid
    const galleryGrid = document.createElement('div');
    galleryGrid.className = 'commission-grid';

    characterData.ideas.forEach((idea, index) => {
      const commissionCard = this.createCommissionCard(idea, character, index);
      galleryGrid.appendChild(commissionCard);
    });

    galleryElement.appendChild(galleryGrid);
  }

  createCommissionCard(idea, character, index) {
    const card = document.createElement('div');
    card.className = `commission-card priority-${idea.priority || 'medium'} status-${idea.status || 'concept'}`;
    
    card.innerHTML = `
      <div class="commission-image">
        <img src="${idea.image}" alt="${idea.title}" loading="lazy" 
             onerror="this.parentElement.innerHTML='<div class=\\'image-placeholder\\'>No Image</div>'">
      </div>
      <div class="commission-details">
        <h4 class="commission-title">${idea.title}</h4>
        <p class="commission-description">${idea.description}</p>
        ${idea.notes ? `<div class="commission-notes"><strong>Notes:</strong> ${idea.notes}</div>` : ''}
        <div class="commission-meta">
          <span class="priority-tag priority-${idea.priority || 'medium'}">${(idea.priority || 'medium').toUpperCase()}</span>
          <span class="status-tag status-${idea.status || 'concept'}">${(idea.status || 'concept').toUpperCase()}</span>
        </div>
      </div>
      <div class="commission-actions">
        <button class="action-btn edit-btn" onclick="commissionGallery.editIdea('${character}', ${index})">✏️ Edit</button>
        <button class="action-btn delete-btn" onclick="commissionGallery.deleteIdea('${character}', ${index})">🗑️ Delete</button>
      </div>
    `;

    return card;
  }

  async editIdea(character, index) {
    const idea = this.commissionData[character].ideas[index];
    if (!idea) return;

    try {
      // Simple prompt-based editing (can be enhanced with a modal later)
      const newTitle = await customDialogs.prompt('Edit Title:', idea.title, '💼 EDIT COMMISSION IDEA', 'Title Information');
      if (newTitle !== null) idea.title = newTitle;

      const newDescription = await customDialogs.prompt('Edit Description:', idea.description, '💼 EDIT COMMISSION IDEA', 'Description Information');
      if (newDescription !== null) idea.description = newDescription;

      const newNotes = await customDialogs.prompt('Edit Notes:', idea.notes || '', '💼 EDIT COMMISSION IDEA', 'Additional Notes');
      if (newNotes !== null) idea.notes = newNotes;

      const newPriority = await customDialogs.prompt('Edit Priority (high/medium/low):', idea.priority || 'medium', '💼 EDIT COMMISSION IDEA', 'Priority Level');
      if (newPriority !== null && ['high', 'medium', 'low'].includes(newPriority.toLowerCase())) {
        idea.priority = newPriority.toLowerCase();
      }

      const newStatus = await customDialogs.prompt('Edit Status (concept/planned/commissioned/completed):', idea.status || 'concept', '💼 EDIT COMMISSION IDEA', 'Status Information');
      if (newStatus !== null && ['concept', 'planned', 'commissioned', 'completed'].includes(newStatus.toLowerCase())) {
        idea.status = newStatus.toLowerCase();
      }

      // Re-render the gallery
      this.setupGalleries();
      console.log('✅ Commission idea updated (remember to save to commission-data.js)');
    } catch (error) {
      // User cancelled editing
      console.log('Edit cancelled');
    }
  }

  async deleteIdea(character, index) {
    const idea = this.commissionData[character].ideas[index];
    if (!idea) return;

    try {
      const confirmDelete = await customDialogs.confirm(`Delete commission idea: "${idea.title}"?\n\nThis action cannot be undone.`, '💼 DELETE COMMISSION IDEA', 'Confirm Deletion');
      
      if (confirmDelete) {
        this.commissionData[character].ideas.splice(index, 1);
        this.setupGalleries();
        console.log('🗑️ Commission idea deleted (remember to update commission-data.js)');
      }
    } catch (error) {
      // User cancelled deletion
      console.log('Delete cancelled');
    }
  }

  // Method to add new commission idea
  async addNewIdea(character) {
    try {
      const title = await customDialogs.prompt('Commission Title:', '', '💼 NEW COMMISSION IDEA', 'Title Information');
      if (!title) return;

      const description = await customDialogs.prompt('Description:', '', '💼 NEW COMMISSION IDEA', 'Description Information');
      if (!description) return;

      const imageUrl = await customDialogs.prompt('Image URL (optional, or add to assets/commissions/[character]/ folder):', '', '💼 NEW COMMISSION IDEA', 'Image Information') || '';
      const notes = await customDialogs.prompt('Additional Notes (optional):', '', '💼 NEW COMMISSION IDEA', 'Additional Notes') || '';
      
      const priority = await customDialogs.prompt('Priority (high/medium/low):', 'medium', '💼 NEW COMMISSION IDEA', 'Priority Level');
      const validPriority = ['high', 'medium', 'low'].includes(priority.toLowerCase()) ? priority.toLowerCase() : 'medium';
      
      const status = await customDialogs.prompt('Status (concept/planned/commissioned/completed):', 'concept', '💼 NEW COMMISSION IDEA', 'Status Information');
      const validStatus = ['concept', 'planned', 'commissioned', 'completed'].includes(status.toLowerCase()) ? status.toLowerCase() : 'concept';

      const newIdea = {
        title,
        description,
        image: imageUrl,
        notes,
        priority: validPriority,
        status: validStatus
      };

      this.commissionData[character].ideas.push(newIdea);
      this.setupGalleries();
      
      console.log('➕ New commission idea added (remember to save to commission-data.js)');
      await customDialogs.commissionDialog('Commission idea added! Remember to:\n1. Add image to assets/commissions/[character]/ folder\n2. Update commission-data.js with the new idea');
    } catch (error) {
      // User cancelled creation
      console.log('Add new idea cancelled');
    }
  }
}

// Initialize gallery system when page loads
let commissionGallery;
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if authenticated
  if (sessionStorage.getItem('commission-access') === 'granted') {
    commissionGallery = new CommissionGallery();
    
    // Add "Add New Idea" buttons to each section
    addNewIdeaButtons();
  }
});

function addNewIdeaButtons() {
  const sections = document.querySelectorAll('.character-commission-section');
  sections.forEach(section => {
    const character = section.getAttribute('data-character');
    const header = section.querySelector('.commission-header');
    
    if (header) {
      const addButton = document.createElement('button');
      addButton.className = 'add-idea-btn';
      addButton.innerHTML = '➕ Add New Idea';
      addButton.onclick = () => commissionGallery.addNewIdea(character);
      header.appendChild(addButton);
    }
  });
}
