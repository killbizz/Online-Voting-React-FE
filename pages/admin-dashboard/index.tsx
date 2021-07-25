import { GetServerSideProps, GetStaticPropsResult } from 'next';
import NewElection from '../../components/admin/NewElection';
import Layout from '../../components/Layout'
import { getParties } from '../../services/party';
import { Party } from '../../classes/Party';
import ElectionList from '../../components/admin/ElectionList';
import { getElections } from '../../services/election';
import { Election } from '../../classes/Election';
import PartyList from '../../components/admin/PartyList';
import NewParty from '../../components/admin/NewParty';
import { useState } from 'react';

interface AdminDashboardProps {
  partiesArray: Party[],
  electionsArray: Election[]
}

const AdminDashboard = ({ partiesArray, electionsArray } : AdminDashboardProps) => {

  const refreshOnElectionsChange = async () => {
    const freshElections = await getElections();
    setElections(freshElections);
  };

  const refreshOnPartiesChange = async () => {
    const freshParties = await getParties();
    setParties(freshParties);
  };

  const [parties, setParties] = useState(partiesArray);
  const [elections, setElections] = useState(electionsArray);

  return (
    <Layout title="Admin Dashboard">
        <div className="mid">
            <div className="containerDashboard col-xxl-8 py-3">
                <div>
                    <h1 className="text-center mb-4">Admin Dashboard</h1>
                    <h3 className="text-center my-4">Elections</h3>
                    <NewElection parties={parties} refreshOnElectionsChange={refreshOnElectionsChange} />
                    <ElectionList elections={elections} parties={parties} refreshOnElectionsChange={refreshOnElectionsChange} />
                    <h3 className="text-center my-4">Political Parties</h3>
                    <NewParty refreshOnPartiesChange={refreshOnPartiesChange} />
                    <PartyList parties={parties} elections={elections} refreshOnPartiesChange={refreshOnPartiesChange} />
                </div>
            </div>
        </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<AdminDashboardProps> = async ({ req }): Promise<GetStaticPropsResult<AdminDashboardProps>> => {
  // session handling using cookies
  if(!(req.cookies.jwtToken !== undefined && req.cookies.userRole === "admin")) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      partiesArray: await getParties(),
      electionsArray: await getElections()
    }
  };
};
  
  export default AdminDashboard;