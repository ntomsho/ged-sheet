import React from 'react';
import * as tables from './ged-tables';
import NameComp from './name_comp';
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
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

class CharSheet extends React.Component {
    constructor (props) {
        super(props);
        if (window.location.hash) {
            this.state = JSON.parse(unescape(atob(window.location.hash.slice(1))));
        } else {
            this.state = {
                level: 1,
                rerolls: 10,
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
                    current: 0,
                    max: 0
                },
                derpPoints: 1,
                inventory: null,
                equippedArmor: null,
                conditions: [],
                dead: false
            }
        }
        this.rerollTracker = this.rerollTracker.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateHealth = this.updateHealth.bind(this);
        this.healthTrackerDisp = this.healthTrackerDisp.bind(this);
        this.updatePlotPoints = this.updatePlotPoints.bind(this);
        this.plotPointsTrackerDisp = this.plotPointsTrackerDisp.bind(this);
        this.updateFeature = this.updateFeature.bind(this);
        this.updateSkill = this.updateSkill.bind(this);
        this.updateInventory = this.updateInventory.bind(this);
        this.updateExperience = this.updateExperience.bind(this);
        this.populateFeatures = this.populateFeatures.bind(this);
        this.randomize = this.randomize.bind(this);
        this.getTable = this.getTable.bind(this);
        this.useReroll = this.useReroll.bind(this);
        this.rest = this.rest.bind(this);
        this.removeUpgrade = this.removeUpgrade.bind(this);
        this.levelUp = this.levelUp.bind(this);

