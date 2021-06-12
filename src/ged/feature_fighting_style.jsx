import React from 'react';
import * as tables from './ged-tables';
import CharacterFeature from './character_feature';
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class FeatureFightingStyle extends CharacterFeature {    
    titleComp() {
        return <>
            <h3>Fighting Style{this.props.feature.upgrade ? " 🌟" : ""}</h3>
            <div>You are a capable warrior, trained in one of the three Combat Skills.</div>
        </>
    }

    combatSkillComp(upgrade) {
        return (
            <div>
                <h3><strong>Trained Skill:</strong> {upgrade ? this.props.feature.upgrade.combatSkill : this.props.feature.combatSkill}</h3>
                <div>{tables.SKILL_DESCRIPTIONS[upgrade ? this.props.feature.upgrade.combatSkill : this.props.feature.combatSkill].covers}</div>
            </div>
        )
    }

    styleBonusComp(upgrade) {
        const source = (upgrade ? this.props.feature.upgrade : this.props.feature)
        const setFunction = (upgrade ? this.setUpgrade : this.setField)
        return (
            <Dropdown>
                <Dropdown.Toggle className="long-text-button" variant="light">{source.fightingStyleBonus ? source.fightingStyleBonus : "Choose a Fighting Style Bonus"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item className="long-text-button" as="button" onClick={() => setFunction("fightingStyleBonus", "You gain proficiency in Armor.")}><p>You gain proficiency in Armor.</p></Dropdown.Item>
                    <Dropdown.Item className="long-text-button" as="button" onClick={() => setFunction("fightingStyleBonus", tables.FIGHTING_STYLE_BONUSES[source.combatSkill])}><p>{tables.FIGHTING_STYLE_BONUSES[source.combatSkill]}</p></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    upgradeComp() {
        if (!this.props.feature.upgrade) return <></>
        
        const upgrade = this.props.feature.upgrade
        let choices = [
            "Gain training in a second Combat Skill of your choice and choose an additional Fighting Style Bonus. You can choose any bonus that you meet the prerequisites for.",
            "Attack rolls using your trained Combat Skill deal enhanced damage."
        ]
        let comps = [];
        if (upgrade && upgrade.choice === 0) {
            if (!upgrade.combatSkill) {
                comps.push(<Button className="random-button" disabled={this.props.rerolls <= 0 && upgrade.combatSkill} variant="outline-dark" onClick={() => this.randomizeUpgrade("combatSkill", true)}>Roll Combat Skill</Button>)
            } else {
                comps.push(<>
                    {this.combatSkillComp(true)}
                    {this.styleBonusComp(true)}
                </>)
            }
        }
        comps.push(
            <Dropdown>
                <div className="grenze">Feature Upgrade</div>
                <Dropdown.Toggle className="long-text-button" variant="light">{typeof upgrade.choice === "number" ? choices[upgrade.choice] : "Choose an upgrade for this feature"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item className="long-text-button" as="button" onClick={() => this.setUpgrade("choice", 0)}><p>Gain training in a second Combat Skill of your choice and choose an additional Fighting Style Bonus. You can choose any bonus that you meet the prerequisites for.</p></Dropdown.Item>
                    <Dropdown.Item className="long-text-button" as="button" onClick={() => this.setUpgrade("choice", 1)}><p>Attack rolls using your trained Combat Skill deal enhanced damage.</p></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
        return (
            <Col>
                {comps}
            </Col>
        )
    }

    rerollButtons() {
        return <Button className="random-button" disabled={this.props.rerolls <= 0 && this.props.feature.combatSkill} variant={this.props.feature.combatSkill ? "outline-warning" : "outline-dark"} onClick={() => this.randomize("combatSkill")}>{this.props.feature.combatSkill ? "Reroll" : "Roll"} Combat Skill</Button>
    }

    featureComp() {
        if (!this.props.feature.combatSkill) {
            return <></>
        } else {
            return (
                <Row xs={1} sm={this.props.feature.upgrade ? 2 : 1}>
                    <Col>
                    {this.combatSkillComp()}
                    {this.styleBonusComp()}
                    </Col>
                    {this.upgradeComp()}
                </Row>
            )
        }
    }
}

export default FeatureFightingStyle;