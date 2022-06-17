import { Party } from '../classes/Party';
import getBackendResponse from '../lib/endpoints';

export const getParties = async (jwt: string | undefined): Promise<Party[]> => {
  const { response } = await getBackendResponse("party", "GET", null, jwt);
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

export const getPartiesById = async (partiesId: number[], jwt: string | undefined): Promise<Party[]> => {

  const { response } = await getBackendResponse("party", "GET", null, jwt);
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

export const getParty = async (id: number, jwt: string | undefined): Promise<Party> => {
  const { response } = await getBackendResponse(`party/${id}`, "GET", null, jwt);
  if (response === undefined) {
    console.log(response);
  }
  return response;
}

export const newParty = async (party: Party, jwt: string | undefined): Promise<boolean> => {
  const { response } = await getBackendResponse("party", "POST", JSON.stringify(party), jwt);
  if(response.error !== undefined){
    return false;
  }
  return true;
}

export const deleteParty = async (id: number, jwt: string | undefined): Promise<boolean> => {
  const { response } = await getBackendResponse(`party/${id}`, "DELETE", null, jwt);
  if(response.error !== undefined){
    return false;
  }
  return true;
}