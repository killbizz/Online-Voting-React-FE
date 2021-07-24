import { Vote } from '../classes/Vote';
import getBackendResponse from '../pages/api/lib/endpoints';
import { getUserId } from './auth';

export const getVotes = async (): Promise<Vote[]> => {
  const { response } = (
    await getBackendResponse("vote", "GET", null)
  ).props;
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

export const getVotesByUserId = async (): Promise<Vote[]> => {
  const id: string = getUserId()!;
  const { response } = (
    await getBackendResponse("vote", "GET", null)
  ).props;
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

export const newVote = async (vote: Vote): Promise<boolean> => {
  const { response } = ( await getBackendResponse("vote", "POST", JSON.stringify(vote))).props;
  if(response.error !== undefined){
    return false;
  }
  return true;
}
