import React from 'react';
import * as tables from './ged-tables';
import CharacterFeature from './character_feature';
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class FeatureSkillMastery extends CharacterFeature {
    titleComp() {
        return <>
            <h3>Skill Mastery{this.props.feature.upgrade ? " 🌟" : ""}</h3>
            <div>You have mastered one of the six Civilized Skills, gaining special abilities related to it.</div>
        </>
    }

    masteryComp(mastery, upgrade) {
        let components = [];
        components.push(
            
        );
        if (mastery.upgradeText) {
            components.push(<div><strong>Upgrade: </strong>{mastery.upgradeText}</div>)
        }
        if (mastery.checkbox) {
            components.push(this.checkboxComp(mastery.checkbox));
        }
        if (mastery.resource) {
            components.push(this.resourceComp(mastery.resource, upgrade));
        }
        if (mastery.specials) {
            components.push(this.specialComp(mastery.specials, upgrade));
        }
        if (mastery.specialRefresh) {
            components.push(this.specialRefreshComp(mastery.specialRefresh, upgrade));
        }
        if (mastery.menagerie) {
            components.push(this.zoomasterComp(upgrade));
        }
        return (<>
            <h3>{upgrade ? this.props.feature.upgrade.mastery : this.props.feature.mastery}</h3>
            <Row xs={1} sm={components.length > 0 ? 2 : 1}>
                <Col>
                    <div>{mastery.description}</div>
                    <ul>
                        {mastery.traits.map((trait, i) => {
                            return <li key={i}>{trait}</li>
                        })}
                    </ul>
                </Col>
                {components.length > 0 ?
                <Col>
                    {components}
                </Col>:
                <></>}
            </Row>
            <Row>{this.masteryChoiceComp(upgrade)}</Row>
        </>)
    }

    upgradeComp() {
        const upgrade = this.props.feature.upgrade
        let choices = [
            "Choose a second mastery from your Trained Skill",
            "Upgrade your currently selected mastery"
        ];
        let comps = [];
        if (upgrade && upgrade.choice === 0) {
            if (upgrade.mastery) {
                comps.push(this.masteryComp(tables.SKILL_MASTERIES[this.props.feature.trainedSkill][this.props.feature.upgrade.mastery], true))
            } else {
                comps.push(this.masteryChoiceComp(true))
            }
        }
        comps.push(
            <Dropdown>
                <div className="grenze">Feature Upgrade</div>
                <Dropdown.Toggle className="long-text-button" variant="light">{typeof upgrade.choice === "number" ? choices[upgrade.choice] : "Choose an upgrade for this feature"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item className="long-text-button" as="button" onClick={() => this.setUpgrade("choice", 0)}><p>{choices[0]}</p></Dropdown.Item>
                    <Dropdown.Item className="long-text-button" as="button" onClick={() => this.setUpgrade("choice", 1)}><p>{choices[1]}</p></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
        return comps;
    }

    masteryChoiceComp(upgrade) {
        const source = (upgrade ? this.props.feature.upgrade : this.props.feature);
        const setFunction = (upgrade ? this.setUpgrade : this.setField);
        let masteries = Object.keys(tables.SKILL_MASTERIES[this.props.feature.trainedSkill]);
        if (upgrade) {
            masteries = masteries.filter(mastery => mastery !== this.props.feature.mastery);
        }
        return (
            <Dropdown>
                <Dropdown.Toggle variant="light">{source.mastery ? "Change Mastery" : "Choose a Mastery from your Trained Skill"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {masteries.map((mastery, i) => {
                        return (
                            <Dropdown.Item key={i} as="button" className="long-text-button" onClick={() => setFunction("mastery", mastery)}>{mastery} - {tables.SKILL_MASTERIES[this.props.feature.trainedSkill][mastery].description}</Dropdown.Item>
                        )
                    })}
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    updateMenagerie(field, value, beastIndex, upgrade, reroll) {
        const source = (upgrade ? this.props.feature.upgrade : this.props.feature);
        const setFunction = (upgrade ? this.setUpgrade : this.setField);

        let newMenagerie = Object.assign([], source.menagerie);
        if (field === "all") {
            newMenagerie[beastIndex] = {
                name: "",
                beast: this.randomizeBeast(),
                stamina: 3,
                inOrb: true
            }
        } else if (field === "delete") {
            newMenagerie.splice(beastIndex, 1);
        } else if (field === "add") {
            newMenagerie.push({
                name: "",
                beast: value,
                stamina: 3,
                inOrb: true
            });
        } else {
            newMenagerie[beastIndex][field] = value;
        }
        if (reroll) {
            this.props.useReroll();
        }
        setFunction("menagerie", newMenagerie);
    }

    randomizeBeast() {
        const beastType = Math.floor(Math.random() * tables.BEAST_TYPES.length);
        const table1 = this.props.getTable(tables.BEAST_TYPES[beastType][0]);
        const table2 = this.props.getTable(tables.BEAST_TYPES[beastType][1]);
        let beastString;
        if (beastType === 0) {
            beastString = tables.ELEMENT_ADJECTIVES[table1[Math.floor(Math.random() * table1.length)]];
            beastString += " " + table2[Math.floor(Math.random() * table2.length)];
        } else {
            beastString = table1[Math.floor(Math.random() * table1.length)]
            beastString += ` with ${table2[Math.floor(Math.random() * table2.length)]} feature`;
        }
        return beastString;
    }

    sendOut(index, upgrade) {
        const source = (upgrade ? this.props.feature.upgrade : this.props.feature);
        const setFunction = (upgrade ? this.setUpgrade : this.setField);

        let newMenagerie = Object.assign([], source.menagerie);
        newMenagerie.forEach(beast => beast.inOrb = true);
        newMenagerie[index].inOrb = false;

        setFunction("menagerie", newMenagerie);
    }

    zoomasterComp(upgrade) {
        const source = (upgrade ? this.props.feature.upgrade : this.props.feature);
        const setFunction = (upgrade ? this.setUpgrade : this.setField);

        if (!source.menagerie) {
            let beasts = [];
            for (let i = 0; i < 3; i++) {
                beasts.push({
                    name: "",
                    beast: this.randomizeBeast(),
                    stamina: 3,
                    inOrb: true
                });
            }
            setFunction("menagerie", beasts);
        } else {
            const activeBeast = source.menagerie.find(beast => !beast.inOrb)
            return (
                <>
                <div className="feature-comp-box">
                <h3>Active Beast</h3>
                {activeBeast ? 
                    this.beastComp(activeBeast, source.menagerie.indexOf(activeBeast), upgrade)
                    :
                    <div>None</div>
                }
                </div>
                <div><h3 style={{textAlign: "center"}}>Menagerie</h3></div>
                <div>
                    {source.menagerie.filter(beast => beast.inOrb).map((beast, i) => {
                        return (
                            <div className="feature-comp-box" key={i}>
                                {this.beastComp(beast, i, upgrade)}
                            </div>
                        )
                    })}
                </div>
                <Form>
                    <Form.Label className="grenze">Add New Beast</Form.Label>
                    <Form.Control type="text" onChange={(e) => this.changeNewBeastType(e)} placeholder="Beast Type" value={this.state.customBeast} />
                    <Button variant="outline-success" disabled={!this.state.customBeast} onClick={() => this.updateMenagerie("add", this.state.customBeast,null,upgrade)}>Add New Beast</Button>
                </Form>
                </>
            )
        }
    }

    changeNewBeastType(event) {
        let newState = Object.assign({}, this.state);
        newState.customBeast = event.target.value;
        this.setState(newState);
    }

    beastComp(beast, i, upgrade) {
        return (
        <>
        <div>
        <Form>
            <Form.Control type="text" placeholder="Beast name" onChange={(e) => this.updateMenagerie("name", e.target.value, i, upgrade)} value={beast.name}></Form.Control>
        </Form>
        </div>
        <div className="grenze" style={{textAlign: "center"}}>{beast.beast}</div>
        <div>
        <InputGroup style={{justifyContent: "center"}}>
            <InputGroup.Prepend>
                <Button disabled={beast.stamina <= 0} variant="dark" onClick={() => this.updateMenagerie("stamina", beast.stamina - 1, i, upgrade)}>-</Button>
            </InputGroup.Prepend>
            <InputGroup.Text className="grenze">Stamina: {beast.stamina} / 3</InputGroup.Text>
            <InputGroup.Append>
                <Button disabled={beast.stamina >= 3} variant="light" onClick={() => this.updateMenagerie("stamina", beast.stamina - 1, i, upgrade)}>+</Button>
            </InputGroup.Append>
        </InputGroup>
        </div>
        <ButtonGroup>
            <Button size="sm" variant="danger" onDoubleClick={() => this.updateMenagerie("delete", null, i, upgrade)}>Release (double tap)</Button>
            <Button size="sm" variant="outline-warning" disabled={this.props.rerolls <= 0} onClick={() => this.updateMenagerie("beast", this.randomizeBeast(), i, upgrade, true)}>Reroll Beast</Button>
            <Button size="sm" variant="outline-dark" onClick={beast.inOrb ? () => this.sendOut(i, upgrade) : () => this.updateMenagerie("inOrb", true, i, upgrade)}>{beast.inOrb ? "Send Out" : "Return to Orb"}</Button>
        </ButtonGroup>
        </>
        )
    }

    rerollButtons() {
        return <Button className="random-button" disabled={this.props.rerolls <= 0 && this.props.feature.trainedSkill} variant={this.props.feature.trainedSkill ? "outline-warning" : "outline-dark"} onClick={() => this.randomize("trainedSkill")}>{this.props.feature.trainedSkill ? "Reroll" : "Roll"} Trained Skill</Button>
    }

    featureComp() {
        if (!this.props.feature.trainedSkill) {
            return <></>
        } else {
            let components = [];
            if (this.props.feature.mastery) {
                let mastery = tables.SKILL_MASTERIES[this.props.feature.trainedSkill][this.props.feature.mastery];
                if (this.props.feature.upgrade && this.props.feature.upgrade.choice === 1) {
                    mastery = Object.assign(mastery, tables.SKILL_MASTERIES[this.props.feature.trainedSkill][this.props.feature.mastery].upgrade)
                }
                components.push(this.masteryComp(mastery));
                if (this.props.feature.upgrade) {
                    components.push(this.upgradeComp());
                }
            } else {
                components.push(this.masteryChoiceComp());
            }

            return (
                <>
                    <div>
                        <h3>{this.props.feature.trainedSkill}</h3>
                        <div>{tables.SKILL_DESCRIPTIONS[this.props.feature.trainedSkill].covers}</div>
                    </div>
                    {components}
                </>
            )
        }
    }
}

export default FeatureSkillMastery;