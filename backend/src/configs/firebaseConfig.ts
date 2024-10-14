// src/firebaseConfig.ts

import admin from "firebase-admin";
// Path to your service account key file
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://your-database-name.firebaseio.com", // Replace with your database URL
    });
}

// Export the Firestore instance
const db = admin.firestore();
export { db, admin };
