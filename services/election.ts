import { Election } from '../classes/Election';
import getBackendResponse from '../lib/endpoints';

export const getElections = async (jwt: string | undefined): Promise<Election[]> => {
  const { response } = await getBackendResponse("election", "GET", null, jwt);
  if (response._embedded === undefined) {
    return [];
  }
  return response._embedded.election.sort((a: Election,b : Election) => {
    if(a.startDate < b.startDate){
      return -1;
    }
    if(a.id > b.id){
      return 1;
    }
    return 0;
  });
}

export const getElection = async (id: number, jwt: string | undefined): Promise<Election | undefined> => {
  const { response } = await getBackendResponse(`election/${id}`, "GET", null, jwt);
  if (response.error !== undefined) {
    return undefined;
  }
  return response;
}

export const newElection = async (election: Election, jwt: string | undefined): Promise<boolean> => {
  const { response } = await getBackendResponse("election", "POST", JSON.stringify(election), jwt);
  if(response.error !== undefined){
    return false;
  }
  return true;
}

export const updateElection = async (id: number, election: Election, jwt: string | undefined): Promise<boolean> => {
  const { response } = await getBackendResponse(`election/${id}`, "PUT", JSON.stringify(election), jwt);
  if(response.error !== undefined){
    return false;
  }
  return true;
}

export const deleteElection = async (id: number, jwt: string | undefined): Promise<boolean> => {
  const { response } = await getBackendResponse(`election/${id}`, "DELETE", null, jwt);
  if(response.error !== undefined){
    return false;
  }
  return true;
}