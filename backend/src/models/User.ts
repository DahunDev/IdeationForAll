export class User {
  private userId: string;
  private username: string;
  private email: string;
  private password: string; // You should hash this before storing
  private accountSettingID: string; // Reference to account settings document
  private sharedBoardIds: string[]; // Array of shared board IDs
  private ownedBoardIds: string[]; // Array of owned board IDs
  private ownedUngroupedPostItIds: string[]; // Array of owned ungrouped Post-It IDs

  constructor(
    userId: string,
    username: string,
    email: string,
    password: string,
    accountSettingID: string,
    sharedBoardIds: string[] = [],
    ownedBoardIds: string[] = [],
    ownedUngroupedPostItIds: string[] = [],
  ) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.password = password;
    this.accountSettingID = accountSettingID;
    this.sharedBoardIds = sharedBoardIds;
    this.ownedBoardIds = ownedBoardIds;
    this.ownedUngroupedPostItIds = ownedUngroupedPostItIds;
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

  public getSharedBoardIds(): string[] {
    return this.sharedBoardIds;
  }

  public getOwnedBoardIds(): string[] {
    return this.ownedBoardIds;
  }

  public getOwnedUngroupedPostItIds(): string[] {
    return this.ownedUngroupedPostItIds;
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

  addSharedBoard(boardId: string): boolean {
    if (!this.sharedBoardIds.includes(boardId)) {
      this.sharedBoardIds.push(boardId);
      // Save to Firestore
      return true;
    }

    return false;
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

  removeSharedBoard(boardId: string): boolean {
    this.sharedBoardIds = this.sharedBoardIds.filter((id) => id !== boardId);
    // Save to Firestore

    return true;
  }

  addOwnedBoard(boardId: string): boolean {
    if (!this.ownedBoardIds.includes(boardId)) {
      this.ownedBoardIds.push(boardId);
      // Save to Firestore

      return true;
    }

    return false;
  }

  removeOwnedUngroupedPostItIds(postItId: string): boolean {
    this.ownedUngroupedPostItIds = this.ownedUngroupedPostItIds.filter(
      (id) => id !== postItId,
    );
    // Save to Firestore

    return true;
  }

  addOwnedUngroupedPostItIds(postItId: string): boolean {
    if (!this.ownedBoardIds.includes(postItId)) {
      this.ownedBoardIds.push(postItId);
      // Save to Firestore
      return true;
    }

    return false;
  }
}
