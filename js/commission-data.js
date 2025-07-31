// Commission Ideas Data
// This file contains all commission concepts organized by character
// Add new ideas here and refresh the commission page to see updates

const commissionData = {
  ariella: {
    ideas: [
      // Example commission idea structure:
      // {
      //   title: "Ariella in Starfleet Uniform",
      //   description: "Full body commission of Ariella in a custom USS Axiom uniform, standing confidently on the bridge",
      //   image: "assets/commissions/ariella/starfleet-concept.jpg",
      //   notes: "Include the Axiom logo on the uniform, maybe holding a PADD",
      //   priority: "high",
      //   status: "concept"
      // }
    ]
  },
  
  aridoe: {
    ideas: [
      // Add Aridoe commission ideas here
    ]
  },
  
  darla: {
    ideas: [
      // Add Darla commission ideas here
    ]
  },
  
  caelielle: {
    ideas: [
      // Add Caelielle commission ideas here
    ]
  }
};

// Export for use in commission-gallery.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = commissionData;
} else if (typeof window !== 'undefined') {
  window.commissionData = commissionData;
}

// Instructions for adding new commission ideas:
// 
// 1. Copy the example structure above
// 2. Fill in your commission details:
//    - title: Brief, descriptive title
//    - description: Detailed description of what you want
//    - image: Path to reference image (optional)
//    - notes: Additional notes for the artist
//    - priority: "high", "medium", or "low"
//    - status: "concept", "planned", "commissioned", or "completed"
// 
// 3. Add the object to the appropriate character's ideas array
// 4. Save this file and refresh the commission page
//
// Example of adding a new idea:
// 
// ariella: {
//   ideas: [
//     {
//       title: "Ariella Coffee Shop AU",
//       description: "Casual modern AU artwork of Ariella working as a barista, warm cozy atmosphere",
//       image: "assets/commissions/ariella/coffee-ref.jpg",
//       notes: "Soft lighting, maybe with steam from coffee machine",
//       priority: "medium",
//       status: "concept"
//     }
//   ]
// }
