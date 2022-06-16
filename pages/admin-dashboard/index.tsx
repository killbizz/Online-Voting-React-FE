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
import { getVotes } from '../../services/vote';
import { Vote } from '../../classes/Vote';
import { isAdmin, isUserLoggedIn } from '../../services/auth';
import { getSession, signOut, useSession } from 'next-auth/react';
import { NextPageWithAuth } from '../../types/auth-types';

interface AdminDashboardProps {
  partiesArray: Party[],
  electionsArray: Election[],
  votesArray: Vote[]
}

const AdminDashboard: NextPageWithAuth<AdminDashboardProps> = ({ partiesArray, electionsArray, votesArray } : AdminDashboardProps) => {

  const { data: session } = useSession();

  const refreshOnElectionsChange = async () => {
    const freshElections = await getElections(session?.accessToken);
    setElections(freshElections);
  };

  const refreshOnPartiesChange = async () => {
    const freshParties = await getParties(session?.accessToken);
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
                    <ElectionList elections={elections} parties={parties} votes={votesArray} 
                      refreshOnElectionsChange={refreshOnElectionsChange} />
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
  const session = await getSession({ req });

  if(!(isUserLoggedIn(session) && isAdmin(session))) {
    signOut({ callbackUrl: '/login', redirect: false });
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const accessToken = session?.accessToken;
  return {
    props: {
      partiesArray: await getParties(accessToken),
      electionsArray: await getElections(accessToken),
      votesArray: await getVotes(accessToken)
    }
  };
};

AdminDashboard.auth = true;

export default AdminDashboard;