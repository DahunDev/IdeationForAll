import { PostItRef } from "../types/firestoreTypes";

export interface GroupData {
  groupId: string; // Adjust fields as necessary
  title: string; // Adjust fields as necessary
  postIts?: Array<PostItRef>; // If you want to include references to PostIts
}

export class Group {
  private groupId: string;
  private title: string;
  private postIts: PostItRef[]; // Array of PostIt references

  constructor(data: any) {
    this.groupId = data.groupId;
    this.title = data.title;
    this.postIts = data.postIts || [];
  }
  getGroupId(): string {
    return this.groupId;
  }

  getTitle() {
    return this.title;
  }

  updateTitle(title: string) {
    this.title = title;
    // Save to Firestore
  }

  // Adds a PostIt reference to the group
  addPostIt(postIt: PostItRef): boolean {
    if (!this.postIts.find((ref) => ref.id === postIt.id)) {
      this.postIts.push(postIt);
      // Save to Firestore
      return true;
    }
    return false; // PostIt already exists in the group
  }

  // Removes a PostIt reference from the group
  removePostIt(postIt: PostItRef): boolean {
    const originalLength = this.postIts.length;
    this.postIts = this.postIts.filter((ref) => ref.id !== postIt.id);
    // Check if any PostIt was removed
    return originalLength !== this.postIts.length;
  }
}
