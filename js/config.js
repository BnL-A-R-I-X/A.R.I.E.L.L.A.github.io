// Site Configuration
// Edit this file to customize your portfolio website

const SITE_CONFIG = {
    // Site Information
    siteName: "Axiom's Portfolio",
    ownerName: "Axiom",
    tagline: "Artist • Creator • Dreamer",
    
    // Bio Information
    bio: {
        title: "About Me",
        content: [
            "Hello! I'm Axiom, a passionate artist who loves bringing characters to life through digital art. My portfolio showcases original characters (OCs) and commissioned works across various styles and themes.",
            "I specialize in character design, digital illustrations, and creating immersive visual stories. Each piece is crafted with attention to detail and a touch of whimsy.",
            "Feel free to explore my gallery and don't hesitate to reach out for commissions or collaborations!"
        ]
    },
    
    // Character Information
    characters: {
        ariella: {
            name: "Ariella",
            description: "A mysterious and enchanting character with a story that unfolds through art. Ariella represents elegance, strength, and the magic found in everyday moments.",
            stats: {
                age: "Unknown",
                species: "Human",
                occupation: "Wanderer"
            }
        },
        otherOCs: {
            title: "Other Original Characters",
            description: "Explore the diverse collection of original characters beyond Ariella. Each character has their own unique story, personality, and artistic journey. From fantasy warriors to modern-day adventurers, this gallery showcases the breadth of creative imagination.",
            highlights: {
                "Featured Characters": "Multiple OCs",
                "Art Styles": "Various",
                "Themes": "Fantasy, Modern, Sci-Fi"
            },
            showcaseCharacters: [
                {
                    name: "Luna",
                    description: "Mysterious moon priestess with ethereal powers",
                    tag: "Fantasy"
                },
                {
                    name: "Zara",
                    description: "Cyberpunk hacker from the neon-lit future",
                    tag: "Sci-Fi"
                },
                {
                    name: "Phoenix",
                    description: "Fire elemental warrior with a noble heart",
                    tag: "Fantasy"
                },
                {
                    name: "Echo",
                    description: "Modern artist who sees the world differently",
                    tag: "Modern"
                }
            ]
        }
    },
    
    // Admin Settings
    admin: {
        pinCode: "3272",
        sessionTimeout: 3600000 // 1 hour in milliseconds
    },
    
    // Firebase Configuration (replace with your own)
    firebase: {
        apiKey: "your-api-key",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "123456789",
        appId: "your-app-id"
    },
    
    // Gallery Settings
    gallery: {
        imageFormats: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        maxFileSize: 5242880, // 5MB in bytes
        thumbnailSize: 300,
        categories: ['sfw', 'nsfw', 'reference'],
        characters: ['ariella', 'other-ocs']
    },
    
    // UI Settings
    ui: {
        itemsPerPage: 20,
        autoRefreshInterval: 300000, // 5 minutes
        animationDuration: 300,
        showLoadingSpinners: true
    },
    
    // Social Links (optional)
    social: {
        // Uncomment and add your social media links
        // twitter: "https://twitter.com/yourusername",
        // instagram: "https://instagram.com/yourusername",
        // deviantart: "https://deviantart.com/yourusername",
        // artstation: "https://artstation.com/yourusername"
    },
    
    // Commission Information
    commissions: {
        open: true,
        queueDescription: "Here you can see all my upcoming artworks and their current status. Each project goes through different stages from planning to completion.",
        statusTypes: [
            { value: "Planning", color: "#f59e0b", label: "Planning" },
            { value: "In Progress", color: "#3b82f6", label: "In Progress" },
            { value: "Completed", color: "#10b981", label: "Completed" }
        ]
    },
    
    // Content Warnings
    contentWarnings: {
        nsfwWarning: "⚠️ Adult Content Warning: This section contains mature artwork. Click on blurred images to view.",
        nsfwBlurText: "NSFW Content\nClick to View"
    }
};

// Make config available globally
if (typeof window !== 'undefined') {
    window.SITE_CONFIG = SITE_CONFIG;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SITE_CONFIG;
}
