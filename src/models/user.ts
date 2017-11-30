export interface User{
    uid:string;
    email?:string;
    photoURL?:string;
    displayName?:string;
    firstName?:string;
    token?:string;
    notificationNotSaw?:number;
    receiveNotif?:boolean;
    shareFav?:boolean;
  }