import { BoardRef, PostItRef } from "../types/firestoreTypes";

export class User {
  private userId: string;
  private username: string;
  private email: string;
  private password: string; // You should hash this before storing
  private accountSettingID: string; // Reference to account settings document
  private sharedBoards: Array<BoardRef>; // Array of shared boards
  private ownedBoards: Array<BoardRef>; // Array of owned boards
  private ownedUnGroupedPostIts: Array<PostItRef>; // Array of owned ungrouped Post-Its

  constructor(
    userId: string,
    username: string,
    email: string,
    password: string,
    accountSettingID: string,
    sharedBoards: Array<BoardRef> = [],
    ownedBoards: Array<BoardRef> = [],
    ownedUngroupedPostIts: Array<PostItRef> = [],
  ) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.password = password;
    this.accountSettingID = accountSettingID;
    this.sharedBoards = sharedBoards || [];
    this.ownedBoards = ownedBoards || [];
    this.ownedUnGroupedPostIts = ownedUngroupedPostIts || [];
  }

  public getUserId(): string {
    return this.userId;
  }

  public getUsername(): string {
    return this.username;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getAccountSettingID(): string {
    return this.accountSettingID;
  }

  public getSharedBoards(): BoardRef[] {
    return this.sharedBoards;
  }

  public getOwnedBoards(): BoardRef[] {
    return this.ownedBoards;
  }

  public getOwnedUngroupedPostIts(): PostItRef[] {
    return this.ownedUnGroupedPostIts;
  }

  /**
   * Updates the user's username.
   *
   * @param username - The new username to be set for the user.
   * @returns `true` if the username was successfully updated  `false` otherwise.
   *
   */

  updateuserName(userName: string): boolean {
    this.username = userName;
    // Update in Firestore
    return true;
  }

  /**
   * Updates the user's password.
   *
   * @param password - The new password to be set for the user.
   * @returns `true` if the password was successfully updated  `false` otherwise.
   *
   */

  updateHashedPassword(password: string): boolean {
    // Hash the password and update in Firestore
    this.password = password; // Example: Hashing using bcrypt

    // Update in Firestore

    return true;
  }

  addSharedBoard(board: BoardRef): boolean {
    if (this.sharedBoards.some((ref) => ref.id === board.id)) {
      return false; // Board already exists, so return false
    }

    // If the board does not exist, add it to sharedBoards
    this.sharedBoards.push(board);
    // Save to Firestore
    return true;
  }

  /**
   * Updates the user's email and checks if the new email is unique.
   *
   * @param newEmail - The new email to be set for the user.
   * @returns `true` if the email was successfully updated and unique, `false` otherwise.
   *
   * @remarks
   * This function should perform the following steps:
   * 1. Check if the new email is the same as the current email. If it is, return `false`.
   * 2. Check if the new email is unique in the system. If it is not, return `false`.
   * 3. Update the user's email in the Firestore database.
   * 4. Return `true`.
   */

  updateEmail(newEmail: string): boolean {
    if (this.email === newEmail) {
      return false;
    }

    // Check if the new email is unique

    this.email = newEmail;
    // Update email in Firestore

    return false;
  }

  /**
   * Updates the user's username.
   *
   * @param username - The new username to be set for the user.
   * @returns `true` if the boardId was successfully removed from list (in both class and firestore)  `false` otherwise.
   *
   */

  removeSharedBoard(board: BoardRef): boolean {
    this.sharedBoards = this.sharedBoards.filter((ref) => ref.id !== board.id); //only includes item that id != id
    // Save to Firestore
    return true;
  }

  addOwnedBoard(board: BoardRef): boolean {
    if (this.ownedBoards.some((ref) => ref.id === board.id)) {
      return false; // Board already exists, so return false
    }

    this.ownedBoards.push(board);

    //Save to Firestore
    return true;
  }

  removeOwnedUngroupedPostItIds(postIt: PostItRef): boolean {
    this.ownedUnGroupedPostIts = this.ownedUnGroupedPostIts.filter(
      (ref) => ref.id !== postIt.id,
    );

    // Save to Firestore

    return true;
  }

  addOwnedUngroupedPostItIds(postIt: PostItRef): boolean {
    if (this.ownedUnGroupedPostIts.some((ref) => ref.id === postIt.id)) {
      return false; // Board already exists, so return false
    }

    this.ownedUnGroupedPostIts.push(postIt);

    //save to firesotre
    return true;
  }
}
