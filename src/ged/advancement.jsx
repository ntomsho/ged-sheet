import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Accordion, Alert, Card } from 'react-bootstrap';

class Advancement extends React.Component {
    constructor(props) {
        super(props);
    }

    changeExp(inc) {
        const expToLevel = this.props.level + 4;
        if (inc && this.props.experience < expToLevel) {
            this.props.updateExperience(this.props.experience + 1);
        } else if (!inc && this.props.experience > 0) {
            this.props.updateExperience(this.props.experience - 1);
        }
    }

    render() {
        const expToLevel = this.props.level + 4;
        return (
            <Accordion>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="light" className="w-100 grenze" eventKey="advancement">
                            <h2>Advancement</h2>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="advancement">
                    <div>
                            <Row>
                                <h3>Experience</h3>
                                <div className="grenze">Level {this.props.level}</div>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <InputGroup>
                                        <InputGroup.Prepend style={{ width: '10%' }}>
                                            <Button block variant="outline-secondary" onClick={() => this.changeExp(false)}>-</Button>
                                        </InputGroup.Prepend>
                                        <ProgressBar style={{ height: '38px' }} className="w-75" variant="warning" now={Math.floor((this.props.experience / expToLevel) * 100)} />
                                        <span className="position-absolute w-100 text-center"><h3>{this.props.experience} / {expToLevel}</h3></span>
                                        <InputGroup.Append style={{ width: '10%' }}>
                                            <Button block variant="outline-secondary" onClick={() => this.changeExp(true)}>+</Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                            </Row>
                            {this.props.experience >= expToLevel ?
                                <Button variant="primary" size="lg" onClick={this.props.levelUp}>LEVEL UP</Button> :
                                <></>
                            }
                            {this.props.upgradeAvailable ?
                                <Alert variant="info">You've leveled up! Your max Health has increased by one and you have a free Character Feature available. Tap the Roll Character Feature button above to learn a new Character Feature or tap the Upgrade Feature button in one of your existing features.</Alert>:
                                <></>
                            }
                    </div>
                    </Accordion.Collapse>
                </Card>
            </Accordion >
        )
    }
}

export default Advancement