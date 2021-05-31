import React from 'react';
import * as tables from './ged-tables';
import CharacterFeature from './character_feature';
import FeatureFightingStyle from './feature_fighting_style';
import FeatureMagicArtifact from './feature_magic_artifact';
import FeatureSkillMastery from './feature_skill_mastery';
import FeatureSpecialAncestry from './feature_special_ancestry';
import FeatureWordsOfPower from './feature_words_of_power';
import Skills from './skills';
import Inventory from './inventory';
import Advancement from './advancement';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

class CharSheet extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            level: 1,
            rerolls: 4000,
            charName: "",
            background: null,
            appearance: null,
            derp: null,
            features: [null, null],
            bonusSkill: null,
            experience: 0,
            health: {
                current: 7,
                max: 7
            },
            armor: {
                current: 3,
                max: 3
            },
            derpPoints: 1,
            inventory: [],
            conditions: [],
            dead: false
        }

        this.rerollTracker = this.rerollTracker.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateHealth = this.updateHealth.bind(this);
        this.healthTrackerDisp = this.healthTrackerDisp.bind(this);
        this.updatePlotPoints = this.updatePlotPoints.bind(this);
        this.plotPointsTrackerDisp = this.plotPointsTrackerDisp.bind(this);
        this.updateFeature = this.updateFeature.bind(this);
        this.updateInventory = this.updateInventory.bind(this);
        this.updateExperience = this.updateExperience.bind(this);
        this.populateFeatures = this.populateFeatures.bind(this);
        this.randomize = this.randomize.bind(this);
        this.getTable = this.getTable.bind(this);
        this.useReroll = this.useReroll.bind(this);
        this.rest = this.rest.bind(this);
        this.removeUpgrade = this.removeUpgrade.bind(this);
        this.levelUp = this.levelUp.bind(this);
    }

    rerollTracker() {
        if (this.state.rerolls > 0) {
            return (
                <h2 className="text-center">{this.state.rerolls} Rerolls Remaining</h2>
            )
        } else {
            return <></>
        }
    }

    handleChange(event) {
        let newState = Object.assign({}, this.state);
        newState["charName"] = event.target.value;
        this.setState(newState);
        // this.updateState(event.target.name, event.target.value);
    }

    rest() {
        let newState = Object.assign({}, this.state);
        if (newState.health.current < newState.health.max) {
            newState.health.current++;
        }
        newState.features.forEach(feature => {
            if (feature === null) return;
            if (feature.resource && feature.resource.refreshOn === "rest") {
                feature.resource.current = feature.resource.refreshAmt ? feature.resource.refreshAmt : feature.resource.max;
            }
            if (feature.specialRefresh) {
                feature.specialRefresh.forEach((special, i) => {
                    if (special.refreshOn === "rest") {
                        special = CharacterFeature.refreshSpecial(feature.specialRefresh, i, false, true);
                    }
                })
            }
            if (feature.ancestries) {
                feature.ancestries.forEach((ancestry, i) => {
                    if (ancestry.resource && ancestry.resource.refreshOn === "rest") {
                        ancestry.resource.current = ancestry.resource.refreshAmt ? ancestry.resource.refreshAmt : ancestry.resource.max;
                    }
                });
            }
        });
        this.setState(newState);
    }

    updateHealth(num) {
        let newState = Object.assign({}, this.state);
        
        if (newState.health.current <= this.state.health.current) {
            if (newState.armor.current > 0) {
                newState.health.current = num;
                newState.armor.current = 0;
            } else {
                newState.health.current = this.state.health.current === num ? num - 1 : num;
            }
        }
        this.setState(newState);
    }

    updateArmor(num) {
        let newState = Object.assign({}, this.state);
        newState.armor.current = this.state.armor.current === num ? num - 1 : num;
        this.setState(newState);
    }

    healthTrackerDisp() {
        const totalCurrent = this.state.health.current + this.state.armor.current;
        const totalMax = this.state.health.max + this.state.armor.max;
        const hearts = [
            <Col xs={3} md={2} lg={1} key={0}>
                <Image
                    id="heart-0"
                    className="heart-container"
                    alt="0 Health"
                    fluid
                    // onClick={() => this.setState({ deathModal: true })}
                    src={"https://icons.iconarchive.com/icons/icons8/ios7/256/Healthcare-Skull-icon.png"}
                />
            </Col>
        ];
        for (let i = 0; i < this.state.health.max; i++) {
            hearts.push(
                <Col xs={3} md={2} lg={1} key={i + 1}>
                    <Image 
                        id={`heart-${i + 1}`}
                        key={i}
                        className="heart-container"
                        alt={`${i + 1} Health`}
                        fluid
                        onClick={() => this.updateHealth(i + 1)}
                        src={this.state.health.current >= i + 1 ?
                            "https://icons.iconarchive.com/icons/designbolts/free-valentine-heart/256/Heart-icon.png" : 
                            "https://icons.iconarchive.com/icons/icons8/windows-8/256/Gaming-Hearts-icon.png"}
                    />
                </Col>
            )
        }
        for (let i = 0; i < this.state.armor.max; i++) {
            hearts.push(
                <Col xs={3} md={2} lg={1} key={i + 1}>
                    <Image
                        id={`heart-${this.state.health.max + i + 1}`}
                        key={this.state.health.max + i}
                        className="heart-container"
                        alt={`${this.state.health.max + i + 1} Health`}
                        fluid
                        onClick={() => this.updateArmor(i + 1)}
                        src={this.state.health.current + this.state.armor.current >= this.state.health.max + i + 1 ?
                            "https://icons.iconarchive.com/icons/icons8/ios7/256/Network-Shield-icon.png" :
                            "https://icons.iconarchive.com/icons/icons8/windows-8/256/Security-Shield-icon.png"}
                    />
                </Col>
            )
        }
        return (
            <Row>
                {hearts}
                <Button className="mt-4 w-50" variant="success" size="lg" onClick={this.rest}>Rest</Button>
            </Row>
        )
    }

    updatePlotPoints(num) {
        let newState = Object.assign({}, this.state);
        newState.derpPoints = this.state.derpPoints === num ? num - 1 : num;
        this.setState(newState);
        // this.updateState('plotPoints', this.charSource().plotPoints === num ? num - 1 : num);
    }

    plotPointsTrackerDisp() {
        const pp = [];
        for (let i = 0; i < 3; i++) {
            pp.push(
                <Col lg={2} md={3} xs={4} key={i} className="plot-point d-flex justify-content-center align-items-center" onClick={() => this.updatePlotPoints(i + 1)}>
                    <h1 key={i} id={`pp-${i + 1}`}
                    >
                        {this.state.derpPoints >= i + 1 ? "⦿" : "⦾"}
                    </h1>
                </Col>
            )
        }
        return (
            <Row>
                {pp}
            </Row>
        )
    }

    updateFeature(obj, index, reroll) {
        let newState = Object.assign({}, this.state);
        newState.features[index] = obj;
        if (reroll) newState.rerolls--;
        this.setState(newState);
    }

    updateInventory(newInv) {
        let newState = Object.assign({}, this.state);
        newState.inventory = newInv;
        this.setState(newState);
    }

    updateExperience(newExp) {
        let newState = Object.assign({}, this.state);
        newState.experience = newExp;
        this.setState(newState);
    }

    useReroll() {
        let newState = Object.assign({}, this.state);
        newState.rerolls--;
        this.setState(newState);
    }

    populateFeatures() {
        let features = [];
        for (let i = 0; i < this.state.features.length; i++) {
            if (this.state.features[i]) {
                switch (this.state.features[i].feature) {
                    case "Fighting Style":
                        features[i] = [<FeatureFightingStyle index={i} key={i} rerolls={this.state.rerolls} feature={this.state.features[i]} updateFeature={this.updateFeature} useReroll={this.useReroll} />]
                        break;
                    case "Magic Artifact":
                        features[i] = [<FeatureMagicArtifact index={i} key={i} rerolls={this.state.rerolls} feature={this.state.features[i]} updateFeature={this.updateFeature} useReroll={this.useReroll} />]
                        break;
                    case "Skill Mastery":
                        features[i] = [<FeatureSkillMastery index={i} key={i} rerolls={this.state.rerolls} feature={this.state.features[i]} updateFeature={this.updateFeature} useReroll={this.useReroll} />]
                        break;
                    case "Special Ancestry":
                        features[i] = [<FeatureSpecialAncestry index={i} key={i} rerolls={this.state.rerolls} feature={this.state.features[i]} updateFeature={this.updateFeature} useReroll={this.useReroll} />]
                        break;
                    case "Words of Power":
                        features[i] = [<FeatureWordsOfPower index={i} key={i} rerolls={this.state.rerolls} feature={this.state.features[i]} updateFeature={this.updateFeature} useReroll={this.useReroll} />]
                }
                if (this.state.features[i].upgrade) {
                    features[i].push(<Button block className="random-button" key={i} disabled={this.state.rerolls <= 0 && this.state.features[i]} variant="outline-warning" onClick={() => this.removeUpgrade(i)}>Reroll Upgrade as New Feature</Button>)
                } else {
                    features[i].push(<Button block className="random-button" key={i} disabled={this.state.rerolls <= 0 && this.state.features[i]} variant="outline-warning" onClick={() => this.randomize("feature_" + i)}>Reroll Character Feature</Button>)
                }
            } else {
                features[i] = <Button block className="random-button" key={i} disabled={this.state.rerolls <= 0 && this.state.features[i]} variant="outline-dark" onClick={() => this.randomize("feature_" + i)}>Roll Character Feature</Button>
            }
        }
        return features;
    }

    randomize(field) {
        let newState = Object.assign({}, this.state);
        const table = this.getTable(field);
        if (field.slice(0,7) === "feature") {
            const featureIndex = parseInt(field.slice(8));
            const newFeature = { feature: table[Math.floor(Math.random() * table.length)] }
            if (newState.features[featureIndex]) newState.rerolls--;
            if (newFeature.feature !== "Magic Artifact") {
                for (let i = 0; i < newState.features.length; i++) {
                    if (newState.features[i] && i !== featureIndex && newState.features[i].feature === newFeature.feature) {
                        newState.features[i].upgrade = {};
                        if (newState.features[featureIndex]) {
                            newState.rerolls--    
                        }
                        newState.features.splice(featureIndex, 1);
                        return this.setState(newState);
                    }
                }
            }
            newState.features[featureIndex] = newFeature;
        } else {
            newState[field] = table[Math.floor(Math.random() * table.length)];
            if (this.state[field]) {
                newState.rerolls--;
            }
        }
        this.setState(newState);
    }

    removeUpgrade(featureInd) {
        let newState = Object.assign({}, this.state);
        newState.features[featureInd].upgrade = null;
        if (newState.features[featureInd].ancestries) {
            newState.features[featureInd].ancestries = newState.features[featureInd].ancestries.slice(0,2);
        }
        newState.features.push(null);
        newState.rerolls--;
        this.setState(newState);
    }

    getTable(field) {
        switch (field) {
            case "background": return tables.BACKGROUNDS
            case "appearance": return tables.APPEARANCES
            case "derp": return tables.DERPS
            case "feature_0":
            case "feature_1": return tables.CHARACTER_FEATURES
            case "bonusSkill": return tables.CIVILIZED_SKILLS
            case "weapon":
                const weaponType = tables.WEAPON_TYPES[Math.floor(Math.random() * tables.WEAPONS.length)]
                return tables.WEAPONS[weaponType]
        }
    }

    levelUp() {
        let newState = Object.assign({}, this.state);
        newState.level++;
        newState.experience = 0;
        newState.health.max++;
        newState.health.current++;
        newState.features.push(null);
        newState.rerolls++;
        this.setState(newState);
    }

    render() {
        return (
            <Container className="bg-light">
                <Row className="justify-content-center">
                    <h1 className="text-center ged-color mb-0">GED:</h1>
                </Row>
                <Row className="justify-content-center">
                    <h1 className="text-center ged-color">Guild of Expendable Dungeoneers</h1>
                </Row>
                <Row className="justify-content-center">
                    {this.rerollTracker()}
                </Row>
                <Row id="main-section" ref={this.mainRef} className="mb-3">
                    <Form>
                    <Col xs={6} md={4} className="my-1">
                        <Form.Label className="grenze mb-0">Name</Form.Label>
                        <Form.Control type="text" name="name" id="name-input" onChange={this.handleChange} value={this.state.charName} />
                    </Col>
                    </Form>
                </Row>
                <Row>
                    <Col xs={12} md={4} className="my-1">
                        <div className="grenze mb-0">Background</div>
                        <div>{this.state.background}</div>
                        <Button className="random-button" disabled={this.state.rerolls <= 0 && this.state.background} variant={this.state.background ? "outline-warning" : "outline-dark"} onClick={() => this.randomize("background")}>{this.state.background ? "Reroll" : "Roll"}</Button>
                    </Col>
                    <Col xs={12} md={4} className="my-1">
                        <div className="grenze mb-0">Appearance</div>
                        <div>{this.state.appearance}</div>
                        <Button className="random-button" disabled={this.state.rerolls <= 0 && this.state.appearance} variant={this.state.appearance ? "outline-warning" : "outline-dark"} onClick={() => this.randomize("appearance")}>{this.state.appearance ? "Reroll" : "Roll"}</Button>
                    </Col>
                    <Col xs={12} md={4} className="my-1">
                        <div className="grenze mb-0">DERP</div>
                        <div>{this.state.derp}</div>
                        <Button className="random-button" disabled={this.state.rerolls <= 0 && this.state.derp} variant={this.state.derp ? "outline-warning" : "outline-dark"} onClick={() => this.randomize("derp")}>{this.state.derp ? "Reroll" : "Roll"}</Button>
                    </Col>
                </Row>
                <Row className="mb-5">
                    <Col xs={8}>
                        <Row>
                            <div className="grenze">Health</div>
                        </Row>
                        {this.healthTrackerDisp()}
                    </Col>
                    <Col xs={4}>
                        <Row>
                            <div className="grenze">Derp Points</div>
                        </Row>
                        {this.plotPointsTrackerDisp()}
                    </Col>
                </Row>
                <Row xs={12} className="justify-content-center w-100">
                    <h2>Character Features</h2>
                </Row>
                <Row>
                    <Accordion>
                        {this.populateFeatures()}
                    </Accordion>
                </Row>
                <Row>
                    <Skills features={this.state.features} bonusSkill={this.state.bonusSkill} randomizeSkill={this.randomize} rerolls={this.state.rerolls} useReroll={this.useReroll} />
                </Row>
                <Row>
                    <Inventory inventory={this.state.inventory} features={this.state.features} updateInventory={this.updateInventory} rerolls={this.state.rerolls} useReroll={this.useReroll} />
                </Row>
                <Row className="mb-5">
                    <Advancement experience={this.state.experience} level={this.state.level} updateExperience={this.updateExperience} levelUp={this.levelUp} />
                </Row>
            </Container>
        )
    }
}

export default CharSheet;