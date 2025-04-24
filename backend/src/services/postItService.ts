import { db, firebaseAdmin } from "../configs/firebaseConfig"; //-
import { PostItUpdate } from "../types/customTypes";

export const getPostItIfExists = async (
  postItId: string,
): Promise<FirebaseFirestore.DocumentSnapshot | null> => {
  const postItRef = firebaseAdmin
    .firestore()
    .collection("PostIts")
    .doc(postItId);
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
async function isUserAuthorized(
  userId: string,
  postItDoc: FirebaseFirestore.DocumentSnapshot,
): Promise<boolean> {
  try {
    // Fetch the PostIt document to check if the user is the poster or board member

    if (!postItDoc.exists) {
      return false;
    }

    const postItData = postItDoc.data();
    if (!postItData) return false;

    // Check if the user is the owner of the PostIt
    if (postItData.posterUserID === userId) return true;

    const boardId = postItData.associatedBoardID;

    // Fetch the Board document to check for board ownership or shared access
    const boardRef = firebaseAdmin
      .firestore()
      .collection("Boards")
      .doc(boardId);
    const boardDoc = await boardRef.get();

    if (!boardDoc.exists) {
      console.error(`Board with ID ${boardId} does not exist.`);
      return false;
    }

    const boardData = boardDoc.data();
    if (!boardData) {
      return false;
    }

    // Check if the user is the organizer of the board
    if (boardData.workspaceOrganizerId === userId) {
      return true;
    }
    // Check if the user is in the SharedUserIds array of the board
    if (Array.isArray(boardData.SharedUserIds) && boardData.SharedUserIds.includes(userId)) {
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

export async function updatePostItInFirestore(
  postItId: string,
  updates: PostItUpdate,
  userId: string,
): Promise<void> {
  const postItRef = firebaseAdmin.firestore().collection("PostIts").doc(postItId);

  try {
    await firebaseAdmin.firestore().runTransaction(async (transaction) => {
      const postItDoc = await transaction.get(postItRef);

      if (!postItDoc.exists) {
        throw new Error("Post-it does not exist");
      }

      const postItData = postItDoc.data();
      if (!postItData) return;

      // Check if the post-it is locked
      if (postItData.locked && postItData.lockedBy !== userId) {
        throw new Error(`Post-it is currently locked by ${postItData.lockedBy}`);
      }

      // Authorization check: Only allow update if user is authorized
      let isAllowed = await isUserAuthorized(userId, postItDoc);
      if (!isAllowed) {
        throw new Error("Unauthorized update attempt");
      }

      // Merge updates while preserving existing fields
      const newData = { 
        ...postItData, 
        ...updates, 
        lastEditedBy: userId, 
        updatedAt: new Date() 
      };

      // Perform the update inside the transaction
      transaction.update(postItRef, {
        ...newData,
        locked: false,
        lockedBy: null,
        lockedAt: null, // Timestamp of when it was locked
      });
    
    });

    console.log(`Post-it ${postItId} updated successfully by ${userId}`);
  } catch (error) {
    console.error("Error updating post-it:", error);
  }
}


export async function lockPostIt(
  postItId: string,
  userId: string,
): Promise<void> {
  const postItRef = firebaseAdmin.firestore().collection("PostIts").doc(postItId);

  try {
    await firebaseAdmin.firestore().runTransaction(async (transaction) => {
      const postItDoc = await transaction.get(postItRef);

      if (!postItDoc.exists) {
        throw new Error("Post-it does not exist");
      }

      const postItData = postItDoc.data();
      if (!postItData) return;

      // Check if the post-it is locked
      if (postItData.locked && postItData.lockedBy !== userId) {
        throw new Error(`Post-it is currently locked by ${postItData.lockedBy}`);
      }

      // Authorization check: Only allow update if user is authorized
      let isAllowed = await isUserAuthorized(userId, postItDoc);
      if (!isAllowed) {
        throw new Error("Unauthorized update attempt");
      }

      // Lock the post-it for editing
      transaction.update(postItRef, {
        locked: true, // Set the post-it as locked
        lockedBy: userId, // Assign the user locking it
        lockedAt: Date.now(), // Timestamp of when it was locked
      });
    
    });

    console.log(`Post-it ${postItId} locked successfully by ${userId}`);
  } catch (error) {
    console.error("Error locking post-it:", error);
  }
}




export async function updatePostItVotes(
  postItId: string,
  voteType: 'upvote' | 'downvote' | 'cancelUpvote' | 'cancelDownvote',
  userId: string
): Promise<{
  upvotedUsers: string[],
  downvotedUsers: string[],
  upvotesCount: number,
  downvotesCount: number
}> {
  const postItRef = firebaseAdmin.firestore().collection("PostIts").doc(postItId);

  try {
    // Run the Firestore transaction
    const result = await firebaseAdmin.firestore().runTransaction(async (transaction) => {
      const postItDoc = await transaction.get(postItRef);

      if (!postItDoc.exists) {
        throw new Error("Post-it does not exist");
      }

      const postItData = postItDoc.data();
      if (!postItData) return;

      // Check if the post-it is locked
      if (postItData.locked && postItData.lockedBy !== userId) {
        throw new Error(`Post-it is currently locked by ${postItData.lockedBy}`);
      }

      // Authorization check: Only allow update if user is authorized
      let isAllowed = await isUserAuthorized(userId, postItDoc);
      if (!isAllowed) {
        throw new Error("Unauthorized update attempt");
      }

      // Define the sets for upvotes and downvotes with explicit typing
      let upvotedUsers: Set<string> = new Set(postItData.upvotedUsers || []);
      let downvotedUsers: Set<string> = new Set(postItData.downvotedUsers || []);

      // Handle the different vote types
      if (voteType === 'upvote') {
        // Remove from downvotedUsers if the user previously downvoted
        if (downvotedUsers.has(userId)) {
          downvotedUsers.delete(userId);
        }
        // Add user to upvotedUsers if not already voted
        if (!upvotedUsers.has(userId)) {
          upvotedUsers.add(userId);
        } else {
          console.log("User already upvoted.");
        }
      } else if (voteType === 'downvote') {
        // Remove from upvotedUsers if the user previously upvoted
        if (upvotedUsers.has(userId)) {
          upvotedUsers.delete(userId);
        }
        // Add user to downvotedUsers if not already voted
        if (!downvotedUsers.has(userId)) {
          downvotedUsers.add(userId);
        } else {
          console.log("User already downvoted.");
        }
      } else if (voteType === 'cancelUpvote') {
        // Remove user from upvotedUsers if they already upvoted
        if (upvotedUsers.has(userId)) {
          upvotedUsers.delete(userId);
        } else {
          console.log("User hasn't upvoted.");
        }
      } else if (voteType === 'cancelDownvote') {
        // Remove user from downvotedUsers if they already downvoted
        if (downvotedUsers.has(userId)) {
          downvotedUsers.delete(userId);
        } else {
          console.log("User hasn't downvoted.");
        }
      }

      // Update the post-it with the new sets for upvotes and downvotes
      const newData = {
        ...postItData,
        upvotedUsers: Array.from(upvotedUsers),
        downvotedUsers: Array.from(downvotedUsers),
        lastEditedBy: userId,
        updatedAt: new Date()
      };

      // Perform the update inside the transaction
      transaction.update(postItRef, newData);

      // Return the updated vote information as an object
      return {
        upvotedUsers: Array.from(upvotedUsers),
        downvotedUsers: Array.from(downvotedUsers),
        upvotesCount: upvotedUsers.size,
        downvotesCount: downvotedUsers.size
      };
    });

    // Ensure the result is valid before returning it
    if (!result) {
      throw new Error('Failed to retrieve updated vote information');
    }

    // Return the updated data (upvotedUsers, downvotedUsers, their counts)
    console.log(`Post-it ${postItId} vote updated successfully by ${userId}`);
    return result;  // result contains the updated vote info
  } catch (error) {
    console.error("Error updating post-it votes:", error);
    throw error;  // Rethrow to handle in WebSocket handler
  }
}
