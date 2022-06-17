import { Vote } from '../classes/Vote';
import getBackendResponse from '../lib/endpoints';

export const getVotes = async (jwt: string | undefined): Promise<Vote[]> => {
  const { response } = await getBackendResponse("vote", "GET", null, jwt);
  if (response._embedded === undefined) {
    return [];
  }
  return response._embedded.vote.sort((a: Vote ,b : Vote) => {
    if(a.date < b.date){
      return -1;
    }
    if(a.date > b.date){
      return 1;
    }
    return 0;
  })
}

export const getVotesByUserId = async (id: string, jwt: string | undefined): Promise<Vote[]> => {
  const { response } = await getBackendResponse("vote", "GET", null, jwt);
  if (response._embedded === undefined) {
    return [];
  }
  return response._embedded.vote.filter((value: Vote) => value.userId === id ).sort((a: Vote ,b : Vote) => {
    if(a.date < b.date){
      return -1;
    }
    if(a.date > b.date){
      return 1;
    }
    return 0;
  })
}

export const newVote = async (vote: Vote, jwt: string | undefined): Promise<boolean> => {
  const { response } = await getBackendResponse("vote", "POST", JSON.stringify(vote), jwt);
  if(response.error !== undefined){
    return false;
  }
  return true;
}