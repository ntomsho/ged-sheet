import React, { useState } from 'react';
import * as tables from './ged-tables';
import Modal from 'react-bootstrap/Modal';
import { Card, Dropdown, Row, Col, Button } from 'react-bootstrap';

const RulesModal = (props) => {
    const [showModal, setShowModal] = useState(false);
    
    function modal() {
        return (
            <>
            <Button onClick={() => setShowModal(true)} style={{justifySelf: "flex-start"}}>Rules</Button>
            <Modal onClick={() => setShowModal(false)} size="lg" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header style={{ justifyContent: "center" }}>
                    <h2>Action Roll Reference Sheet</h2>
                </Modal.Header>
                <Modal.Body style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
                    <div>Roll <strong>1d20 +</strong></div>
                    <div><strong>1d6</strong> per source of <strong>Advantage</strong></div>
                    <div><strong>-1d6</strong> per <strong>Difficulty</strong></div>
                    <div><em>(roll 1d6 and subtract if Difficulty is higher than number of Advantages)</em></div>
                    <br/>
                    <div className="grenze"><u>Results</u></div>
                    <div className="rules-modal-result-row">
                        <span style={{width: "20%"}}><strong>{"Nat 1 or <1"}</strong></span>
                        <span>Critical Fail → <strong>Fail</strong> and take a <strong>Serious Consequence</strong></span>
                    </div>
                    <div className="rules-modal-result-row">
                        <span style={{width: "20%"}}><strong>1-9</strong></span>
                        <span>Fail → <strong>Fail</strong> and take a <strong>Consequence</strong></span>
                    </div>
                    <div className="rules-modal-result-row">
                        <span style={{width: "20%"}}><strong>10-17</strong></span>
                        <span>Pass → <strong>Succeed</strong> but take a <strong>Consequence</strong></span>
                    </div>
                    <div className="rules-modal-result-row">
                        <span style={{width: "20%"}}><strong>18-24</strong></span>
                        <span>Success → <strong>Succeed</strong></span>
                    </div>
                    <div className="rules-modal-result-row">
                        <span style={{width: "20%"}}><strong>{"Nat 20 or >24"}</strong></span>
                        <span>Critical Success → <strong>Succeed</strong> with a <strong>Bonus</strong></span>
                    </div>
                    <div><em>Spend a DERP Point to improve a non-Critical roll by one result level</em></div>
                    <br/>
                    <div className="grenze"><u>Sources of Advantage</u></div>
                    <div style={{display: "flex", justifyContent: "space-between", width: "100%", textAlign: "start"}}>
                        <div style={{width: "33%", borderRight: "1px solid black"}}>
                            <div style={{ textAlign: "center"}} className="grenze">Skill</div>
                            <div>‣Training in the relevant Skill</div>
                            <div>‣Other features that provide Skill Advantage</div>
                            <div style={{fontSize: "12px"}}>
                                <div><u>Expertise:</u> {"if you have >1 source of Skill Advantage"}</div>
                                <div>Ignore one source of Disadvantage</div>
                            </div>
                        </div>
                        <div style={{ width: "33%", borderRight: "1px solid black" }}>
                            <div style={{ textAlign: "center" }} className="grenze">Magic</div>
                            <div>‣Casting a spell</div>
                            <div>‣Using a magic item</div>
                            <div>‣Other features that provide Magic Advantage</div>
                        </div>
                        <div style={{ width: "33%"}}>
                            <div style={{ textAlign: "center" }} className="grenze">Circumstance</div>
                            <div>‣Right tools or equipment</div>
                            <div>‣Environment helps you</div>
                            <div>‣Enemy at a disadvantage</div>
                        </div>
                    </div>
                    <br/>
                    <div className="grenze"><u>Sources of Difficulty</u></div>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", width: "100%", textAlign: "start" }}>
                        <div>‣Complexity of task</div>
                        <div>‣Darkness</div>
                        <div>‣Strength of target</div>
                        <div>‣Distance</div>
                        <div>‣Unarmed or improvised weapon</div>
                        <div>‣Illness or injury</div>
                        <div>‣Cover or obstacles</div>
                        <div>‣Doing multiple things in one Action</div>
                    </div>
                    <br/>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", textAlign: "start" }}>
                        <div style={{display: "flex", flexDirection: "column", width: "35%"}}>
                            <div className="grenze" style={{textAlign: "center"}}><u>Damage</u></div>
                            <div style={{fontSize: "12px"}}><strong>Reduced</strong> = 1</div>
                            <div style={{fontSize: "12px"}}><strong>Standard</strong> = 2</div>
                            <div style={{fontSize: "12px"}}><strong>Enhanced</strong> = 3</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", width: "65%" }}>
                            <div className="grenze" style={{ textAlign: "center" }}><u>Health</u></div>
                            <div style={{fontSize: "12px"}}>‣Starts at 7, +1 per Level</div>
                            <div style={{fontSize: "12px"}}>‣Take 1 damage from a Consequence</div>
                            <div style={{fontSize: "12px"}}>‣Take 1d6 damage from a Serious Consequence</div>
                            <div style={{fontSize: "12px"}}>‣Heal 1 on rest (8 hours); 0 Health? → u ded</div>
                        </div>
                    </div>
                    <br/>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", textAlign: "start" }}>
                        <div style={{ display: "flex", flexDirection: "column", width: "50%", borderRight: "1px solid black" }}>
                            <div className="grenze" style={{ textAlign: "center" }}><u>Threat</u></div>
                            <div style={{ fontSize: "12px" }}>‣Become Threatened as a Consequence</div>
                            <div style={{ fontSize: "12px" }}>‣Can add Difficulty to rolls</div>
                            <div style={{ fontSize: "12px" }}>‣Rolls to escape Threat are Defense Rolls</div>
                            <div style={{ fontSize: "12px" }}>‣Take Serious Consequence on failed roll</div>
                        </div>  
                        <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                            <div className="grenze" style={{ textAlign: "center" }}><u>Spells</u></div>
                            <div style={{ display: "flex", flexWrap: "wrap", fontSize:"12px", justifyContent: "space-between", width: "100%", textAlign: "start" }}>
                                <div>‣Attack roll (enhanced damage)</div>
                                <div>‣Standard damage (no roll)</div>
                                <div>‣Critical on Defense Roll</div>
                                <div>‣Create lasting advantage</div>
                                <div>‣Create hazard</div>
                                <div>‣Heal someone (full)</div>
                                <div>‣Misc</div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            </>
        )
    }

    return modal();
}

export default RulesModal;