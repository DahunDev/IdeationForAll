import { db, firebaseAdmin } from "../configs/firebaseConfig";//-
import { PostItUpdate } from "../types/customTypes";


export const getPostItIfExists = async (postItId: string): Promise<FirebaseFirestore.DocumentSnapshot | null> => {
    const postItRef = firebaseAdmin.firestore().collection("PostIts").doc(postItId);
    const postItDoc = await postItRef.get();
  
    return postItDoc.exists ? postItDoc : null;
  };


/**
 * Checks if a user is authorized to perform certain actions on a PostIt within a specific board. (Assume postIt data exists in the database)
 *
 * @param userId - The ID of the user making the request.
 *
 * @returns A Promise that resolves to a boolean indicating whether the user is authorized.
 *          - `true` if the user is authorized.
 *          - `false` if the user is not authorized.
 *
 * @throws An error if there is a problem with the database or network request.
 */
async function isUserAuthorized( userId: string, postItDoc: FirebaseFirestore.DocumentSnapshot): Promise<boolean> {
  try {
    // Fetch the PostIt document to check if the user is the poster

    if (!postItDoc.exists) {
      return false;
    }

    const postItData = postItDoc.data();
    if (!postItData) return false;

    // Check if the user is the owner of the PostIt
    if (postItData.posterUserID === userId) return true;

    const boardId = postItData.associatedBoardID;

    // Fetch the Board document to check for board ownership or shared access
    const boardRef = firebaseAdmin.firestore().collection("Boards").doc(boardId);
    const boardDoc = await boardRef.get();

    if (!boardDoc.exists) {
      console.error(`Board with ID ${boardId} does not exist.`);
      return false;
    }

    const boardData = boardDoc.data();
    if (!boardData){
        return false;
    } 

    // Check if the user is the organizer of the board
    if (boardData.workspaceOrganizerId === userId){
        return true;
    }

    // If none of the checks pass, the user is not authorized
    return false;
  } catch (error) {
    console.error("Error checking user authorization:", error);
    return false;
  }
}




const DEBOUNCE_WAIT = 500; // Debounce delay in milliseconds

// Firestore update function with debouncing
export async function updatePostItInFirestore(postItId: string, updates: PostItUpdate, userId: string): Promise<void> {
  const postItRef = firebaseAdmin.firestore().collection('PostIts').doc(postItId);
  const postItDoc = await postItRef.get();

  if (!postItDoc.exists) {
    throw new Error('PostIt does not exist');
  }

  const postItData = postItDoc.data();

  // Authorization check: Only allow update if user is authorized
  let isAllowed = await isUserAuthorized(userId, postItDoc);
  if (!isAllowed) {
    throw new Error('Unauthorized update attempt');
  }

  // Perform the update
  await postItRef.update(updates);
}