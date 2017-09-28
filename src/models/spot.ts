import { User } from "./user";

export class Spot {
    message:  string;
    dateUpdate: number;
    userUid: string;
    user: User;

    constructor(message:string, userUid:string, dateUpdate:number) {
       this.message = message;
       this.userUid = userUid;
       this.dateUpdate = dateUpdate;
    }
}