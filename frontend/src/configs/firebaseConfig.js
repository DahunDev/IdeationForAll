// Import the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Example: Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Example: Firestore database
import { getStorage } from "firebase/storage"; // Example: Firebase Storage
import clientConfig from "./clientKey.json";

// Initialize Firebase app

const app = initializeApp(clientConfig);

// Initialize Firebase services
const auth = getAuth(app); // Authentication
const db = getFirestore(app); // Firestore database
const storage = getStorage(app); // Storage

// Export Firebase services for use in other files
export { app, auth, db, storage };
