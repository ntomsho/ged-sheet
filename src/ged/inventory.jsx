import React, { useState } from 'react';
import * as tables from './ged-tables';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Card from 'react-bootstrap/Card';

class Inventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.itemTables = {
        //     "Heavy Melee Weapon": tables.WEAPONS["Heavy Melee"],
        //     "Light Melee Weapon": tables.WEAPONS["Light Melee"],
        //     "Ranged Weapon": tables.WEAPONS["Ranged"],
        //     "Thrown Weapon": tables.WEAPONS["Thrown"],
        //     "Good luck trinket": tables.TRINKETS.map(trinket => `Good luck ${trinket}`),
        //     "Trap Kit": tables.TRAPS.map(trap => `${trap} kit`),
        //     "Your people's favored weapon": tables.ALL_WEAPONS,
        //     "Background Tools": tables.BACKGROUNDS.map(bg => `${bg}'s tools`),
        //     "Background tools for your people's favored profession": tables.BACKGROUNDS.map(bg => `${bg}'s tools`),
        //     "A good luck trinket that reminds you of home": tables.TRINKETS.map(trinket => `Good luck ${trinket}`),
        //     "Extra Weapon": tables.ALL_WEAPONS,
        //     "Musical Instrument": tables.MUSICAL_INSTRUMENTS
        // }

        this.showStartingEquipment = this.showStartingEquipment.bind(this);
        this.acceptStartingEquipment = this.acceptStartingEquipment.bind(this);

