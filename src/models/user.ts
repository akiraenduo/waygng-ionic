export class User {
    uid: string;
    email: string;
    password: string;
    firstName: string;
    username: string;
    picture: string;
    token:string;

    constructor(
        uid: string,
        email:string,
        firstName: string,
        username: string,
        picture: string
    ) {
        this.uid = uid;
        this.email = email;
        this.firstName = firstName;
        this.username = username;
        this.picture = picture;
    }
}