import { EventEmitter, Injectable, Output } from '@angular/core';
import { Election } from '../classes/Election';
import getBackendResponse from '../lib/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {

  @Output() newElectionCreated = new EventEmitter();
  @Output() electionDeleted = new EventEmitter();
  @Output() electionUpdated = new EventEmitter();;

  constructor() { }

  getElections = async (): Promise<Election[]> => {
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

  getElection = async (id: number): Promise<Election> => {
    const { response } = (
      await getBackendResponse(`election/${id}`, "GET", null)
    ).props;
    if (response === undefined) {
      console.log(response);
    }
    return response;
  }

  newElection = async (election: Election): Promise<boolean> => {
    const { response } = ( await getBackendResponse("election", "POST", JSON.stringify(election))).props;
    if(response.error !== undefined){
      return false;
    }
    this.newElectionCreated.emit();
    return true;
  }

  updateElection = async (election: Election): Promise<boolean> => {
    const { response } = ( await getBackendResponse("election", "PUT", JSON.stringify(election))).props;
    console.log(response);
    if(response.error !== undefined){
      return false;
    }
    this.electionUpdated.emit();
    return true;
  }

  deleteElection = async (id: number): Promise<boolean> => {
    const { response } = ( await getBackendResponse(`election/${id}`, "DELETE", null)).props;
    console.log(response);
    if(response.error !== undefined){
      return false;
    }
    this.electionDeleted.emit();
    return true;
  }

}
