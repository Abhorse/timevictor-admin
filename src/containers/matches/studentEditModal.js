
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import FirestoreDatabase from '../../backend/firestoreDatabase';
import { Loader } from '../../components/loader';

const StudentEditModal = (props) => {
    const {
        buttonLabel,
        className,
        matchID,
        student,
        isTeamAStudent,
        onSuccess,
    } = props;

    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);


    const toggle = () => setModal(!modal);

    const updateStudentMarks = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        var newMarks = data.get('quizMarks');
        if (newMarks) {
            try {
                setLoading(true);
                await FirestoreDatabase.updateStudentMark(matchID, student, parseInt(newMarks), isTeamAStudent);
                toggle();
                onSuccess();
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }


    }

    return (
        <div>
            <Button color="primary" onClick={toggle}>{buttonLabel}</Button>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>Edit Student (Current Marks: {student.quizMarks ?? 'NA'})</ModalHeader>
                <ModalBody>
                    {loading && <Loader />}
                    {!loading && <Form onSubmit={updateStudentMarks}>
                        <FormGroup>
                            <Label for='QuizMarks'>Current Quiz Marks</Label>
                            <Input type='number' name='quizMarks' id='QuizMarks' />
                        </FormGroup>
                        <Button type='submit' color="primary" >Update</Button>
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

export default StudentEditModal;