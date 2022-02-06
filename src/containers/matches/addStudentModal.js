
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import FirestoreDatabase from '../../backend/firestoreDatabase';
import { Loader } from '../../components/loader';

const AddStudentModal = (props) => {
    const {
        buttonLabel,
        className,
        matchID,
        isTeamAStudent,
        teamName,
        onSuccess,
        subjects
    } = props;

    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);


    const toggle = () => setModal(!modal);

    const updateStudentMarks = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        var id = data.get('id');
        var name = data.get('name');
        var image = data.get('image');
        var score = data.get('score');
        var subject = data.get('subject');
        console.log(subject)
        var newStudentData = {
            id: id,
            name: name,
            profilePic: image,
            quizMarks: null,
            score: score,
            subject: subject,
        }

        if (id && name && image && score && subject && subject !== '--select--') {
            try {
                setLoading(true);
                await FirestoreDatabase.addStudent(matchID, newStudentData, isTeamAStudent);
                onSuccess();
                toggle();
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }


    }

    return (
        <div>
            <Button color="success" onClick={toggle}>{buttonLabel}</Button>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>Add Student to team {teamName}</ModalHeader>
                <ModalBody>
                    {loading && <Loader />}
                    {!loading && <Form onSubmit={updateStudentMarks}>
                        <FormGroup>
                            <Label for='id'>ID</Label>
                            <Input type='text' name='id' id='id' placeholder='Enter Student id' />
                        </FormGroup>
                        <FormGroup>
                            <Label for='name'>Name</Label>
                            <Input type='text' name='name' id='name' placeholder='Student name' />
                        </FormGroup>
                        <FormGroup>
                            <Label for='image'>Image URL</Label>
                            <Input type='text' name='image' id='image' placeholder='Profile image URL' />
                        </FormGroup>
                        <FormGroup>
                            <Label for='score'>Enter TM Score</Label>
                            <Input type='number' name='score' id='score' placeholder='Enter Student Timemarks Score' />
                        </FormGroup>
                        <FormGroup>
                            <Label for="subject">subjects</Label>
                            <Input
                                type="select"
                                name="subject"
                                id="subject" >
                                <option>--select--</option>
                                {subjects.map((sub) => <option key={`temp-${sub.subject}`}>{sub.subject}</option>)}
                            </Input>
                        </FormGroup>
                        <Button type='submit' color="primary" >Add</Button>
                    </Form>}
                </ModalBody>
                <ModalFooter>
                    {/* <Button type='submit' color="primary" >Update</Button>{' '} */}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default AddStudentModal;