        //
            //To-Do:
                //+ button for clearing items from inventory
                //+ give item types different backgrounds
                //+ handle armor
                //+ interface for buying equipment
        //
    }

    isReady() {
        if (this.props.features.some(feature => feature === null)) return false;
        if (this.props.features.some(feature => feature.feature === "Magic Artifact" && !feature.artifact)) return false;
        if (this.props.features.some(feature => feature.feature === "Skill Mastery" && !feature.mastery)) return false;
        return true;
    }

    showStartingEquipment() {
        let startingEquipmentChoices = [];
        this.props.features.forEach(feature => {
            startingEquipmentChoices = startingEquipmentChoices.concat(this.featureStartingChoice(feature));
        });
        startingEquipmentChoices.push([{name: "Cash Money", cashMoney: true}]);
        this.setState({
            startingEquipmentChoices: startingEquipmentChoices,
            startingEquipmentChoicesMade: startingEquipmentChoices.map(choice => null)
        });
    }

    itemSelectButton(item, choiceSet, setIndex) {
        if (item.table) {
            return (
                <div key={`${setIndex}_${choiceSet}`}>
                <Button variant={this.state.startingEquipmentChoicesMade[choiceSet] === setIndex ? "secondary" : "outline-secondary"} onClick={() => this.selectChoice(choiceSet, setIndex)}>{item.name ? item.name : item.title}</Button>
                <Button variant={item.name ? "outline-warning" : "outline-dark"} onClick={() => this.randomizeChoice(choiceSet, setIndex, item.table)}>{item.name ? "Reroll" : "Roll"} Item</Button>
                </div>
            )
        } else {
            return <div key={`${setIndex}_${choiceSet}`}><Button variant={this.state.startingEquipmentChoicesMade[choiceSet] === setIndex ? "secondary" : "outline-secondary"} onClick={() => this.selectChoice(choiceSet, setIndex)}>{item.name}</Button></div>
        }
    }

    randomizeChoice(choiceSet, setIndex, table) {
        let newState = Object.assign([], this.state);
        if (newState.startingEquipmentChoices[choiceSet][setIndex].name) this.props.useReroll();
        newState.startingEquipmentChoices[choiceSet][setIndex].name = table[Math.floor(Math.random() * table.length)];
        this.setState(newState);
    }

    selectChoice(choiceSet, setIndex) {
        if (!this.state.startingEquipmentChoices[choiceSet][setIndex].name) return;
        let newState = Object.assign([], this.state);
        newState.startingEquipmentChoicesMade[choiceSet] = setIndex;
        this.setState(newState);
    }

    featureStartingChoice(feature) {
        switch (feature.feature) {
            case "Fighting Style":
                return [
                    [{ title: "Heavy Melee Weapon", table: tables.WEAPONS["Heavy Melee"] }, { title: "Light Melee Weapon", table: tables.WEAPONS["Light Melee"] }, { title: "Ranged Weapon", table: tables.WEAPONS["Ranged"] }, { title: "Thrown Weapon", table: tables.WEAPONS["Thrown"]}],
                    [{ name: "Armor", worn: false }, { name: "Shield" }, { title: "Light Melee Weapon", table: tables.WEAPONS["Light Melee"] }, {name: "Spare ammunition"}]
                ]
            case "Magic Artifact":
                return [[{name: feature.artifact}]]
            case "Skill Mastery":
                if (feature.trainedSkill === "Believe in Yourself") return [
                    [{ title: "Good luck trinket", table: tables.TRINKETS.map(trinket => `Good luck ${trinket}`) }, { title: "Musical Instrument", table: tables.MUSICAL_INSTRUMENTS}]
                ]
                if (feature.trainedSkill === "Cardio") return [
                    [{ title: "Thrown Weapon", table: tables.WEAPONS["Thrown"] }, { title: "Heavy Melee Weapon", table: tables.WEAPONS["Heavy Melee"] }, {name: "Shield"}]
                ]
                if (feature.trainedSkill === "Creepin\'") return [
                    [{ name: "Lockpicks" }, { name: "Disguise kit" }, { title: "Light Melee Weapon", table: tables.WEAPONS["Light Melee"] }]
                ]
                if (feature.trainedSkill === "Macgyver") return [
                    [{name: "Smith's tools"}, {name: "Hammer and chisel"}, {name: "Carpenter's tools"}, {name: "Apothecary's tools"}],
                    [{name: "Oil flask"}, {name: "Glue"}, {name: "Vial of acid"}]
                ]
                if (feature.trainedSkill === "Man vs. Wild") return [
                    [{ title: "Ranged Weapon", table: tables.WEAPONS["Ranged"] }, {name: "Scimitar"}, {name: "Net"}],
                    [{ title: "Trap Kit", table: tables.TRAPS.map(trap => `${trap} kit`)}, {name: "Medicine (herbal)"}, {name: "Food"}]
                ]
                if (feature.trainedSkill === "Thinkiness") return [[{name: "Cash money", cashMoney: true}]];
            case "Special Ancestry":
                return [
                    [{ title: "Your people's favored weapon", table: tables.ALL_WEAPONS }, { title: "Background tools for your people's favored profession", table: tables.BACKGROUNDS.map(bg => `${bg}'s tools`) }, { title: "A good luck trinket that reminds you of home", table: tables.TRINKETS.map(trinket => `Good luck ${trinket}`)}]
                ]
            case "Words of Power":
                return [
                    [{name: "Staff"}, {name: "Dagger"}, {name: "Sling"}],
                    [{name: "Librarian's tools"}, {name: "Apothecary's tools"}]
                ]
        }
    }

    startingEquipmentComp() {
        return (
        <>
        {this.state.startingEquipmentChoices.map((choiceSet, i) => {
            return (
                <>
                <Row>
                    {choiceSet.map((choice, j) => {
                        return (
                            <Col key={`${i}_${j}`} xs={12 / choiceSet.length}>
                                {this.itemSelectButton(choice, i, j)}
                            </Col>
                        )
                    })}
                </Row>
                </>
            )
        })}
        {this.state.startingEquipmentChoicesMade.every(choice => choice !== null) ?
        <Row>
            <Button variant="primary" onClick={this.acceptStartingEquipment}>Accept</Button>
        </Row> :
        <div></div>}
        </>
    )}

    acceptStartingEquipment() {
        let newInv = [];
        this.state.startingEquipmentChoicesMade.forEach((choice, i) => {
            const item = this.state.startingEquipmentChoices[i][choice]
            newInv.push({name: item.name, worn: item.worn, cashMoney: item.cashMoney});
        });
        this.props.updateInventory(newInv);
    }

    handleChange(event, itemIndex) {
        let newInv = Object.assign([], this.props.inventory);
        newInv[itemIndex].name = event.target.value;
        this.props.updateInventory(newInv)
    }

    changeAddItemType(itemType) {
        let newState = Object.assign({}, this.state);
        newState.addItemType = itemType;
        this.setState(newState);
    }

    addItem(itemType) {
        let newInv = Object.assign([], this.props.inventory);
        let newItemObj = {name: ""};
        if (itemType === "Treasure") newItemObj.treasure = true;
        if (itemType === "Armor") newItemObj.worn = false;
        if (itemType === "Cash") newItemObj.cashMoney = true;
        this.props.updateInventory(newInv);
    }

    inventoryComp() {
        return (<>
            {this.props.inventory.map((item, i) => {
            return (
                <Form>
                    <Form.Control type="text" value={item.name} onChange={(e) => this.handleChange(e, i)} />
                </Form>
            )})}
            <Form>
                <Dropdown>
                    <Dropdown.Toggle>Add Item</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item as="button" variant="outline-dark" onClick={() => this.addItem("Standard")}>Add Standard Item</Dropdown.Item>
                        <Dropdown.Item as="button" variant="outline-dark" onClick={() => this.addItem("Cash")}>Add Cash Money</Dropdown.Item>
                        <Dropdown.Item as="button" variant="outline-dark" onClick={() => this.addItem("Armor")}>Add Armor</Dropdown.Item>
                        <Dropdown.Item as="button" variant="outline-dark" onClick={() => this.addItem("Treasure")}>Add Treasure</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Form>
        </>)
    }

    render() {
        if (!this.isReady()) return <div></div>
        if (this.props.inventory.length === 0) {
            if (this.state.startingEquipmentChoices) {
                return (<>
                    <h3>Choose Starting Equipment</h3>
                    {this.startingEquipmentComp()}
                </>)
            } else {
                return <Button variant="dark-outline" onClick={this.showStartingEquipment}>Select Starting Equipment</Button>
            }
        } else {
            return (<>
                <h3>Inventory</h3>
                {this.inventoryComp()}    
            </>)
        }
    }
}

export default Inventory;