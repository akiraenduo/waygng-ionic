import { User } from "./user";

export class Spot {
    id: string;
    message:  string;
    dateUpdate: number;
    userUid: string;

    constructor(id:string, message:string, userUid:string, dateUpdate:number) {
       this.id = id;
       this.message = message;
       this.userUid = userUid;
       this.dateUpdate = dateUpdate;
    }
}