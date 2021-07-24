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
import { ElectionService } from "../../services/election.service";
import moment from "moment";

const NewElection = () => {

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

      const electionService: ElectionService = ElectionService.getInstance();
      const result: boolean = await electionService.newElection(election);
      setProductInserted(result);
    }
  }
  
  const [dpStartDate, setDpStartDate] = useState(new Date());
  const [dpEndDate, setDpEndDate] = useState(new Date());
  const [errors, setErrors] = useState(new Map<string,string>());
  const [show, setShow] = useState(true);
  const [productInserted, setProductInserted] = useState(false);
  let parties: Party[] = [];

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
                <FormLabel column sm="4" htmlFor="name">
                  Name
                </FormLabel>
                <Col sm="8">
                  <FormControl
                    type="text"
                    className="sm text-center"
                    id="name"
                    name="name"
                    placeholder="Name"
                  />
                  {errors.has("nameError") ? (
                    <small id="nameError" className="text-danger">
                      {errors.get("nameError")}
                    </small>
                  ) : (
                    <p />
                  )}
                </Col>
              </FormGroup>
              <FormGroup as={Row}>
                <FormLabel column sm="4" htmlFor="type">
                  Type
                </FormLabel>
                <Col sm="8">
                  <FormControl
                    as="select"
                    className="form-control-sm form-control text-center"
                    defaultValue="municipal"
                    id="type"
                    name="type"
                  >
                    <option>municipal</option>
                    <option>regional</option>
                  </FormControl>
                  {errors.has("productCategoryError") ? (
                    <small id="productCategoryErrors" className="text-danger">
                      {errors.get("productCategoryError")}
                    </small>
                  ) : (
                    <p />
                  )}
                </Col>
              </FormGroup>
              <FormGroup as={Row}>
                <FormLabel column sm="4" htmlFor="dpStartDate">
                  Start Date
                </FormLabel>
                <Col sm="8">
                  <InputGroup>
                    <DatePicker className="text-center dp" selected={dpStartDate} onChange={(date: Date) => setDpStartDate(date)} dateFormat='yyyy-MM-dd' />
                  </InputGroup>
                  {errors.has("startDateError") ? (
                    <small id="startDateError" className="text-danger">
                      {errors.get("startDateError")}
                    </small>
                  ) : (
                    <p />
                  )}
                </Col>
              </FormGroup>
              <FormGroup as={Row}>
                <FormLabel column sm="4" htmlFor="dpEndDate">
                  Start Date
                </FormLabel>
                <Col sm="8">
                  <InputGroup>
                    <DatePicker className="text-center dp" selected={dpEndDate} onChange={(date: Date) => setDpEndDate(date)} dateFormat='yyyy-MM-dd' />
                  </InputGroup>
                  {errors.has("endDateError") ? (
                    <small id="endDateError" className="text-danger">
                      {errors.get("endDateError")}
                    </small>
                  ) : (
                    <p />
                  )}
                </Col>
              </FormGroup>
              <FormGroup as={Row}>
                <FormLabel column sm="4" htmlFor="parties">
                  Political Parties
                </FormLabel>
                <Col sm="8">
                  <div className="form-control">
                    <label className="checkbox-inline">
                        {
                          parties.map((party: Party) => <input type="checkbox" name={party.name} value={party.id} onClick={() => handlePartyClick(party.id)}>{party.name}</input>)
                        }
                    </label>
                  </div>
                </Col>
              </FormGroup>
              <Form.Row className="text-center">
                <Col sm="12">
                  <Button type="submit" variant="primary" onClick={() => setShow(true)}>
                    Submit
                  </Button>
                </Col>
              </Form.Row>
            </Form>
            {productInserted ? (
              <Alert variant="success" show={show} onClose={() => setShow(false)} dismissible>
                <Alert.Heading className="text-center">
                  Product created successfully!
                </Alert.Heading>
              </Alert>
            ) : (
              <p />
            )}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  </>
  );
};

export default NewElection;