export class ErrorResponse {
    error_code: number;
    error_description: string;

    constructor(ec: number, ed: string){
        this.error_code = ec;
        this.error_description = ed;
    }

}