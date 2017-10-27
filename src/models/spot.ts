export interface Spot {
    message:  string;
    dateUpdate: number;
    userUid: string;
    userName: string;
    userPicture: string;
    likes?:string[];
    anonyme?:boolean;
}