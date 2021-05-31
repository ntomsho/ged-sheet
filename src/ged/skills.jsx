import React from 'react';
import * as tables from './ged-tables';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Dropdown } from 'react-bootstrap';

class Skills extends React.Component {
    constructor(props) {
        super(props)
    }

    checkTrained(skill) {
        if (this.props.bonusSkill === skill) return true;
        for (let i = 0; i < this.props.features.length; i++) {
            if (!this.props.features[i]) continue; 
            if (this.props.features[i].trainedSkill === skill || this.props.features[i].combatSkill === skill) {
                return true;
            }
        }
        return false;
    }

    skillBox(skill, index) {
        let variant = (this.checkTrained(skill) ? "" : "outline-");
        variant += (tables.CIVILIZED_SKILLS.includes(skill) ? "info" : "danger");
        return (
            <Col xs={4}>
                <Dropdown>
                    <Dropdown.Toggle className="w-100" key={index} variant={variant}>
                        <div className="grenze"><strong>{skill}</strong></div>
                        <Dropdown.Menu>
                            <Dropdown.Item>{tables.SKILL_DESCRIPTIONS[skill].covers}</Dropdown.Item>
                            {
                                this.checkTrained(skill) ? 
                                <Dropdown.Item><strong>You are trained in {skill}</strong></Dropdown.Item> :
                                <Dropdown.Item>You are <strong>NOT</strong> trained in {skill}</Dropdown.Item>
                            }
                            <Dropdown.Divider />
                            <Dropdown.Item>{skill} is used for:</Dropdown.Item>
                            <ul>
                                {tables.SKILL_DESCRIPTIONS[skill].usedFor.map((use, i) => {
                                    return <Dropdown.Item key={i}><li>{use}</li></Dropdown.Item>
                                })}
                            </ul>
                        </Dropdown.Menu>
                    </Dropdown.Toggle>
                </Dropdown>
            </Col>
        )
    }

    render() {
        return (
            <>
            <h2>Skills</h2>
            <div className="grenze">Tap Skills for more info</div>
            <Row>
                {tables.FIGHTING_SKILLS.map((skill, i) => {
                    return this.skillBox(skill)
                })}
            </Row>
            <Row>
                {tables.CIVILIZED_SKILLS.slice(0,3).map((skill, i) => {
                    return this.skillBox(skill)
                })}
            </Row>
            <Row>
                {tables.CIVILIZED_SKILLS.slice(3).map((skill, i) => {
                    return this.skillBox(skill)
                })}
            </Row>
            <Button block className="random-button w-50" disabled={this.props.rerolls <= 0 && this.props.bonusSkill} variant={this.props.bonusSkill ? "outline-warning" : "outline-dark"} onClick={() => this.props.randomizeSkill("bonusSkill")}>{this.props.bonusSkill ? "Reroll" : "Roll"} Trained Skill</Button>
            </>
        )
    }
}

export default Skills;