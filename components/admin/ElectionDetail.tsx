import { Election } from "../../classes/Election";
import { Modal, Form, FormGroup, FormLabel, Col, Row, FormControl, InputGroup, Alert } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import ReactTooltip from 'react-tooltip';
import moment from "moment";
import { useState } from "react";
import { deleteElection, updateElection } from "../../services/election";
import { Party } from "../../classes/Party";
import { useSession } from "next-auth/react";

interface ElectionDetailProps {
    election: Election,
    parties: Party[],
    refreshOnElectionsChange: any
}

const ElectionDetail = ({ election, parties, refreshOnElectionsChange }: ElectionDetailProps) => {

    const {data : session}  = useSession();

    const updateElectionHandler = async (event: any) => {
        event.preventDefault();
    
        let name: string = event.target.name.value;
        let type: string = event.target.type.value;
        let startDate: string = event.target.dpStartDate.value;
        let endDate: string = event.target.dpEndDate.value;
    
        const valid: boolean = formValidation(name, type, dpStartDate, dpEndDate, partiesInModifiedElection);
    
        if(valid){
            name = name === "" ? election.name : name;
            type = type === "" ? election.type : type;
            startDate = startDate === "" ? election.startDate : startDate;
            endDate = endDate === "" ? election.endDate : endDate;
            partiesInModifiedElection = partiesInModifiedElection.length === 0 ? election.parties : partiesInModifiedElection;
            const updatedElection: Election = new Election(election.id, name, type, moment(dpStartDate).format('YYYY-MM-DD'), 
              moment(dpEndDate).format('YYYY-MM-DD'), partiesInModifiedElection, election.votes);
    
            await updateElection(election.id, updatedElection, session?.accessToken);
            refreshOnElectionsChange();
            handleClose();
        }
    }

    const formValidation = (name: string, type: string, startDate: Date, endDate: Date, parties: number[]): boolean => {
        // Check if there is at least one valid input
        if(name === election.name && type === election.type && moment(startDate).format('YYYY-MM-DD') === election.startDate && 
          moment(endDate).format('YYYY-MM-DD') === election.endDate && arraysEqual(partiesInModifiedElection, election.parties)){
            setShowAlert(true);
            return false;
        }
        // Check if the inputs are valid
        let isValid: boolean = true;
        if (name === "") {
            updateErrors("nameError", "The Name field is required");
            isValid = false;
        }
        else if (name.length < 6) {
            updateErrors("nameError", "The Name field must contain at least 6 characters");
            isValid = false;
        }
        else {
            updateErrors("nameError", "");
        }
        // method in order to keep only the date part, not the time part
        const today = new Date(new Date().toDateString());
        if (new Date(startDate) < today) {
            updateErrors("startDateError", "The Start Date cannot precede today's date");
            isValid = false;
        }
        else {
            updateErrors("startDateError", "");
        }
        if (new Date(endDate) < today) {
            updateErrors("endDateError", "The End Date cannot precede today's date");
            isValid = false;
        }
        else if (new Date(endDate) < new Date(startDate)) {
            updateErrors("endDateError", "The End Date cannot precede the Start Date");
            isValid = false;
        }
        else {
            updateErrors("endDateError", "");
        }
        return isValid;
    }

    // passing a clone o errors map to setErrors in order to trigger the state update
    const updateErrors = (key: string, value: string) => {
        setErrors(new Map<string,string>(errors.set(key,value)));
    }

    const handlePartyClick = (id: number) => {
        const idx: number = partiesInModifiedElection.indexOf(id);
        if(idx > -1){
            partiesInModifiedElection.splice(idx, 1);
        } else {
            partiesInModifiedElection.push(id);
        }
    }

    const arraysEqual = (a: number[], b: number []) => {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
      
        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        // Please note that calling sort on an array will modify that array.
        // you might want to clone your array first.
      
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
    }

    const enableUpdateElection = () => {
        setUserWantsToUpdate(true);
    }
    
    const disableUpdateElection = () => {
        setUserWantsToUpdate(false);
        setShow(false);
    }

    const updateOrDeletePossibility = () => {
        const today: Date = new Date();
        return new Date(election.startDate) > today;
    }

    const deleteElectionHandler = async () => {
        const result: boolean = await deleteElection(election.id, session?.accessToken);
        if(result){
            refreshOnElectionsChange();
            handleClose();
        }
    }

    let partiesInModifiedElection: number[] = Array.from(election.parties);
    const [userWantsToUpdate, setUserWantsToUpdate] = useState(false);
    const [dpStartDate, setDpStartDate] = useState(new Date(election.startDate));
    const [dpEndDate, setDpEndDate] = useState(new Date(election.endDate));
    const [errors, setErrors] = useState(new Map<string,string>());
    const [show, setShow] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const handleClose = () => {
        setShow(false);
        setUserWantsToUpdate(false);
    }
    const handleShow = () => setShow(true);

    return (
        <>
            <button className="btn btn-sm btn-warning my-1 mr-2" onClick={handleShow}>Edit</button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Election Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={updateElectionHandler}>
                <FormGroup as={Row}>
                  <FormLabel column sm="2" htmlFor="name">
                    Name
                  </FormLabel>
                  <Col sm="10">
                    <FormControl
                      type="text"
                      readOnly={userWantsToUpdate ? undefined : true}
                      className="form-control-sm form-control text-center mb-2"
                      id="name"
                      name="name"
                      value={election.name}
                    />
                    {errors.has("nameError") &&
                      <small id="nameError" className="text-danger">
                        {errors.get("nameError")}
                      </small>
                    }
                  </Col>
                </FormGroup>
                <FormGroup as={Row}>
                  <FormLabel column sm="2" htmlFor="type">
                    Type
                  </FormLabel>
                  <Col sm="10">
                    <FormControl
                      as="select"
                      className="form-control-sm form-control text-center mb-2"
                      defaultValue={election.type}
                      disabled={userWantsToUpdate ? undefined : true}
                      id="type"
                      name="type"
                    >
                      <option>municipal</option>
                      <option>regional</option>
                    </FormControl>
                    {errors.has("typeError") &&
                      <small id="typeErrors" className="text-danger">
                        {errors.get("typeError")}
                      </small>
                    }
                  </Col>
                </FormGroup>
                <FormGroup as={Row}>
                  <FormLabel column sm="2" htmlFor="dpStartDate">
                    Start Date
                  </FormLabel>
                  <Col sm="10">
                    <InputGroup>
                      <DatePicker name="dpStartDate" disabled={userWantsToUpdate ? undefined : true} className="text-center" 
                      selected={dpStartDate} onChange={(date: Date) => setDpStartDate(date)} dateFormat='yyyy-MM-dd' />
                    </InputGroup>
                    {errors.has("startDateError") &&
                      <small id="startDateError" className="text-danger">
                        {errors.get("startDateError")}
                      </small>
                    }
                  </Col>
                </FormGroup>
                <FormGroup as={Row}>
                  <FormLabel column sm="2" htmlFor="dpEndDate">
                    End Date
                  </FormLabel>
                  <Col sm="10">
                    <InputGroup>
                      <DatePicker name="dpEndDate" disabled={userWantsToUpdate ? undefined : true} className="text-center" 
                      selected={dpEndDate} onChange={(date: Date) => setDpEndDate(date)} dateFormat='yyyy-MM-dd' />
                    </InputGroup>
                    {errors.has("endDateError") &&
                      <small id="endDateError" className="text-danger">
                        {errors.get("endDateError")}
                      </small>
                    }
                  </Col>
                </FormGroup>
                <FormGroup as={Row}>
                  <FormLabel column sm="2" htmlFor="parties">
                    Political Parties
                  </FormLabel>
                  <Col sm="10">
                    
                      {
                        parties.map((party: Party) => 
                          <div key={party.id} className="form-control">
                            <input className="mx-2" type="checkbox" disabled={userWantsToUpdate ? undefined : true} defaultChecked={election.parties.indexOf(party.id) > -1 ? true : undefined} name={party.name} value={party.id} onClick={() => handlePartyClick(party.id)} />
                            <label className="checkbox-inline mx-1" htmlFor={party.name.toString()}>{party.name} - {party.candidate}</label>
                          </div>)
                      }
                  </Col>
                </FormGroup>
                <Form.Row className="text-center">
                  <Col sm="12">
                    { userWantsToUpdate && <button type="submit" className="btn btn-outline-primary mr-2">Submit</button>}
                    { userWantsToUpdate && <button type="button" className="btn btn-outline-danger" onClick={disableUpdateElection}>Cancel</button>}
                  </Col>
                </Form.Row>
                </Form>
                <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                    <Alert.Heading className="text-center">
                        At least one field must be modified!
                    </Alert.Heading>
                </Alert>
                </Modal.Body>
                <Modal.Footer>
                { !updateOrDeletePossibility() && 
                <>
                    <ReactTooltip effect="solid" />
                    <span className="d-inline-block" tabIndex={0} data-tip="This election has already ended or is in progress right now">
                        <button type="button" disabled={updateOrDeletePossibility() ? undefined : true} className="btn btn-warning btn-sm px-4 me-md-2" onClick={enableUpdateElection}>Edit</button>
                    </span>
                </>
                }
                { !userWantsToUpdate && updateOrDeletePossibility() && 
                <button type="button" className="btn btn-warning btn-sm px-4 me-md-2" onClick={enableUpdateElection}>Edit</button>
                }
                {
                !updateOrDeletePossibility() && 
                <>
                    <ReactTooltip effect="solid" />
                    <span className="d-inline-block" tabIndex={0} data-tip="This election has already ended or is in progress right now">
                        <button type="button" disabled={updateOrDeletePossibility() ? undefined : true} className="btn btn-danger btn-sm px-4 me-md-2" >Delete</button>
                    </span>
                </>
                }
                { !userWantsToUpdate && updateOrDeletePossibility() &&
                <button type="button" className="btn btn-danger btn-sm px-4 me-md-2" onClick={() => { handleClose(); deleteElectionHandler(); }}>Delete</button>
                }
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ElectionDetail;