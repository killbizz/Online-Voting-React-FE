import { GetServerSideProps, GetStaticPropsResult } from 'next';
import { Election } from '../../classes/Election';
import { Party } from '../../classes/Party';
import ElectionList from '../../components/user/ElectionList';
import Layout from '../../components/Layout'
import { getElections } from '../../services/election';
import { getParties } from '../../services/party';
import { Vote } from '../../classes/Vote';
import { getVotesByUserId } from '../../services/vote';
import VotingHistory from '../../components/user/VotingHistory';

interface UserDashboardProps {
    elections: Election[],
    parties: Party[],
    votesOfTheUser: Vote[],
    userId: string | null
}

const UserDashboard = ({parties,  elections, votesOfTheUser, userId}: UserDashboardProps ) => {

    let userRelatedElections: Election[] = [];
    let userRetaledParties: Party[] = [];

    for(const vote of votesOfTheUser){
      userRelatedElections.push(elections.find((value) => value.id === vote.electionId)!);
      userRetaledParties.push(parties.find((value) => value.id === vote.partyId)!);
    }

    return (
        <Layout title="e-Voting User Dashboard">
          <div className="mid">
            <div className="containerDashboard col-xxl-8 py-3">
                <div>
                    <h1 className="text-center mb-4">User Dashboard</h1>
                    <h3 className="text-center my-4">Elections</h3>
                    <ElectionList elections={elections} userVotes={votesOfTheUser} userId={userId} />
                    <h3 className="text-center my-4">Voting History</h3>
                    <VotingHistory userRelatedElections={userRelatedElections} userRelatedParties={userRetaledParties} userVotes={votesOfTheUser} />
                </div>
            </div>
        </div>
        </Layout>
      );
}

export const getServerSideProps: GetServerSideProps<UserDashboardProps> = async ({ req }): Promise<GetStaticPropsResult<UserDashboardProps>> => {
    // session handling using cookies
    if(!(req.cookies.userId !== undefined && req.cookies.userRole !== "admin")) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const id: string | undefined = req.cookies.userId;
    const votesOfTheUser = await getVotesByUserId(id!);
    const elections = await getElections();
    const parties = await getParties();
    return {
      props: {
        elections: elections,
        parties: parties,
        votesOfTheUser: votesOfTheUser,
        userId: id === undefined ? null : id
      }
    };
};

export default UserDashboard;