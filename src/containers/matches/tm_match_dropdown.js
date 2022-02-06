import React, { useState, useEffect } from 'react';
import { Input, Label, Card, Row, Col, FormGroup, Button, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody } from 'reactstrap';
import FirestoreDatabase from '../../backend/firestoreDatabase';
import TimemarksAPI from '../../backend/timemarksAPIs';
import { Loader } from '../../components/loader';
import MatchTeamLogo from '../../components/matchTeamLogo';
import { VAR_STR } from '../../Variables';

const TMMatchDropdown = (props) => {

    const {
        onSelect
    } = props;

    const [isLoding, setLoading] = useState(false);
    const [sopnsorLoader, setSponsorLoader] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [showSponsors, setShowSponsors] = useState(false);
    const [modal, setModal] = useState(false);
    const [loadTeam, setLoadTeam] = useState(false);
    const [sponsorsTeam, setSponsorsTeam] = useState([]);

    const toggle = () => {
        setModal(!modal);
    }

    const reloadPage = () => {
        fetchData();
    }

    async function fetchData() {
        try {
            setLoading(true);
            const response = await TimemarksAPI.getAllUnMappedMatches();
            console.log(response.data);
            setQuizzes(response.data);
        } catch (e) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const onChangeSelect = (e) => {
        const quizId = e.target.options[e.target.selectedIndex].dataset.id
        // console.log(quizId, typeof (quizId));
        const quiz = quizzes.list.find((q) => q.id === quizId);
        // console.log(quiz);
        setSelectedQuiz(quiz);
        setShowSponsors(false);
    }
    const alignLeft = {
        textAlign: 'left'
    }
    const alignRight = {
        textAlign: 'right'
    }
    const getDatapair = (label, value) => <Row>
        <Col>
            <Row>
                <Col sm={4} style={alignRight}> <b>{label}:</b>
                </Col>
                <Col sm='8' style={alignLeft}>  {value}
                </Col>

            </Row>
        </Col>
    </Row>;
    const getSelectedQuizData = () => {
        if (selectedQuiz) {
            return <Row style={{ textAlign: 'center' }}>
                <Col>
                    <Row>
                        <Col sm='7'>
                            {getDatapair('QUIZ ID', selectedQuiz.id)}
                            {getDatapair('Start Date', selectedQuiz.calender_start_date)}
                            {getDatapair('End Date', selectedQuiz.calender_end_date)}
                            {getDatapair('Reward Time', selectedQuiz.calender_reward_time)}
                            {getDatapair('Duration', selectedQuiz.time)}
                            {getDatapair('Students in a Team', selectedQuiz.number_of_team_member)}
                        </Col>
                        <Col sm='5' style={{ textAlign: 'left' }}>
                            {selectedQuiz.subjects.map((subject, index) => getDatapair(`Subject-${index + 1}`, subject.new_chapter_name))}
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <Button
                                color='primary'
                                onClick={getSponsorsListByQuiz}>
                                Select & Next
                            </Button>
                        </Col>
                    </Row>
                    <br />
                </Col>
            </Row>
        } else {
            return <center><b style={{ color: 'red' }}>Please select a quiz</b></center>
        }
    }

    const getSponsorsListByQuiz = async () => {
        try {
            setSponsorLoader(true);
            const response = await TimemarksAPI.getSponsorsByQuiz(selectedQuiz.id);
            console.log(response.data);
            if (response.data) {
                setSponsors(response.data.list);
            } else {
                setSponsors([]);
            }

            setShowSponsors(true);
        } catch (e) {
            alert(e.message);
        } finally {
            setSponsorLoader(false);
        }
    }

    const showTeam = async (sponsorID, students) => {
        console.log(sponsorID);
        try {
            setLoadTeam(true);
            toggle()
            // const response = await TimemarksAPI.getSponsorsTeam(sponsorID, selectedQuiz.id);
            setSponsorsTeam(students)
            // console.log(response.data);
        } catch (e) {
            alert(e.message);
        } finally {
            setLoadTeam(false);
        }

    }

    const TeamModal = () => {
        return <Modal size="lg" isOpen={modal} toggle={toggle} >
            <ModalHeader>
                Team Name
            </ModalHeader>
            <ModalBody>
                {loadTeam && <Loader />}
                {!loadTeam && <ListGroup>

                    {sponsorsTeam && sponsorsTeam.map((s, index) => <ListGroupItem key={`stu-${index}`}>
                        <Row>
                            <Col>  {s.team_name}</Col>
                            <Col>  {s.image}</Col>
                            <Col>  {s.quiz_score}</Col>
                            <Col>  {s.timemarks_avg_points}</Col>
                            {/* <Col>  {s.rank}</Col> */}
                        </Row>
                    </ListGroupItem>)}
                </ListGroup>}
            </ModalBody>
        </Modal>
    }

    const getImageName = (image) => {
        if (image) {
            const splitArray = image.split("/");
            return splitArray[splitArray.length - 1];
        }
        return null;
    }
    const renderSponsors = () => {
        console.log('sp', sponsors);
        if (sponsors === null || sponsors === undefined) {
            return <b>There is not any sponsor added yet!</b>
        }
        return <Row>
            {sponsors.length !== 0 && sponsors.map((sponsor, index) => <Col key={`key-spons-${index}`} sm='6'>
                <ListGroup>
                    <ListGroupItem color='primary'>
                        <Row>
                            <Col>
                                <MatchTeamLogo imageURL={VAR_STR.IMAGE_URL + getImageName(sponsor.image)} />
                            </Col>
                            <Col>
                                <b> {sponsor.name}'s Team</b>
                                {sponsor.sponsor_type === '1' && <i style={{ color: 'green' }} className="fas fa-certificate"></i>}
                            </Col>

                        </Row>
                    </ListGroupItem>
                </ListGroup>
                <hr />
                <ListGroup>
                    <ListGroupItem color='dark' key={`stu-main`}>
                        <Row>
                            <Col>
                                <b>Image</b>
                            </Col>
                            <Col>
                                <b>Name</b>
                            </Col>
                            <Col><b>Timemarks Point</b></Col>
                            <Col><b>Recommended Subject</b></Col>
                        </Row>
                    </ListGroupItem>
                    {sponsor.students.map((stu, index) => <ListGroupItem key={`stu-${index}`}>
                        <Row>
                            <Col>
                                <MatchTeamLogo imageURL={VAR_STR.IMAGE_URL + getImageName(stu.team_image)} />
                            </Col>
                            <Col>
                                <b> {stu.team_name}</b>
                            </Col>
                            <Col>{stu.timemarks_avg_points}</Col>
                            <Col>{getRecommendedSubject(stu.subject_ids)}</Col>
                        </Row>
                    </ListGroupItem>)}
                </ListGroup>
            </Col>)
            }
        </Row>
    }

    const getRecommendedSubject = (subjectid) => {
        var random = Math.floor(Math.random() * ((selectedQuiz.subjects.length - 1) - 0 + 1)) + 0;

        if (subjectid) {
            const sub = selectedQuiz.subjects.find((sub) => sub.id === subjectid);
            if (sub) {
                return sub.new_chapter_name;
            }
            return selectedQuiz.subjects[random].new_chapter_name
        } else {
            // try {
            //     // const studentData = await TimemarksAPI.getStudentProfileData(subjectid);
            //     // console.log('student Data: ', studentData);
            // } catch (e) {
            //     console.log(e);
            // }
            console.log(random, 'random');
            return selectedQuiz.subjects[random].new_chapter_name;
        }

    }

    const submitMatchData = async () => {
        const res = prompt('Are you sure to create this match on Timevictor? If yes the type YES in the input box. Thanks');

        if (res === 'YES') {

            const date1 = new Date(selectedQuiz.start_date);
            const date2 = new Date(selectedQuiz.end_date);
            const diffTime = Math.abs(date2 - date1);
            const diffMin = Math.ceil(diffTime / (1000 * 60));
            const matchInfo = {
                matchID: selectedQuiz.id,
                // teamAId: sponsors[0].
                teamAName: sponsors[0].name,
                // teamALogo: null,
                teamALogo: VAR_STR.IMAGE_URL + getImageName(sponsors[0].image),
                teamBName: sponsors[1].name,
                // teamBLogo: null,
                teamBLogo: VAR_STR.IMAGE_URL + getImageName(sponsors[1].image),
                totalPools: 0,
                showToAll: false,
                studentCount: parseInt(selectedQuiz.number_of_team_member) + 2,
                duration: diffMin,
                startDate: new Date(selectedQuiz.start_date),
                endTime: new Date(selectedQuiz.end_date),
                rewardTime: selectedQuiz.calender_reward_time,
            }

            const subjectList = selectedQuiz.subjects.map((sub) => {
                return {
                    maxStudents: 5,
                    minStudents: 1,
                    subject: sub.new_chapter_name,
                    id: sub.id,
                }

            })

            const teamAStudents = sponsors[0].students.map((stu) => {
                return {
                    id: stu.user_id,
                    name: stu.team_name,
                    // profilePic: null,
                    profilePic: stu.team_image !== '' ? VAR_STR.IMAGE_URL + getImageName(stu.team_image) : null,
                    quizMarks: null,
                    score: (parseFloat(stu.timemarks_avg_points) / 10).toFixed(2),
                    subject: getRecommendedSubject(stu.subject_ids)
                }
            })

            const teamBStudents = sponsors[1].students.map((stu) => {
                return {
                    id: stu.user_id,
                    name: stu.team_name,
                    // profilePic: null,
                    profilePic: stu.team_image !== '' ? VAR_STR.IMAGE_URL + getImageName(stu.team_image) : null,
                    quizMarks: null,
                    score: (parseFloat(stu.timemarks_avg_points) / 10).toFixed(2),
                    subject: getRecommendedSubject(stu.subject_ids)
                }
            })

            console.log(matchInfo, subjectList, teamAStudents, teamBStudents);

            try {
                setLoading(true);
                await FirestoreDatabase.addMatch(matchInfo, subjectList, teamAStudents, teamBStudents);
                alert('Match added successfully. Please review in match section.')
                setSponsors(null);
                setSelectedQuiz(null);
            } catch (e) {
                alert('Error while adding match: ' + e.message);
            } finally {
                setLoading(false);
            }
        }
    }


    return (
        <React.Fragment>
            {isLoding && <Loader />}
            {!isLoding && <Row>
                <Col>
                    <Card>
                        <Row>
                            <Col>
                                <FormGroup row style={{ margin: 20 }}>
                                    <Label for='TMMatch' sm={2}> <b>Select Quiz</b></Label>
                                    <Col sm={10}>
                                        <Input
                                            type="select"
                                            name="tm_Match"
                                            id="TMMatch"
                                            onChange={(e) => onChangeSelect(e)}
                                        >
                                            <option data-id=''>--select--</option>
                                            {quizzes.length !== 0 && quizzes.list.map((quiz, index) =>
                                                <option
                                                    data-id={quiz.id}
                                                    key={`quiz-${index}`}>
                                                    {`Quiz ( ID-${quiz.id} )`}
                                                </option>)
                                            }
                                        </Input></Col>
                                </FormGroup>
                            </Col>
                            <Col sm='2'><Button onClick={reloadPage} style={{ marginTop: 20 }} color=''><i className="fas fa-redo"></i></Button></Col>
                        </Row>
                        <hr />
                        {getSelectedQuizData()}
                    </Card>
                </Col>

            </Row>}
            {sopnsorLoader && <Loader />}
            {!sopnsorLoader && showSponsors && renderSponsors()}
            <br />
            { !sopnsorLoader && showSponsors && <Row>
                <Col></Col>
                <Col style={{ textAlign: 'center' }}>
                    <Button onClick={submitMatchData} color='primary'>Create Match</Button>
                </Col>
                <Col></Col>
            </Row>}
        </React.Fragment>
    );
}

export default TMMatchDropdown;