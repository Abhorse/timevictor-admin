
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, ListGroup, ListGroupItem } from 'reactstrap';
import FirestoreDatabase from '../../backend/firestoreDatabase';
import { Loader } from '../../components/loader';

const ContestLeaderBoard = (props) => {
    const {
        buttonLabel,
        className,
        contestData,
        matchID,
    } = props;

    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [prizeLoading, setPrizeLoading] = useState(false);
    const [tab, setTab] = useState(1);
    const [joinedUsers, setJoinedUsers] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');


    const toggle = () => setModal(!modal);

    const getJoindUsers = async () => {
        console.log('intilal render ');
        const querySnapshot = await FirestoreDatabase.getJoinedUser(matchID, contestData.id);
        const joinedUsers = querySnapshot.docs.map(doc => doc.data());
        console.log(joinedUsers);
    }

    // useEffect(getJoindUsers, []);
    useEffect(() => {
        async function fetchData() {
            // You can await here
            const querySnapshot = await FirestoreDatabase.getJoinedUser(matchID, contestData.id);
            const joinedUsers = querySnapshot.docs.map(doc => doc.data());
            // console.log(joinedUsers);
            setJoinedUsers(joinedUsers);
            // ...
        }
        fetchData();
    }, []);
    const getContestDetails = () => {
        return <Row>
            <Col>ID: {contestData.id}</Col>
            <Col>Max Prize: {contestData.maxPrize}</Col>
            <Col>Current Prize: {contestData.currentPrize}</Col>
            <Col>Joined Users: {contestData.currentCount}</Col>
            <Col>Max Users Limit: {contestData.maxLimit}</Col>
        </Row>
    }

    const updateLeaderboard = async () => {
        setLoading(true);
        try {
            await FirestoreDatabase.updateLeaderboard(matchID, contestData.id);
            setErrorMsg('Successfully update score and Rank');
        } catch (e) {
            console.log(e);
            setErrorMsg('Failed: Not able to update Score for ' + e.message)
        } finally {
            setLoading(false);
        }
    }

    const distributePrize = async () => {
        var response = prompt('Are you sure to distribute prizes? if yes then please write YES in the box. Thanks!!', 'NO');
        console.log(response);
        if (response === 'YES') {
            setPrizeLoading(true);
            try {
                await FirestoreDatabase.distributePrizes(matchID, contestData.id);
                setErrorMsg('Successfully Distributed Prizes');
            } catch (e) {
                console.log(e);
                setErrorMsg('Failed: Not able to distribute prize to ' + e.message)
            } finally {
                setPrizeLoading(false);
            }
        }

    }

    const getTabs = () => {
        return <Nav tabs>
            <NavItem>
                <NavLink
                    className={` ${tab === 1 ? 'active' : ''}`}
                    onClick={() => { setTab(1); }}>
                    Awards
            </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={` ${tab === 2 ? 'active' : ''}`}
                    onClick={() => { setTab(2); }}>
                    Joined Users
            </NavLink>
            </NavItem>
        </Nav>;
    }

    const calculatePrize = (per) => {
        var prize = (contestData.maxPrize * per) / 100;
        prize = parseInt(prize);
        return prize;
    }
    const getTabsContent = () => {
        return <TabContent activeTab={`${tab}`}>
            <TabPane tabId="1">
                <Row>
                    <Col style={{ textAlign: 'center' }}>Rank</Col>
                    <Col style={{ textAlign: 'center' }}>Prize</Col>
                </Row>
                {contestData.awards && contestData.awards.map((a) => <Row key={`award-${a.from}`}>
                    <Col style={{ textAlign: 'center' }}>#{a.from === a.to ? a.from : `${a.from} - ${a.to}`}</Col>
                    <Col style={{ textAlign: 'center' }}>Rs. {calculatePrize(a.prize)}</Col>
                </Row>)}
            </TabPane>
            <TabPane tabId="2">
                <ListGroupItem style={{ backgroundColor: 'gray', color: 'white' }}>
                    <Row>
                        <Col style={{ textAlign: 'center' }}>Name</Col>
                        <Col style={{ textAlign: 'center' }}>Team Score</Col>
                        <Col style={{ textAlign: 'center' }}>Rank</Col>
                        <Col style={{ textAlign: 'center' }}>Prize</Col>
                    </Row>
                </ListGroupItem>
                <ListGroup style={{ overflow: 'scroll', height: '300px' }}>

                    {joinedUsers && joinedUsers.length !== 0 && joinedUsers.map((user) => <ListGroupItem style={{ margin: '5px' }} key={`award-${user.userId}`}>
                        <Row>
                            <Col style={{ textAlign: 'center' }}>{user.name}</Col>
                            <Col style={{ textAlign: 'center' }}>{user.quizTotalScore} </Col>
                            <Col style={{ textAlign: 'center' }}>#{user.rank}</Col>
                            <Col style={{ textAlign: 'center' }}>{user.prize ?? 0} </Col>
                        </Row>
                    </ListGroupItem>)}
                </ListGroup>
                {joinedUsers.length === 0 && <Col>No one joined yet!</Col>}
            </TabPane>
        </TabContent>;
    }

    return (
        <div>
            <Button color="success" onClick={toggle}>{buttonLabel}</Button>
            <Modal size="lg" isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>
                    Leaderboard
                    <Row>
                        <Col>
                            {loading && <Loader />}
                            {!loading && <Button style={{ marginRight: 5 }} color="danger" onClick={updateLeaderboard}>Update</Button>}
                            {/* </Col> */}
                            {/* <Col> */}
                            {prizeLoading && <Loader />}
                            {!prizeLoading && <Button color="danger" onClick={distributePrize}>Distribute Prize</Button>}
                        </Col>
                    </Row>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        {/* <Col>Leaderboard</Col> */}
                        {/* <Col> */}
                        {/* </Col> */}
                    </Row>
                    <Row>
                        {errorMsg.includes('Successfully') && <Col style={{ color: "green" }}>
                            {errorMsg}
                        </Col>}
                        {errorMsg.includes('Failed') && <Col style={{ color: "red" }}>
                            {errorMsg}
                        </Col>}

                    </Row>
                    {getContestDetails()}
                    <br />
                    {getTabs()}
                    <br />
                    <br />
                    {getTabsContent()}
                </ModalBody>
                <ModalFooter>
                    {/* <Button type='submit' color="primary" >Update</Button>{' '} */}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ContestLeaderBoard;