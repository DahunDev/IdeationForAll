import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/customTypes";
import { authAdmin, db, firebaseAdmin } from "../configs/firebaseConfig"; // Assume db is your Firestore instance

//get boardList
export const getUserBoards = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const userId = req.user?.uid;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    // Fetch user's document to get owned and shared board references
    const userDoc = await db.collection("Users").doc(userId).get();
    const userData = userDoc.data();

    if (!userData) {
      res.status(404).json({ message: "User data not found" });
      return;
    }

    const ownedBoardRefs = userData.OwnedBoards || [];
    const sharedBoardRefs = userData.SharedBoards || [];

    // Fetch board details for owned boards
    const ownedBoards = await Promise.all(
      ownedBoardRefs.map(
        async (boardRef: FirebaseFirestore.DocumentReference) => {
          const boardDoc = await boardRef.get();
          const boardData = boardDoc.exists ? boardDoc.data() : null;
          return boardData
            ? { boardId: boardData.boardId, name: boardData.name }
            : null;
        },
      ),
    ).then((results) => results.filter((board) => board !== null));

    // Fetch board details for shared boards
    const sharedBoards = await Promise.all(
      sharedBoardRefs.map(
        async (boardRef: FirebaseFirestore.DocumentReference) => {
          const boardDoc = await boardRef.get();
          const boardData = boardDoc.exists ? boardDoc.data() : null;
          return boardData
            ? { boardId: boardData.boardId, name: boardData.name }
            : null;
        },
      ),
    ).then((results) => results.filter((board) => board !== null));

    const responseData = {
      Owned: ownedBoards,
      Shared: sharedBoards,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error retrieving boards:", error);
    res.status(500).json({ message: "Failed to retrieve boards" });
  }
};

export const updateEmail = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const userId = req.user?.uid;
  const { newEmail } = req.body;

  // Check for authentication and email input
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!newEmail) {
    res.status(400).json({ message: "New email address is required" });
    return;
  }

  try {
    // Check if the new email is already in use
    try {
      await firebaseAdmin.auth().getUserByEmail(newEmail);
      res
        .status(400)
        .json({ message: "Email is already in use by another account" });
      return;
    } catch (error: any) {
      if (error.code !== "auth/user-not-found") {
        if (error.code === "auth/invalid-email") {
          console.error("Invalid email format:", error);
          res.status(400).json({ message: "Invalid email format" });
          return;
        }
        console.error("Error verifying email availability:", error);
        res.status(500).json({ message: "Error verifying email availability" });
        return;
      }
      // If the email is not found, it's available
    }

    // Retrieve old user data before updating
    const oldUserData = await authAdmin.getUser(userId);

    // Attempt to update the email in Firebase Authentication
    try {
      await authAdmin.updateUser(userId, { email: newEmail });
    } catch (authError) {
      console.error(
        "Error updating email in Firebase Authentication:",
        authError,
      );
      res
        .status(500)
        .json({ message: "Failed to update email in Authentication" });
      return;
    }

    // Now attempt to update the email in Firestore
    try {
      await firebaseAdmin
        .firestore()
        .collection("Users")
        .doc(userId)
        .update({ email: newEmail });
      res.status(200).json({ message: "Email updated successfully" });
      return;
    } catch (firestoreError) {
      // If Firestore update fails, revert the email in Firebase Authentication
      try {
        await authAdmin.updateUser(userId, { email: oldUserData.email }); // Revert to the old email
      } catch (revertError) {
        console.error("Error reverting email in Authentication:", revertError);
        res.status(500).json({
          message:
            "Failed to update email in DB and failed reverting that. (Only info in authentication updated)",
        });
        return;
      }
      console.error(
        "Error updating Firestore, reverted email in Authentication:",
        firestoreError,
      );
      res
        .status(500)
        .json({ message: "Failed to update email in DB. Changes reverted." });
      return;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Failed to update email" });
    return;
  }
};
