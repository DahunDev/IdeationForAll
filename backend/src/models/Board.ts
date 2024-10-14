import { BoardRef, PostItRef } from "../types/firestoreTypes";
import { Group } from "./Group";

export class Board {
    boardId: string;
    name: string;
    workspaceOrganizerId: string;
    sharedUsers: Array<string>; // References to shared userID
    postItList: Array<PostItRef>; // Array of PostIt references
    groups: Array<Group>; // Array of Group objects

    constructor(data: {
        boardId: string;
        name: string;
        workspaceOrganizerId: string;
        sharedUsers?: Array<string>;
        postItList?: Array<PostItRef>;
        groups?: Array<Group>; // Use GroupData type here
    }) {
        this.boardId = data.boardId;
        this.name = data.name;
        this.workspaceOrganizerId = data.workspaceOrganizerId;
        this.sharedUsers = data.sharedUsers || [];
        this.postItList = data.postItList || [];
        // Map the groups using the Group constructor
        this.groups = data.groups ? data.groups.map(groupData => new Group(groupData)) : [];
    }
}
