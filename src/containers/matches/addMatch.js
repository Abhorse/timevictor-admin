import React, { Component } from 'react';
import { Card, Row, Col, Input, InputGroup, Label, Form, FormGroup, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Loader } from '../../components/loader';
import FirestoreDatabase from '../../backend/firestoreDatabase';

class AddMatch extends Component {
    state = {
        showMatchInfoForm: true,
        matchInfoFormErrorMsg: '',
        matchInfo: {},
        showSubjectForm: false,
        subjectFormErrorMsg: '',
        subjectList: [],
        showStudentForm: false,
        teamAStudents: [],
        teamBStudents: [],
        showVerifyAndSubmitForm: false,
        isLoading: false,
        successMes: ''
    }

    changeMatchInfoErrorMsg(msg) {
        this.setState(state => state.matchInfoFormErrorMsg = msg)
    }

    toggleLoader(status) {
        this.setState(state => state.isLoading = status);
    }

    async submitMatch() {
        try {
            //
            this.toggleLoader(true);
            this.toggleForms('');
            await FirestoreDatabase.addMatch(this.state.matchInfo, this.state.subjectList, this.state.teamAStudents, this.state.teamBStudents);
            this.setState({
                ...this.state,
                showMatchInfoForm: true,
                matchInfoFormErrorMsg: '',
                matchInfo: {},
                showSubjectForm: false,
                subjectFormErrorMsg: '',
                subjectList: [],
                showStudentForm: false,
                teamAStudents: [],
                teamBStudents: [],
                showVerifyAndSubmitForm: false,
                isLoading: false,
                successMes: 'Successfully added match.'
            })
        } catch (e) {
            this.toggleLoader(false);
            this.setState(state => state.successMes = e.message);
            console.log(e);
        }
    }

    toggleForms(action) {

        switch (action) {
            case 'matchInfoForm':
                this.setState({
                    ...this.state,
                    showMatchInfoForm: true,
                    showSubjectForm: false,
                    showStudentForm: false,
                    showVerifyAndSubmitForm: false,
                })
                break;
            case 'subjectForm':
                this.setState({
                    ...this.state,
                    showMatchInfoForm: false,
                    showSubjectForm: true,
                    showStudentForm: false,
                    showVerifyAndSubmitForm: false,
                })
                break;
            case 'studentForm':
                this.setState({
                    ...this.state,
                    showMatchInfoForm: false,
                    showSubjectForm: false,
                    showStudentForm: true,
                    showVerifyAndSubmitForm: false,
                })
                break;
            case 'verification':
                this.setState({
                    ...this.state,
                    showMatchInfoForm: false,
                    showSubjectForm: false,
                    showStudentForm: false,
                    showVerifyAndSubmitForm: true,
                })
                break;
            default:
                this.setState({
                    ...this.state,
                    showMatchInfoForm: false,
                    showSubjectForm: false,
                    showStudentForm: false,
                    showVerifyAndSubmitForm: false,
                })

        }
    }

    matchInfoValidator(e) {
        e.preventDefault();
        this.changeMatchInfoErrorMsg('')
        const formData = new FormData(e.target);
        Date.prototype.addMinutes = function (m) {
            this.setTime(this.getTime() + (m * 60 * 1000));
            return this;
        }
        var startTime = new Date(formData.get('startDateAndTime'));
        var duration = parseInt(formData.get('duration'));
        var endTime = new Date(formData.get('startDateAndTime')).addMinutes(duration);

        const matchInfo = {
            teamAName: formData.get('teamAName'),
            teamALogo: formData.get('teamALogo'),
            teamBName: formData.get('teamBName'),
            teamBLogo: formData.get('teamBLogo'),
            duration: duration,
            startDate: startTime,
            endTime: endTime,
            studentCount: formData.get('studentCount')
        }
        const isValidForm = matchInfo.teamAName && matchInfo.teamBName && matchInfo.teamALogo && matchInfo.teamBLogo && matchInfo.duration && matchInfo.startDate && matchInfo.studentCount;
        console.log(matchInfo);

        if (isValidForm) {
            console.log('i');
            this.setState(state => state.matchInfo = matchInfo);
            this.setState({
                ...this.state,
                matchInfo: matchInfo,
                showMatchInfoForm: false,
                showSubjectForm: true,
            })
        } else {
            this.changeMatchInfoErrorMsg('All field are required!');
        }

    }

