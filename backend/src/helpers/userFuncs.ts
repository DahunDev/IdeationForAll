// Example usage in a service or controller
import { db } from "../configs/firebaseConfig";

async function getUserById(userId: string) {
    const userDoc = await db.collection("Users").doc(userId).get();
    return userDoc.exists ? userDoc.data() : null;
}
