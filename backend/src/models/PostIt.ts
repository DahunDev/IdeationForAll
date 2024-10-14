import { DocumentReference } from "@firebase/firestore";
import { BoardRef } from "../types/firestoreTypes";

export class PostIt {
    postItId: string;
    associatedBoards: Array<BoardRef>; // References to boards associated with this Post-It
    associatedGroups: Array<DocumentReference>; // References to groups associated with this Post-It
    name: string;
    posterUserID: string;
    content: string;
    votes: number;
    groupId?: string; // Optional group ID if it's associated with a group
    images: Array<string>; // URLs for images associated with this Post-It
    font: string;
    position: { x: number; y: number }; // Position on the board

    constructor(postItId: string, name: string, posterUserID: string, content: string) {
        this.postItId = postItId;
        this.name = name;
        this.posterUserID = posterUserID;
        this.content = content;
        this.votes = 0;
        this.associatedBoards = [];
        this.associatedGroups = [];
        this.images = [];
        this.font = 'default'; // Default font style
        this.position = { x: 0, y: 0 }; // Default position
    }

    // Method to add a board reference
    addAssociatedBoard(boardRef: BoardRef) {
        this.associatedBoards.push(boardRef);
    }

    // Method to add a group reference
    addAssociatedGroup(groupRef: DocumentReference) {
        this.associatedGroups.push(groupRef);
    }

    // Method to add an image URL
    addImage(imageUrl: string) {
        this.images.push(imageUrl);
    }
}
