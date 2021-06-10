import React, { useState } from 'react';
import * as tables from './ged-tables';
import Modal from 'react-bootstrap/Modal';
import { ButtonGroup, Form, Row, Col, Button, InputGroup } from 'react-bootstrap';

const NameComp = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [firstNameType, setFirstNameType] = useState(null);
    const [lastNameType, setLastNameType] = useState(null);
    const [namesList, setNamesList] = useState([]);

    function getFirstName() {
        let nameStr = firstNameType.split("_");
        let table;
        switch(nameStr[0]) {
            case "grimdark":
                table = tables.GRIMDARK_FIRST_NAMES[nameStr[1]];
                break;
            case "oldtimey":
                table = tables.OLD_TIMEY_FIRST_NAMES[nameStr[1]];
                break;
            case "whimsical":
                table = tables.WHIMSICAL_FIRST_NAMES[nameStr[1]];
                break;
            default:
                table = tables.MUNDANE_FIRST_NAMES[nameStr[1]];
                break;
        }
        return table[Math.floor(Math.random() * table.length)];
    }

    function buildLastName() {
        let table;
        if (lastNameType === "grimdark") table = tables.GRIMDARK_LAST_NAMES;
        if (lastNameType === "classic") table = tables.CLASSIC_LAST_NAMES;
        if (lastNameType === "whimsical") table = tables.WHIMSICAL_LAST_NAMES;
        if (table.affixes) {
            let part1 = table.affixes[Math.floor(Math.random() * table.affixes.length)];
            part1 = part1.charAt(0).toUpperCase() + part1.slice(1);
            return part1 + table.affixes[Math.floor(Math.random() * table.affixes.length)];
        } else {
            let part1 = table.prefixes[Math.floor(Math.random() * table.prefixes.length)];
            return part1 + table.suffixes[Math.floor(Math.random() * table.suffixes.length)];
        }
    }
    
    function getNames(num) {
        let names = [];
        for (let i = 0; i < num; i++) {
            let name = getFirstName();
            if (lastNameType) name += " " + buildLastName();
            names.push(name);
        }
        setNamesList(names);
    }

    function selectName(name) {
        props.handleChange({target: {value: name}});
        setShowModal(false);
    }

    return (
        <Form>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header style={{ justifyContent: "center" }}><h2>Name Generator</h2></Modal.Header>
                <Modal.Body>
                    <Row xs={2}>
                        <Col>
                            <h3>First Name</h3>
                            <ButtonGroup>
                                <Button variant={firstNameType === "grimdark_female" ? "dark" : "outline-dark"} onClick={() => setFirstNameType("grimdark_female")}>Female Grimdark Names</Button>
                                <Button variant={firstNameType === "oldtimey_female" ? "dark" : "outline-dark"} onClick={() => setFirstNameType("oldtimey_female")}>Female Old Timey Names</Button>
                                <Button variant={firstNameType === "whimsical_female" ? "dark" : "outline-dark"} onClick={() => setFirstNameType("whimsical_female")}>Female Whimsical Names</Button>
                                <Button variant={firstNameType === "mundane_female" ? "dark" : "outline-dark"} onClick={() => setFirstNameType("mundane_female")}>Female Mundane Names</Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button variant={firstNameType === "grimdark_male" ? "dark" : "outline-dark"} onClick={() => setFirstNameType("grimdark_male")}>Male Grimdark Names</Button>
                                <Button variant={firstNameType === "oldtimey_male" ? "dark" : "outline-dark"} onClick={() => setFirstNameType("oldtimey_male")}>Male Old Timey Names</Button>
                                <Button variant={firstNameType === "whimsical_male" ? "dark" : "outline-dark"} onClick={() => setFirstNameType("whimsical_male")}>Male Whimsical Names</Button>
                                <Button variant={firstNameType === "mundane_male" ? "dark" : "outline-dark"} onClick={() => setFirstNameType("mundane_male")}>Male Mundane Names</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row xs={2}>
                        <Col>
                            <h3>Last Name</h3>
                            <ButtonGroup>
                                <Button variant={lastNameType === "grimdark" ? "dark" : "outline-dark"} onClick={() => setLastNameType("grimdark")}>Grimdark Last Names</Button>
                                <Button variant={lastNameType === "classic" ? "dark" : "outline-dark"} onClick={() => setLastNameType("classic")}>Classic Last Names</Button>
                                <Button variant={lastNameType === "whimsical" ? "dark" : "outline-dark"} onClick={() => setLastNameType("whimsical")}>Whimsical Last Names</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Button block variant="primary" disabled={!firstNameType} onClick={() => getNames(1)}>Generate 1 Name</Button>
                        <Button block variant="primary" disabled={!firstNameType} onClick={() => getNames(3)}>Generate 3 Names</Button>
                        <Button block variant="primary" disabled={!firstNameType} onClick={() => getNames(5)}>Generate 5 Names</Button>
                        <Button block variant="outline-danger" onClick={() => setShowModal(false)}>Cancel</Button>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    {namesList.map(name => {
                        return <Button variant="outline-dark" onClick={() => selectName(name)}>{name}</Button>
                    })}
                </Modal.Footer>
            </Modal>
            <Col className="my-1">
                <Form.Label className="grenze mb-0">Name</Form.Label>
                <InputGroup>
                    <Form.Control type="text" name="name" id="name-input" onChange={props.handleChange} value={props.charName} />
                    <InputGroup.Append>
                        <Button variant="dark" onClick={() => setShowModal(true)}>Name Generator</Button>
                    </InputGroup.Append>
                </InputGroup>
            </Col>
        </Form>
    )
}

export default NameComp;