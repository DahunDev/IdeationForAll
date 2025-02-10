// src/controllers/boardController.ts
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/customTypes";
import { db, firebaseAdmin } from "../configs/firebaseConfig"; // Assume db is your Firestore instance
export const createPostIt = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const userId = req.user?.uid; // Retrieve the UID from the authenticated request
  const { name, boardId, content, position, size } = req.body; // Extract boardName from the request body

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
      res.status(403).json({
        message: "You are not authorized to add a Post-It to this board",
      });
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
      font: "",
      posterUserID: userId,
      content: content || "", // If content is provided, use it, otherwise set it to an empty string
      associatedGroups: [], // No group assignment, so leave this empty
      position: position || { x: 0, y: 0 }, // Default position (if not provided)
      size: size || { width: 100, height: 250 }, // Default size
    };

    // Add the Post-It creation to the batch
    batch.set(postItRef, postItData);

    // Add the Post-It ID to the board's unGroupedpostItList array
    batch.update(boardRef, {
      unGroupedpostItList:
        firebaseAdmin.firestore.FieldValue.arrayUnion(postItRef),
    });

    // Commit the batch
    await batch.commit();

    res.status(201).json({ message: "Post-It created successfully", postItId });
  } catch (error) {
    console.error("Error creating Post-It:", error);
    res.status(500).json({ message: "Failed to create Post-It" });
  }
};

export const deletePostIt = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const userId = req.user?.uid; // Retrieve the UID from the authenticated request
  const { postItId } = req.body; // Extract boardName from the request body
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!postItId) {
    res.status(400).json({ message: "postItId is required" }); // corrected message
    return;
  }

  try {
    const postItRef = db.collection("PostIts").doc(postItId);
    const postItDoc = await postItRef.get();

    if (!postItDoc.exists) {
      res.status(404).json({ message: "PostIt not found" });
      return;
    }

    const postItData = postItDoc.data();
    const boardId = postItData?.associatedBoardID;
    const groupId = postItData?.groupId;
    const postItOwnerId = postItData?.posterUserID;

    const batch = db.batch();

    // Add deletion of the PostIt itself to the batch
    batch.delete(postItRef);

    // Retrieve the associated board and determine where to remove the reference
    const boardRef = db.collection("Boards").doc(boardId);
    const boardDoc = await boardRef.get();

    if (!boardDoc.exists) {
      res.status(404).json({ message: "Associated board not found" });
      return;
    }
    const boardData = boardDoc.data();
    const boardOwnerId = boardData?.workspaceOrganizerId;

    // Check if the current user is either the PostIt owner or the board owner
    if (userId !== postItOwnerId && userId !== boardOwnerId) {
      res
        .status(403)
        .json({ message: "You do not have permission to delete this PostIt" });
      return;
    }

    if (groupId) {
      // If the PostIt is part of a group, remove it from the group’s postItIds array
      const groupRef = boardRef.collection("Groups").doc(groupId);
      batch.update(groupRef, {
        postItIds: firebaseAdmin.firestore.FieldValue.arrayRemove(postItRef),
      });
    } else {
      // If the PostIt is ungrouped, remove it from the board’s unGroupedpostItList
      batch.update(boardRef, {
        unGroupedpostItList:
          firebaseAdmin.firestore.FieldValue.arrayRemove(postItRef),
      });
    }

    // Commit the batch operation
    await batch.commit();

    // Send success response
    res.status(200).json({ message: "PostIt deleted successfully" });
  } catch (error) {
    console.error("Error in batch deletion of PostIt:", error);
    res
      .status(500)
      .json({ message: "Failed to delete PostIt in batch operation" });
  }
};