    matchInfoForm() {
        return <Form onSubmit={this.matchInfoValidator.bind(this)}>
            <Row>
                <Col>
                    <FormGroup>
                        <Label for='teamAName'>First Team Name</Label>
                        <Input type='text' name='teamAName' id='teamAName' />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label for='teamBName'>Second Team Name</Label>
                        <Input type='text' name='teamBName' id='teamBName' />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <Label for='teamALogo'>First Team Logo URL</Label>
                        <Input type='text' name='teamALogo' id='teamALogo' />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label for='teamBLogo'>Second Team Logo URL</Label>
                        <Input type='text' name='teamBLogo' id='teamBLogo' />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col sm='3'>
                    <FormGroup>
                        <Label for='duration'>Match Duration (in Min)</Label>
                        <Input type='number' name='duration' id='duration' />
                    </FormGroup>
                </Col>
                <Col sm='6'>
                    <FormGroup>
                        <Label for='startDateAndTime'>Match Start Date & Time</Label>
                        <Input valid type='datetime-local' name='startDateAndTime' id='startDateAndTime' />
                    </FormGroup>
                </Col>
                {/* <Col sm='3'>
                    <FormGroup>
                        <Label for='startTime'>Match Start Time</Label>
                        <Input valid type='time' name='startTime' id='startTime' />
                    </FormGroup>
                </Col> */}
                <Col sm='3'>
                    <FormGroup>
                        <Label for='studentCount'>Number of Students in users Team</Label>
                        <Input valid type='number' name='studentCount' id='studentCount' />
                    </FormGroup>
                </Col>
            </Row>
            <Row >
                <Col style={{ color: 'red' }}>
                    {this.state.matchInfoFormErrorMsg}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button color='primary' type='submit'>Next</Button>
                </Col>
            </Row>

        </Form>;
    }


    addSubject(e) {
        e.preventDefault()
        this.setState(state => state.subjectFormErrorMsg = '')
        const data = new FormData(e.target);
        const subjectData = {
            subject: data.get('subjectName'),
            minStudents: parseInt(data.get('minStudents')),
            maxStudents: parseInt(data.get('maxStudents')),
        }


        if (subjectData.subject && subjectData.minStudents && subjectData.maxStudents) {

            var newSubjectList = this.state.subjectList.concat([]);
            // console.log(newSubjectList.includes((sub) => sub.name === subjectData.name, 0));
            // if (newSubjectList.includes((sub) => sub.name === subjectData.name, 0)) {
            //     this.setState(state => state.subjectFormErrorMsg = 'already exits!')
            // } else {
            newSubjectList.push(subjectData);
            this.setState({
                ...this.state,
                subjectList: newSubjectList,
            })
            // console.log(this.state.subjectList);
            // console.log(this.state);
            // }

        } else {
            this.setState(state => state.subjectFormErrorMsg = 'all fields are required!')
        }
    }


    subjectForm() {
        return <div> <Form onSubmit={this.addSubject.bind(this)}>
            <Row>
                <Col>
                    <FormGroup>
                        <Label for='subjectName'>Subject Name</Label>
                        <Input type='text' name='subjectName' id='subjectName' />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label for='minStudents'>Mininum Student in Team</Label>
                        <Input type='number' name='minStudents' id='minStudents' />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label for='maxStudents'>Maximum Student in Team</Label>
                        <Input type='number' name='maxStudents' id='maxStudents' />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col style={{ color: 'red' }}>
                    {this.state.subjectFormErrorMsg}
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button type='submit' color='primary'>Add</Button>
                </Col>
            </Row>

        </Form>
            <br />
            <ListGroup>
                {this.state.subjectList.map((subject, index) =>
                    <ListGroupItem style={{ margin: 5 }} key={`subject-${index}`}>
                        <Row>
                            <Col>
                                {subject.subject}
                            </Col>
                            <Col>
                                Minimun Students: {subject.minStudents}
                            </Col>
                            <Col>
                                Maximum Students: {subject.maxStudents}
                            </Col>
                        </Row>
                    </ListGroupItem>
                )}
            </ListGroup>
            <br />
            <Row>
                <Col>
                    <Button onClick={() => this.toggleForms('matchInfoForm')} >Privious</Button>
                </Col>
                <Col>
                    <Button onClick={() => this.toggleForms('studentForm')}  >Next</Button>
                </Col>
            </Row>
        </div>
    }



