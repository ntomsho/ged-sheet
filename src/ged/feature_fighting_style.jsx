import React, { useState } from 'react';
import * as tables from './ged-tables';
import CharacterFeature from './character_feature';
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown';
import Card from 'react-bootstrap/Card';

class FeatureFightingStyle extends CharacterFeature {
    titleComp() {
        return <>
            <h3>Fighting Style</h3>
            <div>You are a capable warrior, trained in one of the three Combat Skills.</div>
        </>
    }

    featureComp() {
        if (!this.props.feature.combatSkill) {
            return <>
                <Button className="random-button" disabled={this.props.rerolls <= 0 && this.props.feature.combatSkill} variant="outline-dark" onClick={() => this.randomize("combatSkill")}>Roll Combat Skill</Button>
            </>
        } else {
            return (
                <>
                    <h3><strong>Trained Skill:</strong> {this.props.feature.combatSkill}</h3>
                    <Dropdown>
                        <Dropdown.Toggle className="long-text-button" variant="light">{this.props.feature.fightingStyleBonus ? this.props.feature.fightingStyleBonus : "Choose a Fighting Style Bonus"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item className="long-text-button" as="button" onClick={() => this.setField("fightingStyleBonus", "You gain proficiency in Armor.")}><p>You gain proficiency in Armor.</p></Dropdown.Item>
                            <Dropdown.Item className="long-text-button" as="button" onClick={() => this.setField("fightingStyleBonus", tables.FIGHTING_STYLE_BONUSES[this.props.feature.combatSkill])}><p>{tables.FIGHTING_STYLE_BONUSES[this.props.feature.combatSkill]}</p></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button className="random-button" disabled={this.props.rerolls <= 0 && this.props.feature.combatSkill} variant="outline-warning" onClick={() => this.randomize("combatSkill")}>Reroll Combat Skill</Button>
                </>
            )
        }
    }
}

export default FeatureFightingStyle;