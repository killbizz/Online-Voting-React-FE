import { useState } from "react";
import {
    Button,
    Accordion,
    Card,
    Form,
    Row,
    Col,
    FormControl,
    FormGroup,
    FormLabel,
    Alert
  } from "react-bootstrap";
import { Party } from "../../classes/Party";
import { fileToBase64, newParty } from "../../services/party";

interface NewPartyProps {
    refreshOnPartiesChange: any
}

const NewParty = ({ refreshOnPartiesChange }: NewPartyProps) => {

    const createNewParty = async (event: any) => {
        event.preventDefault();

        const name: string = event.target.name.value;
        const candidate: string = event.target.candidate.value;
        const logoFile: any = event.target.logo;

        const valid: boolean = formValidation(name, candidate, logoFile);

        if(valid){
            const base64logo = await fileToBase64(logoFile.files[0]);

            const party: Party = new Party(0, name, candidate, base64logo);
            const result: boolean = await newParty(party);
            refreshOnPartiesChange();
            setPartyCreated(result);

            // reset form
            event.target.name.value = "";
            event.target.candidate.value = "";
            event.target.logo.value = null;
        } else {
            setPartyCreated(false);
        }
    }

    const formValidation = (name: string, candidate: string, logo: any): boolean => {
        let isValid: boolean = true;
        let sizeFile: any;
        // max 50Kb files
        const maxSize: number = 50000;
        if(logo.files.length > 0){
            const [{ size }] = logo.files;
            sizeFile = size;
        }
        const rejectEmojiRegexp = /[\ud800-\udbff][\udc00-\udfff]|[^\0-\x7f]/;

        if (name === "") {
          updateErrors("nameError", "The Name field is required");
          isValid = false;
        }
        else if (name.length < 6) {
          updateErrors("nameError", "The Name field must contain at least 6 characters");
          isValid = false;
        }
        else if (name.match(rejectEmojiRegexp)) {
            updateErrors("nameError", "This field cannot contain emojis");
            isValid = false;
        }
        else {
          updateErrors("nameError", "");
        }
        if (candidate === "") {
            updateErrors("candidateError", "The Candidate field is required");
            isValid = false;
        }
        else if (candidate.length < 6) {
        updateErrors("candidateError", "The Candidate field must contain at least 6 characters");
        isValid = false;
        }
        else if (candidate.match(rejectEmojiRegexp)) {
            updateErrors("candidateError", "This field cannot contain emojis");
            isValid = false;
        }
        else {
        updateErrors("candidateError", "");
        }
        if (logo.files[0] === undefined) {
            updateErrors("logoError", "The Party Logo is required");
            isValid = false;
        }
        else if (sizeFile > maxSize) {
            updateErrors("logoError", "The max allowed size of a file is 50KB");
            isValid = false;
            }
        else {
        updateErrors("logoError", "");
        }
        return isValid;
    }
    
      // passing a clone o errors map to setErrors in order to trigger the state update
      const updateErrors = (key: string, value: string) => {
        setErrors(new Map<string,string>(errors.set(key,value)));
    }

    const [errors, setErrors] = useState(new Map<string,string>());
    const [show, setShow] = useState(true);
    const [partyCreated, setPartyCreated] = useState(false);

    return (
        <div className="NewFormBoxing mx-auto">
        <Accordion>
            <Card>
            <Card.Header style={{ backgroundColor: "white" }}>
                <div className="d-flex justify-content-center">
                <Accordion.Toggle as={Button} variant="secondary" eventKey="1">
                    Add new party
                </Accordion.Toggle>
                </div>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
                <Card.Body>
                <Form onSubmit={createNewParty}>
                    <FormGroup as={Row}>
                    <FormLabel column sm="4" htmlFor="name">
                        Party Name
                    </FormLabel>
                    <Col sm="8">
                        <FormControl
                        type="text"
                        className="sm text-center"
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
                    <FormLabel column sm="4" htmlFor="type">
                        Candidate
                    </FormLabel>
                    <Col sm="8">
                        <FormControl
                            type="text"
                            className="sm text-center"
                            id="candidate"
                            name="candidate"
                            placeholder="Candidate"
                            />
                        {errors.has("candidateError") &&
                        <small id="candidateErrors" className="text-danger">
                            {errors.get("candidateError")}
                        </small>
                        }
                    </Col>
                    </FormGroup>
                    <FormGroup as={Row}>
                    <FormLabel column className="mt-4" sm="4" htmlFor="type">
                        Party Logo
                    </FormLabel>
                    <Col sm="8">
                        <FormControl
                            type="file"
                            className="sm text-center mt-4"
                            id="logo"
                            name="logo"
                            />
                        {errors.has("logoError") &&
                        <small id="logoErrors" className="text-danger">
                            {errors.get("logoError")}
                        </small>
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
                {partyCreated &&
                    <Alert variant="success" show={show} onClose={() => setShow(false)} dismissible>
                    <Alert.Heading className="text-center">
                        Party created successfully!
                    </Alert.Heading>
                    </Alert>
                }
                </Card.Body>
            </Accordion.Collapse>
            </Card>
        </Accordion>
    </div>
    );
}

export default NewParty;