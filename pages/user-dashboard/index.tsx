import { GetServerSideProps, GetStaticPropsResult } from 'next';
import { Election } from '../../classes/Election';
import { Party } from '../../classes/Party';
import ElectionList from '../../components/user/ElectionList';
import Layout from '../../components/Layout'
import { getElections } from '../../services/election';
import { getParties } from '../../services/party';
import { useState } from 'react';
import { Vote } from '../../classes/Vote';
import { getVotesByUserId } from '../../services/vote';
import { getUserId } from '../../services/auth';

interface UserDashboardProps {
    parties: Party[],
    electionsArray: Election[],
    votesOfTheUser: Vote[],
    userId: string | null
}

const UserDashboard = ({parties,  electionsArray, votesOfTheUser, userId}: UserDashboardProps ) => {

    const refreshOnElectionsChange = async () => {
        const freshElections = await getElections();
        setElections(freshElections);
    };

    const [elections, setElections] = useState(electionsArray);
    const [userVotes, setUserVotes] = useState(votesOfTheUser);

    return (
        <Layout title="e-Voting User Dashboard">
          <div className="mid">
            <div className="containerDashboard col-xxl-8 py-3">
                <div>
                    <h1 className="text-center mb-4">User Dashboard</h1>
                    <h3 className="text-center my-4">Elections</h3>
                    <ElectionList elections={elections} userVotes={userVotes} userId={userId} />
                    <h3 className="text-center my-4">Voting History</h3>
                    
                    
                </div>
            </div>
        </div>
        </Layout>
      );
}

export const getServerSideProps: GetServerSideProps<UserDashboardProps> = async ({ req }): Promise<GetStaticPropsResult<UserDashboardProps>> => {
    // session handling using cookies
    if(!(req.cookies.jwtToken !== undefined && req.cookies.userRole !== "admin")) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    const id: string | undefined = req.cookies.userId;
    return {
      props: {
        parties: await getParties(),
        electionsArray: await getElections(),
        votesOfTheUser: await getVotesByUserId(id!),
        userId: id === undefined ? null : id
      }
    };
};

export default UserDashboard;