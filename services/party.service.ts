import { Party } from './../classes/Party';
import getBackendResponse from '../pages/api/lib/endpoints';

// SINGLETON PATTERN

export class PartyService {

  static instance: PartyService;

  static getInstance() {
    if (PartyService.instance === undefined) {
        PartyService.instance = new PartyService();
    }

    return this.instance;
  }

  getParties = async (): Promise<Party[]> => {
    const { response } = (
      await getBackendResponse("party", "GET", null)
    ).props;
    if (response._embedded === undefined) {
      return [];
    }
    return response._embedded.party.sort((a: Party ,b : Party) => {
      if(a.name < b.name){
        return -1;
      }
      if(a.name > b.name){
        return 1;
      }
      return 0;
    })
  }

  getParty = async (id: number): Promise<Party> => {
    const { response } = (
      await getBackendResponse(`party/${id}`, "GET", null)
    ).props;
    if (response === undefined) {
      console.log(response);
    }
    return response;
  }

  newParty = async (party: Party): Promise<boolean> => {
    const { response } = ( await getBackendResponse("party", "POST", JSON.stringify(party))).props;
    if(response.error !== undefined){
      return false;
    }
    return true;
  }

  deleteParty = async (id: number): Promise<boolean> => {
    const { response } = ( await getBackendResponse(`party/${id}`, "DELETE", null)).props;
    if(response.error !== undefined){
      return false;
    }
    return true;
  }

  fileToBase64 = async (file: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => resolve('data:image/png;base64,'+btoa(reader.result!.toString()));
      reader.onerror = (e) => reject(e);
    });
  }

}
