import { GetServerSideProps, GetStaticPropsResult, NextApiRequest } from 'next';
import NewElection from '../../components/admin/NewElection';
import Layout from '../../components/Layout'
import { AuthService } from '../../services/auth.service';
import { PartyService } from '../../services/party.service';
import { Party } from '../../classes/Party';

interface AdminDashboardProps {
  parties: Party[]
}

const AdminDashboard = ({ parties } : AdminDashboardProps) => {
    return (
        <Layout title="Admin Dashboard">
            <div className="mid">
                <div className="container col-xxl-8 px-2 py-3">
                    <div>
                        <h1 className="text-center mb-4">Admin Dashboard</h1>
                        <h3 className="text-center my-4">Elections</h3>
                        <NewElection />
                        <h3 className="text-center my-4">Political Parties</h3>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps<AdminDashboardProps> = async ({ req }): Promise<GetStaticPropsResult<AdminDashboardProps>> => {
  const partyService: PartyService = PartyService.getInstance();
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
      parties: await partyService.getParties()
    }
  };
};
  
  export default AdminDashboard;