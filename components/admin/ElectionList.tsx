import { Election } from "../../classes/Election";
import { Party } from "../../classes/Party";
import ElectionDetail from "./ElectionDetail";

interface ElectionListProps {
    elections: Election[],
    parties: Party[],
    refreshOnElectionsChange: any
}

const ElectionList = ({ elections, parties, refreshOnElectionsChange }: ElectionListProps) => {
    return (
        <table className="table mb-4">
            <thead className="thead-light">
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
                {elections.map((election) => 
                    <tr>
                        <th scope="row">{election.id}</th>
                        <td>{election.name}</td>
                        <td>{election.startDate}</td>
                        <td>{election.endDate}</td>
                        <td>
                            <ElectionDetail election={election} parties={parties} refreshOnElectionsChange={refreshOnElectionsChange} />
                        </td>
                    </tr>
                )
                }
            </tbody>
        </table>
    );

}

export default ElectionList;