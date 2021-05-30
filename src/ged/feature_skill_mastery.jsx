import React, { useState } from 'react';
import * as tables from './ged-tables';
import CharacterFeature from './character_feature';
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';

class FeatureSkillMastery extends CharacterFeature {
    titleComp() {
        return <>
            <h3>Skill Mastery</h3>
            <div>You have mastered one of the six Civilized Skills, gaining special abilities related to it.</div>
        </>
    }

    masteryComp(mastery) {
        return (
            <>
            <div className="grenze">{this.props.feature.mastery}</div>
            <div>{mastery.description}</div>
            <ul>
                {mastery.traits.map((trait, i) => {
                    return <li key={i}>{trait}</li>
                })}
            </ul>
            </>
        )
    }

    featureComp() {
        if (!this.props.feature.trainedSkill) {
            return <>
                <Button className="random-button" disabled={this.props.rerolls <= 0 && this.props.feature.trainedSkill} variant="outline-dark" onClick={() => this.randomize("trainedSkill")}>Roll Trained Skill</Button>
            </>
        } else {
            let components = [];
            if (this.props.feature.mastery) {
                const mastery = tables.SKILL_MASTERIES[this.props.feature.trainedSkill][this.props.feature.mastery];
                components.push(this.masteryComp(mastery));
                if (mastery.resource) {
                    components.push(this.resourceComp(mastery.resource));
                }
                if (mastery.specials) {
                    components.push(this.specialComp(mastery.specials));
                }
                if (mastery.specialRefresh) {
                    components.push(this.specialRefreshComp(mastery.specialRefresh));
                }
            }

            return (
                <>
                    <h3>{this.props.feature.trainedSkill}</h3>
                    {components}
                    <Dropdown>
                        <Dropdown.Toggle variant="light">{this.props.feature.mastery ? this.props.feature.mastery : "Choose a Mastery from your Trained Skill"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Object.keys(tables.SKILL_MASTERIES[this.props.feature.trainedSkill]).map((mastery, i) => {
                                return (
                                    <Dropdown.Item key={i} as="button" className="long-text-button" onClick={() => this.setField("mastery", mastery)}>{mastery} - {tables.SKILL_MASTERIES[this.props.feature.trainedSkill][mastery].description}</Dropdown.Item>
                                )
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button className="random-button" disabled={this.props.rerolls <= 0 && this.props.feature.trainedSkill} variant="outline-warning" onClick={() => this.randomize("trainedSkill")}>Reroll Trained Skill</Button>
                </>
            )
        }
    }
}

export default FeatureSkillMastery;