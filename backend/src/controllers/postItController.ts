// src/controllers/boardController.ts
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/customTypes";
import { db, firebaseAdmin } from "../configs/firebaseConfig"; // Assume db is your Firestore instance
export const createPostIt = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.uid; // Retrieve the UID from the authenticated request
  const { name , boardId, content , position } = req.body; // Extract boardName from the request body

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!name) {
    res.status(400).json({ message: "PostIt name is required" });
    return;
  }

  if (!boardId) {
    res.status(400).json({ message: "boardId name is required" });
    return;
  }

  try {
    const batch = db.batch(); // Create a Firestore batch

    // Reference to the board
    const boardRef = db.collection("Boards").doc(boardId);
    const boardSnapshot = await boardRef.get();

    if (!boardSnapshot.exists) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    const boardData = boardSnapshot.data();

    // Check if the user is either the owner of the board or in the SharedUserIds array
    const isAuthorized =
      boardData?.workspaceOrganizerId === userId ||
      (boardData?.SharedUserIds && boardData.SharedUserIds.includes(userId));

    if (!isAuthorized) {
      res.status(403).json({ message: "You are not authorized to add a Post-It to this board" });
      return;
    }

    // Create a new Post-It document with an automatic ID
    const postItRef = db.collection("PostIts").doc(); // Creates a reference with an auto-generated ID
    const postItId = postItRef.id; // Retrieve the auto-generated ID

    // Prepare the Post-It data
    const postItData = {
      postItId,
      associatedBoardID: boardId,
      name,
      posterUserID: userId,
      content: content || "", // If content is provided, use it, otherwise set it to an empty string
      votes: 0, // Start with 0 votes
      associatedGroups: [], // No group assignment, so leave this empty
      position: position || { x: 0, y: 0 }, // Default position (if not provided)
    };

    // Add the Post-It creation to the batch
    batch.set(postItRef, postItData);

    // Add the Post-It ID to the board's unGroupedpostItList array
    batch.update(boardRef, {
      unGroupedpostItList: firebaseAdmin.firestore.FieldValue.arrayUnion(postItRef),
    });

    // Commit the batch
    await batch.commit();

    res.status(201).json({ message: "Post-It created successfully", postItId });
  } catch (error) {
    console.error("Error creating Post-It:", error);
    res.status(500).json({ message: "Failed to create Post-It" });
  }
};
