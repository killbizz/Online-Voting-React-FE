import { GetServerSideProps, GetStaticPropsResult } from 'next';
import { useState } from 'react';
import { Election } from '../../classes/Election';
import { Party } from '../../classes/Party';
import Layout from '../../components/Layout';
import { getElection } from '../../services/election';
import { getPartiesById } from '../../services/party';
import { newVote } from '../../services/vote';
import Router from 'next/router';
import { Vote } from '../../classes/Vote';
import moment from 'moment';
import { Accordion, Card, Button, Modal } from 'react-bootstrap';
import { isUserAdmin, isUserLoggedIn } from '../../services/auth';
import { getSession, signOut } from 'next-auth/react';
import { Session } from 'next-auth';

interface ElectionPageProps {
    parties: Party[],
    election: Election,
    userId: string | null,
    session: Session | null
}

const ElectionPage = ({ parties, election, userId, session }: ElectionPageProps) => {

  const selectParty = (id: number, event:any) => {
    event.preventDefault();
    setSelectedParty(parties.find((value) => value.id === id));
    setActive(true);
  }

  const confirmVote = async () => {
    const today: Date = new Date();
    let date: string = moment(today).format('YYYY-MM-DD');

    const vote: Vote = new Vote(0, userId!, selectedParty!.id, election.id, date);
    
    await newVote(vote, session?.accessToken);
    Router.push('/user-dashboard');
  }

  const [selectedParty, setSelectedParty] = useState<Party | undefined>(undefined);
  const [active, setActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return(
      <Layout title="e-Voting User Dashboard">
          <div className="mid">
            <h1 className="text-center my-4">{election.name}</h1>

            <Accordion>
              <Card>
                <Card.Header style={{ backgroundColor: "white" }}>
                  <div className="d-flex justify-content-center">
                    <Accordion.Toggle as={Button} variant="outline-secondary" eventKey="1">
                      Rules
                    </Accordion.Toggle>
                  </div>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <ul>
                        <li>Only <strong>one</strong> political party can be voted on;</li>
                        <li>
                            To <strong>vote</strong>, click on the preferred political party. You can do the same operation again on a different card to <strong>replace the vote</strong> by indicating another political party;
                        </li>
                        <li>
                            Once you have selected your favorite political party, click on the <strong>End Voting</strong> button. At this point, a window will open in which you can confirm your vote or go back to change your choice. This button will remain disabled until a choice is made; 
                        </li>
                        <li>
                            Once you have clicked the End Voting button, the operation will end and you will no longer be able to go back to change your choice.
                        </li>
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>

            <h3 className="text-center my-4">Political Parties</h3>
            <div id="cards_landscape_wrap-2">
                <div className="container">
                    <div className="row">
                      {
                        parties.map((party) => 
                        <div key={party.id} className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                          <a href="" onClick={(event) => selectParty(party.id,event)}>
                              <div className="card-flyer">
                                  <div className="text-box">
                                      <div className="image-box">
                                          <img src={party.base64logo} alt="Logo" />
                                      </div>
                                      <div className={active && party.id === selectedParty?.id ? "active text-container" : "text-container" }>
                                          <h6>{party.name}</h6>
                                          <p>{party.candidate}</p>
                                      </div>
                                  </div>
                              </div>
                          </a>
                        </div>
                        )
                      }
                    </div>
                </div>
            </div>

            <button disabled={selectedParty === undefined} className="btn btn-lg btn-secondary mb-4 mx-auto text-center d-block" onClick={handleShow}>Finish Voting</button>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm your vote</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <h6>You voted for: <b>{selectedParty?.name} - {selectedParty?.candidate}</b></h6>
                  <p>Are you sure of your choice? clicking the <em>Confirm</em> button the action cannot be canceled </p>
                </Modal.Body>
                <Modal.Footer>
                  <button  type="button" className="btn btn-outline-primary btn-sm px-4 me-md-2" onClick={ () => {handleClose(); confirmVote()}}>Confirm</button>
                  <button  type="button" className="btn btn-outline-danger btn-sm px-4 me-md-2" onClick={handleClose}>Cancel</button>
                </Modal.Footer>
            </Modal>
          </div>
      </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<ElectionPageProps> = async ({params, req }): Promise<GetStaticPropsResult<ElectionPageProps>> => {
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
    const election: Election | undefined = await getElection(Number(params!.id), accessToken);
    // election doesn't exist
    if(election === undefined){
      return {
        redirect: {
          destination: "/user-dashboard",
          permanent: false,
        },
      };
    }
    let parties: Party[] = await getPartiesById(election!.parties, accessToken);
    const id: string | undefined =  session?.user.id;
    return {
      props: {
        parties: parties,
        election: election,
        userId: id === undefined ? null : id,
        session: session
      }
    };
};

export default ElectionPage;