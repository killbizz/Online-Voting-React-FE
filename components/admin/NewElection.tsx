import { useState } from "react";
import { Button, Accordion, Card, Form, Row, Col, InputGroup, FormControl, FormGroup, FormLabel, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Election } from "../../classes/Election";
import { Party } from "../../classes/Party";
import { newElection } from "../../services/election";
import moment from "moment";

interface NewElectionProps {
  parties: Party[],
  refreshOnElectionsChange: any,
}

const NewElection = ({ parties, refreshOnElectionsChange }: NewElectionProps) => {

  const formValidation = (name: string, startDate: Date, endDate: Date): boolean => {
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

  const unCheck = () => {
    let x: HTMLCollectionOf<HTMLInputElement> = document.getElementsByClassName("checkbox") as HTMLCollectionOf<HTMLInputElement>;
    for(var i=0; i<x.length; i++) {
      x[i].checked = false;
    }   
  }

  const handlePartyClick = (id: number) => {
    const idx: number = partiesInNewElection.indexOf(id);
    if(idx > -1){
      partiesInNewElection.splice(idx, 1);
    } else {
      partiesInNewElection.push(id);
    }
  }

  const createNewElection = async (event: any) => {
    event.preventDefault();

    const name: string = event.target.name.value;
    const type: string = event.target.type.value;

    const valid: boolean = formValidation(name, dpStartDate, dpEndDate);

    if(valid){
      const election: Election = new Election(0, name, type, moment(dpStartDate).format('YYYY-MM-DD'), moment(dpEndDate).format('YYYY-MM-DD'), Object.assign([], partiesInNewElection) , undefined);
      const result: boolean = await newElection(election);
      refreshOnElectionsChange();
      setProductInserted(result);

      // reset form
      event.target.name.value = "";
      event.target.type.value = "municipal";
      setDpStartDate(new Date());
      setDpEndDate(new Date());
      unCheck();
      partiesInNewElection.splice(0,partiesInNewElection.length)
    }
    setProductInserted(false);
  }
  
  let partiesInNewElection: number[] = [];
  const [dpStartDate, setDpStartDate] = useState(new Date());
  const [dpEndDate, setDpEndDate] = useState(new Date());
  const [errors, setErrors] = useState(new Map<string,string>());
  const [show, setShow] = useState(true);
  const [productInserted, setProductInserted] = useState(false);

  return (
    <div className="NewFormBoxing mx-auto">
      <Accordion>
        <Card>
          <Card.Header style={{ backgroundColor: "white" }}>
            <div key={"accordionContainer"} className="d-flex justify-content-center">
              <Accordion.Toggle as={Button} variant="secondary" eventKey="1">
                Add new election
              </Accordion.Toggle>
            </div>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Form onSubmit={createNewElection}>
                <FormGroup as={Row}>
                  <FormLabel column sm="3" htmlFor="name">
                    Name
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      type="text"
                      className="sm text-center mb-2"
                      id="name"
                      name="name"
                      placeholder="Name"
                    />
                    {errors.has("nameError") &&
                      <small id="nameError" className="text-danger">
                        {errors.get("nameError")}
                      </small>
                    }
                  </Col>
                </FormGroup>
                <FormGroup as={Row}>
                  <FormLabel column sm="3" htmlFor="type">
                    Type
                  </FormLabel>
                  <Col sm="9">
                    <FormControl
                      as="select"
                      className="form-control-sm form-control text-center mb-2"
                      defaultValue="municipal"
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
                  <FormLabel column sm="3" htmlFor="dpStartDate">
                    Start Date
                  </FormLabel>
                  <Col sm="9">
                    <InputGroup>
                      <DatePicker className="text-center" selected={dpStartDate} onChange={(date: Date) => setDpStartDate(date)} dateFormat='yyyy-MM-dd' />
                    </InputGroup>
                    {errors.has("startDateError") &&
                      <small id="startDateError" className="text-danger">
                        {errors.get("startDateError")}
                      </small>
                    }
                  </Col>
                </FormGroup>
                <FormGroup as={Row}>
                  <FormLabel column sm="3" htmlFor="dpEndDate">
                    End Date
                  </FormLabel>
                  <Col sm="9">
                    <InputGroup>
                      <DatePicker className="text-center" selected={dpEndDate} onChange={(date: Date) => setDpEndDate(date)} dateFormat='yyyy-MM-dd' />
                    </InputGroup>
                    {errors.has("endDateError") &&
                      <small id="endDateError" className="text-danger">
                        {errors.get("endDateError")}
                      </small>
                    }
                  </Col>
                </FormGroup>
                <FormGroup as={Row}>
                  <FormLabel column sm="3" htmlFor="parties">
                    Political Parties
                  </FormLabel>
                  <Col sm="9">
                      {
                        parties.map((party: Party) => 
                          <div key={party.id} className="row border border-secondary rounded my-1">
                            <input className="col-auto mx-2 checkbox" type="checkbox" id={party.id.toString()} value={party.id} onClick={() => handlePartyClick(party.id)} />
                            <label className="col mx-1" htmlFor={party.name.toString()}>{party.name} - {party.candidate}</label>
                          </div>)
                      }
                  </Col>
                </FormGroup>
                <Form.Row className="text-center">
                  <Col sm="12">
                    <Button className="mt-4" type="submit" variant="primary" onClick={() => setShow(true)}>
                      Submit
                    </Button>
                  </Col>
                </Form.Row>
              </Form>
              {productInserted &&
                <Alert variant="success" show={show} onClose={() => setShow(false)} dismissible>
                  <Alert.Heading className="text-center">
                    Election created successfully!
                  </Alert.Heading>
                </Alert>
              }
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default NewElection;