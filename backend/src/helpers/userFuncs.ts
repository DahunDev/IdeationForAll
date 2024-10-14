// Example usage in a service or controller
import { DocumentReference } from "@firebase/firestore";
import { db } from "../configs/firebaseConfig";

// Helper function to resolve a DocumentReference to its data
async function resolveDocRef(docRef : any) {
    try{
        const doc = await docRef.get();
        return doc.exists ? doc.data() : null;
    }catch(e){
        console.error("Error resolving document reference:", e);
        return null; // Return null in case of an error
    }
}


async function getUserById(userId: string) {
    const userDoc = await db.collection("Users").doc(userId).get();

    if (!userDoc.exists) {
        return null; // Return null if the document does not exist
    }

    const userData = userDoc.data();

    // console.log("userdate done\n");
    // console.log("Account Settings display:", userData?.accountSettings);

    // console.log("Account Settings display done\n");


    if (userData?.accountSettings && (userData.accountSettings as DocumentReference)) {
        console.log("resolving account settings");
        userData.accountSettings = await resolveDocRef(userData.accountSettings as DocumentReference);
    } else {
        console.log("Account settings is not a DocumentReference. Type:", typeof userData?.accountSettings);
    }
    // If OwnedBoards is an array of DocumentReferences, resolve each one
    if (Array.isArray(userData?.OwnedBoards)) {
        userData.OwnedBoards = await Promise.all(
            userData.OwnedBoards.map((boardRef: DocumentReference) => resolveDocRef(boardRef))
        );
    }

    if (Array.isArray(userData?.SharedBoards)) {
        userData.SharedBoards = await Promise.all(
            userData.SharedBoards.map((boardRef: DocumentReference) => resolveDocRef(boardRef))
        );
    }
    return userData;
}


(async () => {
    try {
        const userId = "userIDExample"; // Replace this with a valid user ID
        const userData = await getUserById(userId);
        console.log("User Data:", userData);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
})();