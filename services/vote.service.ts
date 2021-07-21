import { Vote } from '../classes/Vote';
import getBackendResponse from '../pages/api/lib/endpoints';
import { AuthService } from './auth.service';


export class VoteService {

  constructor(private authService: AuthService) { }

  getVotes = async (): Promise<Vote[]> => {
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

  getVotesByUserId = async (): Promise<Vote[]> => {
    const id: string = this.authService.getUserId()!;
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

  newVote = async (vote: Vote): Promise<boolean> => {
    const { response } = ( await getBackendResponse("vote", "POST", JSON.stringify(vote))).props;
    if(response.error !== undefined){
      return false;
    }
    return true;
  }

}
