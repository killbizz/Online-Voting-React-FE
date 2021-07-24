import { Election } from "../../classes/Election";
import ElectionDetail from "./ElectionDetail";

interface ElectionListProps {
    elections: Election[]
}

const ElectionList = ({ elections }: ElectionListProps) => {
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
                            <ElectionDetail election={election} />
                        </td>
                    </tr>
                )
                }
            </tbody>
        </table>
    );

}

export default ElectionList;