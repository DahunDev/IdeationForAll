export class Board {
    boardId: string;
    name: string;
    workspaceOrganizerId: string;
    sharedBoards: BoardRef[]; // Array of Board references
    postItList: PostItRef[]; // Array of PostIt references
    groups: Group[]; // Array of Group objects

    constructor(data: any) {
        this.boardId = data.boardId;
        this.name = data.name;
        this.workspaceOrganizerId = data.workspaceOrganizerId;
        this.sharedBoards = data.sharedBoards || [];
        this.postItList = data.postItList || [];
        this.groups = data.groups ? data.groups.map(groupData => new Group(groupData)) : [];
    }
}
