// src/services/authService.ts
import { authAdmin, db } from '../configs/firebaseConfig' 
interface UserRegistration {
  email: string;
  password: string;
}

export const registerUser = async ({ email, password }: UserRegistration): Promise<string> => {
  try {
    // Create user with Firebase Admin Authentication
    const userRecord = await authAdmin.createUser({
      email,
      password
    });

    const uid = userRecord.uid;

    // Add user data to Firestore
    await db.collection('users').doc(uid).set({
      email: userRecord.email,
      createdAt: new Date(),
      role: 'user' // example default field
    });

    return uid;
} catch (error: unknown) { // Specify 'unknown' type
    // Type assertion to 'Error' to access message
    if (error instanceof Error) {
      throw new Error(`Failed to register user: ${error.message}`);
    } else {
      throw new Error(`Failed to register user: ${String(error)}`); // Fallback for unknown error types
    }
  }
};
