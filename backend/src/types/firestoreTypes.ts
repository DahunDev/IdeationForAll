// src/types/firestoreTypes.ts

import { DocumentReference } from "firebase/firestore";
import { User } from "../models/User"; // Adjust path as necessary
import { Board } from "../models/Board"; // Adjust path as necessary
import { PostIt } from "../models/PostIt";

// Firestore types for references
export type UserRef = DocumentReference<User>;
export type BoardRef = DocumentReference<Board>;
export type PostItRef = DocumentReference<PostIt>;

export type UserRefList = UserRef[]; // Array of User references
export type BoardRefList = BoardRef[]; // Array of Board references
export type PostItRefList = PostItRef[]; // Array of PostIt references