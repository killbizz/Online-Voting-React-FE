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
import { isUserAdmin, isUserLoggedIn } from '../../services/auth';
import { getSession, signOut } from 'next-auth/react';
import { NextPageWithAuth } from '../../types/auth-types';

interface UserDashboardProps {
    elections: Election[],
    parties: Party[],
    votesOfTheUser: Vote[],
    userId: string | null
}

const UserDashboard: NextPageWithAuth<UserDashboardProps> = ({parties,  elections, votesOfTheUser, userId}: UserDashboardProps ) => {

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
  const session = await getSession({ req });

  if(!(isUserLoggedIn(session) && !isUserAdmin(session))) {
    signOut({ callbackUrl: '/login', redirect: false });
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const accessToken = session?.accessToken;
  const id = session?.user.id;
  const votesOfTheUser = await getVotesByUserId(id!, accessToken);
  const elections = await getElections(accessToken);
  const parties = await getParties(accessToken);
  return {
    props: {
      elections: elections,
      parties: parties,
      votesOfTheUser: votesOfTheUser,
      userId: id === undefined ? null : id
    }
  };
};

UserDashboard.auth = true;

export default UserDashboard;