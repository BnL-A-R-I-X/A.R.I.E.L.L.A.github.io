// Commission Queue Data
// This file contains active commission tracking data
// Update this file to reflect current commission status

const commissionQueueData = [
  // Example commission entries:
  {
    id: "COMM-001",
    title: "Ariella Starfleet Portrait",
    characters: ["Ariella"],
    type: "Character Portrait",
    status: "planning",
    progress: 0,
    estimatedCompletion: "2025-08-15",
    artist: "TBD",
    dateCommissioned: "2025-07-31",
    description: "Full body portrait in custom USS Axiom uniform",
    priority: "normal",
    lastUpdate: "2025-07-31",
    isPublic: true,
    notes: "Initial concept discussion phase"
  },
  
  // Add more commissions here following this structure:
  // {
  //   id: "COMM-002",                    // Unique commission ID
  //   title: "Commission Title",         // Brief title for the commission
  //   characters: ["Character1", "Character2"], // Array of characters involved
  //   type: "Character Portrait",        // Type: "Character Portrait", "Scene Art", "Reference Sheet", etc.
  //   status: "queued",                  // Status: "planning", "queued", "in-progress", "review", "revisions", "completed", "delivered", "on-hold", "cancelled"
  //   progress: 25,                      // Progress percentage (0-100)
  //   estimatedCompletion: "2025-08-20", // YYYY-MM-DD format
  //   artist: "Artist Name",             // Artist name or "TBD"
  //   dateCommissioned: "2025-07-31",    // Date commissioned (YYYY-MM-DD)
  //   description: "Detailed description", // Optional description
  //   priority: "normal",                // Priority: "low", "normal", "high", "urgent"
  //   lastUpdate: "2025-07-31",          // Last status update date
  //   isPublic: true,                    // Whether to show on public queue (true/false)
  //   notes: "Additional notes"          // Internal notes (optional)
  // }
];

// Export for use in commission-queue.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = commissionQueueData;
} else if (typeof window !== 'undefined') {
  window.commissionQueueData = commissionQueueData;
}

// Commission Status Guide:
// - planning: Initial planning and concept phase
// - queued: Waiting in artist's queue
// - in-progress: Actively being worked on
// - review: Completed, awaiting client review
// - revisions: Making requested changes
// - completed: Finished and approved
// - delivered: Final files delivered to client
// - on-hold: Temporarily paused
// - cancelled: Commission cancelled

// Commission Types:
// - Character Portrait: Single character artwork
// - Scene Art: Multiple characters or environment scenes
// - Reference Sheet: Character reference materials
// - Icon/Avatar: Small profile images
// - Concept Art: Initial design concepts
// - Custom: Other specialized commissions
