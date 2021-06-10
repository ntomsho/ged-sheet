import React from 'react';
import * as tables from './ged-tables';
import CharacterFeature from './character_feature';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class FeatureMagicArtifact extends CharacterFeature {
    titleComp() {
        return <>
            <h3>Magic Artifact</h3>
            <div>You have been chosen by a magic artifact that has bound itself and its power to you.</div>
        </>
    }

    // chargeComp(baseCharge) {
    //     if (!this.props.feature.charge || this.props.feature.charge.max !== baseCharge) {
    //         return this.setField("charge", { max: baseCharge, current: (this.props.feature.baseZeroCharge ? 0 : baseCharge)})
    //     }
    //     if (this.props.feature.charge.current !== undefined && this.props.feature.charge.max) {
    //         return <>
    //             <span className="grenze">Charge</span>
    //             <InputGroup>
    //                 <InputGroup.Prepend>
    //                     <Button disabled={this.props.feature.charge.current <= 0} variant="dark" onClick={() => this.updateCharge(false)}>-</Button>
    //                 </InputGroup.Prepend>
    //                 <InputGroup.Text className="grenze">{this.props.feature.charge.current}</InputGroup.Text>
    //                 <InputGroup.Append>
    //                     <Button disabled={this.props.feature.charge.current >= this.props.feature.charge.max} variant="light" onClick={() => this.updateCharge(true)}>+</Button>
    //                 </InputGroup.Append>
    //             </InputGroup>
    //         </>
    //     }
    // }

    // updateCharge(increment) {
    //     let newCharge = Object.assign({}, this.props.feature.charge);
    //     if (increment && this.props.feature.charge.current < this.props.feature.charge.max) {
    //         newCharge.current++;
    //     } else if (!increment && this.props.feature.charge.current > 0) {
    //         newCharge.current--;
    //     }
    //     this.setField("charge", newCharge);
    // }

    artifactComp(featureObj) {
        if (featureObj.boomerang) {
            if (!this.props.feature.weapon) {
                return <div>If this weapon is a melee weapon, it is a Boomerang Weapon. If this weapon is a ranged or thrown weapon, it is a Multishot Weapon.</div>
            } else if (tables.WEAPONS["Heavy Melee"].includes(this.props.feature.weapon) || tables.WEAPONS["Light Melee"].includes(this.props.feature.weapon)) {
                return this.artifactComp(featureObj.boomerang);
            } else {
                return this.artifactComp(featureObj.multishot);  
            }
        }
        return (
            <>
            <div>{featureObj.description}</div>
            <ul>
                {featureObj.traits.map((trait, i) => {
                    return <li key={i}>{trait}</li>
                })}
            </ul>
            </>
        )
    }

    rerollButtons() {
        let comps = [];
        if (this.props.feature.artifactType === "Magic Weapon") {
            comps.push(
                <>
                    <Button className="random-button" variant={this.props.feature.weapon ? "outline-warning" : "outline-dark"} disabled={this.props.rerolls <= 0 && this.props.feature.weapon} onClick={() => this.randomize("weapon")}>{this.props.feature.weapon ? "Reroll" : "Roll"} Weapon Type</Button>
                </>
            )
        }
        if (this.props.feature.artifactType) {
            comps.push(
                <Button className="random-button" variant={this.props.feature.artifact ? "outline-warning" : "outline-dark"} disabled={this.props.rerolls <= 0 && this.props.feature.artifact} onClick={() => this.randomize(this.props.feature.artifactType)}>{this.props.feature.artifact ? "Reroll" : "Roll"} Artifact</Button>
            )
        }
        comps.push(
            <Button className="random-button" variant={this.props.feature.artifactType ? "outline-warning" : "outline-dark"} disabled={this.props.rerolls <= 0 && this.props.feature.artifactType} onClick={() => this.randomize("artifactType")}>{this.props.feature.artifactType ? "Reroll" : "Roll"} Artifact Type</Button>
        )
        return comps;
    }
    
    featureComp() {
        let components = [];
        if (this.props.feature.artifactType && !this.props.feature.artifact) {
            return (<>
                <h3>{this.props.feature.artifactType}</h3>
                <div>{tables.ARTIFACT_TYPE_DESCRIPTIONS[this.props.feature.artifactType]}</div>
            </>)
        } else if (this.props.feature.artifact) {
            const featureObj = tables.MAGIC_ARTIFACT_INFO[this.props.feature.artifact];
            // components.push(
            //     <h3>{this.props.feature.artifact}</h3>,
            //     this.artifactComp(featureObj)
            // );

            if (featureObj.resource) {
                components.push(this.resourceComp(featureObj.resource));
            }

            if (featureObj.specials) {
                components.push(this.specialComp(featureObj.specials));
            }

            if (featureObj.specialRefresh) {
                components.push(this.specialRefreshComp(featureObj.specialRefresh));
            }
            
            if (featureObj.dropdown) {
                components.push(this.dropdownComp(featureObj.dropdown))
            }
            return (
                <div>
                    <div>
                        <h3 style={{textAlign: "center"}}>{this.props.feature.artifact}</h3>
                    </div>
                    <Row xs={1} sm={2}>
                        <Col>
                            {
                                this.props.feature.artifactType === "Magic Weapon" && this.props.feature.weapon ?
                                    <div><span className="grenze">Weapon Type:</span> <strong>{this.props.feature.weapon ? this.props.feature["weapon"] : ""}</strong></div>
                                    :
                                    <></>
                            }
                            {this.artifactComp(featureObj)}
                        </Col>
                        <Col>
                            {components}
                        </Col>
                    </Row>
                </div>
            )
        }
    }
}

export default FeatureMagicArtifact;