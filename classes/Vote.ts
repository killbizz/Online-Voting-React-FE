export class Vote {
    id: number;
    userId: string;
    partyId: number;
    electionId: number;
    date: string;

    constructor(id: number, userId: string, partyId: number, electionId: number, date: string){
        this.id = id;
        this.userId = userId;
        this.partyId = partyId;
        this.electionId = electionId;
        this.date = date;
    }
}