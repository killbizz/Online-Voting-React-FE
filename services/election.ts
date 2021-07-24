import { Election } from '../classes/Election';
import getBackendResponse from '../pages/api/lib/endpoints';

export const getElections = async (): Promise<Election[]> => {
  const { response } = (
    await getBackendResponse("election", "GET", null)
  ).props;
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

export const getElection = async (id: number): Promise<Election> => {
  const { response } = (
    await getBackendResponse(`election/${id}`, "GET", null)
  ).props;
  if (response === undefined) {
    console.log(response);
  }
  return response;
}

export const newElection = async (election: Election): Promise<boolean> => {
  const { response } = ( await getBackendResponse("election", "POST", JSON.stringify(election))).props;
  if(response.error !== undefined){
    return false;
  }
  return true;
}

export const updateElection = async (election: Election): Promise<boolean> => {
  const { response } = ( await getBackendResponse("election", "PUT", JSON.stringify(election))).props;
  console.log(response);
  if(response.error !== undefined){
    return false;
  }
  return true;
}

export const deleteElection = async (id: number): Promise<boolean> => {
  const { response } = ( await getBackendResponse(`election/${id}`, "DELETE", null)).props;
  console.log(response);
  if(response.error !== undefined){
    return false;
  }
  return true;
}