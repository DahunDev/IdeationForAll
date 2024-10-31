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



export const getBoard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.uid; // Retrieve the UID from the authenticated request
  const { boardId } = req.body; // Extract boardName from the request body

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!boardId) {
    res.status(400).json({ message: "boardId is required" });
    return;
  }

  try {
    // Create a new board document with an automatic ID
    const boardRef = db.collection("Boards").doc(boardId);
    const boardDoc = await boardRef.get();

    if (!boardDoc.exists) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    const boardData = boardDoc.data();
    // Ensure boardData is defined
    if (!boardData) {
      res.status(404).json({ message: "Board data is undefined" });
      return;
    }

    if (boardData.workspaceOrganizerId !== userId && !boardData.SharedUserIds.includes(userId)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }



    // Fetch ungrouped post-its from the PostIts collection
    const ungroupedPostItRefs = boardData.unGroupedpostItList || [];
    const ungroupedPostIts = await Promise.all(
      ungroupedPostItRefs.map(async (postItRef: any) => {
        const postItDoc = await postItRef.get();
        return postItDoc.exists ? postItDoc.data() : null;
      })
    ).then(results => results.filter(postIt => postIt !== null));

    // Fetch groups and their post-its
    const groupsSnapshot = await boardRef.collection("Groups").get();
    const groups = await Promise.all(
      groupsSnapshot.docs.map(async groupDoc => {
        const groupData = groupDoc.data();
        
        // Fetch post-its within each group
        const postItRefs = groupData.postItIds || [];
        const postIts = await Promise.all(
          postItRefs.map(async (postItRef: any) => {
            const postItDoc = await postItRef.get();
            return postItDoc.exists ? postItDoc.data() : null;
          })
        ).then(results => results.filter(postIt => postIt !== null));

        return {
          groupId: groupData.groupId,
          title: groupData.title,
          postIts, // Include the post-its data for each group
        };
      })
    );

    const responseData = {
      boardId,
      name: boardData.name,
      workspaceOrganizerId: boardData.workspaceOrganizerId,
      SharedUserIds: boardData.SharedUserIds,
      Groups: groups,
      UngroupedPostIts: ungroupedPostIts, // Include the ungrouped post-its data
    };

    res.status(200).json(responseData);



  } catch (error) {
    console.error("Error retrieving board data:", error);
    res.status(500).json({ message: "Failed to get board data" });
    return;

  }
};

