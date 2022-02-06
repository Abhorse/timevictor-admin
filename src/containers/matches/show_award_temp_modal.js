import React, { useState } from "react";
import FirestoreDatabase from "../../backend/firestoreDatabase";
import { Loader } from "../../components/loader";

const { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Form, Label, Col, Row, ListGroupItem, ListGroup } = require("reactstrap");

const ShowAwardTemplate = (props) => {
    const {
        buttonLabel,
        award
    } = props;

    const [modal, setModal] = useState(false);


    const toggle = () => setModal(!modal);





    return <div>
        <Button color='' onClick={toggle}>{buttonLabel}</Button>
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Award Template: {award.name}</ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <ListGroupItem style={{ backgroundColor: 'gray', color: 'white' }}>
                            <Row>
                                <Col style={{ textAlign: 'center' }}>Rank</Col>
                                <Col style={{ textAlign: 'center' }}>Prize</Col>
                            </Row>
                        </ListGroupItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ListGroup>
                            {award.awards.map((a, index) => <ListGroupItem key={`award-${index}`}>
                                <Row >
                                    <Col style={{ textAlign: 'center' }}>#{a.from === a.to ? a.from : `${a.from} - ${a.to}`}</Col>
                                    <Col style={{ textAlign: 'center' }}> {a.prize} %</Col>
                                </Row>
                            </ListGroupItem>)}
                        </ListGroup>
                    </Col>
                </Row>
                <br />
            </ModalBody>
        </Modal>
    </div>
}

export default ShowAwardTemplate;

