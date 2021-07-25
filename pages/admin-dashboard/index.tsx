import { GetServerSideProps, GetStaticPropsResult, NextApiRequest } from 'next';
import NewElection from '../../components/admin/NewElection';
import Layout from '../../components/Layout'
import { getParties } from '../../services/party.service';
import { Party } from '../../classes/Party';
import ElectionList from '../../components/admin/ElectionList';
import { getElections } from '../../services/election';
import { Election } from '../../classes/Election';
import PartyList from '../../components/admin/PartyList';

interface AdminDashboardProps {
  parties: Party[],
  elections: Election[]
}

const AdminDashboard = ({ parties, elections } : AdminDashboardProps) => {
    return (
        <Layout title="Admin Dashboard">
            <div className="mid">
                <div className="containerDashboard col-xxl-8 py-3">
                    <div>
                        <h1 className="text-center mb-4">Admin Dashboard</h1>
                        <h3 className="text-center my-4">Elections</h3>
                        <NewElection parties={parties} />
                        <ElectionList elections={elections} />
                        <h3 className="text-center my-4">Political Parties</h3>
                        <PartyList parties={parties} />
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
      parties: await getParties(),
      elections: await getElections()
    }
  };
};
  
  export default AdminDashboard;