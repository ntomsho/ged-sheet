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
            <h3>Skill Mastery{this.props.feature.upgrade ? " 🌟" : ""}</h3>
            <div>You have mastered one of the six Civilized Skills, gaining special abilities related to it.</div>
        </>
    }

    masteryComp(mastery, upgrade) {
        let components = [];
        components.push(
            <>
            <h3>{upgrade ? this.props.feature.upgrade.mastery : this.props.feature.mastery}</h3>
            <div>{mastery.description}</div>
            <ul>
                {mastery.traits.map((trait, i) => {
                    return <li key={i}>{trait}</li>
                })}
            </ul>
            </>
        );
        if (mastery.upgradeText) {
            components.push(<div><strong>Upgrade: </strong>{mastery.upgradeText}</div>)
        }
        if (mastery.checkbox) {
            components.push(this.checkboxComp(mastery.checkbox));
        }
        if (mastery.resource) {
            components.push(this.resourceComp(mastery.resource), upgrade);
        }
        if (mastery.specials) {
            components.push(this.specialComp(mastery.specials), upgrade);
        }
        if (mastery.specialRefresh) {
            components.push(this.specialRefreshComp(mastery.specialRefresh), upgrade);
        }
        components.push(this.masteryChoiceComp(upgrade))
        return components;
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
                <Dropdown.Toggle variant="light">{source.mastery ? source.mastery : "Choose a Mastery from your Trained Skill"}</Dropdown.Toggle>
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

    featureComp() {
        if (!this.props.feature.trainedSkill) {
            return <>
                <Button className="random-button" disabled={this.props.rerolls <= 0 && this.props.feature.trainedSkill} variant="outline-dark" onClick={() => this.randomize("trainedSkill")}>Roll Trained Skill</Button>
            </>
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
                    <h3>{this.props.feature.trainedSkill}</h3>
                    <div>{tables.SKILL_DESCRIPTIONS[this.props.feature.trainedSkill].covers}</div>
                    {components}
                    <Button className="random-button" disabled={this.props.rerolls <= 0 && this.props.feature.trainedSkill} variant="outline-warning" onClick={() => this.randomize("trainedSkill")}>Reroll Trained Skill</Button>
                </>
            )
        }
    }
}

export default FeatureSkillMastery;