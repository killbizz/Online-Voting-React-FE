import { Election } from "../../classes/Election";
import ReactTooltip from 'react-tooltip';
import Router from 'next/router';
import { Vote } from "../../classes/Vote";
import React, { useEffect, useState } from 'react';

interface ElectionListProps {
    elections: Election[],
    userVotes: Vote[],
    userId: string | null
}

const ElectionList = ({ elections, userVotes, userId }: ElectionListProps) => {

    const userAlreadyVoted = (electionId: number): boolean => {
        return userVotes.find((value) => value.electionId === electionId && value.userId === userId) !== undefined;
    }

    const votePossibility = (electionId: number, startDate: string, endDate: string) => {
        const alreadyVoted: boolean = userAlreadyVoted(electionId);
        const today: Date = new Date();
        const timeCompatibility: boolean = new Date(startDate) <= today && new Date(endDate) >= today;
        return timeCompatibility && !alreadyVoted;
    }

    const alreadyVoted: string = "You have already voted for this election";
    const timingIssue: string = "This election is terminated or is not already opened";
    // Need this for the react-tooltip
    const [isMounted,setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[]);

    return (
        <table className="table mb-4">
            <thead className="thead-light">
            <tr key={"userElectionListHeader"}>
                <th scope="col">Name</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
                {elections.map((election) => 
                    <tr key={election.id}>
                        <td>{election.name}</td>
                        <td>{election.startDate}</td>
                        <td>{election.endDate}</td>
                        <td>
                            { !votePossibility(election.id, election.startDate, election.endDate) &&
                            <>
                                {isMounted &&
                                    <ReactTooltip place="right" effect="solid" />
                                }
                                <span className="d-inline-block" tabIndex={0} data-tip={userAlreadyVoted(election.id) ? alreadyVoted : timingIssue}>
                                    <button type="button" disabled className="btn btn-outline-secondary btn-sm px-4 me-md-2">Vote!</button>
                                </span>
                            </>
                            }
                            { votePossibility(election.id, election.startDate, election.endDate) &&
                            <button type="button" className="btn btn-secondary btn-sm px-4 me-md-2" onClick={() => Router.push(`election-page/${election.id}`)}>Vote!</button>
                            }
                        </td>
                    </tr>
                )
                }
            </tbody>
        </table>
    );

}

export default ElectionList;