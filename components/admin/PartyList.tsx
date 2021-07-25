import { Party } from "../../classes/Party"
import ReactTooltip from 'react-tooltip';

interface PartyListProps {
    parties: Party[]
}

const PartyList = ({ parties }: PartyListProps) => {

    const deletePossibility = (id: number) => {
        return false;
    }

    const deleteParty = (id: number) => {

    }

    return(
        <table className="table mb-4">
            <thead className="thead-light">
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Logo</th>
                <th scope="col">Name</th>
                <th scope="col">Candidate</th>
                <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
                { parties.map((party) => 
                    <tr>
                        <th scope="row">{party.id}</th>
                        <td><img className="rounded" src={party.base64logo} alt={party.name} height="100" width="60" /></td>
                        <td>{party.name.charAt(0).toUpperCase() + party.name.slice(1)}</td>
                        <td>{party.candidate.charAt(0).toUpperCase() + party.candidate.slice(1)}</td>
                        <td>
                            { !deletePossibility(party.id) &&
                            <>
                                <ReactTooltip place="right" />
                                <span className="d-inline-block" tabIndex={0} data-tip="This party is present in an old votation or in one that is currently open">
                                    <button type="button" disabled={deletePossibility(party.id) ? undefined : true} className="btn btn-danger btn-sm px-4 me-md-2" onClick={ () => deleteParty(party.id)}>Delete</button>
                                </span>
                            </>
                            }
                            { deletePossibility(party.id) &&
                            <button type="button" disabled={deletePossibility(party.id) ? undefined : true } className="btn btn-danger btn-sm px-4 me-md-2" onClick={() => deleteParty(party.id)}>Delete</button>
                            }
                        </td>
                    </tr>
                )
                }
                
            </tbody>
        </table>
    );
}

export default PartyList;