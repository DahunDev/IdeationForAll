 import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/customTypes";
import { db, firebaseAdmin } from "../configs/firebaseConfig"; // Assume db is your Firestore instance

 //get boardList
 export const getUserBoards = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
        ownedBoardRefs.map(async (boardRef: FirebaseFirestore.DocumentReference) => {
          const boardDoc = await boardRef.get();
          const boardData = boardDoc.exists ? boardDoc.data() : null;
          return boardData ? { boardId: boardData.boardId, name: boardData.name } : null;
        })
      ).then(results => results.filter(board => board !== null));
  
      // Fetch board details for shared boards
      const sharedBoards = await Promise.all(
        sharedBoardRefs.map(async (boardRef: FirebaseFirestore.DocumentReference) => {
          const boardDoc = await boardRef.get();
          const boardData = boardDoc.exists ? boardDoc.data() : null;
          return boardData ? { boardId: boardData.boardId, name: boardData.name } : null;
        })
      ).then(results => results.filter(board => board !== null));
  
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