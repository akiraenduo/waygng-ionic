export class Spot {
    message:  string;
    dateUpdate: number;
    userUid: string;
    userName: string;
    userPicture: string;
    likes:string[];

    constructor(message:string, userUid:string, userName:string, userPicture:string, dateUpdate:number) {
       this.message = message;
       this.userUid = userUid;
       this.userName = userName;
       this.userPicture = userPicture;
       this.dateUpdate = dateUpdate;
    }
}