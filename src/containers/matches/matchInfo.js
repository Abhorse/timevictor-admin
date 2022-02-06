import React, { Component } from 'react';
import FirestoreDatabase from '../../backend/firestoreDatabase';
import { Loader } from '../../components/loader';
import { ListGroupItem, ListGroup, Row, Col, Progress, Nav, NavItem, NavLink, TabContent, TabPane, Form, FormGroup, Label, Input, Button, Card, CardBody, CardHeader } from 'reactstrap';
import MatchContest from '../../models/contest';
import Match from '../../models/match';
import MatchTeamLogo from '../../components/matchTeamLogo';
import FormatDateTime from '../../utils/dateTimeFormator';
import StudentEditModal from './studentEditModal';
import AddStudentModal from './addStudentModal';
import ContestLeaderBoard from './Leaderboard';
import EditContestModal from './edit_contest_modal';
import EditDateModal from './edit_date_modal';
import TimemarksAPI from '../../backend/timemarksAPIs';

class MatchInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            matchInfo: {},
            startTime: Date.now(),
            matchContests: [],
            tab: 1,
            awardTemplates: [],
            selectedAwardTemp: null,
            isContestFormLoading: false,
            errorMsg: '',
            teamAStudents: [],
            teamBStudents: [],
            subjects: [],
            scoreErrorMsg: '',
            successMsg: '',
            updateScoreLoader: false,
        }
    }

    getMatchID() {
        var matchID = window.location.href.split('/').pop();
        matchID = matchID.replace('%20', ' ');
        return matchID;
    }
    toggleLoading(bool) {
        this.setState(state => state.isLoading = bool);
    }

    toggleFormLoader(bool) {
        this.setState(state => state.isContestFormLoading = bool);
    }

    setErrorMsg(msg) {
        this.setState(state => state.errorMsg = msg);
    }

    setScoreErrorMsg(msg) {
        this.setState(state => state.scoreErrorMsg = msg);
    }
    setSuccessMsg(msg) {
        this.setState(state => state.successMsg = msg);
    }

    toggleTab(tab) {
        if (this.state.tab !== tab) {
            this.setState(state => state.tab = tab);
        }
    }
    componentDidMount() {
        this.toggleLoading(true);
        var matchID = this.getMatchID();

        Promise.all([FirestoreDatabase.getMatchInfo(matchID),
        FirestoreDatabase.getMatchContests(matchID),
        FirestoreDatabase.getPrizeTemplates(),
        FirestoreDatabase.getStudents(matchID, true),
        FirestoreDatabase.getStudents(matchID, false),
        FirestoreDatabase.getSubjects(matchID),
        ]).then((querySnapshot) => {

            const matchInfo = querySnapshot[0].data();
            const sec = matchInfo.startTime.toDate();
            const matchContests = querySnapshot[1].docs.map(doc => new MatchContest(doc.data()));
            const prizeTemp = querySnapshot[2].docs.map(doc => doc.data());
            const teamAStudents = querySnapshot[3].docs.map(doc => doc.data());
            const teamBStudents = querySnapshot[4].docs.map(doc => doc.data());
            const subjects = querySnapshot[5].docs.map(doc => doc.data());
            this.setState({
                ...this.state,
                matchInfo: new Match(matchInfo),
                matchContests: matchContests,
                awardTemplates: prizeTemp,
                startTime: sec,
                teamAStudents: teamAStudents,
                teamBStudents: teamBStudents,
                subjects: subjects,
            })


        }).catch((e) => {
            console.log('Error', e);
        }).finally(() => {
            this.toggleLoading(false);
        })
    }

    getContestCartList() {
        if (this.state.matchContests.length === 0) {
            return <center>No Data</center>;
        }
        return <ListGroup>
            {this.state.matchContests.map((constest) => <ListGroupItem
                key={`contest-${constest.id}`}
                style={{ margin: 5 }}>
                {/* <div>Max Prize: {constest.maxPrize}</div> */}
                <Row >
                    <Col >
                        <h6>Max Prize: <b>{constest.maxPrize}</b></h6>
                        <Row>
                            <Col>
                                <h6>Current Prize: <b>{constest.currentPrize}</b></h6>
                            </Col>
                            {/* <Col> */}
                               {/* <Button color=''> */}
                                {/* <i style={{color:"blue"}} className='fas fa-edit'></i> */}
                               {/* </Button> */}
                            {/* </Col> */}
                        </Row>
                    </Col>
                    <Col style={{ textAlign: 'center' }}>
                        <ContestLeaderBoard
                            buttonLabel={'LeaderBoard'}
                            contestData={constest}
                            matchID={this.getMatchID()}
                        />
                    </Col>
                    <Col style={{ textAlign: 'end' }}>
                        <h6>Entry: </h6>
                        <h5>{constest.entry}</h5>
                    </Col>
                </Row>
                <Row >
                    <Col> <Progress animated color="info" value={(constest.joinedUsers.length / constest.maxLimit) * 100} /></Col>
                </Row>
                <Row>
                    <Col>
                        Available Spots: {constest.maxLimit - constest.joinedUsers.length}
                    </Col>
                    <Col style={{ textAlign: 'end' }}>
                        Max Spots: {constest.maxLimit}
                    </Col>
                </Row>
                <Row>
                   <Col>
                        <EditContestModal 
                                buttonLabel={  <i style={{color:"blue"}} className='fas fa-edit'></i>}
                                contestData={constest}
                                matchID={this.getMatchID()}
                        />
                   </Col>
                </Row>
            </ListGroupItem>)}
        </ListGroup>
    }

    getMatchDetails() {
        var matchInfo = this.state.matchInfo;
        var startTime = FormatDateTime.format(this.state.startTime);

        return <div style={{ border: 'dashed', borderColor: 'blue' }}>
            <Row style={{ margin: 5 }}>
                <Col style={{ textAlign: 'center' }}>{matchInfo.teamAName}
                    <MatchTeamLogo imageURL={matchInfo.teamAImageURL} /></Col>
                <Col style={{ textAlign: 'center' }}>VS
                    <div>
                       <Col>
                       <i style={{margin: 5}} className="fas fa-stopwatch"></i> 
                        {startTime}
                        </Col>
                       <Col>
                       Duration: {matchInfo.duration} Min</Col>
                        <EditDateModal
                            buttonLabel={<i style={{color: 'blue'}} className="fas fa-edit"></i>}
                            startTime={startTime}
                            match={matchInfo}
                        />
                        </div>
                </Col>
                <Col style={{ textAlign: 'center' }}>{matchInfo.teamBName}
                    <MatchTeamLogo imageURL={matchInfo.teamBImageURL} />
                </Col>
            </Row>
            <br />
        </div>
    }

    getTabs() {
        return <Nav tabs>
            <NavItem>
                <NavLink
                    className={` ${this.state.tab === 1 ? 'active' : ''}`}
                    onClick={() => { this.toggleTab(1); }}>
                    Contests
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={` ${this.state.tab === 2 ? 'active' : ''}`}
                    // className={classnames({ active: this.state.tab === 2 })}
                    onClick={() => { this.toggleTab(2); }}>
                    Add Contest
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={` ${this.state.tab === 3 ? 'active' : ''}`}
                    // className={classnames({ active: this.state.tab === 2 })}
                    onClick={() => { this.toggleTab(3); }}>
                    Students
                </NavLink>
            </NavItem>
        </Nav>
    }

    getTabContent() {
        return <TabContent activeTab={`${this.state.tab}`}>
            <TabPane tabId="1">
                <br />
                {!this.state.isLoading && this.getContestCartList()}
            </TabPane>
            <TabPane tabId="2">
                {this.state.isContestFormLoading && <Loader />}
                {!this.state.isLoading && !this.state.isContestFormLoading && this.addContestForm()}

            </TabPane>
            <TabPane tabId="3">
                <br />
                {!this.state.isLoading && this.studentsList()}

            </TabPane>
        </TabContent>;
    }

    addContestForm() {

        return <Form onSubmit={this.onSubmitContestForm}>
            <br />
            <div style={{ color: this.state.errorMsg.includes('Successfully') ? 'green' : 'red' }}>{this.state.errorMsg}</div>
            <Row>
                <Col>
                    <FormGroup>
                        <Label for="MaxPrize">Contest Prize</Label>
                        <Input type='number' name="maxPrize" id="MaxPrize" placeholder="Enter Contest Prize" />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label for="MaxPlayers">Players Limit</Label>
                        <Input type='number' name="maxPlayers" id="MaxPlayers" placeholder="Enter Maxinum Player Limit" />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label for="EntryAmount">Entry Amount</Label>
                        <Input type='number' name="entryAmount" id="EntryAmount" placeholder="Enter Entry Amount" />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <Label for="AwardTemplate">Award/Prize Template</Label>
                        <Input
                            type="select"
                            name="awardTemplate"
                            id="AwardTemplate"
                            onChange={this.onTempSelect.bind(this)}>
                            <option>--select--</option>
                            {this.state.awardTemplates.map((temp) => <option key={`temp-${temp.name}`}>{temp.name}</option>)}
                        </Input>
                    </FormGroup>
                </Col>
                <Col>
                    {this.state.selectedAwardTemp && <Card>
                        <CardHeader>
                            <Row>
                                <Col style={{ textAlign: 'center' }}> <h5> RANK</h5>
                                </Col>
                                <Col style={{ textAlign: 'center' }}> <h5> PRIZE(in %)</h5></Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            {this.getSelectedAwardTemp()}

                        </CardBody>
                    </Card>}
                </Col>
            </Row>

            <Button>Submit</Button>
        </Form>
    }

    getSelectedAwardTemp() {
        if (this.state.selectedAwardTemp) {
            return this.state.selectedAwardTemp.awards.map((a) => <Row key={`award-${a.from}`}>
                <Col style={{ textAlign: 'center' }}>#{a.from === a.to ? a.from : `${a.from} - ${a.to}`}</Col>
                <Col style={{ textAlign: 'center' }}>{a.prize}%</Col>
            </Row>);
        } else {
            return <h3> Yes</h3>;
        }
    }

    onTempSelect(event) {
        console.log('selected', event.target.value);
        const selectedAwardTemp = this.state.awardTemplates.find(e => e.name === event.target.value);
        console.log(selectedAwardTemp);
        if (selectedAwardTemp) {
            this.setState(state => state.selectedAwardTemp = selectedAwardTemp);
        } else {
            this.setState(state => state.selectedAwardTemp = null);
        }
    }

    onSubmitContestForm = async (e) => {
        e.preventDefault();
        // console.log(e.target);
        this.setErrorMsg('');
        const data = new FormData(e.target);
        const maxPrize = data.get('maxPrize');
        const maxPlayers = data.get('maxPlayers');
        const entryAmount = data.get('entryAmount');
        if (maxPrize && maxPlayers && entryAmount && this.state.selectedAwardTemp) {
            // console.log('Data', maxPrize, maxPlayers, entryAmount, this.state.selectedAwardTemp);
            this.toggleFormLoader(true)
            await FirestoreDatabase.createContest(this.getMatchID(),
                {
                    id: `pool_${this.state.matchInfo.totalPools + 1}`,
                    awards: this.state.selectedAwardTemp.awards,
                    currentCount: 0,
                    currentPrize: parseInt(maxPrize),
                    entry: parseInt(entryAmount),
                    joinedUsers: [],
                    maxLimit: parseInt(maxPlayers),
                    maxPrize: parseInt(maxPrize),
                },
                this.state.matchInfo.totalPools);
            this.componentDidMount();
            this.toggleFormLoader(false);
            this.setErrorMsg('Successfully added Contest');
        } else {
            this.setErrorMsg('Please Fill all Fields');
        }

    }

    getStudentsList(teamName, matchID, isTeamA, students) {
        return <Col><ListGroup>
            <h5>{teamName}</h5>
            <ListGroupItem key={`${teamName}-stu-header`}>
                <Row>
                    <Col>Name</Col>
                    <Col>Score</Col>
                    <Col>Subject</Col>
                    <Col>Quiz Marks</Col>
                    <Col>
                        <AddStudentModal
                            buttonLabel={<i className="fa fa-plus">Add</i>}
                            isTeamAStudent={isTeamA}
                            matchID={matchID}
                            onSuccess={this.refresh}
                            subjects={this.state.subjects}
                            teamName={teamName}
                        />
                    </Col>
                </Row>
            </ListGroupItem>
            {students.map((s) => <ListGroupItem key={`student-${s.id}`}>
                <Row>
                    <Col>{s.name ?? 'NA'}</Col>
                    <Col>{s.score ?? 'NA'}</Col>
                    <Col>{s.subject ?? 'NA'}</Col>
                    <Col>{s.quizMarks ?? 'NA'}</Col>
                    <Col style={{ textAlign: 'end' }}>
                        <StudentEditModal
                            buttonLabel={<i className="fas fa-edit"></i>}
                            student={s}
                            matchID={matchID}
                            isTeamAStudent={isTeamA}
                            onSuccess={this.refresh}
                        />
                        {/* <Button color=''><i className="fas fa-edit"></i></Button> */}
                    </Col>
                </Row>
            </ListGroupItem>)}
        </ListGroup></Col>;
    }
     updateStudentScore = async(matchID) => {
        // console.log(matchID, this.state.teamAStudents,  this.state.teamBStudents)
        try{
            // 
            this.setState((state) => state.updateScoreLoader = true);
            const sponsors = await TimemarksAPI.getSponsorsByQuiz(this.state.matchInfo.quizId);
            // console.log(sponsors.data);
            var teamA = [];
            var teamB = [];
            if(sponsors.data.list[0].name === this.state.matchInfo.teamAName) {
                teamA = sponsors.data.list[0].students;
                teamB = sponsors.data.list[1].students
            } else {
                teamA = sponsors.data.list[1].students;
                teamB = sponsors.data.list[0].students
            }

            await FirestoreDatabase.updateAllStudentMark(matchID, teamA, teamB);
            alert('Score updated successfully');
        } catch (e) {
            alert('Error while updateing scores' + e.message);
        } finally {
            this.setState((state) => state.updateScoreLoader = false);

        }
    }

    studentsList = () => {
        const matchID = this.getMatchID();
        return <div>
            <Row>
                <Col></Col>
                <Col>
                {this.state.updateScoreLoader && <Loader />}
                {!this.state.updateScoreLoader && <Button onClick={() => this.updateStudentScore(matchID)}>Update Quiz Score from Timemarks</Button>}
                </Col>
                <Col></Col>
            </Row>
            <br />
            <Row>
                {this.getStudentsList(this.state.matchInfo.teamAName, matchID, true, this.state.teamAStudents)}
                {this.getStudentsList(this.state.matchInfo.teamBName, matchID, false, this.state.teamBStudents)}
            </Row>
            </div>
    }

    refresh = () => {
        this.componentDidMount();
    }

    updateAllLeaderboard = async () => {
        var response = prompt('Are you sure to update all contest\'s leaderboard? If yes then please write UPDATE in the box. Thanks');

        if(response === 'UPDATE') {
            this.toggleLoading(true);
            const matchID = this.getMatchID();
            var errosMsg = 'Not able to update following contests: ';
            for (var contest of this.state.matchContests) {
                console.log(matchID, contest.id);
                try {
                    await FirestoreDatabase.updateLeaderboard(matchID, contest.id);
                } catch (e) {
                    errosMsg = errosMsg + ' { contest id: ' + contest.id + e.message + ' }';
                    console.log(e);
                }
            }
            this.setScoreErrorMsg(errosMsg);
            console.log('Error', errosMsg);
            this.toggleLoading(false);
        }

        // try {
        //     this.toggleLoading(true);
        //     const matchID = this.getMatchID();
        //     for (var contest of this.state.matchContests) {
        //         console.log(matchID, contest.id);
        //         await FirestoreDatabase.updateLeaderboard(matchID, contest.id);
        //     }
        //     this.toggleLoading(false);
        // } catch (e) {
        //     this.toggleLoading(false);
        //     console.log(e);
        // } finally {
        //     // this.componentDidMount();
        // }

    }

    distributePrizes = async () => {
        const response = prompt('are you sure to destribute prizes now? If yes then please write PRIZE in the BOX');

        if(response === 'PRIZE') {
            this.toggleLoading(true);
            const matchID = this.getMatchID();
            var errosMsg = 'Not able to distribute prizes in following contests: ';
            for (var contest of this.state.matchContests) {
                console.log(matchID, contest.id);
                try {
                    await FirestoreDatabase.distributePrizes(matchID, contest.id);
                } catch (e) {
                    errosMsg = errosMsg + ' { contest id: ' + contest.id + e.message + ' }';
                    console.log(e);
                }
            }
            this.setScoreErrorMsg(errosMsg);
            console.log('Error', errosMsg);
            this.toggleLoading(false);
        }
        

    }


    render() {
        return (
            <React.Fragment>
                {this.state.isLoading && <Loader />}
                {!this.state.isLoading && this.getMatchDetails()}
                {!this.state.isLoading && <Row>
                    <Col>
                        <Button
                            onClick={this.updateAllLeaderboard}
                            style={{ margin: 10 }}
                            color='danger'>Update All LeaderBoard Score
                    </Button>
                    </Col>
                   {FormatDateTime.isClosed(this.state.matchInfo.endTime) && <Col>
                        <Button
                            onClick={this.distributePrizes}
                            style={{ margin: 10 }}
                            color='danger'> Distribute Prizes
                           
                        </Button>
                    </Col>}
                    <Col style={{ textAlign: 'end' }}>
                        <Button
                            onClick={this.refresh}
                            style={{ margin: 10 }}
                        >Refresh
                    </Button>
                    </Col>
                </Row>}
                {!this.state.isLoading && <Row>
                    {this.state.scoreErrorMsg.includes('contest id') &&
                        <Col style={{ color: 'red' }}>
                            {this.state.scoreErrorMsg}
                        </Col>}
                    {this.state.scoreErrorMsg !== '' && !this.state.scoreErrorMsg.includes('contest id') &&
                        <Col style={{ color: 'green' }}>
                            Successfully Updated All LeaderBoards
                        </Col>}
                </Row>}
                {!this.state.isLoading && this.getTabs()}
                {!this.state.isLoading && this.getTabContent()}
                {/* {!this.state.isLoading && this.getContestCartList()} */}

            </React.Fragment>
        )
    }
}

export default MatchInfo;