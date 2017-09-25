export class Spot {
    id: string;
    message:  string;
    date: number;
    dateUpdate: number;
    gender: string;
    userUid: string;


    constructor(id:string, message:string, gender:string, date:number, userUid:string) {
       this.id = id;
       this.message = message;
       this.date = date;
       this.gender = gender;
       this.userUid = userUid;
    }
}