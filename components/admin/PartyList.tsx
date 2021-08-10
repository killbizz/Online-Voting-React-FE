import { Party } from "../../classes/Party"
import ReactTooltip from 'react-tooltip';
import { Election } from "../../classes/Election";
import { deleteParty } from "../../services/party";

interface PartyListProps {
    parties: Party[],
    elections: Election[],
    refreshOnPartiesChange: any
}

const PartyList = ({ parties, elections, refreshOnPartiesChange }: PartyListProps) => {
    const deletePossibility = (id: number): boolean => {
        const today = new Date(new Date().toDateString());
        today.setHours(23,59,59,999);
        let removable: boolean = true;
        elections.filter((value) => value.parties.indexOf(id) > -1).forEach((value) => {
            if(new Date(value.startDate) < today){
                removable =  false;
            }
        });
        return removable;
    }

    const deleteSelectedParty = async (id: number) => {
        await deleteParty(id);
        refreshOnPartiesChange();
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
                        <td className="partyLogo"><img className="rounded" src={party.base64logo} alt={party.name} height="100" width="60" /></td>
                        <td>{party.name.charAt(0).toUpperCase() + party.name.slice(1)}</td>
                        <td>{party.candidate.charAt(0).toUpperCase() + party.candidate.slice(1)}</td>
                        <td>
                            { !deletePossibility(party.id) &&
                            <>
                                <ReactTooltip place="bottom" type="dark" effect="solid"/>
                                <span className="d-inline-block" tabIndex={0} data-tip="This party is present in an old votation or in one that is currently open">
                                    <button type="button" disabled={!deletePossibility(party.id)} className="btn btn-danger btn-sm px-4 me-md-2">Delete</button>
                                </span>
                            </>
                            }
                            { deletePossibility(party.id) &&
                            <button type="button" className="btn btn-danger btn-sm px-4 me-md-2" onClick={() => deleteSelectedParty(party.id)}>Delete</button>
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