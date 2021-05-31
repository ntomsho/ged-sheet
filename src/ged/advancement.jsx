import React from 'react';
import * as tables from './ged-tables';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';

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
            <>
            <h2>Experience</h2>
            <div className="grenze">Level {this.props.level}</div>
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
            </>
        )
    }
}

export default Advancement