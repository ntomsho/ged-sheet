import React, { useState } from 'react';
import * as tables from './ged-tables';
import CharacterFeature from './character_feature';
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown';
import Card from 'react-bootstrap/Card';

class FeatureWordsOfPower extends CharacterFeature {
    titleComp() {
        return <>
            <h3>Words of Power</h3>
            <div>You are a spellcaster, combining Words of Power to create powerful effects.</div>
        </>
    }

    featureComp() {
        return this.specialRefreshComp([{
            specialType: "Word",
            number: 4,
            refreshOn: "rest",
            favoriteSpecial: true
        }]);
    }
}

export default FeatureWordsOfPower;