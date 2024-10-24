// src/services/authService.ts
import { authAdmin, db } from "../configs/firebaseConfig";
interface postItCreation {
  boardId: string;
  userId: string;
  name: string;
}

export const createPostIt = async ({
    boardId,
    userId,
    name,
}: postItCreation): Promise<string> => {
  try {
    // Create user with Firebase Admin Authentication
    const userRecord = await authAdmin.createUser({
      email,
      password,
    });

    const uid = userRecord.uid;

    // Add user data to Firestore
    await db.collection("Users").doc(uid).set({
      email: userRecord.email,
      createdAt: new Date(),
      username: username,
      role: "user", // example default field
    });

    return uid;
  } catch (error: unknown) {
    // Specify 'unknown' type
    // Type assertion to 'Error' to access message
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    } else {
      throw new Error(`${String(error)}`); // Fallback for unknown error types
    }
  }
};