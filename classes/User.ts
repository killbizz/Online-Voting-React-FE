import { UserInterface } from './../interfaces/UserInterface';

export class User implements UserInterface {
    email: string;
    password: string;
    username: string;

    constructor(email: string, password: string, username: string){
        this.email = email;
        this.password = password;
        this.username = username;
    }

}