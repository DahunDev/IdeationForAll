import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../configs/firebaseConfig";
import { AuthenticatedRequest } from "../types/customTypes";

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Change the return type to Promise<void>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.displayName,
    };
    next(); // Call next() to proceed to the next middleware
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
