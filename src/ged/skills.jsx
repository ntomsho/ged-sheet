import React from 'react';
import * as tables from './ged-tables';
import SkillModal from './skill_modal';
import believeImg from '../images/believe-in-yourself.png';
import bruteImg from '../images/brute-force.png';
import cardioImg from '../images/cardio.png';
import creepinImg from '../images/creepin.png';
import macgyverImg from '../images/macgyver.png';
import manvswildImg from '../images/man-vs-wild.png';
import ocularImg from '../images/ocular-prowess.png';
import radmovesImg from '../images/rad-moves.png';
import thinkinessImg from '../images/thinkiness.png';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Accordion, Dropdown, Card } from 'react-bootstrap';

class Skills extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalDisplaySkill: null,
            displaySkillTrained: null
        }
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

    randomizeSkill() {
        let newSkill = tables.CIVILIZED_SKILLS[Math.floor(Math.random() * tables.CIVILIZED_SKILLS.length)];
        while (this.checkTrained(newSkill)) {
            newSkill = tables.CIVILIZED_SKILLS[Math.floor(Math.random() * tables.CIVILIZED_SKILLS.length)];
        }
        this.props.updateSkill(newSkill)
    }

    getImage(skill) {
        switch (skill) {
            case "Believe in Yourself": return believeImg;
            case "Brute Force": return bruteImg;
            case "Cardio": return cardioImg;
            case "Creepin\'": return creepinImg;
            case "Macgyver": return macgyverImg;
            case "Man vs. Wild": return manvswildImg;
            case "Ocular Prowess": return ocularImg;
            case "Rad Moves": return radmovesImg;
            case "Thinkiness": return thinkinessImg;
        }
    }

    toggleModal(displaySkill) {
        let newState = Object.assign({}, this.state);
        newState.modalDisplaySkill = displaySkill;
        newState.displaySkillTrained = displaySkill ? this.checkTrained(displaySkill) : null;
        this.setState(newState);
    }

    skillBox(skill, index) {
        let variant = (tables.CIVILIZED_SKILLS.includes(skill) ? "info" : "danger");
        let trained = this.checkTrained(skill);
        return (
            <Col xs={4} key={index}>
                <Card bg={trained ? variant : ""} border={trained ? "" : variant} onClick={() => this.toggleModal(skill)}>
                <Card.Img src={this.getImage(skill)} alt="Card Image" />
                <Card.ImgOverlay style={{padding: 0, zIndex: 0}}>
                <Card.Body className="skill-box" style={{padding: "1rem 0.5rem"}}>
                    <Button className="w-100" variant={trained ? "dark" : "outline-dark"}>
                        <div className="grenze" style={{fontSize: "2.75vw"}}><strong>{skill}</strong></div>
                    </Button>
                {/* <Dropdown>
                    <Dropdown.Toggle style={{border: "none", whiteSpace: "normal"}} className="w-100" key={index} variant={trained ? "dark" : "outline-dark"}>
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
                </Dropdown> */}
                </Card.Body>
                </Card.ImgOverlay>
                </Card>
            </Col>
        )
    }

    render() {
        return (
            <Accordion>
                <SkillModal displaySkill={this.state.modalDisplaySkill} trained={this.state.displaySkillTrained} toggleModal={this.toggleModal.bind(this)} />
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="light" className="w-100 grenze" eventKey="skills">
                            <h2>Skills</h2>
                            <div className="grenze">Tap Skills for more info</div>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="skills">
                        <div style={{position: "relative", zIndex: 5}}>
                        <Row className="mt-2">
                            {tables.FIGHTING_SKILLS.map((skill, i) => {
                                return this.skillBox(skill)
                            })}
                        </Row>
                        <Row className="mt-2">
                            {tables.CIVILIZED_SKILLS.slice(0,3).map((skill, i) => {
                                return this.skillBox(skill)
                            })}
                        </Row>
                        <Row className="mt-2">
                            {tables.CIVILIZED_SKILLS.slice(3).map((skill, i) => {
                                return this.skillBox(skill)
                            })}
                        </Row>
                        <Row>
                            <Col className="justify-content-center" style={{display: "flex"}}>
                                <Button block className="random-button w-50 mt-4 mb-4" disabled={this.props.rerolls <= 0 && this.props.bonusSkill} variant={this.props.bonusSkill ? "outline-warning" : "outline-dark"} onClick={() => this.randomizeSkill()}>{this.props.bonusSkill ? "Reroll" : "Roll"} Trained Skill</Button>
                            </Col>
                        </Row>
                        </div>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }
}

export default Skills;