        window.addEventListener("hashchange", () => this.setState(JSON.parse(unescape(atob(window.location.hash.slice(1))))));
    }

    saveState(newState) {
        const hash = btoa(escape(JSON.stringify(newState)));
        window.location.hash = hash;
        this.setState(newState);
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
        this.saveState(newState);
        // this.updateState(event.target.name, event.target.value);
    }

    rest() {
        let newState = Object.assign({}, this.state);
        let healthRestore = 1;
        //add something to get extra health restore from Aquatic, Plantimal, Fast Healer ancestries
        newState.features.forEach(feature => {
            if (feature === null) return;
            if (feature.resource && feature.resource.refreshOn === "rest") {
                feature.resource.current = feature.resource.refreshAmt ? feature.resource.refreshAmt : feature.resource.max;
            }
            if (feature.currentSpecials) {
                feature.currentSpecials.forEach((special) => {
                    if (special.refreshOn === "rest") {
                        special.specials = this.returnRefreshedSpecials(special.specialType, special.specials.length, special.favoriteSpecial);
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
        newState.health.current = (newState.health.current + healthRestore > newState.health.max ? newState.health.max : newState.health.current + healthRestore);
        this.saveState(newState);
    }

    calculateHealthAndArmor(newState) {
        let noHealth = false;
        let health = 6 + this.state.level;
        let armor = 0;
        if (newState.equippedArmor) {
            armor = newState.equippedArmor.armor;
        }
        // if (newState.inventory) {
        //     newState.inventory.forEach(item => {
        //         if (item.armor && item.worn) {
        //             armor = item.armor;
        //         }
        //     });
        // }
        newState.features.forEach(feature => {
            if (feature === null) return;
            const sources = [feature, feature.dropdownChoice, feature.upgrade];
            if (feature.ancestries) {
                sources.shift();
                feature.ancestries.forEach(ancestry => sources.push(tables.SPECIAL_ANCESTRY_INFO[ancestry.ancestry]))
            }
            if (feature.upgrade) sources.push(feature.upgrade.dropdownChoice);
            sources.forEach(source => {
                if (!source) return;
                if (source.noHealth) noHealth = true;
                if (source.maxHealth) health += source.maxHealth;
                if (source.armor) armor += source.armor;
            });
        });
        if (!newState.health) {
            newState.health = { current: noHealth ? 0 : health, max: noHealth ? 0 : health };
        } else {
            newState.health.max = noHealth ? 0 : health;
        }
        if (!newState.armor) {
            newState.armor = { current: armor, max: armor };
        } else {
            newState.armor.max = armor;
        }
        return newState;
    }

    returnRefreshedSpecials(specialType, num, favorite) {
        let specials = [];
        if (favorite) specials.push(favorite);
        for (let i = 0; i < num + (favorite ? -1 : 0); i++) {
            const table = this.getTable(specialType);
            specials.push(table[Math.floor(Math.random() * table.length)]);
        }
        return specials;
    }

    updateHealth(num) {
        let newState = Object.assign({}, this.state);
        if (num <= this.state.health.current) {
            if (newState.armor.current > 0) {
                newState.health.current = num;
                newState.armor.current = 0;
            } else {
                newState.health.current = this.state.health.current === num ? num - 1 : num;
            }
        } else {
            newState.health.current = num;
        }
        this.saveState(newState);
    }

    updateArmor(num) {
        let newState = Object.assign({}, this.state);
        newState.armor.current = this.state.armor.current === num ? num - 1 : num;
        this.saveState(newState);
    }

    healthTrackerDisp() {
        const hearts = [
            <Col xs={3} md={2} lg={1} key={0}>
                <Image
                    id="heart-0"
                    className="heart-container"
                    alt="0 Health"
                    fluid
                    // onClick={() => this.saveState({ deathModal: true })}
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
                        id={`armor-${i + 1}`}
                        key={i}
                        className="heart-container"
                        alt={`${i + 1} Armor`}
                        fluid
                        onClick={() => this.updateArmor(i + 1)}
                        src={this.state.armor.current >= i + 1 ?
                            "https://icons.iconarchive.com/icons/icons8/ios7/256/Network-Shield-icon.png" :
                            "https://icons.iconarchive.com/icons/icons8/windows-8/256/Security-Shield-icon.png"}
                    />
                </Col>
            )
        }
        return (
            <>
            <Row>
                {hearts}
            </Row>
            <Row>
                <Button className="mt-4 w-50" variant="success" size="lg" onClick={this.rest}>Rest</Button>
            </Row>
            </>
        )
    }

    updatePlotPoints(num) {
        let newState = Object.assign({}, this.state);
        newState.derpPoints = this.state.derpPoints === num ? num - 1 : num;
        this.saveState(newState);
        // this.updateState('plotPoints', this.charSource().plotPoints === num ? num - 1 : num);
    }

    plotPointsTrackerDisp() {
        //calculateDerpPoints()
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
        this.checkItemReqs(newState);
        this.checkSkillRepeat(newState);
        this.saveState(this.calculateHealthAndArmor(newState));
    }

    checkItemReqs(newState) {
        if (newState.inventory) {
            let artifacts = {};
            newState.features.forEach((feature, i) => {
                if (feature.artifact) {
                    artifacts[feature.artifact] = {index: i, present: false};
                }
            });
            if (Object.keys(artifacts).length === 0) return newState;
            for (let i = 0; i < newState.inventory.length; i++) {
                if (newState.inventory[i].featureReq) {
                    if (!Object.keys(artifacts).includes(newState.inventory[i].featureReq)) {
                        newState.inventory.splice(i, 1);
                        i--;
                    } else {
                        artifacts[newState.inventory[i].featureReq].present = true;
                    }
                }
            }
            Object.keys(artifacts).forEach(name => {
                if (artifacts[name].present === false) {
                    const feature = newState.features[artifacts[name].index];
                    let artifact;
                    if (feature.item) artifact = feature.item;
                    if (feature.upgrade && feature.upgrade.item) artifact = feature.upgrade;
                    if (feature.dropdownChoice && feature.dropdownChoice.item) artifact = feature.dropdownChoice.item;
                    if (artifact) {
                        artifact.featureReq = feature.artifact;
                        newState.inventory.push(artifact);
                    } else {
                        newState.inventory.push({ name: feature.artifact, itemType: "Artifact", featureReq: feature.artifact });
                    }
                }
            });
            return newState;
            // let artifacts = newState.features.map(feature => feature.artifact).filter(ele => !!ele);
            // newState.inventory = newState.inventory.filter(item => !item.featureReq || artifacts.includes(item.featureReq));
        }
    }

    checkSkillRepeat(newState) {
        newState.features.forEach(feature => {
            if (feature && feature.trainedSkill && feature.trainedSkill === newState.bonusSkill) {
                newState.bonusSkill = null;
            }
        });
        return newState;
    }

    updateSkill(skill) {
        let newState = Object.assign({}, this.state);
        newState.bonusSkill = skill;
        this.saveState(newState);
    }

    updateInventory(newInv, newArmor) {
        let newState = Object.assign({}, this.state);
        newState.inventory = newInv;
        if (newArmor) {
            newState.equippedArmor = newArmor;
        }
        this.saveState(this.calculateHealthAndArmor(newState));
    }

    updateExperience(newExp) {
        let newState = Object.assign({}, this.state);
        newState.experience = newExp;
        this.saveState(newState);
    }

    useReroll() {
        let newState = Object.assign({}, this.state);
        newState.rerolls--;
        this.saveState(newState);
    }

    populateFeatures() {
        let features = [];
        for (let i = 0; i < this.state.features.length; i++) {
            if (this.state.features[i]) {
                switch (this.state.features[i].feature) {
                    case "Fighting Style":
                        features[i] = [<FeatureFightingStyle index={i} key={i} rerolls={this.state.rerolls} feature={this.state.features[i]} getTable={this.getTable.bind(this)} updateFeature={this.updateFeature} removeUpgrade={() => this.removeUpgrade(i)} rerollFeature={() => this.randomize("feature_" + i)} useReroll={this.useReroll} />]
                        break;
                    case "Magic Artifact":
                        features[i] = [<FeatureMagicArtifact index={i} key={i} rerolls={this.state.rerolls} feature={this.state.features[i]} getTable={this.getTable.bind(this)} updateFeature={this.updateFeature} removeUpgrade={() => this.removeUpgrade(i)} rerollFeature={() => this.randomize("feature_" + i)} useReroll={this.useReroll} />]
                        break;
                    case "Skill Mastery":
                        features[i] = [<FeatureSkillMastery index={i} key={i} rerolls={this.state.rerolls} feature={this.state.features[i]} bonusSkill={this.state.bonusSkill} updateSkill={this.updateSkill} getTable={this.getTable.bind(this)} updateFeature={this.updateFeature} removeUpgrade={() => this.removeUpgrade(i)} rerollFeature={() => this.randomize("feature_" + i)} useReroll={this.useReroll} />]
                        break;
                    case "Special Ancestry":
                        features[i] = [<FeatureSpecialAncestry index={i} key={i} rerolls={this.state.rerolls} feature={this.state.features[i]} getTable={this.getTable.bind(this)} updateFeature={this.updateFeature} removeUpgrade={() => this.removeUpgrade(i)} rerollFeature={() => this.randomize("feature_" + i)} useReroll={this.useReroll} />]
                        break;
                    case "Words of Power":
                        features[i] = [<FeatureWordsOfPower index={i} key={i} rerolls={this.state.rerolls} feature={this.state.features[i]} getTable={this.getTable.bind(this)} updateFeature={this.updateFeature} removeUpgrade={() => this.removeUpgrade(i)} rerollFeature={() => this.randomize("feature_" + i)} useReroll={this.useReroll} />]
                }
            } else {
                features[i] = <Button block className="random-button" key={i} disabled={this.state.rerolls <= 0 && this.state.features[i]} getTable={this.getTable.bind(this)} variant="outline-dark" onClick={() => this.randomize("feature_" + i)}>Roll Character Feature</Button>
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
                        return this.saveState(newState);
                    }
                }
            }
            newState.features[featureIndex] = newFeature;
            this.checkItemReqs(newState);
        } else {
            newState[field] = table[Math.floor(Math.random() * table.length)];
            if (this.state[field]) {
                newState.rerolls--;
            }
        }
        this.saveState(newState);
    }

    removeUpgrade(featureInd) {
        let newState = Object.assign({}, this.state);
        newState.features[featureInd].upgrade = null;
        if (newState.features[featureInd].ancestries) {
            newState.features[featureInd].ancestries = newState.features[featureInd].ancestries.slice(0,2);
        }
        newState.features.push(null);
        newState.rerolls--;
        this.saveState(newState);
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
                const weaponType = tables.WEAPON_TYPES[Math.floor(Math.random() * tables.WEAPON_TYPES.length)]
                return tables.WEAPONS[weaponType]
            case "combatSkill": return tables.FIGHTING_SKILLS
            case "artifactType": return tables.MAGIC_ARTIFACTS
            case "Magic Garb": return tables.MAGIC_GARB
            case "Magic Object": return tables.MAGIC_OBJECTS
            case "Magic Weapon": return tables.MAGIC_WEAPONS
            case "trainedSkill": return tables.CIVILIZED_SKILLS
            case "skillMastery": return tables.SKILL_MASTERIES
            case "ancestry": return tables.SPECIAL_ANCESTRIES
            case "weapon":
                return tables.WEAPONS[tables.WEAPON_TYPES[Math.floor(Math.random() * tables.WEAPON_TYPES.length)]]
            case "Background": return tables.BACKGROUNDS
            case "Blessing": return tables.BLESSINGS_OF_TUSHUZE
            case "Element": return tables.ELEMENTS
            case "Element Adjective": return tables.ELEMENT_ADJECTIVES
            case "Form": return tables.FORMS
            case "Verb": return tables.VERBS
            case "Animal":
                return tables.ANIMALS[tables.ANIMAL_TYPES[Math.floor(Math.random() * tables.ANIMAL_TYPES.length)]]
            case "Knowledge": return tables.KNOWLEDGES
            case "Derp": return tables.DERPS
            case "Song": return tables.SONGS
            case "Rogue Trick": return tables.ROGUE_TRICKS
            case "Ammo":
            case "Rune":
            case "Catalyst": return (Math.random() < 0.5 ? tables.ELEMENTS : tables.VERBS)
            case "Word":
                return this.getTable(tables.WORDS_OF_POWER[Math.floor(Math.random() * tables.WORDS_OF_POWER.length)])
            case "item":
                return tables.EQUIPMENT
        }
    }

    levelUp() {
        let newState = Object.assign({}, this.state);
        newState.level++;
        newState.experience = 0;
        newState.features.push(null);
        newState.rerolls++;
        this.saveState(newState);
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
                <Row>
                    <div>This sheet saves your character state in the URL. To save your character, copy or bookmark the URL and come back to it to pick up where you left off.</div>
                </Row>
                <Row className="justify-content-center">
                    {this.rerollTracker()}
                </Row>
                <Row id="main-section" ref={this.mainRef} className="mb-3">
                    <NameComp charName={this.state.charName} handleChange={this.handleChange} />
                </Row>
                <Row>
                    <Col xs={4} className="my-1">
                        <div className="grenze mb-0">Background</div>
                        <div>{this.state.background}</div>
                        <Button className="random-button" disabled={this.state.rerolls <= 0 && this.state.background} variant={this.state.background ? "outline-warning" : "outline-dark"} onClick={() => this.randomize("background")}>{this.state.background ? "Reroll" : "Roll"}</Button>
                    </Col>
                    <Col xs={4} className="my-1">
                        <div className="grenze mb-0">Appearance</div>
                        <div>{this.state.appearance}</div>
                        <Button className="random-button" disabled={this.state.rerolls <= 0 && this.state.appearance} variant={this.state.appearance ? "outline-warning" : "outline-dark"} onClick={() => this.randomize("appearance")}>{this.state.appearance ? "Reroll" : "Roll"}</Button>
                    </Col>
                    <Col xs={4} className="my-1">
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
                    <div className="grenze">Tap Features to expand</div>
                </Row>
                <Row className="mb-5">
                    <Accordion>
                        {this.populateFeatures()}
                    </Accordion>
                </Row>
                <Row>
                    <Skills features={this.state.features} bonusSkill={this.state.bonusSkill} updateSkill={this.updateSkill} rerolls={this.state.rerolls} useReroll={this.useReroll} />
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