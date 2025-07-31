# 🔥 Firebase Setup Guide for Character Rankings

## Step 1: Create Firebase Project (FREE)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `AxiomOCDatabase` (or use existing project)
4. Disable Google Analytics (not needed)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In Firebase Console, go to "Build" > "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (allows read/write for 30 days)
4. Select your region (closest to your users)
5. Click "Done"

## Step 3: Get Your Config

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register app with nickname: "Axiom Rankings"
5. **Copy the firebaseConfig object**

## Step 4: Update the Code

Replace the placeholder config in `js/firebase-ranking-system.js`:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "axiomocdatabase.firebaseapp.com",
    projectId: "axiomocdatabase",
    storageBucket: "axiomocdatabase.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

## Step 5: Set Security Rules (Important!)

1. Go to Firestore Database > Rules
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to user votes for any user
    match /user_votes/{userId} {
      allow read, write: if true;
    }
    
    // Allow read/write to global rankings for any user
    match /global_rankings/{characterId} {
      allow read, write: if true;
    }
  }
}
```

3. Click "Publish"

## Step 6: Update Your Pages

Replace the ranking system script in your HTML files:

**In `pages/rankings.html`:**
```html
<!-- Replace this line -->
<script src="../js/ranking-system.js"></script>

<!-- With this -->
<script src="../js/firebase-ranking-system.js"></script>
```

**In `pages/ocs.html`:**
```html
<!-- Replace this line -->
<script src="../js/ranking-system.js"></script>

<!-- With this -->
<script src="../js/firebase-ranking-system.js"></script>
```

## 🎉 That's It!

Your site will now have:
- ✅ **Global rankings** visible to all users
- ✅ **Real-time updates** when people vote
- ✅ **Personal + global data** displayed
- ✅ **Automatic fallback** to localStorage if Firebase fails
- ✅ **Completely free** (Firebase free tier is very generous)

## 📊 Free Tier Limits

Firebase free tier includes:
- **50,000 reads per day**
- **20,000 writes per day**
- **1 GB storage**
- **No credit card required**

This is more than enough for a character ranking system!

## 🔧 Troubleshooting

**If Firebase fails to load:**
- The system automatically falls back to localStorage
- Users see "📱 LOCAL DATA" instead of "🔥 LIVE DATA"
- Everything still works, just no global rankings

**To test:**
1. Open your site in two different browsers
2. Vote for characters in one browser
3. Refresh the other browser - you should see the votes appear!

## 🚀 Going Live

1. Update your Firebase config in the code
2. Commit and push to GitHub
3. Your GitHub Pages site will automatically deploy
4. Global rankings will work immediately!

---

**Need help?** The system is designed to be beginner-friendly and includes detailed error logging.
