import { Party } from "../../classes/Party"
import ReactTooltip from 'react-tooltip';
import { Election } from "../../classes/Election";
import { deleteParty } from "../../services/party";
import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

interface PartyListProps {
    parties: Party[],
    elections: Election[],
    refreshOnPartiesChange: any,
    session: Session | null
}

const PartyList = ({ parties, elections, refreshOnPartiesChange, session }: PartyListProps) => {

    const deletePossibility = (id: number): boolean => {
        const today = new Date(new Date().toDateString());
        today.setHours(23,59,59,999);
        let removable: boolean = true;
        // elections.filter((value) => value.parties.indexOf(id) > -1).forEach((value) => {
        //     if(new Date(value.startDate) < today){
        //         removable =  false;
        //     }
        // });
        elections.forEach((value) => {
            if(value.parties.indexOf(id) > -1)
                removable = false;
        });
        return removable;
    }

    const deleteSelectedParty = async (id: number) => {
        await deleteParty(id, session?.accessToken);
        refreshOnPartiesChange();
    }

    // Need this for the react-tooltip
    const [isMounted,setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[]);

    return(
        <Table className="table mb-4">
            <Thead className="thead-light">
            <Tr key={"partyListHeader"}>
                <Th scope="col">ID</Th>
                <Th scope="col">Name</Th>
                <Th scope="col">Candidate</Th>
                <Th scope="col">Logo</Th>
                <Th scope="col">Action</Th>
            </Tr>
            </Thead>
            <Tbody>
                { parties.map((party) => {
                    return (
                        <Tr key={party.id}>
                            <Th scope="row">{party.id}</Th>
                            <Td>{party.name.charAt(0).toUpperCase() + party.name.slice(1)}</Td>
                            <Td>{party.candidate.charAt(0).toUpperCase() + party.candidate.slice(1)}</Td>
                            <Td><img className="rounded partyLogo" src={party.base64logo} alt={party.name} height="100" width="60" /></Td>
                            <Td>
                                { !deletePossibility(party.id) &&
                                <>
                                    {isMounted &&
                                        <ReactTooltip place="bottom" type="dark" effect="solid"/>
                                    }
                                    <span className="d-inline-block" tabIndex={0} data-tip="This party is present in al least one votation">
                                        <button type="button" disabled={!deletePossibility(party.id)} className="btn btn-danger btn-sm px-4 me-md-2">Delete</button>
                                    </span>
                                </>
                                }
                                { deletePossibility(party.id) &&
                                <button type="button" className="btn btn-danger btn-sm px-4 me-md-2" onClick={() => deleteSelectedParty(party.id)}>Delete</button>
                                }
                            </Td>
                        </Tr>
                    )
                }
                )} 
            </Tbody>
        </Table>
    );
}

export default PartyList;