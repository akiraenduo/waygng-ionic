export class User {
    id:string;
    email: string;
    password: string;
    firstName: string;
    username: string;
    picture: string;
    token:string;

    constructor(
        id: string,
        email:string,
        firstName: string,
        username: string,
        picture: string
    ) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.username = username;
        this.picture = picture;
    }
}