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
        this.setUpgrade = this.setUpgrade.bind(this);
        this.updateCustomSpecial = this.updateCustomSpecial.bind(this);
        this.updateSpecial = this.updateSpecial.bind(this)
        this.updateRefreshSpecial = this.updateRefreshSpecial.bind(this);
        this.specialComp = this.specialComp.bind(this);
        this.specialRefreshComp = this.specialRefreshComp.bind(this);
        this.refreshSpecial = this.refreshSpecial.bind(this);
    }

    randomize(field) {
        let newState = Object.assign({}, this.props.feature);
        const table = this.props.getTable(field);
        if (field === "Magic Garb" || field === "Magic Object" || field === "Magic Weapon") {
            field = "artifact";
        }
        while (newState[field] === this.props.feature[field]) {
            newState[field] = table[Math.floor(Math.random() * table.length)];
        }
        if (field === "artifactType") {
            newState = { feature: newState.feature, artifactType: newState.artifactType, upgrade: newState.upgrade }
        } else if (field === "artifact") {
            newState = { feature: newState.feature, artifactType: newState.artifactType, artifact: newState.artifact }
        } else if (field === "trainedSkill") {
            newState = { feature: newState.feature, trainedSkill: newState.trainedSkill, upgrade: newState.upgrade }   
        } else if (field === "mastery") {
            newState = { feature: newState.feature, trainedSkill: newState.trainedSkill, mastery: newState.mastery, upgrade: newState.upgrade }
        }
        this.props.updateFeature(newState, this.props.index, !!this.props.feature[field]);
    }

    setField(field, value) {
        let newState = Object.assign({}, this.props.feature);
        newState[field] = value;
        this.props.updateFeature(newState, this.props.index, false);
    }

    setUpgrade(field, value) {
        let newUpgrade = Object.assign({}, this.props.feature.upgrade);
        newUpgrade[field] = value;
        this.setField("upgrade", newUpgrade);
    }

    randomizeUpgrade(field, noDup) {
        let newState = Object.assign({}, this.props.feature);
        let newUpgrade = Object.assign({}, this.props.feature.upgrade);
        const table = this.props.getTable(field);
        while (newUpgrade[field] === this.props.feature.upgrade[field] || (noDup && newUpgrade[field] === this.props.feature[field])) {
            newUpgrade[field] = table[Math.floor(Math.random() * table.length)];
        }
        newState.upgrade = newUpgrade;
        this.props.updateFeature(newState, this.props.index, !!this.props.feature.upgrade[field]);
    }

    updateCustomSpecial(event, specialIndex, upgrade) {
        const newState = Object.assign({}, upgrade ? this.state.upgrade : this.state);
        newState[`customSpecial_${specialIndex}`] = event.target.value;
        this.setState(newState);
    }

    resourceComp(resource, upgrade) {
        const source = (upgrade ? this.props.feature.upgrade : this.props.feature);
        const setFunction = (upgrade ? this.setUpgrade : this.setField);
        if (!source.resource || source.resource.max !== resource.max) {
            let newResource = resource;
            newResource.current = resource.refreshAmt ? resource.refreshAmt : resource.max;
            return setFunction("resource", newResource);
        }
        return <>
            <div className="grenze">{resource.name}</div>
            <InputGroup>
                <InputGroup.Prepend>
                    <Button disabled={source.resource.current <= 0} variant="dark" onClick={() => this.updateResource(false, upgrade)}>-</Button>
                </InputGroup.Prepend>
                <InputGroup.Text className="grenze">{source.resource.current}</InputGroup.Text>
                <InputGroup.Append>
                    <Button disabled={source.resource.max && source.resource.current >= source.resource.max} variant="light" onClick={() => this.updateResource(true, upgrade)}>+</Button>
                </InputGroup.Append>
            </InputGroup>
            {resource.refreshOn === "resupply" ? 
                <Button variant="dark" onClick={() => this.updateResource(source.resource.max, upgrade)}>Resupply</Button>
                :
                <></>
            }
        </>
    }

    updateResource(increment, upgrade) {
        const source = (upgrade ? this.props.feature.upgrade : this.props.feature);
        const setFunction = (upgrade ? this.setUpgrade : this.setField);
        let newCurrent = source.resource;
        if (typeof increment === "number") {
            newCurrent.current = increment;
        } else if (!source.resource.max && increment) {
            newCurrent.current++;
        } else if (increment && source.resource.max && source.resource.current < source.resource.max) {
            newCurrent.current++;
        } else if (!increment && source.resource.current > 0) {
            newCurrent.current--;
        }
        setFunction("resource", newCurrent);
    }

    updateSpecial(specialType, index, specials, upgrade) {
        const source = (upgrade ? this.props.feature.upgrade : this.props.feature);
        const setFunction = (upgrade ? this.setUpgrade : this.setField);
        let newSpecials = Object.assign(new Array(specials.length), source.specials);
        const table = this.props.getTable(specialType);
        newSpecials[index] = table[Math.floor(Math.random() * table.length)];
        setFunction("specials", newSpecials);
    }

    updateRefreshSpecial(specialIndex, listIndex, value, upgrade) {
        const source = (upgrade ? this.props.feature.upgrade : this.props.feature);
        const setFunction = (upgrade ? this.setUpgrade : this.setField);
        let newSpecials = Object.assign([], source.currentSpecials);
        if (!newSpecials[specialIndex].specials) {
            newSpecials[specialIndex].specials = new Array(source.currentSpecials[specialIndex].number);
        }
        // else {
        //     newSpecials[specialIndex].specials = Object.assign([], source.currentSpecials[specialIndex].specials);
        // }
        if (value !== undefined) {
            newSpecials[specialIndex].specials[listIndex] = value;
        } else {
            const table = this.props.getTable(source.currentSpecials[specialIndex].specialType);
            newSpecials[specialIndex].specials[listIndex] = table[Math.floor(Math.random() * table.length)];
        }
        setFunction("currentSpecials", newSpecials);
    }

    specialComp(specials, upgrade) {
        const source = (upgrade ? this.props.feature.upgrade : this.props.feature);
        const setFunction = (upgrade ? this.setUpgrade : this.setField);
        if (!source.specials) {
            return setFunction("specials", new Array(specials.length));
        }
        let specialComps = [];
        specials.forEach((special, i) => {
            let thisComp = [];
            thisComp.push(
                <span className="grenze">{special}: </span>
            )
            if (source.specials[i]) {
                thisComp.push(<>
                    <span>{source.specials[i]}</span>
                </>)
            }
            thisComp.push(
                <Button className="random-button" variant={source.specials[i] ? "outline-warning" : "outline-dark"} disabled={this.props.rerolls <= 0 && source.specials[i]} onClick={() => this.updateSpecial(special, i, specials, upgrade)}>{source.specials[i] ? "Reroll" : "Roll"} {special}</Button>
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

    setFavoriteSpecial(specialIndex, favoriteIndex, specialRefreshObj, upgrade) {
        const source = (upgrade ? this.props.feature.upgrade : this.props.feature);
        const setFunction = (upgrade ? this.setUpgrade : this.setField);
        let newSpecials;
        if (source.currentSpecials) {
            newSpecials = Object.assign([], source.currentSpecials);
        } else {
            newSpecials = []
        }
        let options = Object.assign([], upgrade ? this.state.upgrade.favoriteSpecialOptions : this.state.favoriteSpecialOptions);
        const favorite = options.splice(favoriteIndex,1)[0];
        options.unshift(favorite);
        newSpecials[specialIndex] = {
            specials: options,
            favoriteSpecial: favorite,
            specialType: specialRefreshObj.specialType,
            refreshOn: specialRefreshObj.refreshOn
        }
        setFunction("currentSpecials", newSpecials);
    }

    populateFavoriteSpecialOptions(specialType, number, upgrade, reroll) {
        let options = [];
        for (let i = 0; i < number; i++) {
            const table = this.props.getTable(specialType);
            options.push(table[Math.floor(Math.random() * table.length)]);
        }
        let newState = Object.assign({}, this.state);
        if (upgrade) {
            newState.upgrade.favoriteSpecialOptions = options;
        } else {
            newState.favoriteSpecialOptions = options;
        }
        if (reroll) {
            this.props.useReroll();
        }
        this.setState(newState);
    }

    selectFavoriteSpecialComp(specialRefreshObj, index, upgrade) {
        const source = (upgrade ? this.state.upgrade : this.state);
        if (!source.favoriteSpecialOptions) {
            return (
                <Button className="random-button" variant="outline-dark" onClick={() => this.populateFavoriteSpecialOptions(specialRefreshObj.specialType, specialRefreshObj.number, upgrade)}>Roll Initial {specialRefreshObj.specialType}s</Button>
            )
        }
        let comps = [];
        for (let i = 0; i < source.favoriteSpecialOptions.length; i++) {
            comps.push(
                <Button variant="outline-success" onClick={() => this.setFavoriteSpecial(index, i, specialRefreshObj, upgrade)}>{source.favoriteSpecialOptions[i]}</Button>
            )
        }
        return (
            <>
            <div>Choose one to be your favorite {specialRefreshObj.specialType}</div>
            {comps}
            <Button className="random-button" variant="outline-warning" onClick={() => this.populateFavoriteSpecialOptions(specialRefreshObj.specialType, specialRefreshObj.number, upgrade, true)}>Reroll Initial {specialRefreshObj.specialType}s</Button>
            </>
        )
    }

    specialRefreshComp(specialRefresh, upgrade) {
        const source = (upgrade ? this.props.feature.upgrade : this.props.feature);
        const setFunction = (upgrade ? this.setUpgrade : this.setField);
        if (!source.currentSpecials) {
            let specialSelects = [];
            specialRefresh.forEach(special => {
                if (special.favoriteSpecial) {
                    specialSelects.push(special)
                }
            })
            if (specialSelects.length > 0) {
                return (<div>
                    {specialRefresh.map((special, i) => this.selectFavoriteSpecialComp(special, i, upgrade))}
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
                                    const table = this.props.getTable(special.specialType);
                                    newSpecials.push(table[Math.floor(Math.random() * table.length)]);
                                }
                            }
                            currentSpecials.push({
                                specialType: special.specialType,
                                specials: newSpecials,
                                refreshOn: special.refreshOn
                            });
                        });
                        setFunction("currentSpecials", currentSpecials);
                    }}>Set Specials</Button>
                )
            }
        }
        let specialComps = [];
        source.currentSpecials.forEach((special, i) => {
            let thisComp = [];
            for (let j = 0; j < special.specials.length; j++) {
                if (special.specials[j]) {
                    thisComp.push(
                    <InputGroup>
                        {this.specialDisplayComp(special.specialType, special.specials[j])}
                        {special.noReplacement ? 
                            <></>
                            :
                            <InputGroup.Append>
                                <Button variant={(j === 0 && special.favoriteSpecial ? "success" : "light")} onClick={() => this.updateRefreshSpecial(i,j,null,upgrade)}>X</Button>
                            </InputGroup.Append>
                        }
                    </InputGroup>)
                } else {
                    thisComp.push(
                    <>
                    <div key={j}>X</div>
                    {(j === 0 && specialRefresh[i].refreshFavorite) ?
                        <InputGroup.Append>
                            <Button variant="success" onClick={() => this.updateRefreshSpecial(i, j, special.favoriteSpecial, upgrade)}>Refresh</Button>
                        </InputGroup.Append>
                        :
                        <></>
                    }
                    </>
                    )
                }
            }
            thisComp.push(
                <Form>
                    <InputGroup>
                        {/* <InputGroup.Prepend><InputGroup.Text>Replace with Custom {special.specialType}</InputGroup.Text></InputGroup.Prepend> */}
                        <Form.Control type="text" value={this.state[`customSpecial_${i}`]} onChange={(e) => this.updateCustomSpecial(e, i, upgrade)} />
                        <InputGroup.Append><Button variant="info" onClick={() => this.addCustomSpecial(i,this.state[`customSpecial_${i}`], upgrade)}>Add custom {special.specialType}</Button></InputGroup.Append>
                    </InputGroup>
                </Form>
            );
            if (special.refreshOn === "resupply") {
                thisComp.push(
                    <Button variant="dark" onClick={() => this.refreshSpecial(specialRefresh, i, upgrade)}>Resupply</Button>
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

    refreshSpecial(currentSpecials, specialIndex, upgrade, returnValue) {
        let newSpecials = Object.assign([], currentSpecials);
        let refreshSpecials = [];
        if (currentSpecials[specialIndex].specialType === "Bases") {
            refreshSpecials = Object.assign([], tables.ALCHEMICAL_BASES);
        } else {
            for (let i = 0; i < currentSpecials[specialIndex].number; i++) {
                const table = this.props.getTable(currentSpecials[specialIndex].specialType);
                refreshSpecials.push(table[Math.floor(Math.random() * table.length)]);
            }
        }
        newSpecials[specialIndex].specials = refreshSpecials;
        if (returnValue) {
            return refreshSpecials;
        } else {
            upgrade ? this.setUpgrade("currentSpecials", newSpecials) : this.setField("currentSpecials", newSpecials);
        }
    }

    specialDisplayComp(specialType, special) {
        if (specialType === "Blessing") {
            const blessing = tables.BLESSINGS_INFO[special];
            return <Dropdown>
                <Dropdown.Toggle variant="light"><strong>{special} - {blessing.skill}</strong></Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item className="long-text-button">{blessing.description}</Dropdown.Item>
                    <Dropdown.Item className="long-text-button"><span className="grenze">Good Deed: </span>{blessing.goodDeed}</Dropdown.Item>
                    <Dropdown.Item className="long-text-button"><span className="grenze">Upgraded: </span>{blessing.upgrade}</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        } else if (specialType === "Song") {
            return <Dropdown>
                        <Dropdown.Toggle variant="light"><strong>{special}</strong></Dropdown.Toggle>
                        <Dropdown.Menu>
                        <Dropdown.Item className="long-text-button"><div>{tables.SONG_INFO[special]}</div></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
        } else {
            return <InputGroup.Text>{special}</InputGroup.Text>
        }
    }

    checkboxComp(title) {
        return (
            <InputGroup>
                <InputGroup.Prepend><InputGroup.Text>{title}</InputGroup.Text></InputGroup.Prepend>
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

    addCustomSpecial(specialIndex, customSpecial, upgrade) {
        let newSpecials = Object.assign([], upgrade ? this.props.feature.upgrade.currentSpecials : this.props.feature.currentSpecials);
        newSpecials[specialIndex].specials.push(customSpecial);
        upgrade ? this.setUpgrade("currentSpecials", newSpecials) : this.setField("currentSpecials", newSpecials);
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
                        {this.props.feature.upgrade ? 
                            <Button block className="random-button" disabled={this.props.rerolls <= 0} variant="outline-warning" onClick={this.props.removeUpgrade}>Reroll Upgrade as New Feature</Button>
                            :
                            <Button block className="random-button" disabled={this.props.rerolls <= 0} variant="outline-warning" onClick={this.props.rerollUpgrade}>Reroll Character Feature</Button>
                        }
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }
}

export default CharacterFeature;


