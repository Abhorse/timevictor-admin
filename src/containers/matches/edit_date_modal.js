import React, { useState } from "react";
import FirestoreDatabase from "../../backend/firestoreDatabase";
import { Loader } from "../../components/loader";

const { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Form, Label, Col } = require("reactstrap");

const EditDateModal = (props) => {
    const {
        buttonLabel,
        startTime,
        match
    } = props;

    const [modal, setModal] = useState(false);
    const [newDate, setDate] = useState(new Date(startTime));
    const [duration, setDuration] = useState(match.duration);
    const [loader, setLoader] = useState(false);


    const toggle = () => setModal(!modal);



    const onFormSubmit = async (e) => {
        e.preventDefault();
        Date.prototype.addMinutes = function (m) {
            this.setTime(this.getTime() + (m * 60 * 1000));
            return this;
        }
        var startTime = new Date(newDate);
        var newDuration = parseInt(duration);
        var endTime = new Date(newDate).addMinutes(newDuration);

        console.log(startTime, newDuration);

        try {
            setLoader(true);
            await FirestoreDatabase.editStartTime(match.id, startTime, newDuration, endTime);
            alert(`Successfully updated the timing (startTime: ${startTime.toLocaleString()}, duration: ${newDuration}), please refresh the page if you don\'t see any changes. Thanks`)
        } catch (e) {
            alert(e.message);
        } finally {
            setLoader(false);
        }
    }
    const getContestForm = () => {
        return <Form onSubmit={onFormSubmit}>
            <FormGroup>
                <Label for='date'>Start Time</Label>
                <Input type='datetime-local' name='date' id='date' onChange={(e) => setDate(e.target.value)} value={newDate} />
            </FormGroup>
            <FormGroup>
                <Label for='duration'>Duration</Label>
                <Input type='number' name='duration' id='duration' onChange={(e) => setDuration(e.target.value)} value={duration} />
            </FormGroup>
            <Col style={{ textAlign: 'end' }}>
                <Button color='danger' type='submit'> Update </Button>
            </Col>
        </Form>
    }

    return <div>
        <Button color='' onClick={toggle}>{buttonLabel}</Button>
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Edit Start Time : {startTime, new Date(startTime).toLocaleString()}</ModalHeader>
            <ModalBody>
                {loader && <Loader />}
                {!loader && getContestForm()}
            </ModalBody>
            <ModalFooter>
                <Button color='primary' onClick={toggle}>Close</Button>
            </ModalFooter>
        </Modal>
    </div>
}

export default EditDateModal;