export const updatePostItGroup = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const userId = req.user?.uid;
  const { postItId, targetGroupId } = req.body; // targetGroupId is null if moving to ungrouped

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!postItId) {
    res.status(400).json({ message: "postItId is required" });
    return;
  }

  try {
    const postItRef = db.collection("PostIts").doc(postItId);
    const postItDoc = await postItRef.get();

    if (!postItDoc.exists) {
      res.status(404).json({ message: "PostIt not found" });
      return;
    }

    const postItData = postItDoc.data();
    const boardId = postItData?.associatedBoardID;
    const currentGroupId = postItData?.groupId;

    if (!boardId) {
      res
        .status(400)
        .json({ message: "Associated board ID is missing in PostIt data" });
      return;
    }

    // Retrieve the associated board document to check for board ownership
    const boardRef = db.collection("Boards").doc(boardId);
    const boardDoc = await boardRef.get();

    if (!boardDoc.exists) {
      res.status(404).json({ message: "Associated board not found" });
      return;
    }

    const boardData = boardDoc.data();
    const boardOwnerId = boardData?.workspaceOrganizerId;
    const postItOwnerId = postItData?.posterUserID;

    // Check if the current user is either the PostIt owner or the board owner
    if (userId !== postItOwnerId && userId !== boardOwnerId) {
      res
        .status(403)
        .json({ message: "You do not have permission to move this PostIt" });
      return;
    }

    const batch = db.batch();

    // Update the PostIt's groupId to the targetGroupId (null if moving to ungrouped)
    batch.update(postItRef, { groupId: targetGroupId || null });

    // Remove PostIt reference from its current group or unGroupedpostItList
    if (currentGroupId) {
      const currentGroupRef = boardRef.collection("Groups").doc(currentGroupId);
      batch.update(currentGroupRef, {
        postItIds: firebaseAdmin.firestore.FieldValue.arrayRemove(postItRef),
      });
    } else {
      batch.update(boardRef, {
        unGroupedpostItList:
          firebaseAdmin.firestore.FieldValue.arrayRemove(postItRef),
      });
    }

    // Add PostIt reference to the target group or unGroupedpostItList
    if (targetGroupId) {
      const targetGroupRef = boardRef.collection("Groups").doc(targetGroupId);
      batch.update(targetGroupRef, {
        postItIds: firebaseAdmin.firestore.FieldValue.arrayUnion(postItRef),
      });
    } else {
      batch.update(boardRef, {
        unGroupedpostItList:
          firebaseAdmin.firestore.FieldValue.arrayUnion(postItRef),
      });
    }

    // Commit the batch
    await batch.commit();

    res.status(200).json({ message: "PostIt moved successfully" });
  } catch (error) {
    console.error("Error moving PostIt:", error);
    res.status(500).json({ message: "Failed to move PostIt" });
  }
};

export const updatePostItFont = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const userId = req.user?.uid;
  const { postItId, font } = req.body; // targetGroupId is null if moving to ungrouped

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!postItId) {
    res.status(400).json({ message: "postItId is required" });
    return;
  }

  try {
    const postItRef = db.collection("PostIts").doc(postItId);
    const postItDoc = await postItRef.get();

    if (!postItDoc.exists) {
      res.status(404).json({ message: "PostIt not found" });
      return;
    }

    if (!postItDoc || !postItDoc.exists) {
      res.status(404).json({ message: "PostIt not found" });
      return;
    }

    const postItData = postItDoc.data();
    const boardId = postItData?.associatedBoardID;

    if (!boardId) {
      res
        .status(500)
        .json({ message: "Associated board ID is missing in PostIt data" });
      return;
    }

    // Retrieve the associated board document to check for board ownership
    const boardRef = db.collection("Boards").doc(boardId);
    const boardDoc = await boardRef.get();

    if (!boardDoc.exists) {
      res.status(404).json({ message: "Associated board not found" });
      return;
    }

    const boardData = boardDoc.data();
    const boardOwnerId = boardData?.workspaceOrganizerId;
    const postItOwnerId = postItData?.posterUserID;

    // Check if the current user is either the PostIt owner or the board owner
    if (userId !== postItOwnerId && userId !== boardOwnerId) {
      res.status(403).json({
        message: "You do not have permission to edit font for this PostIt",
      });
      return;
    }
    await postItRef.update({ font: font });
    res.status(200).json({ message: "PostIt font updated successfully" });
  } catch (error) {
    console.error("Error moving PostIt:", error);
    res.status(500).json({ message: "Failed to updated PostIt font" });
  }
};

