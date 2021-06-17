import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

export default function DiceRoller(props) {
    //Selection variables
    const [showModal, setShowModal] = useState(false);
    const [selectedDice, setSelectedDice] = useState([false, false, false]);
    const [difficulty, setDifficulty] = useState(0);
    const [rollHistory, setRollHistory] = useState([]);
    const [disadvantage, setDisadvantage] = useState(false);
    //the first roll in rollHistory is always the current one

    const historyRef = useRef(null);
    const blankd6 = '▢';
    const dieFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

    const advantageSources = [
        "Skill",
        "Magic",
        "Circumstance"
    ]

    useEffect(() => {
        setDisadvantage(difficulty > numDice() ? true : false);
    }, [JSON.stringify(selectedDice), difficulty])

    useEffect(() => {
        if (rollHistory.length > 0) historyRef.current.scrollTo(0, 0)
    }, [JSON.stringify(rollHistory)])

    function numDice() {
        let num = 0;
        for (let i = 0; i < 3; i++) {
            if (selectedDice[i]) num++;
        }
        return num;
    }

    function changeDifficulty(inc) {
        if (inc && difficulty < 3) {
            setDifficulty(difficulty + 1);
        } else if (!inc && difficulty > 0) {
            setDifficulty(difficulty - 1);
        }
    }

    function selectAdvantageDie(ind) {
        let newDice = [...selectedDice];
        newDice[ind] = newDice[ind] ? false : true;
        setSelectedDice(newDice);
    }

    function resetSelections() {
        setDifficulty(0);
        setSelectedDice([false, false, false]);
    }

    function rollDice() {
        const mainRoll = Math.floor(Math.random() * 20 + 1);
        let mod = false;
        let newDice;
        if (disadvantage) {
            mod = -1 * Math.floor(Math.random() * 6) + 1;
            newDice = [0, 0, 0];
        } else {
            let cancels = difficulty;
            newDice = selectedDice.map(die => {
                if (cancels && die) {
                    cancels -= 1;
                    return 0;
                }
                return !!die ? Math.floor(Math.random() * 6) + 1 : 0;
            });
            mod = newDice.reduce((acc, num) => acc + num, 0);
        }
        let result = mainRoll + mod;
        const rolls = [...rollHistory];
        rolls.unshift({ 'result': result, 'difficulty': difficulty, 'dice': [mainRoll, ...newDice], 'disadvantage': disadvantage ? mod : false });
        setRollHistory(rolls);
        resetSelections();
        if (props.updateState) props.updateState("", "", { roll_dice: { result: result, resultString: resultString(result, mainRoll).main } })
    }

    function resultString(total, mainDie) {
        if (mainDie === 1 || total < 1) {
            return { 'main': "Critical Failure", 'sub': "Fail and take a Serious Consequence" };
        } else if (mainDie === 20 || total > 24) {
            return { 'main': "Critical Success", 'sub': "You succeed with a bonus" };
        } else if (total <= 9) {
            return { 'main': "Failure", 'sub': "You fail and take a Consequence" };
        } else if (total >= 18) {
            return { 'main': "Success", 'sub': "You succeed" };
        } else {
            return { 'main': "Pass", 'sub': "You succeed, but take a Consequence" };
        }
    }

    function currentRollDisp() {
        if (rollHistory.length > 0) {
            const currentRoll = rollHistory[0];
            const resultText = resultString(currentRoll.result, currentRoll.dice[0]);
            return (
                <>
                    <Row>
                        <h1 style={{ textDecoration: 'underline' }}>Result</h1>
                    </Row>
                    <Row className="mb-4">
                        <Col>
                            <h1>{currentRoll.result}</h1>
                            <div className="d-flex">
                                <h2 className="d20-value mr-3" style={{width: "15%"}}>{currentRoll.dice[0]}</h2>
                                {currentRoll.disadvantage ?
                                    <h2 style={{ color: 'red' }} className="current-d6">{dieFaces[(currentRoll.disadvantage * -1) - 1]}</h2> :
                                    currentRoll.dice.map((die, i) => {
                                        if (i > 0) {
                                            return (
                                                <h2 key={i} className="current-d6">{dieFaces[die - 1]}</h2>
                                            )
                                        }
                                    })}
                            </div>
                        </Col>
                        <Col>
                            <h2>{resultText.main}</h2>
                            <em>{resultText.sub}</em>
                        </Col>
                    </Row>
                </>
            )
        } else {
            return (
                <>
                    <div style={{ minHeight: '174px' }} />
                </>
            )
        }
    }

    function diceSelectionDisplay() {
        let cancels = difficulty;
        return (
            <Row>
                <Col xs={10}>
                    <Row style={{ color: disadvantage ? 'red' : 'black' }}>
                        <Col xs={12} sm={4} style={{display: "flex", alignItems: "center"}}>
                            <h3 className="text-center">Difficulty</h3>
                        </Col>
                        <Col xs={6}>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Button size="lg" className="text-center" variant="outline-secondary" onClick={() => changeDifficulty(false)}>-</Button>
                                </InputGroup.Prepend>
                                <InputGroup.Text style={{border: "none", background: "none"}}>
                                    <h2 className="text-center">{difficulty}</h2>
                                </InputGroup.Text>
                                <InputGroup.Append>
                                    <Button size="lg" className="text-center" variant="outline-secondary" onClick={() => changeDifficulty(true)}>+</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        {selectedDice.map((die, i) => {
                            let canceled = false;
                            if (selectedDice[i] && cancels > 0) {
                                cancels -= 1;
                                canceled = true;
                            }
                            return (
                                <Col key={i} className="text-center">
                                    <small><em>{advantageSources[i]}</em></small>
                                    <div key={i} style={{ opacity: selectedDice[i] ? '100%' : '20%', position: "relative" }} variant="outline-secondary" onClick={() => selectAdvantageDie(i)} className="advantage-die">
                                        {blankd6}
                                        <div className={`canceled-x${canceled ? '' : ' hidden'}`}>X</div>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                </Col>
                <Col xs={2}>
                    <Button className="h-100 grenze" size="lg" variant="secondary" onClick={rollDice}>Roll</Button>
                </Col>
            </Row>
        )
    }

    function rollHistoryDisp() {
        if (rollHistory.length > 0) {
            return (
                <div ref={historyRef} className="overflow-auto border border-secondary border-rounded" style={{ height: '150px', padding: "0 1vw" }}>
                    {rollHistory.map((roll, i) => {
                        return (
                            <div key={i}>
                                <div className="d-flex align-items-center">
                                    <h3 className="mr-3">{roll.result}</h3>
                                    <span className="grenze">{resultString(roll.result, roll.dice[0]).main}</span>
                                </div>
                                <div className="d-flex">
                                    <h3 className="mr-3" style={{width: "15%"}}>{roll.dice[0]} </h3>
                                    {
                                        roll.disadvantage ?
                                            <h3 style={{ color: 'red' }}>{dieFaces[(roll.disadvantage * -1) - 1]}</h3> :
                                            roll.dice.slice(1, 4).map((die, j) => <h3 key={j}>{dieFaces[die - 1]}</h3>)
                                    }
                                </div>
                                <div style={{ width: '50%', borderTop: '1px solid black' }}></div>
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            return (
                <div className="overflow-auto border border-secondary border-rounded" style={{ height: '100px', width: '100%' }} />
            )
        }
    }

    return (
        <>
        <Button onClick={() => setShowModal(true)} style={{ justifySelf: "flex-end" }}>Dice</Button>
        <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <h2>Dice Roller</h2>
            </Modal.Header>
            <Modal.Body>
                {currentRollDisp()}
                {diceSelectionDisplay()}
                <Row>
                    <Col xs={6}>
                        <h2>Roll History</h2>
                        {rollHistoryDisp()}
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
        </>
    )
}