import { Election } from "../../classes/Election";
import { Party } from "../../classes/Party";
import ElectionDetail from "./ElectionDetail";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

interface ElectionListProps {
    elections: Election[],
    parties: Party[],
    refreshOnElectionsChange: any
}

const ElectionList = ({ elections, parties, refreshOnElectionsChange }: ElectionListProps) => {
    return (
        <Table className="table mb-4">
            <Thead className="thead-light">
            <Tr key={"adminElectionListHeader"}>
                <Th scope="col">ID</Th>
                <Th scope="col">Name</Th>
                <Th scope="col">Start Date</Th>
                <Th scope="col">End Date</Th>
                <Th scope="col">Action</Th>
            </Tr>
            </Thead>
            <Tbody>
                {elections.map((election) => 
                    <Tr key={election.id}>
                        <Th scope="row">{election.id}</Th>
                        <Td>{election.name}</Td>
                        <Td>{election.startDate}</Td>
                        <Td>{election.endDate}</Td>
                        <Td>
                            <ElectionDetail election={election} parties={parties} refreshOnElectionsChange={refreshOnElectionsChange} />
                        </Td>
                    </Tr>
                )
                }
            </Tbody>
        </Table>
    );

}

export default ElectionList;