# Axiom's OC Portfolio Website

A beautiful, candy-cane themed portfolio website showcasing original characters (OCs) with Firebase database integration and GitHub Pages compatibility.

## 🍭 Features

- **Peppermint/Candycane Theme**: Beautiful red, white, and mint green color scheme with animated elements
- **Character Galleries**: Separate galleries for each OC with SFW, NSFW, and Reference categories
- **NSFW Content Protection**: Click-to-unblur functionality for mature content
- **Commission Queue**: Display upcoming artworks with status tracking
- **Admin Panel**: PIN-protected (3272) admin interface for content management
- **Comment System**: Firebase-powered commenting on gallery and commission pages
- **Art Suggestions**: User-submitted artwork suggestions with admin management
- **Mobile Responsive**: Fully responsive design for all devices
- **GitHub Pages Compatible**: Static site that works with GitHub Pages hosting

## 📁 Project Structure

```
AxiomOCDatabase/
├── index.html                 # Homepage with bio
├── commission-queue.html      # Commission queue page
├── admin.html                 # PIN-protected admin panel
├── ocs/
│   ├── ariella.html          # Ariella character page
│   └── other-ocs.html        # Other OCs page
├── css/
│   ├── style.css             # Main theme styles
│   ├── gallery.css           # Gallery-specific styles
│   ├── commission-queue.css  # Commission queue styles
│   └── admin.css             # Admin panel styles
├── js/
│   ├── main.js               # Core functionality
│   ├── firebase-config.js    # Firebase database integration
│   ├── gallery.js            # Gallery functionality
│   ├── commission-queue.js   # Commission queue management
│   └── admin.js              # Admin panel functionality
├── images/
│   ├── gallery/
│   │   ├── ariella/
│   │   │   ├── sfw/          # Ariella SFW images
│   │   │   ├── nsfw/         # Ariella NSFW images
│   │   │   └── reference/    # Ariella reference sheets
│   │   └── other-ocs/
│   │       ├── sfw/          # Other OCs SFW images
│   │       ├── nsfw/         # Other OCs NSFW images
│   │       └── reference/    # Other OCs reference sheets
│   └── demo/                 # Demo/placeholder images
└── update-gallery.bat        # Batch file for gallery management
```

## 🚀 Setup Instructions

### 1. GitHub Pages Setup

1. Clone this repository to your GitHub account
2. Go to repository Settings → Pages
3. Set source to "Deploy from a branch"
4. Select "main" branch and "/ (root)" folder
5. Your site will be available at `https://yourusername.github.io/AxiomOCDatabase`

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Get your Firebase config object
5. Replace the config in `js/firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### 3. Database Collections

The Firebase Firestore should have these collections:

- **commissions**: Commission queue items
  ```javascript
  {
    title: string,
    artist: string,
    description: string,
    status: "Planning" | "In Progress" | "Completed",
    createdAt: timestamp,
    updatedAt: timestamp
  }
  ```

- **comments**: User comments
  ```javascript
  {
    name: string,
    email: string (optional),
    message: string,
    page: string,
    approved: boolean,
    createdAt: timestamp
  }
  ```

- **artSuggestions**: User art suggestions
  ```javascript
  {
    name: string,
    email: string (optional),
    title: string,
    description: string,
    character: string (optional),
    status: "pending",
    createdAt: timestamp
  }
  ```

- **gallery**: Image metadata
  ```javascript
  {
    title: string,
    character: string,
    category: "sfw" | "nsfw" | "reference",
    url: string,
    nsfw: boolean,
    uploadedAt: timestamp
  }
  ```

## 🖼️ Adding Images

### Using the Batch File (Windows)

1. Run `update-gallery.bat`
2. Use the menu options to open gallery folders
3. Add your images to the appropriate folders
4. Use option 7 to generate JSON files if needed

### Manual Method

1. Add images to the appropriate folders in `images/gallery/`
2. Supported formats: JPG, JPEG, PNG, GIF, WebP
3. Use descriptive filenames
4. Commit and push to GitHub

### Folder Structure for Images

```
images/gallery/
├── ariella/
│   ├── sfw/          # Safe for work Ariella art
│   ├── nsfw/         # Adult Ariella content
│   └── reference/    # Ariella reference sheets
└── other-ocs/
    ├── sfw/          # Safe for work other OC art
    ├── nsfw/         # Adult other OC content
    └── reference/    # Other OC reference sheets
```

## 🔧 Admin Panel

- **URL**: `/admin.html`
- **PIN**: 3272
- **Features**:
  - Add new commissions
  - Manage comments (approve/delete)
  - Upload images with metadata
  - View art suggestions
  - Gallery statistics

## 🎨 Customization

### Theme Colors

Edit CSS variables in `css/style.css`:

```css
:root {
    --primary-red: #dc2626;
    --primary-white: #ffffff;
    --accent-pink: #f472b6;
    --light-pink: #fce7f3;
    --mint-green: #34d399;
    --light-mint: #d1fae5;
    /* ... */
}
```

### Character Information

Update character descriptions in:
- `ocs/ariella.html`
- `ocs/other-ocs.html`

### Bio Section

Edit the bio content in `index.html`:

```html
<div class="bio-content">
    <div class="bio-text">
        <p>Your bio content here...</p>
    </div>
</div>
```

## 📱 Mobile Support

The site is fully responsive with:
- Touch-friendly navigation
- Optimized gallery layouts
- Mobile-specific interactions
- Responsive typography

## 🔒 Security Features

- PIN-protected admin panel
- Comment approval system
- Input sanitization
- NSFW content warnings
- Session-based authentication

## 🌟 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📄 License

This project is open source. Feel free to use and modify for your own portfolio!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

If you need help setting up or customizing the site, please open an issue on GitHub.

---

Made with ❤️ and lots of ☕ for the art community!
