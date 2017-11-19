export interface Comment {
    id?:string;
    content:  string;
    createdAt: number
    userUid: string;
    userName: string;
    userPicture: string;
}