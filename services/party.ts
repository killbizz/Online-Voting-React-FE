import { Party } from '../classes/Party';
import getBackendResponse from '../pages/api/lib/endpoints';

export const getParties = async (): Promise<Party[]> => {
  const { response } = await getBackendResponse("party", "GET", null);
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

export const getPartiesById = async (partiesId: number[]): Promise<Party[]> => {

  const { response } = await getBackendResponse("party", "GET", null);
  if (partiesId.length === 0 || response._embedded === undefined) {
    return [];
  }
  return response._embedded.party.filter((party: Party) => partiesId.findIndex((value: number) => value === party.id ) > -1 )
    .sort((a: Party ,b : Party) => {
      if(a.name < b.name){
        return -1;
      }
      if(a.name > b.name){
        return 1;
      }
      return 0;
    });
}

export const getParty = async (id: number): Promise<Party> => {
  const { response } = await getBackendResponse(`party/${id}`, "GET", null);
  if (response === undefined) {
    console.log(response);
  }
  return response;
}

export const newParty = async (party: Party): Promise<boolean> => {
  const { response } = await getBackendResponse("party", "POST", JSON.stringify(party));
  if(response.error !== undefined){
    return false;
  }
  return true;
}

export const deleteParty = async (id: number): Promise<boolean> => {
  const { response } = await getBackendResponse(`party/${id}`, "DELETE", null);
  if(response.error !== undefined){
    return false;
  }
  return true;
}

export const fileToBase64 = async (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => resolve('data:image/png;base64,'+btoa(reader.result!.toString()));
    reader.onerror = (e) => reject(e);
  });
}
