import React, { useState } from 'react';
import * as tables from './ged-tables';
import CharacterFeature from './character_feature';
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown';
import Card from 'react-bootstrap/Card';

class FeatureWordsOfPower extends CharacterFeature {
    titleComp() {
        return <>
            <h3>Words of Power{this.props.feature.upgrade ? " 🌟" : ""}</h3>
            <div>You are a spellcaster, combining Words of Power to create powerful effects.</div>
        </>
    }

    descriptionComp() {
        return (
            <div>
                <p>You create spells by combining two or more Words of Power into a phrase that conjures the effect into the world. You must be able to speak to cast a spell in this manner.</p>
                <p>When you choose this feature, roll 4 random Words of Power on the table below. These are your starting Words of Power. Choose one to be your Signature Word. Whenever you rest, your Signature Word is refreshed, any other Words you haven’t used are lost, and you roll 3 new ones from the table.</p>
                <p>When you use Words of Power to cast a spell, do the following:</p>
                <ul>
                    <li>Arrange any two or three Words you currently have access to into a phrase. You can change any word grammatically (e.g. turn “Restore” into “Restoring” or “Restoration”) and can add “of” where necessary to create a grammatical phrase.</li>
                    <li>Tell the Director what this spell does and which spell effect you want to create with it.</li>
                    <li>If the Director approves the effect, the spell is cast.</li>
                    <li>Choose one of the Words used in the spell. It is expended and cannot be used again.</li>
                </ul>
            </div>
        )
    }

    upgradeComp() {
        if (!this.props.feature.upgrade) return <></>
        if (!this.props.feature.currentSpecials) return <></>
        if (!this.props.feature.currentSpecials[0].favoriteSpecial) return <></>
        const upgrade = this.props.feature.upgrade
        let choices = [
            "You have mastered your Signature Word. When it is expended, you can meditate for 15 minutes to refresh it.",
            "You roll 6 random Words of Power (plus your Signature) when resting."
        ];
        return (
            <Dropdown>
                <div className="grenze">Feature Upgrade</div>
                <Dropdown.Toggle className="long-text-button" variant="light">{typeof upgrade.choice === "number" ? choices[upgrade.choice] : "Choose an upgrade for this feature"}</Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item className="long-text-button" as="button" onClick={() => this.setUpgrade("choice", 0)}><p>{choices[0]}</p></Dropdown.Item>
                    <Dropdown.Item className="long-text-button" as="button" onClick={() => this.setUpgrade("choice", 1)}><p>{choices[1]}</p></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    featureComp() {
        let wordsComp;
        if (this.props.feature.upgrade && typeof this.props.feature.upgrade.choice === "number") {
            wordsComp = (this.props.feature.upgrade.choice === 0 ?
                this.specialRefreshComp([{
                    specialType: "Word",
                    number: 4,
                    refreshOn: "rest",
                    favoriteSpecial: true,
                    refreshFavorite: true
                }])
                :
                this.specialRefreshComp([{
                    specialType: "Word",
                    number: 7,
                    refreshOn: "rest",
                    favoriteSpecial: true
                }]));
        } else {
            wordsComp = this.specialRefreshComp([{
                specialType: "Word",
                number: 4,
                refreshOn: "rest",
                favoriteSpecial: true
            }]);
        }

        return (
            <div>
            {this.descriptionComp()}
            {wordsComp}
            {this.upgradeComp()}
            </div>
        )
    }
}

export default FeatureWordsOfPower;