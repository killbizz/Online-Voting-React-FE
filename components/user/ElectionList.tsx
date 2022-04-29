import { Election } from "../../classes/Election";
import ReactTooltip from 'react-tooltip';
import Router from 'next/router';
import { Vote } from "../../classes/Vote";
import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

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
        <Table className="table mb-4">
            <Thead className="thead-light">
            <Tr key={"userElectionListHeader"}>
                <Th scope="col">Name</Th>
                <Th scope="col">Start Date</Th>
                <Th scope="col">End Date</Th>
                <Th scope="col">Action</Th>
            </Tr>
            </Thead>
            <Tbody>
                {elections.map((election) => 
                    <Tr key={election.id}>
                        <Td>{election.name}</Td>
                        <Td>{election.startDate}</Td>
                        <Td>{election.endDate}</Td>
                        <Td>
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
                        </Td>
                    </Tr>
                )
                }
            </Tbody>
        </Table>
    );

}

export default ElectionList;