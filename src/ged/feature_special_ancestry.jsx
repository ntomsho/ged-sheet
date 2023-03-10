import React from 'react';
import * as tables from './ged-tables';
import CharacterFeature from './character_feature';
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup'

class FeatureSpecialAncestry extends CharacterFeature {
    setField(field, value, ancestryIndex) {
        let newState = Object.assign({}, this.props.feature);
        if (field === "ancestries") {
            newState.ancestries = value;
        } else {
            newState.ancestries[ancestryIndex][field] = value;
        }
        this.props.updateFeature(newState, this.props.index, false);
    }

    addAncestrySlots(num) {
        let newFeature = Object.assign({}, this.props.feature);
        newFeature.upgrade.ancestries = [];
        for (let i = 0; i < num; i++) {
            let newAnc = {ancestry: null}
            newFeature.ancestries.push(newAnc);
            newFeature.upgrade.ancestries.push(newAnc);
        }
        this.props.updateFeature(newFeature, this.props.index, false);
    }
    
    titleComp() {
        return <>
            <h3>Special Ancestry{this.props.feature.upgrade ? " 🌟" : ""}</h3>
            <div>You are born of a non-human people and have special qualities from your heritage.</div>
        </>
    }

    randomizeAncestries(index) {
        const table = this.props.getTable("ancestry");
        let newAncestries;
        if (index !== undefined) {
            newAncestries = Object.assign([], this.props.feature.ancestries);
            if (newAncestries[index]) {
                this.props.useReroll();
                newAncestries[index] = {ancestry: null};
            }
            let newAncestry = table[Math.floor(Math.random() * table.length)];
            while (newAncestries.some(anc => anc.ancestry === newAncestry)) {
                newAncestry = table[Math.floor(Math.random() * table.length)];
            }
            // newAncestries[index] = Object.assign({ancestry: newAncestry}, tables.SPECIAL_ANCESTRY_INFO[newAncestry]);
            newAncestries[index] = { ancestry: newAncestry };
        } else {
            newAncestries = [];
            newAncestries.push(table[Math.floor(Math.random() * table.length)]);
            let ancestry2 = table[Math.floor(Math.random() * table.length)];
            while (newAncestries[0] === ancestry2) {
                ancestry2 = table[Math.floor(Math.random() * table.length)];
            }
            newAncestries.push(ancestry2);
            // newAncestries = newAncestries.map(ancestry => Object.assign({ancestry}, tables.SPECIAL_ANCESTRY_INFO[ancestry]));
            newAncestries = newAncestries.map(ancestry => {
                return { ancestry }
            });
        }
        this.setField("ancestries", newAncestries, index);
    }

    resourceComp(resource, ancestryIndex) {
        const ancestry = this.props.feature.ancestries[ancestryIndex];
        if (!ancestry.resource || ancestry.resource.max !== resource.max) {
            let newResource = resource;
            newResource.current = resource.refreshAmt ? resource.refreshAmt : resource.max;
            return this.setField("resource", newResource, ancestryIndex);
        }
        return <>
            <div className="grenze">{resource.name}</div>
            <InputGroup>
                <InputGroup.Prepend>
                    <Button disabled={ancestry.resource.current <= 0} variant="dark" onClick={() => this.updateResource(false, ancestryIndex)}>-</Button>
                </InputGroup.Prepend>
                <InputGroup.Text className="grenze">{ancestry.resource.current}</InputGroup.Text>
                <InputGroup.Append>
                    <Button disabled={ancestry.resource.max && ancestry.resource.current >= ancestry.resource.max} variant="light" onClick={() => this.updateResource(true, ancestryIndex)}>+</Button>
                </InputGroup.Append>
            </InputGroup>
        </>
    }

    updateResource(increment, ancestryIndex) {
        const ancestry = this.props.feature.ancestries[ancestryIndex];
        let newCurrent = ancestry.resource;
        if (!ancestry.resource.max && increment) {
            newCurrent.current++;
        } else if (increment && ancestry.resource.max && ancestry.resource.current < ancestry.resource.max) {
            newCurrent.current++;
        } else if (!increment && ancestry.resource.current > 0) {
            newCurrent.current--;
        }
        this.setField("resource", newCurrent, ancestryIndex);
    }

