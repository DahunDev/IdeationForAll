// src/firebaseConfig.ts

import admin, { ServiceAccount } from "firebase-admin";
// Path to your service account key file
import serviceAccount from "./serviceAccountKey.json";

const serviceAccountConfig = serviceAccount as ServiceAccount;

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountConfig),
        // databaseURL: "https://your-database-name.firebaseio.com", // Replace with your database URL
    });
}

// Export the Firestore instance
const db = admin.firestore();
export { db, admin };
