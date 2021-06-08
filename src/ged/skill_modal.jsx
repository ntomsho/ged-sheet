import React, { useState } from 'react';
import * as tables from './ged-tables';
import Modal from 'react-bootstrap/Modal';
import { Card, Dropdown, Row, Col, Button } from 'react-bootstrap';

const SkillModal = (props) => {
    function modal() {
        if (!props.displaySkill) return <></>
        else return (
            <Modal onClick={() => props.toggleModal(null)} show={!!props.displaySkill} size="sm" onHide={props.toggleModal}>
                <Modal.Header style={{justifyContent: "center"}}>
                    <h2>{props.displaySkill}</h2>
                </Modal.Header>
                <Modal.Body>
                    <div>{tables.SKILL_DESCRIPTIONS[props.displaySkill].covers}</div>
                    <br/>
                    <div>{
                        props.trained ?
                        <strong>You are trained in {props.displaySkill}</strong>
                        :
                        <>You are <strong>NOT</strong> trained in {props.displaySkill}</>
                        }</div>
                </Modal.Body>
                <Modal.Footer style={{justifyContent: "center"}}>
                    <div className="grenze">{props.displaySkill} is used for:</div>
                    <ul>
                        {tables.SKILL_DESCRIPTIONS[props.displaySkill].usedFor.map((use, i) => {
                            return <li key={i}><li>{use}</li></li>
                        })}
                    </ul>
                </Modal.Footer>
            </Modal>
        )
    }

    return modal();
}

export default SkillModal;