    updateSpecial(specialType, index, specials, ancestryIndex) {
        let newSpecials = Object.assign(new Array(specials.length), this.props.feature.ancestries[ancestryIndex].specials);
        const table = this.props.getTable(specialType);
        newSpecials[index] = table[Math.floor(Math.random() * table.length)];
        this.setField("specials", newSpecials, ancestryIndex);
    }

    specialComp(specials, ancestryIndex) {
        const ancestry = this.props.feature.ancestries[ancestryIndex];
        if (!ancestry.specials) {
            return this.setField("specials", new Array(specials.length), ancestryIndex);
        }
        let specialComps = [];
        specials.forEach((special, i) => {
            let thisComp = [];
            thisComp.push(
                <span className="grenze">{special}: </span>
            )
            if (ancestry.specials[i]) {
                thisComp.push(<>
                    <span>{ancestry.specials[i]}</span>
                </>)
            }
            thisComp.push(
                <Button className="random-button" variant={ancestry.specials[i] ? "outline-warning" : "outline-dark"} disabled={this.props.rerolls <= 0 && ancestry.specials[i]} onClick={() => this.updateSpecial(special, i, specials, ancestryIndex)}>{ancestry.specials[i] ? "Reroll" : "Roll"} {special}</Button>
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

    dropdownComp(dropdown, ancestryIndex) {
        const ancestry = this.props.feature.ancestries[ancestryIndex];
        let dropdownChoiceName;
        if (ancestry.dropdownChoice) {
            dropdownChoiceName = ancestry.dropdownChoice.option;
        }
        return (<>
            <div>{dropdown.title}</div>
            <Dropdown>
                <Dropdown.Toggle className="long-text-button" variant="light">{dropdownChoiceName ? dropdownChoiceName : "Choose one"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {dropdown.options.map((choice, i) => <Dropdown.Item key={i} as="button" className="long-text-button" onClick={() => this.setField("dropdownChoice", choice, ancestryIndex)}>{choice.option}</Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
        </>)
    }

    ancestryComp(ancestry, index) {
        if (!ancestry.ancestry) {
            return (
                <Button className= "random-button" variant="outline-dark" onClick={() => this.randomizeAncestries(index)}>Roll Ancestry</Button >
            )
        }
        const ancestryInfo = tables.SPECIAL_ANCESTRY_INFO[ancestry.ancestry];
        let comps = [];
        if (ancestryInfo.resource) {
            comps.push(this.resourceComp(ancestryInfo.resource, index));
        }
        if (ancestryInfo.specials) {
            comps.push(this.specialComp(ancestryInfo.specials, index));
        }
        if (ancestryInfo.checkbox) {
            comps.push(this.checkboxComp(ancestryInfo.checkbox, index));
        }
        if (ancestryInfo.dropdown) {
            comps.push(this.dropdownComp(ancestryInfo.dropdown, index));
        }
        return (
            <>
            <Row>
                <h3>{ancestry.ancestry}</h3>
            </Row>
            <Row xs={1} sm={comps.length > 0 ? 2 : 1} key={index}>
                <Col>
                    <div>{ancestryInfo.description}</div>
                </Col>
                {comps.length > 0 ?
                    <Col>{comps}</Col> :
                    <></>
                }
            </Row>
            <Row>
                <Button className="random-button w-50 mt-3" variant="outline-warning" onClick={() => this.randomizeAncestries(index)}>Reroll Ancestry</Button >
            </Row>
            </>
        )
    }

    featureComp() {
        if (!this.props.feature.ancestries) {
            return <>
                <Button className="random-button" variant="outline-dark" onClick={() => this.randomizeAncestries()}>Roll Ancestries</Button>
            </>
        } else {
            let comps = [];
            if (this.props.feature.upgrade && !this.props.feature.upgrade.ancestries) {
                comps.push(<Button className="random-button" variant="outline-dark" onClick={() => this.addAncestrySlots(2)}>Upgrade: Add new Ancestry slots</Button>)
            }
            comps = comps.concat(this.props.feature.ancestries.map((ancestry, i) => this.ancestryComp(ancestry, i)));
            const ancestriesLength = comps.length;
            for (let i = 0; i < ancestriesLength - 1; i++) {
                comps.splice(i * 2 + 1, 0, <div style={{width: "100%", height: "2px", border: "1px solid black", margin: "1vw 0"}} />)
            }
            return comps;
        }
    }
}

export default FeatureSpecialAncestry;