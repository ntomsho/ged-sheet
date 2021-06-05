import React from 'react';
import * as tables from './ged-tables';
import ShopModal from './shop_modal';
import armorImg from '../images/armor.png';
import artifactImg from '../images/artifact.png';
import cashImg from '../images/cash-money.png';
import equipmentImg from '../images/equipment.png';
import magicImg from '../images/magic-item.png';
import treasureImg from '../images/treasure.png';
import trinketImg from '../images/trinket.png';
import heavyWeaponImg from '../images/heavy-weapon.png';
import lightWeaponImg from '../images/light-weapon.png';
import rangedWeaponImg from '../images/ranged-weapon.png';
import thrownWeaponImg from '../images/thrown-weapon.png';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

class Inventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {shopModal: false};

        this.showStartingEquipment = this.showStartingEquipment.bind(this);
        this.acceptStartingEquipment = this.acceptStartingEquipment.bind(this);
        this.openShop = this.openShop.bind(this);
    }

    isReady() {
        if (this.props.inventory) return true;
        let readyFeatures = 0;
        this.props.features.forEach(feature => {
            if (feature === null) return;
            if (feature.feature === "Magic Artifact" && !feature.artifact) return;
            if (feature.feature === "Skill Mastery" && !feature.mastery) return;
            readyFeatures++;
        })
        // if (this.props.features.some(feature => feature === null)) return false;
        // if (this.props.features.some(feature => feature.feature === "Magic Artifact" && !feature.artifact)) return false;
        // if (this.props.features.some(feature => feature.feature === "Skill Mastery" && !feature.mastery)) return false;
        return readyFeatures >= 2 ? true : false;
    }

    showStartingEquipment() {
        let startingEquipmentChoices = [];
        this.props.features.forEach(feature => {
            startingEquipmentChoices = startingEquipmentChoices.concat(this.featureStartingChoice(feature));
        });
        startingEquipmentChoices.push([{name: "Cash Money", itemType: "Cash Money"}]);
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
                    [{ title: "Heavy Melee Weapon", table: tables.WEAPONS["Heavy Melee"], itemType: "Heavy Melee Weapon" }, { title: "Light Melee Weapon", table: tables.WEAPONS["Light Melee"], itemType: "Light Melee Weapon" }, { title: "Ranged Weapon", table: tables.WEAPONS["Ranged"], itemType: "Ranged Weapon" }, { title: "Thrown Weapon", table: tables.WEAPONS["Thrown"], itemType: "Thrown Weapon"}],
                    [{ name: "Armor", worn: false, itemType: "Armor" }, { name: "Shield", itemType: "Equipment" }, { title: "Light Melee Weapon", table: tables.WEAPONS["Light Melee"], itemType: "Light Melee Weapon" }, { name: "Spare ammunition", itemType: "Equipment"}]
                ]
            case "Magic Artifact":
                let artifact;
                if (feature.item) artifact = feature.item;
                if (feature.upgrade && feature.upgrade.item) artifact = feature.upgrade;
                if (feature.dropdownChoice && feature.dropdownChoice.item) artifact = feature.dropdownChoice.item;
                if (artifact) {
                    artifact.featureReq = feature.artifact;
                    return [[artifact]]
                }
                return [[{ name: feature.artifact, itemType: "Artifact", featureReq: feature.artifact}]]
            case "Skill Mastery":
                if (feature.trainedSkill === "Believe in Yourself") return [
                    [{ title: "Good luck trinket", derpStored: true, itemType: "Trinket", table: tables.TRINKETS.map(trinket => `Good Luck ${trinket}`) }, { title: "Musical Instrument", table: tables.MUSICAL_INSTRUMENTS, itemType: "Equipment"}]
                ]
                if (feature.trainedSkill === "Cardio") return [
                    [{ title: "Thrown Weapon", table: tables.WEAPONS["Thrown"], itemType: "Thrown Weapon" }, { title: "Heavy Melee Weapon", table: tables.WEAPONS["Heavy Melee"], itemType: "Heavy Melee Weapon" }, { name: "Shield", itemType: "Equipment"}]
                ]
                if (feature.trainedSkill === "Creepin\'") return [
                    [{ name: "Lockpicks", itemType: "Equipment" }, { name: "Disguise kit", itemType: "Equipment" }, { title: "Light Melee Weapon", table: tables.WEAPONS["Light Melee"], itemType: "Light Melee Weapon" }]
                ]
                if (feature.trainedSkill === "Macgyver") return [
                    [{ name: "Smith's tools", itemType: "Equipment" }, { name: "Hammer and chisel", itemType: "Equipment" }, { name: "Carpenter's tools", itemType: "Equipment" }, { name: "Apothecary's tools", itemType: "Equipment"}],
                    [{ name: "Oil flask", itemType: "Equipment" }, { name: "Glue", itemType: "Equipment" }, { name: "Vial of acid", itemType: "Equipment"}]
                ]
                if (feature.trainedSkill === "Man vs. Wild") return [
                    [{ title: "Ranged Weapon", table: tables.WEAPONS["Ranged"], itemType: "Ranged Weapon" }, { name: "Scimitar", itemType: "Light Melee Weapon" }, { name: "Net", itemType: "Equipment"}],
                    [{ title: "Trap Kit", table: tables.TRAPS.map(trap => `${trap} kit`), itemType: "Equipment" }, { name: "Medicine (herbal)", itemType: "Equipment" }, { name: "Food", itemType: "Equipment"}]
                ]
                if (feature.trainedSkill === "Thinkiness") return [[{name: "Cash money", itemType: "Cash Money"}]];
            case "Special Ancestry":
                return [
                    [{ title: "Your people's favored weapon", table: tables.ALL_WEAPONS, itemType: "Weapon" }, { title: "Background tools for your people's favored profession", table: tables.BACKGROUNDS.map(bg => `${bg}'s tools`), itemType: "Equipment" }, { title: "A good luck trinket that reminds you of home", derpStored: true, table: tables.TRINKETS.map(trinket => `Good Luck ${trinket}`), itemType: "Trinket"}]
                ]
            case "Words of Power":
                return [
                    [{ name: "Staff", itemType: "Light Melee Weapon" }, { name: "Dagger", itemType: "Light Melee Weapon" }, { name: "Sling", itemType: "Ranged Weapon"}],
                    [{ name: "Librarian's tools", itemType: "Equipment" }, { name: "Apothecary's tools", itemType: "Equipment"}]
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
            <Col className="justify-content-center" style={{ display: "flex" }}>
                <Button block variant="primary" onClick={this.acceptStartingEquipment}>Accept</Button>
            </Col>
        </Row> :
        <div></div>}
        </>
    )}

    acceptStartingEquipment() {
        let newInv = [];
        this.state.startingEquipmentChoicesMade.forEach((choice, i) => {
            const item = this.state.startingEquipmentChoices[i][choice]
            newInv.push(item);
        });
        this.props.updateInventory(newInv);
    }

    changeItem(field, value, itemIndex) {
        let newInv = Object.assign([], this.props.inventory);
        newInv[itemIndex][field] = value;
        this.props.updateInventory(newInv);
    }

    addItem(itemType, num) {
        let newInv = Object.assign([], this.props.inventory);
        let newItemObj = {name: "", itemType: itemType};
        if (itemType === "Treasure") {
            newItemObj.treasure = true;
            newItemObj.value = num || 1;
        }
        if (itemType === "Armor") {
            newItemObj.worn = false;
            newItemObj.armor = num || 0;
        }
        if (itemType === "Cash Money") {
            newItemObj.name = "Cash Money";
        }
        newInv.push(newItemObj);
        this.props.updateInventory(newInv);
    }

    equipArmor(itemIndex) {
        let newInv = Object.assign([], this.props.inventory);
        for (let i = 0; i < newInv.length; i++) {
            if (i === itemIndex) {
                newInv[i].worn = true;
            } else {
                newInv[i].worn = false;
            }
        }
        this.props.updateInventory(newInv);
    }

    getImage(itemType) {
        switch (itemType) {
            case "Treasure": return treasureImg;
            case "Armor": return armorImg;
            case "Cash Money": return cashImg;
            case "Magic Item": return magicImg;
            case "Artifact": return artifactImg;
            case "Weapon": 
            case "Heavy Melee Weapon": return heavyWeaponImg;
            case "Light Melee Weapon": return lightWeaponImg;
            case "Ranged Weapon": return rangedWeaponImg;
            case "Thrown Weapon": return thrownWeaponImg;
            case "Trinket": return trinketImg;
            default: return equipmentImg;
        }
    }

    itemComp(item, itemIndex) {
        let comps = [];

        if (item.itemType === "Armor" || item.armor) {
            let armorLevels = [];
            for (let i = 1; i <= 7; i++) {
                armorLevels.push(<Dropdown.Item onClick={() => this.changeItem("armor", i, itemIndex)}>{i}</Dropdown.Item>);
            }
            comps.push(
                <Button variant="outline-light" onClick={() => item.worn ? this.changeItem("worn", false, itemIndex) : this.equipArmor(itemIndex)}>{item.worn ? "Unequip" : "Equip"}</Button>,
                <Dropdown>
                    <Dropdown.Toggle variant="light">Armor: {item.armor}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {armorLevels}
                    </Dropdown.Menu>
                </Dropdown>
            )
        }

        if (item.itemType === "Treasure") {
            let valueLevels = [];
            for (let i = 1; i <= 3; i++) {
                valueLevels.push(<Dropdown.Item onClick={() => this.changeItem("value", i, itemIndex)}>{i}</Dropdown.Item>)
            }
            comps.push(
                <Dropdown>
                    <Dropdown.Toggle variant="light">Value: {item.value}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {valueLevels}
                    </Dropdown.Menu>
                </Dropdown>
            )
        }

        if (item.itemType === "Weapon") {
            let weaponTypes = ["Heavy Melee Weapon", "Light Melee Weapon", "Ranged Weapon", "Thrown Weapon"];
            weaponTypes = weaponTypes.map(wt => <Dropdown.Item onClick={() => this.changeItem("itemType", wt, itemIndex)}>{wt}</Dropdown.Item>)
            comps.push(
                <Dropdown>
                    <Dropdown.Toggle variant="light">Weapon Type</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {weaponTypes}
                    </Dropdown.Menu>
                </Dropdown>
            )
        }

        comps.push(
            <ButtonGroup>
                <Button variant="outline-dark" text="dark" onClick={() => this.moveItem(false, itemIndex)}>{"<<"}</Button>
                <Button variant="outline-dark" text="dark" onClick={() => this.moveItem(true, itemIndex)}>{">>"}</Button>
            </ButtonGroup>
        );
        if (item.itemType !== "Artifact") {
            comps.push(<Button className="corner-button" size="sm" variant="danger" onClick={() => this.discardItem(itemIndex)}>X</Button>);
        }

        return (
            <Col>
            <Card bg={this.itemVariant(item.itemType)} text={this.itemVariant(item.itemType) === "light" ? "dark" : "light"}>
                <Card.Img src={this.getImage(item.itemType)} alt="Card Image" />
                <Card.ImgOverlay>
                <Card.Body>
                    <Card.Title>
                        <Form>
                            <Form.Control style={{fontSize: "0.75rem"}} type="text" placeholder={`Unnamed ${item.itemType}`} value={item.name} onChange={(e) => this.changeItem("name", e.target.value, itemIndex)} />
                        </Form>
                    </Card.Title>
                    <Card.Subtitle style={{fontSize: "10px"}}>
                        {item.itemType}
                    </Card.Subtitle>
                    {comps.length > 0 ?
                    <Card.Text>{comps}</Card.Text>
                    :
                    <></>}
                </Card.Body>
                </Card.ImgOverlay>
            </Card>
            </Col>
        )
    }

    moveItem(inc, itemIndex) {
        let newInv = Object.assign([], this.props.inventory);
        let movingItem = newInv.splice(itemIndex, 1)[0];
        if (!inc && itemIndex === 0) {
            newInv.push(movingItem);
        } else if (inc && itemIndex === this.props.inventory.length - 1) {
            newInv.unshift(movingItem);
        } else {
            newInv.splice(itemIndex + (inc ? 1 : -1), 0, movingItem);
        }
        this.props.updateInventory(newInv);
    }

    discardItem(itemIndex) {
        let newInv = Object.assign([], this.props.inventory);
        newInv.splice(itemIndex, 1);
        this.props.updateInventory(newInv);
    }

    itemVariant(itemType) {
        switch(itemType) {
            case "Treasure": return "warning"
            case "Armor": return "secondary"
            case "Cash Money": return "success"
            case "Artifact":
            case "Magic Item": return "info"
            default: return "light"
        }
    }

    purchase(items) {
        let newInv = Object.assign([], this.props.inventory);
        const cash = newInv.find(item => item.itemType === "Cash Money");
        newInv.splice(newInv.indexOf(cash), 1);
        newInv = newInv.concat(items);
        this.props.updateInventory(newInv);
    }

    inventoryComp() {
        return (
            <Card.Body>
                <Row xs={2} sm={3} m={4} lg={5} className="g-1">
                    {this.props.inventory.map((item, i) => {
                    return (
                        this.itemComp(item, i)
                    )})}
                </Row>
                <Form className="mt-4">
                    <Dropdown>
                        <Dropdown.Toggle>Add Item</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as="button" variant="outline-light" onClick={() => this.addItem("Standard")}>Add Standard Item</Dropdown.Item>
                            <Dropdown.Item as="button" variant="outline-secondary" onClick={() => this.addItem("Armor")}>Add Armor</Dropdown.Item>
                            <Dropdown.Item as="button" variant="outline-success" onClick={() => this.addItem("Cash Money")}>Add Cash Money</Dropdown.Item>
                            <Dropdown.Item as="button" variant="outline-info" onClick={() => this.addItem("Magic Item")}>Add Magic Item</Dropdown.Item>
                            <Dropdown.Item as="button" variant="outline-warning" onClick={() => this.addItem("Treasure")}>Add Treasure</Dropdown.Item>
                            <Dropdown.Item as="button" variant="outline-light" onClick={() => this.addItem("Trinket")}>Add Trinket</Dropdown.Item>
                            <Dropdown.Item as="button" variant="outline-light" onClick={() => this.addItem("Weapon")}>Add Weapon</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form>
                {this.props.inventory.filter(item => item.itemType === "Cash Money").length > 0 ?
                <Button variant="outline-success" onClick={this.openShop}>Equipment Store</Button>
                :
                null}
            </Card.Body>
        )
    }

    openShop() {
        let newState = Object.assign({}, this.state);
        newState.shopModal = !newState.shopModal;
        this.setState(newState);
    }

    render() {
        let comp;
        if (!this.props.inventory) {
            if (this.isReady()) {
                if (this.state.startingEquipmentChoices) {
                    comp = (<>
                    <h3>Choose Starting Equipment</h3>
                    {this.startingEquipmentComp()}
                </>)
                } else {
                    comp = <Row><Col className="justify-content-center" style={{ display: "flex" }}><Button className="mt-3 mb-3" variant="dark" block onClick={this.showStartingEquipment}>Select Starting Equipment</Button></Col></Row>
                }
            }
        } else {
            comp = this.inventoryComp();
        }

        return <Accordion>
            <ShopModal closeModal={this.openShop} purchase={this.purchase.bind(this)} getImage={this.getImage.bind(this)} shopModal={this.state.shopModal} />
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="light" className="w-100 grenze" eventKey="inv">
                        <h2>Inventory</h2>
                        <div className="grenze">{this.props.inventory ? "Tap to expand" : this.isReady() ? "Choose starting inventory" : "Complete Character Features to choose starting inventory"}</div>
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="inv">
                    {comp || <></>}
                </Accordion.Collapse>
            </Card>
        </Accordion>
    }
}

export default Inventory;