import React, { useState } from "react";
import FirestoreDatabase from "../../backend/firestoreDatabase";
import { Loader } from "../../components/loader";

const { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Form, Label, Col } = require("reactstrap");

const EditContestModal = (props) => {
    const {
        buttonLabel,
        contestData,
        matchID
    } = props;

    const [modal, setModal] = useState(false);
    const [newContestData, setContestData] = useState(contestData);
    const [currentPrize, setCurrentPrize] = useState(contestData.currentPrize);
    const [entry, setEntry] = useState(contestData.entry);
    const [maxLimit, setMaxLimit] = useState(contestData.maxLimit);
    const [loader, setLoader] = useState(false);


    const toggle = () => setModal(!modal);

    // const onChageInput = (e) => {
    //     console.log(e.target.value);
    // }
    const calculateProfit = () => {
        return entry * maxLimit - currentPrize;
    }

    const onFormSubmit = async (e) => {
        e.preventDefault();
        // alert(currentPrize, entry, maxLimit);

        if (currentPrize === contestData.currentPrize && entry === contestData.entry && maxLimit === contestData.maxLimit) {
            alert('There is no change in contest details, please change at least one field.');
            return;
        }
        const data = {
            currentPrize: parseInt(currentPrize),
            entry: parseInt(entry),
            maxLimit: parseInt(maxLimit),
        }
        try {
            setLoader(true);
            await FirestoreDatabase.editContest(matchID, contestData.id, data);
            alert('Successfully updated the details, please refresh the page if you don\'t see any changes. Thanks')
        } catch (e) {
            alert(e.message);
        } finally {
            setLoader(false);
        }
    }
    const getContestForm = () => {
        return <Form onSubmit={onFormSubmit}>
            <FormGroup>
                <Label for='currentPrize'>Current Prize</Label>
                <Input name='currentPrize' id='currentPrize' onChange={(e) => setCurrentPrize(e.target.value)} value={currentPrize} />
            </FormGroup>
            <FormGroup>
                <Label for='entry'>Entry</Label>
                <Input name='entry' id='entry' onChange={(e) => setEntry(e.target.value)} value={entry} />
            </FormGroup>
            <FormGroup>
                <Label for='maxLimit'>Max Spots</Label>
                <Input name='maxLimit' id='maxLimit' onChange={(e) => setMaxLimit(e.target.value)} value={maxLimit} />
            </FormGroup>
            <hr />
            <Col>
                Profit/loss: <b>{calculateProfit()}</b>
            </Col>
            <br />
            <Col style={{ textAlign: 'end' }}>
                <Button color='danger' type='submit'> Update </Button>
            </Col>
        </Form>
    }

    return <div>
        <Button color='' onClick={toggle}>{buttonLabel}</Button>
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Edit Contest</ModalHeader>
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

export default EditContestModal;

