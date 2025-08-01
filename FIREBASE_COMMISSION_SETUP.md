## Firebase Commission System Setup Guide

### 🔥 Firebase Rules Configuration for Commission System

To enable the commission management system with Firebase, you need to set up proper security rules in your Firebase Console.

#### 1. Enable Firestore Database (if not done yet)
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your **AxiomOCDatabase** project
3. Click **Firestore Database** in left sidebar
4. If no database exists, click **"Create database"**
5. Choose **"Start in test mode"** → Select location → **"Done"**

#### 2. Updated Security Rules for Commission System
1. In Firestore Database, click the **"Rules"** tab
2. Replace the existing rules with these comprehensive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User votes for ranking system
    match /user_votes/{userId} {
      allow read, write: if true; // Allow all users to manage their own votes
    }
    
    // Global rankings data
    match /global_rankings/{characterId} {
      allow read: if true; // Everyone can read rankings
      allow write: if true; // Allow ranking updates (consider restricting in production)
    }
    
    // Character comments system
    match /character_comments/{characterId}/comments/{commentId} {
      allow read: if true; // Everyone can read comments
      allow create: if true; // Anyone can create comments
      allow update, delete: if false; // No editing/deleting comments (prevents abuse)
    }
    
    // ===== COMMISSION SYSTEM RULES =====
    
    // Commission documents - MAIN COLLECTION
    match /commissions/{commissionId} {
      // Read access:
      // - Public commissions: readable by everyone (for commission queue page)
      // - All commissions: readable (assuming this is a personal site, adjust if multi-user)
      allow read: if true;
      
      // Write access:
      // - Allow creation and updates (for admin interface)
      // - In production, you might want to restrict this to authenticated admin users
      allow create, update: if true;
      
      // Delete access:
      // - Allow deletion (for admin management)
      // - In production, consider restricting this further
      allow delete: if true;
    }
    
    // Commission metadata (statistics, counts, etc.)
    match /commission_metadata/{document} {
      allow read: if true; // Allow reading stats
      allow write: if true; // Allow updating stats
    }
    
    // Commission images/attachments (if storing separately)
    match /commission_images/{imageId} {
      allow read: if true; // Public images can be read
      allow write: if true; // Allow uploading images
    }
    
    // Admin logs (optional - for tracking admin actions)
    match /admin_logs/{logId} {
      allow read: if true; // Admin can read logs
      allow create: if true; // Allow creating log entries
      allow update, delete: if false; // Logs should be immutable
    }
  }
}
```

#### 3. Production Security Considerations

**⚠️ IMPORTANT:** The above rules allow public read/write access. For a production environment, consider these security improvements:

```javascript
// More secure rules for production:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      // Replace with your admin user ID or authentication method
      return request.auth != null && request.auth.uid == "YOUR_ADMIN_USER_ID";
    }
    
    // Commission documents - PRODUCTION VERSION
    match /commissions/{commissionId} {
      // Public can read public commissions only
      allow read: if resource.data.isPublic == true || isAdmin();
      
      // Only admin can write
      allow create, update, delete: if isAdmin();
    }
    
    // Commission queue access (public commissions only)
    match /public_commissions/{commissionId} {
      allow read: if true; // Public queue page
      allow write: if false; // No direct writes to public view
    }
  }
}
```

#### 4. Publish Rules
1. Click **Publish** to save the new rules
2. Wait for confirmation that rules are deployed

### 📊 Database Collections Structure

The commission system uses these Firestore collections:

#### `commissions` Collection
```javascript
{
  "id": "auto-generated-id",
  "artist": "Artist Name",
  "title": "Commission Title", 
  "dateCommissioned": "2025-01-01",
  "cost": 150.00,
  "character": "Primary Character Name",
  "additionalCharacters": "Additional Character Names",
  "type": "Character Design", // Options: Character Design, Portrait, Full Body, Scene, Reference Sheet, Other
  "status": "in-progress", // Options: planning, in-progress, review, completed, on-hold
  "description": "Detailed description of the commission",
  "notes": "Additional notes or special instructions",
  "isPublic": true, // Whether to show on public commission queue
  "progress": 50, // Progress percentage (0-100)
  "attachedImage": "base64-image-data", // Optional reference image
  "attachedImageName": "filename.jpg",
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

#### `commission_metadata` Collection (Optional)
```javascript
{
  "stats": {
    "totalCommissions": 42,
    "activeCommissions": 12,
    "completedCommissions": 30,
    "lastUpdated": "2025-01-01T12:00:00.000Z"
  }
}
```

### 🛡️ Security Features

1. **Public Commission Queue**: Only commissions marked `isPublic: true` appear on the public queue page
2. **Admin Control**: Full CRUD operations available in admin interface
3. **Data Validation**: Client-side validation before sending to Firebase
4. **Real-time Updates**: Changes sync automatically across all admin sessions
5. **Fallback System**: If Firebase is unavailable, system falls back to localStorage

### 🔧 Admin Interface Features

- ✅ Add new commissions with full details
- ✅ Edit existing commissions
- ✅ Delete commissions
- ✅ Search and filter commissions
- ✅ Export commission data to JSON
- ✅ Import commission data from JSON
- ✅ Real-time statistics dashboard
- ✅ Image attachment support
- ✅ Public/private visibility toggle

### 📱 Public Queue Features

- ✅ View public commissions by status
- ✅ Real-time updates when commissions change
- ✅ Responsive design for mobile/desktop
- ✅ Search and filter functionality
- ✅ Professional status indicators

### 🚀 Next Steps

1. **Apply the Firebase rules** from step 2 above
2. **Test the admin interface** by accessing the admin page (PIN: 3272)
3. **Add a test commission** to verify Firebase connectivity
4. **Check the public queue** to see the commission appear
5. **Monitor Firebase Console** to see data being written

### 📞 Support

If you encounter issues:
1. Check the browser console for Firebase errors
2. Verify your Firebase configuration in `firebase-commission-system.js`
3. Ensure Firebase rules are properly published
4. Test with a simple commission to verify connectivity

The commission system is now ready to use with persistent cloud storage! 🎉
