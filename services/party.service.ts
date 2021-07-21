import { Party } from './../classes/Party';
import { EventEmitter, Injectable, Output } from '@angular/core';
import getBackendResponse from '../lib/endpoints';

@Injectable({
  providedIn: 'root'
})
export class PartyService {

  @Output() newPartyCreated = new EventEmitter();
  @Output() partyDeleted = new EventEmitter();

  constructor() { }

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
    this.newPartyCreated.emit();
    return true;
  }

  deleteParty = async (id: number): Promise<boolean> => {
    const { response } = ( await getBackendResponse(`party/${id}`, "DELETE", null)).props;
    if(response.error !== undefined){
      return false;
    }
    this.partyDeleted.emit();
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
