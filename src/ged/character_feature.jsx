import React, { useState } from 'react';
import * as tables from './ged-tables';
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Dropdown } from 'react-bootstrap';

class CharacterFeature extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.randomize = this.randomize.bind(this);
        this.setField = this.setField.bind(this);
        this.getTable = this.getTable.bind(this);
        this.updateCustomSpecial = this.updateCustomSpecial.bind(this);
        this.updateSpecial = this.updateSpecial.bind(this)
        this.updateRefreshSpecial = this.updateRefreshSpecial.bind(this);
        this.specialComp = this.specialComp.bind(this);
        this.specialRefreshComp = this.specialRefreshComp.bind(this);
        this.refreshSpecial = this.refreshSpecial.bind(this);

        //
            //To-Do:
                //+ handle upgrades
        //
    }

    randomize(field) {
        let newState = Object.assign({}, this.props.feature);
        const table = this.getTable(field);
        while (newState[field] === this.props.feature[field]) {
            newState[field] = table[Math.floor(Math.random() * table.length)];
        }
        if (field === "artifactType") {
            newState = { feature: newState.feature, artifactType: newState.artifactType }
        } else if (field === "artifact") {
            newState = { feature: newState.feature, artifactType: newState.artifactType, artifact: newState.artifact }
        } else if (field === "trainedSkill") {
            newState = { feature: newState.feature, trainedSkill: newState.trainedSkill }   
        } else if (field === "mastery") {
            newState = { feature: newState.feature, trainedSkill: newState.trainedSkill, mastery: newState.mastery }
        }
        this.props.updateFeature(newState, this.props.index, !!this.props.feature[field]);
    }

    setField(field, value) {
        let newState = Object.assign({}, this.props.feature);
        newState[field] = value;
        this.props.updateFeature(newState, this.props.index, false);
    }

    getTable(field) {
        switch (field) {
            case "combatSkill": return tables.FIGHTING_SKILLS
            case "artifactType": return tables.MAGIC_ARTIFACTS
            case "artifact":
                if (this.props.feature.artifactType === "Magic Garb") return tables.MAGIC_GARB
                if (this.props.feature.artifactType === "Magic Object") return tables.MAGIC_OBJECTS
                else return tables.MAGIC_WEAPONS
            case "trainedSkill": return tables.CIVILIZED_SKILLS
            case "skillMastery": return tables.SKILL_MASTERIES
            case "ancestry": return tables.SPECIAL_ANCESTRIES
            case "weapon":
                return tables.WEAPONS[tables.WEAPON_TYPES[Math.floor(Math.random() * tables.WEAPON_TYPES.length)]]
            case "Background": return tables.BACKGROUNDS
            case "Blessing": return tables.BLESSINGS_OF_TUSHUZE
            case "Element": return tables.ELEMENTS
            case "Form": return tables.FORMS
            case "Verb": return tables.VERBS
            case "Animal":
                return tables.ANIMALS[tables.ANIMAL_TYPES[Math.floor(Math.random() * tables.ANIMAL_TYPES.length)]]
            case "Knowledge": return tables.KNOWLEDGES
            case "Derp": return tables.DERPS
            case "Song": return tables.SONGS
            case "Rune":
            case "Catalyst": return (Math.random() < 0.5 ? tables.ELEMENTS : tables.VERBS)
            case "Word":
                return this.getTable(tables.WORDS_OF_POWER[Math.floor(Math.random() * tables.WORDS_OF_POWER.length)])
            case "item":
                return tables.EQUIPMENT
        }
    }

    updateCustomSpecial(event, specialIndex) {
        const newState = Object.assign({}, this.state);
        newState[`customSpecial_${specialIndex}`] = event.target.value;
        this.setState(newState);
    }

    resourceComp(resource) {
        if (!this.props.feature.resource || this.props.feature.resource.max !== resource.max) {
            let newResource = resource;
            newResource.current = resource.refreshAmt ? resource.refreshAmt : resource.max;
            return this.setField("resource", newResource);
        }
        return <>
            <div className="grenze">{resource.name}</div>
            <InputGroup>
                <InputGroup.Prepend>
                    <Button disabled={this.props.feature.resource.current <= 0} variant="dark" onClick={() => this.updateResource(false)}>-</Button>
                </InputGroup.Prepend>
                <InputGroup.Text className="grenze">{this.props.feature.resource.current}</InputGroup.Text>
                <InputGroup.Append>
                    <Button disabled={this.props.feature.resource.max && this.props.feature.resource.current >= this.props.feature.resource.max} variant="light" onClick={() => this.updateResource(true)}>+</Button>
                </InputGroup.Append>
            </InputGroup>
        </>
    }

    updateResource(increment) {
        let newCurrent = this.props.feature.resource;
        if (!this.props.feature.resource.max && increment) {
            newCurrent.current++;
        } else if (increment && this.props.feature.resource.max && this.props.feature.resource.current < this.props.feature.resource.max) {
            newCurrent.current++;
        } else if (!increment && this.props.feature.resource.current > 0) {
            newCurrent.current--;
        }
        this.setField("resource", newCurrent);
    }

    updateSpecial(specialType, index, specials) {
        let newSpecials = Object.assign(new Array(specials.length), this.props.feature.specials);
        const table = this.getTable(specialType);
        newSpecials[index] = table[Math.floor(Math.random() * table.length)];
        this.setField("specials", newSpecials);
    }

    updateRefreshSpecial(specialIndex, listIndex, value) {
        let newSpecials = Object.assign([], this.props.feature.currentSpecials);
        if (!newSpecials[specialIndex].specials) {
            newSpecials[specialIndex].specials = new Array(this.props.feature.currentSpecials[specialIndex].number);
        }
        // else {
        //     newSpecials[specialIndex].specials = Object.assign([], this.props.feature.currentSpecials[specialIndex].specials);
        // }
        if (value !== undefined) {
            newSpecials[specialIndex].specials[listIndex] = value;
        } else {
            const table = this.getTable(this.props.feature.currentSpecials[specialIndex].specialType);
            newSpecials[specialIndex].specials[listIndex] = table[Math.floor(Math.random() * table.length)];
        }
        this.setField("currentSpecials", newSpecials);
    }

    specialComp(specials) {
        if (!this.props.feature.specials) {
            return this.setField("specials", new Array(specials.length));
        }
        let specialComps = [];
        specials.forEach((special, i) => {
            let thisComp = [];
            thisComp.push(
                <span className="grenze">{special.specialType}: </span>
            )
            if (this.props.feature.specials[i]) {
                thisComp.push(<>
                    <span>{this.props.feature.specials[i]}</span>
                </>)
            }
            thisComp.push(
                <Button className="random-button" variant={this.props.feature.specials[i] ? "outline-warning" : "outline-dark"} disabled={this.props.rerolls <= 0 && this.props.feature.specials[i]} onClick={() => this.updateSpecial(special, i, specials)}>{this.props.feature.specials[i] ? "Reroll" : "Roll"} {special}</Button>
            )
            specialComps.push(
                <li key={i}>
                    {thisComp}
                </li>);
        });
        return (
            <ul>
                {specialComps}
            </ul>
        );
    }

    setFavoriteSpecial(specialIndex, favoriteIndex, specialRefreshObj) {
        let newSpecials;
        if (this.props.feature.currentSpecials) {
            newSpecials = Object.assign([], this.props.feature.currentSpecials);
        } else {
            newSpecials = []
        }
        let options = Object.assign([], this.state.favoriteSpecialOptions);
        const favorite = options.splice(favoriteIndex,1)[0];
        options.unshift(favorite);
        newSpecials[specialIndex] = {
            specials: options,
            favoriteSpecial: favorite,
            specialType: specialRefreshObj.specialType,
            refreshOn: specialRefreshObj.refreshOn
        }
        this.setField("currentSpecials", newSpecials);
    }

    populateFavoriteSpecialOptions(specialType, number, reroll) {
        let options = [];
        for (let i = 0; i < number; i++) {
            const table = this.getTable(specialType);
            options.push(table[Math.floor(Math.random() * table.length)]);
        }
        let newState = Object.assign({}, this.state);
        newState.favoriteSpecialOptions = options;
        if (reroll) {
            this.props.useReroll();
        }
        this.setState(newState);
    }

    selectFavoriteSpecialComp(specialRefreshObj, index) {
        if (!this.state.favoriteSpecialOptions) {
            return (
                <Button className="random-button" variant="outline-dark" onClick={() => this.populateFavoriteSpecialOptions(specialRefreshObj.specialType, specialRefreshObj.number)}>Roll Initial {specialRefreshObj.specialType}s</Button>
            )
        }
        let comps = [];
        for (let i = 0; i < this.state.favoriteSpecialOptions.length; i++) {
            comps.push(
                <Button variant="outline-success" onClick={() => this.setFavoriteSpecial(index, i, specialRefreshObj)}>{this.state.favoriteSpecialOptions[i]}</Button>
            )
        }
        return (
            <>
            <div>Choose one to be your favorite {specialRefreshObj.specialType}</div>
            {comps}
            <Button className="random-button" variant="outline-warning" onClick={() => this.populateFavoriteSpecialOptions(specialRefreshObj.specialType, specialRefreshObj.number, true)}>Reroll Initial {specialRefreshObj.specialType}s</Button>
            </>
        )
    }

    specialRefreshComp(specialRefresh) {
        if (!this.props.feature.currentSpecials) {
            let specialSelects = [];
            specialRefresh.forEach(special => {
                if (special.favoriteSpecial) {
                    specialSelects.push(special)
                }
            })
            if (specialSelects.length > 0) {
                return (<div>
                    {specialRefresh.map((special, i) => this.selectFavoriteSpecialComp(special, i))}
                </div>)
            } else {
                return (
                    <Button variant="dark" onClick={() => {
                        let currentSpecials = [];
                        specialRefresh.forEach(special => {
                            let newSpecials = [];
                            if (special.specialType === "Base") {
                                newSpecials = tables.ALCHEMICAL_BASES;
                            } else {
                                for (let i = 0; i < special.number; i++) {
                                    const table = this.getTable(special.specialType);
                                    newSpecials.push(table[Math.floor(Math.random() * table.length)]);
                                }
                            }
                            currentSpecials.push({
                                specialType: special.specialType,
                                specials: newSpecials,
                                refreshOn: special.refreshOn
                            });
                        });
                        this.setField("currentSpecials", currentSpecials);
                    }}>Set Specials</Button>
                )
            }
        }
        let specialComps = [];
        this.props.feature.currentSpecials.forEach((special, i) => {
            let thisComp = [];
            for (let j = 0; j < special.specials.length; j++) {
                if (special.specials[j]) {
                    thisComp.push(
                    <InputGroup>
                        <InputGroup.Text>{special.specials[j]}</InputGroup.Text>
                        {special.noReplacement ? 
                            <></>
                            :
                            <InputGroup.Append>
                                <Button variant={(j === 0 && special.favoriteSpecial ? "success" : "light")} onClick={() => this.updateRefreshSpecial(i,j,null)}>X</Button>
                            </InputGroup.Append>
                        }
                    </InputGroup>)
                } else {
                    thisComp.push(<div key={j}>X</div>)
                }
            }
            thisComp.push(
                <Form>
                    <InputGroup>
                        {/* <InputGroup.Prepend><InputGroup.Text>Replace with Custom {special.specialType}</InputGroup.Text></InputGroup.Prepend> */}
                        <Form.Control type="text" value={this.state[`customSpecial_${i}`]} onChange={(e) => this.updateCustomSpecial(e, i)} />
                        <InputGroup.Append><Button variant="info" onClick={() => this.addCustomSpecial(i,this.state[`customSpecial_${i}`])}>Add custom {special.specialType}</Button></InputGroup.Append>
                    </InputGroup>
                </Form>
            );
            if (special.refreshOn === "resupply") {
                thisComp.push(
                    <Button variant="dark" onClick={() => this.refreshSpecial(specialRefresh, i)}>Resupply</Button>
                )
            }
            specialComps.push(
                <div key={i}>
                    {thisComp}
                </div>
            );
        });
        return specialComps;
    }

    refreshSpecial(currentSpecials, specialIndex, returnValue) {
        let newSpecials = Object.assign([], currentSpecials);
        let refreshSpecials = [];
        if (currentSpecials[specialIndex].specialType === "Bases") {
            refreshSpecials = Object.assign([], tables.ALCHEMICAL_BASES);
        } else {
            for (let i = 0; i < currentSpecials[specialIndex].number; i++) {
                const table = this.getTable(currentSpecials[specialIndex].specialType);
                refreshSpecials.push(table[Math.floor(Math.random() * table.length)]);
            }
        }
        newSpecials[specialIndex].specials = refreshSpecials;
        if (returnValue) {
            return refreshSpecials;
        } else {
            this.setField("currentSpecials", newSpecials);
        }
    }

    checkboxComp(title) {
        return (
            <InputGroup>
                <InputGroup.Prepend>{title}</InputGroup.Prepend>
                <InputGroup.Checkbox aria-label />
            </InputGroup>
        )
    }

    dropdownComp(dropdown) {
        let dropdownChoiceName;
        if (this.props.feature.dropdownChoice) {
            dropdownChoiceName = this.props.feature.dropdownChoice.option;
        }
        return (<>
            <div>{dropdown.title}</div>
            <Dropdown>
                <Dropdown.Toggle className="long-text-button" variant="light">{dropdownChoiceName ? dropdownChoiceName : "Choose one"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {dropdown.options.map((choice, i) => <Dropdown.Item key={i} as="button" className="long-text-button" onClick={() => this.setField("dropdownChoice", choice)}>{choice.option}</Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
        </>)
    }

    addCustomSpecial(specialIndex, customSpecial) {
        let newSpecials = Object.assign([], this.props.feature.currentSpecials);
        newSpecials[specialIndex].specials.push(customSpecial);
        this.setField("currentSpecials", newSpecials);
    }
    
    render() {
        return (
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="light" className="w-100 grenze" eventKey={this.props.index + 1}>
                        {this.titleComp()}
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={this.props.index + 1}>
                    <Card.Body>
                        {this.featureComp()}
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }
}

export default CharacterFeature;


