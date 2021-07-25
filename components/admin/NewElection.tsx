import { useState } from "react";
import {
    Button,
    Accordion,
    Card,
    Form,
    Row,
    Col,
    InputGroup,
    FormControl,
    FormGroup,
    FormLabel,
    Alert
  } from "react-bootstrap";
  import DatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";
import { Election } from "../../classes/Election";
import { Party } from "../../classes/Party";
import { newElection } from "../../services/election";
import moment from "moment";

interface NewElectionProps {
  parties: Party[],
  refreshOnElectionsChange: any
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

  const handlePartyClick = (id: number) => {

  }

  const createNewElection = async (event: any) => {
    event.preventDefault();

    const name: string = event.target.name.value;
    const type: string = event.target.type.value;

    const valid: boolean = formValidation(name, dpStartDate, dpEndDate);

    if(valid){

      const election: Election = new Election(0, name, type, moment(dpStartDate).format('YYYY-MM-DD'), moment(dpEndDate).format('YYYY-MM-DD'), [], undefined);

      const result: boolean = await newElection(election);
      refreshOnElectionsChange();
      setProductInserted(result);
    }
  }
  
  const [dpStartDate, setDpStartDate] = useState(new Date());
  const [dpEndDate, setDpEndDate] = useState(new Date());
  const [errors, setErrors] = useState(new Map<string,string>());
  const [show, setShow] = useState(true);
  const [productInserted, setProductInserted] = useState(false);

  return (
    <>
      <Accordion>
        <Card>
          <Card.Header style={{ backgroundColor: "white" }}>
            <div className="d-flex justify-content-center">
              <Accordion.Toggle as={Button} variant="secondary" eventKey="1">
                Add new product
              </Accordion.Toggle>
            </div>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Form onSubmit={createNewElection}>
                <FormGroup as={Row}>
                  <FormLabel column sm="2" htmlFor="name">
                    Name
                  </FormLabel>
                  <Col sm="10">
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
                  <FormLabel column sm="2" htmlFor="type">
                    Type
                  </FormLabel>
                  <Col sm="10">
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
                  <FormLabel column sm="2" htmlFor="dpStartDate">
                    Start Date
                  </FormLabel>
                  <Col sm="10">
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
                  <FormLabel column sm="2" htmlFor="dpEndDate">
                    End Date
                  </FormLabel>
                  <Col sm="10">
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
                  <FormLabel column sm="2" htmlFor="parties">
                    Political Parties
                  </FormLabel>
                  <Col sm="10">
                    
                      {
                        parties.map((party: Party) => 
                          <div className="form-control">
                            <input className="mx-2" type="checkbox" name={party.name} value={party.id} onClick={() => handlePartyClick(party.id)} />
                            <label className="checkbox-inline mx-1" htmlFor={party.name.toString()}>{party.name} - {party.candidate}</label>
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
                    Product created successfully!
                  </Alert.Heading>
                </Alert>
              }
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
};

export default NewElection;