    addStudents(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const student = {
            id: data.get('studentID'),
            name: data.get('studentName'),
            profilePic: data.get('profileURL'),
            score: data.get('tmScore'),
            subject: data.get('subject'),
        }

        if (this.state.matchInfo.teamAName === data.get('team')) {
            var newStudentList = this.state.teamAStudents.concat([student]);

            this.setState({
                ...this.state,
                teamAStudents: newStudentList,
            })
        } else if (this.state.matchInfo.teamBName === data.get('team')) {
            var newStudentList = this.state.teamBStudents.concat([student]);

            this.setState({
                ...this.state,
                teamBStudents: newStudentList,
            })
        }
    }

    studentForm() {
        return <div>
            <Form onSubmit={this.addStudents.bind(this)}>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for='studentID'>Student ID</Label>
                            <Input type='text' name='studentID' id='studentID' />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for='studentName'>Student Name</Label>
                            <Input type='text' name='studentName' id='studentName' />
                        </FormGroup>
                    </Col>

                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for='profileURL'>Profile Picture URL</Label>
                            <Input type='text' name='profileURL' id='profileURL' />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="team">Team</Label>
                            <Input type="select" name="team" id="team">
                                <option>{this.state.matchInfo.teamAName}</option>
                                <option>{this.state.matchInfo.teamBName}</option>
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for='tmScore'>Timemarks Score</Label>
                            <Input type='number' name='tmScore' id='tmScore' />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="subject">Subject</Label>
                            <Input type="select" name="subject" id="subject">
                                {this.state.subjectList.map((sub) => <option>{sub.subject}</option>)}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col><Button type='submit'>Add</Button></Col>
                </Row>
            </Form>

            <hr />
            <Row>
                <Col>Team {this.state.matchInfo.teamAName} Students
                <ListGroup>
                        {this.state.teamAStudents.map((student, index) => <ListGroupItem key={`teamA-stu-${index}`}>
                            <Row>
                                <Col> {student.id}</Col>
                                <Col> {student.name}</Col>
                                <Col> {student.subject}</Col>
                            </Row>
                        </ListGroupItem>)}
                    </ListGroup>
                </Col>
                <Col>Team {this.state.matchInfo.teamBName} Students
                <ListGroup>
                        {this.state.teamBStudents.map((student, index) => <ListGroupItem key={`teamB-stu-${index}`}>
                            <Row>
                                <Col> {student.id}</Col>
                                <Col> {student.name}</Col>
                                <Col> {student.subject}</Col>
                            </Row>
                        </ListGroupItem>)}
                    </ListGroup>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col>
                    <Button onClick={() => this.toggleForms('subjectForm')}>Previous</Button>
                </Col>
                <Col>
                    <Button onClick={() => this.toggleForms('verification')}>Verify</Button>
                </Col>
            </Row>
        </div>
    }



    verifyAndSubmitForm() {
        return <div>
            <Row>
                <Col>
                    <Button onClick={() => this.toggleForms('studentForm')}>Back</Button>
                </Col>
                <Col>
                    <Button onClick={this.submitMatch.bind(this)}>Create Match</Button>
                </Col>
            </Row>
        </div>
    }

    render() {
        return (
            <React.Fragment>
                <center><h4><b>Add Timemarks Match</b></h4></center>
                {this.state.successMes !== '' && <center><b><div style={{ color: 'green' }}>Successfully Added Match, You can review and approve it form match section.</div></b></center>}
                {this.state.isLoading && <Loader />}
                {this.state.showMatchInfoForm && this.matchInfoForm()}
                {this.state.showSubjectForm && this.subjectForm()}
                {this.state.showStudentForm && this.studentForm()}
                {this.state.showVerifyAndSubmitForm && this.verifyAndSubmitForm()}
            </React.Fragment>
        );
    }
}

export default AddMatch;