// src/firebaseConfig.ts

import firebaseAdmin , { ServiceAccount } from "firebase-admin";
// Path to your service account key file
import serviceAccount from "./serviceAccountKey.json";

const serviceAccountConfig = serviceAccount as ServiceAccount;

// Initialize Firebase Admin SDK
if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccountConfig),
        // databaseURL: "https://your-database-name.firebaseio.com", // Replace with your database URL
    });
}

// Export the Firestore instance
const db = firebaseAdmin.firestore();


const authAdmin = firebaseAdmin.auth();

export { authAdmin, firebaseAdmin, db };

