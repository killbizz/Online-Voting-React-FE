import { Election } from "../../classes/Election";
import { Party } from "../../classes/Party";
import { Vote } from "../../classes/Vote";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

interface VotingHistoryProps {
    userRelatedElections: Election[],
    userRelatedParties: Party[],
    userVotes: Vote[]
}

const VotingHistory = ({ userRelatedElections, userRelatedParties, userVotes }: VotingHistoryProps) => {

    const getCorrispondingElection = (id: number) => {
        return userRelatedElections.find((value) => value.id === id);
    }

    const getCorrispondingParty = (id: number) => {
        return userRelatedParties.find((value) => value.id === id);
    }

    return (
        <Table className="table mb-4">
            <Thead className="thead-light">
            <Tr key={"votingHistoryListHeader"}>
                <Th scope="col">Election Name</Th>
                <Th scope="col">Election Start Date</Th>
                <Th scope="col">Election End Date</Th>
                <Th scope="col">Vote Date</Th>
                <Th scope="col">Party and Candidate</Th>
            </Tr>
            </Thead>
            <Tbody>
                {
                    userVotes.map((vote) => 
                        <Tr key={vote.id}>
                            <Td>{getCorrispondingElection(vote.electionId)!.name}</Td>
                            <Td>{getCorrispondingElection(vote.electionId)!.startDate}</Td>
                            <Td>{getCorrispondingElection(vote.electionId)!.endDate}</Td>
                            <Td>{vote.date}</Td>
                            <Td>{getCorrispondingParty(vote.partyId)!.name} - {getCorrispondingParty(vote.partyId)!.candidate}</Td>
                        </Tr>
                    )
                }
            </Tbody>
        </Table>
    );
}

export default VotingHistory;