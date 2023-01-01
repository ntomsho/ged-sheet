import React, { useState } from 'react';
import * as tables from './ged-tables';
import Modal from 'react-bootstrap/Modal';
import { Card, Dropdown, Row, Col, Button } from 'react-bootstrap';

const ShopModal = (props) => {
    const [selections, setSelections] = useState([]);

    const [toolsDropdown, setToolsDropdown] = useState(null);
    const [instrumentsDropdown, setInstrumentsDropdown] = useState(null);
    const [trapsDropdown, setTrapsDropdown] = useState(null);
    const [heavyDropdown, setHeavyDropdown] = useState(null);
    const [lightDropdown, setLightDropdown] = useState(null);
    const [rangedDropdown, setRangedDropdown] = useState(null);
    const [thrownDropdown, setThrownDropdown] = useState(null);

    let equipment = tables.EQUIPMENT.filter(item => item !== "Cash Money" && item !== "Extra Weapon" && item !== "Good Luck Trinket");
    equipment = equipment.map(item => {
        if (item === "Background Tools") {
            return { name: "Background Tools", table: tables.BACKGROUNDS.map(bg => bg + " Tools"), itemType: "Equipment", displayName: toolsDropdown, setFunction: setToolsDropdown}
        }
        if (item === "Musical Instrument") {
            return { name: "Musical Instrument", table: tables.MUSICAL_INSTRUMENTS.map(trap => trap + " Kit"), itemType: "Equipment", displayName: instrumentsDropdown, setFunction: setInstrumentsDropdown}
        }
        if (item === "Trap Kit") {
            return { name: "Trap Kit", table: tables.TRAPS, itemType: "Equipment", displayName: trapsDropdown, setFunction: setTrapsDropdown}
        }
        return {name: item, itemType: (item === "Armor" ? "Armor" : "Equipment")}
    });
    let weapons = [
        { name: "Heavy Melee Weapon", table: tables.WEAPONS["Heavy Melee"], itemType: "Heavy Melee Weapon", displayName: heavyDropdown, setFunction: setHeavyDropdown},
        { name: "Light Melee Weapon", table: tables.WEAPONS["Light Melee"], itemType: "Light Melee Weapon", displayName: lightDropdown, setFunction: setLightDropdown},
        { name: "Ranged Weapon", table: tables.WEAPONS["Ranged"], itemType: "Ranged Weapon", displayName: rangedDropdown, setFunction: setRangedDropdown},
        { name: "Thrown Weapon", table: tables.WEAPONS["Thrown"], itemType: "Thrown Weapon", displayName: thrownDropdown, setFunction: setThrownDropdown}
    ];

    function cancel() {
        setSelections([]);
        clearDropdowns();
        props.closeModal();
    }

    function accept() {
        const selectionItems = selections.map(ind => {
            let item = equipment.concat(weapons)[ind];
            return {name: (item.displayName ? item.displayName : item.name), itemType: item.itemType}
        });
        clearDropdowns();
        props.purchase(selectionItems);
    }

    function makeSelection(index) {
        let newSelections = Object.assign([], selections);
        if (!selections.includes(index) && selections.length < 3) {
            newSelections.push(index);
            return setSelections(newSelections);
        }
        if (selections.includes(index)) {
            newSelections.splice(newSelections.indexOf(index), 1);
            return setSelections(newSelections);
        }
    }

    function itemDropdown(item) {
        return (
            <Dropdown>
                <Dropdown.Toggle variant="outline-dark" className="w-100" style={{ fontSize: "10px", whiteSpace: "normal", wordWrap: "normal" }}>{item.displayName ? item.displayName : item.name}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {item.table.map((option, i) => {
                        return <Dropdown.Item onClick={() => item.setFunction(option)} key={i}>{option}</Dropdown.Item>
                    })}
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    function clearDropdowns() {
        setToolsDropdown(null);
        setInstrumentsDropdown(null);
        setTrapsDropdown(null);
        setHeavyDropdown(null);
        setLightDropdown(null);
        setRangedDropdown(null);
        setThrownDropdown(null);
    }

    function itemBox(item, index) {
        return (
            <Col key={index}>
            <Card bg={selections.includes(index) ? "primary" : "light"} text={selections.includes(index) ? "light" : "dark"} onClick={() => makeSelection(index)}>
                <Card.Img src={props.getImage(item.itemType)} alt="Card Image" />
                <Card.ImgOverlay>
                    {
                        item.table ? 
                        itemDropdown(item) :
                        <Card.Body><div style={{fontSize: "11px", wordWrap: "normal", textAlign: "center"}}>{item.name}</div></Card.Body>
                    }
                </Card.ImgOverlay>
            </Card>
            </Col>
        )
    }

    return (
        <Modal show={props.shopModal} size="lg" onHide={props.closeModal}>
            <Modal.Header>Equipment Shop</Modal.Header>
            <Modal.Body>
                <Row xs={4} className="g-1">
                    {equipment.map((item, i) => {
                        return itemBox(item, i);
                    })}
                </Row>
                <Row xs={4} className="g-1 mt-2">
                    {weapons.map((weapon, i) => {
                        return itemBox(weapon, equipment.length + i);
                    })}
                </Row>
                <Row>
                    <Button variant="outline-dark" onClick={cancel}>Cancel</Button>
                    <Button variant="success" disabled={selections.length < 3} onClick={accept}>Purchase</Button>
                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default ShopModal;