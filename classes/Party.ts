export class Party {
    id: number;
    name: string;
    candidate: string;
    base64logo: string;

    constructor(id: number, name: string, candidate: string, base64logo: string){
        this.id = id;
        this.name = name;
        this.candidate = candidate;
        this.base64logo = base64logo;
    }

}