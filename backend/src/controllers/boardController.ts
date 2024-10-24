// src/controllers/boardController.ts
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/customTypes";
import { db, firebaseAdmin } from "../configs/firebaseConfig"; // Assume db is your Firestore instance
export const createBoard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.uid; // Retrieve the UID from the authenticated request
  const { boardName } = req.body; // Extract boardName from the request body

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!boardName) {
    res.status(400).json({ message: "Board name is required" });
    return;
  }

  try {
    // Create a new board document with an automatic ID
    const boardRef = db.collection("Boards").doc(); // Creates a reference with an auto-generated ID
    const boardId = boardRef.id; // Retrieve the auto-generated ID

    // Prepare the board data
    const boardData = {
      boardId, // Set the generated ID
      name: boardName,
      workspaceOrganizerId: userId,
      SharedBoards: [],
      unGroupedpostItList: [],
    };

    // Set the board document in Firestore
    await boardRef.set(boardData);

    // Add the board ID to the user's OwnedBoards array
    await db
      .collection("Users")
      .doc(userId)
      .update({
        OwnedBoards: firebaseAdmin.firestore.FieldValue.arrayUnion(boardId),
      });

    // Optional: Initialize the Groups subcollection for the new board
    const groupsRef = boardRef.collection("Groups");

    // You can add a default group if necessary
    const defaultGroupId = groupsRef.doc().id; // Unique ID for the default group
    await groupsRef.doc(defaultGroupId).set({
      groupId: defaultGroupId,
      title: "Default Group", // Default title for the group
      postItIds: [], // Start with an empty array for post-it IDs
    });

    res
      .status(201)
      .json({ message: "Board created successfully", boardId });
      return;

  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ message: "Failed to create board" });
    return;

  }
};