// Define the PostItData interface to include all possible fields
interface PostItData {
  postItId: string;
  associatedBoardID: string;
  groupId?: string | null;
  posterUserID: string;
  name?: string;
  content?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  font?: string;
  image?: string;
  upvotedUsers?: Set<string>;
  downvotedUsers?: Set<string>;
  upvotes?: number;
}

export const copyPostIt = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const userId = req.user?.uid; // Retrieve the UID from the authenticated request
  const { postItId, boardId, targetGroupId } = req.body; // Extract boardName from the request body

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!boardId) {
    res.status(400).json({ message: "boardId is required" });
    return;
  }

  if (!postItId) {
    res.status(400).json({ message: "postItId is required" });
    return;
  }

  try {
    // Reference to the board
    const boardRef = db.collection("Boards").doc(boardId);
    const boardDoc = await boardRef.get();

    if (!boardDoc.exists) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    const boardData = boardDoc.data();

    // Check if the user is either the owner of the board or in the SharedUserIds array
    const isAuthorized =
      boardData?.workspaceOrganizerId === userId ||
      (boardData?.SharedUserIds && boardData.SharedUserIds.includes(userId));

    if (!isAuthorized) {
      res.status(403).json({
        message: "You are not authorized to add a Post-It to this board",
      });
      return;
    }

    // Fetch the original post-it
    const postItRef = db.collection("PostIts").doc(postItId);
    const postItDoc = await postItRef.get();

    if (!postItDoc.exists) {
      res.status(404).json({ message: "Post-it not found." });
      return;
    }

    const postItData = postItDoc.data() as PostItData;

    await db.runTransaction(async (transaction) => {
      const newPostItId = db.collection("PostIts").doc().id;
      const newPostItRef = db.collection("PostIts").doc(newPostItId);
      const boardRef = db.collection("Boards").doc(boardId);

      // Prepare new PostIt data
      const newPostItData = {
        ...postItData,
        postItId: newPostItId,
        associatedBoardID: boardId,
        groupId: targetGroupId || null,
        posterUserID: userId,
      };

      // Remove fields that should not be copied
      delete newPostItData.upvotedUsers;
      delete newPostItData.downvotedUsers;
      delete newPostItData.upvotes;

      // Set the new PostIt in Firestore
      transaction.set(newPostItRef, newPostItData);

      // Check if targetGroupId is provided
      if (targetGroupId) {
        // If a group is provided, check if it exists
        const groupRef = boardRef.collection("Groups").doc(targetGroupId);
        const groupDoc = await transaction.get(groupRef);

        if (!groupDoc.exists) {
          throw new Error("Group does not exist. Cancelling the operation.");
        }

        // If the group exists, add the new PostIt to the group
        transaction.update(groupRef, {
          postIts: firebaseAdmin.firestore.FieldValue.arrayUnion(newPostItRef),
        });
      } else {
        // If no group is provided, add the PostIt to the unGroupedpostItList in the board
        transaction.update(boardRef, {
          unGroupedpostItList:
            firebaseAdmin.firestore.FieldValue.arrayUnion(newPostItRef),
        });
      }
    });

    res.status(201).json({
      message: "Post-it copied successfully.",
      postItId: postItId,
      postIt: postItData,
    });
  } catch (error: any) {
    if (error as Error) {
      // console.error("Error creating Post-It:", error);
      res
        .status(500)
        .json({ message: "Failed to copy Post-It", error: error.message });
    } else {
      // console.error("Error creating Post-It:", error);
      res.status(500).json({ message: "Failed to copy Post-It", error });
    }
  }
};
