import { Election } from "../../classes/Election";
import { Party } from "../../classes/Party";
import { Vote } from "../../classes/Vote";

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
        <table className="table mb-4">
            <thead className="thead-light">
            <tr key={"votingHistoryListHeader"}>
                <th scope="col">Election Name</th>
                <th scope="col">Election Start Date</th>
                <th scope="col">Election End Date</th>
                <th scope="col">Vote Date</th>
                <th scope="col">Voted Party and Candidate</th>
            </tr>
            </thead>
            <tbody>
                {
                    userVotes.map((vote) => 
                        <tr key={vote.id}>
                            <td>{getCorrispondingElection(vote.electionId)!.name}</td>
                            <td>{getCorrispondingElection(vote.electionId)!.startDate}</td>
                            <td>{getCorrispondingElection(vote.electionId)!.endDate}</td>
                            <td>{vote.date}</td>
                            <td>{getCorrispondingParty(vote.partyId)!.name} - {getCorrispondingParty(vote.partyId)!.candidate}</td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    );
}

export default VotingHistory;