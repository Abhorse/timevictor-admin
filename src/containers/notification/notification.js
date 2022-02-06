import React, { useState, useEffect } from 'react';
import { NavItem, NavLink, Nav, TabContent, TabPane, ListGroup, Col, Row, FormGroup, Label, Input, Form, Button, Card, CardBody, CardHeader, CardFooter } from 'reactstrap';
import FirestoreDatabase from '../../backend/firestoreDatabase';
import { Loader } from '../../components/loader';
import FormatDateTime from '../../utils/dateTimeFormator';

const NotificationPage = (props) => {
    const {
        data
    } = props;

    const [tab, setTab] = useState(1);
    const [notification, setNotification] = useState([]);
    const [loader, setLoader] = useState(false);
    const [formLoader, setFormLoader] = useState(false);
    const [msgCountInRow, setMsgCountInRow] = useState(2);


    async function fetchData() {
        try {
            setLoader(true);
            const querySnapshot = await FirestoreDatabase.getNotifications();
            const notificationData = querySnapshot.docs.map(doc => doc.data());
            setNotification(notificationData);
        } catch (e) {
            alert(e.message);
        } finally {
            setLoader(false);
        }

    }

    useEffect(() => {
        fetchData();
    }, []);

    const tabs = () => {
        return <Nav tabs>
            <NavItem>
                <NavLink
                    className={` ${tab === 1 ? 'active' : ''}`}
                    onClick={() => { setTab(1); }}>
                    Notification
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={` ${tab === 2 ? 'active' : ''}`}
                    onClick={() => { setTab(2); }}>
                    Send Notification
                </NavLink>
            </NavItem>
        </Nav>
    }

    const sendNotification = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const title = data.get('title');
        const message = data.get('message');
        if (title && message) {

            try {
                setFormLoader(true);
                await FirestoreDatabase.sendNotification(title, message);
                fetchData();
                alert('Successfully send notification. If you\'re not able to see the template then please refresh the page.')

            } catch (e) {
                alert(e.message);
            } finally {
                setFormLoader(false);
            }
        } else {
            alert('All fields are required.')
        }
    }

    const deleteNotification = async (id) => {
        if (id) {
            try {
                setLoader(true);
                await FirestoreDatabase.deleteNotifications(id);
                fetchData();
            } catch (e) {
                alert('Error occured while deleting the notification: Error: ' + e.message);
            } finally {
                setLoader(false);
            }
        } else {
            alert('This notification can\'t be deleted. Please contact developer team, Thanks.')
        }
    }


    const awardForm = () => {
        return <div>
            <Form onSubmit={sendNotification}>
                <Row>
                    <Col sm='6'>
                        <FormGroup>
                            <Label for='Title'>Title </Label>
                            <Input type='text' name='title' id='Title' />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for='Message'>Message</Label>
                            <Input type='textarea' name='message' id='Message' />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button color='primary' type='submit'>Send</Button>
                    </Col>
                </Row>
            </Form>
            <hr />
        </div>
    }

    const tabContents = () => {
        return <TabContent activeTab={`${tab}`}>
            <TabPane tabId='1'>
                <Row>
                    <Col sm='10'>

                        <FormGroup row>
                            <Label sm={3} for='MsgCountInRow'><b>Total Notification in a Row</b></Label>
                            <Col sm={2}>
                                <Input
                                    type='select'
                                    name='msgCountInRow'
                                    id='MsgCountInRow'
                                    onChange={(e) => setMsgCountInRow(e.target.value)}
                                    value={msgCountInRow}>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                </Input>
                            </Col>
                        </FormGroup>

                    </Col>
                    <Col>
                        <Button color='primary' onClick={fetchData}>
                            <i
                                style={{ color: 'white' }} className="fas fa-redo">
                            </i>
                        </Button>
                    </Col>
                </Row>
                <Row>
                    {notification.map((notify, index) => <Col sm={`${Math.floor(12 / msgCountInRow)}`} key={`award-${index}`}> <Card style={{ margin: 5 }} >
                        <CardHeader>
                            <Row>
                                <Col>
                                    {notify.title}
                                </Col>
                                <Col style={{ textAlign: 'end' }}>
                                    {FormatDateTime.format(notify.date.toDate())}
                                    <Button color='' onClick={() => deleteNotification(notify.id)}>
                                        <i style={{ color: 'red' }} className="fas fa-trash-alt"></i>
                                    </Button>
                                </Col>

                            </Row>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col>
                                    {notify.message}
                                </Col>
                            </Row>
                        </CardBody>
                        {/* <CardFooter>
                            <Button color='' onClick={() => deleteNotification(notify.id)}>
                                <i style={{ color: 'red' }} className="fas fa-trash-alt"></i>
                            </Button>
                        </CardFooter> */}
                    </Card></Col>)}
                </Row>
            </TabPane>
            <TabPane tabId='2'>
                {formLoader && <Loader />}
                {!formLoader && awardForm()}
            </TabPane>

        </TabContent>
    }

    return <React.Fragment>
        <center><h5><b>Notification</b></h5></center>
        {tabs()}
        <br />
        {loader && <Loader />}
        {!loader && tabContents()}
    </React.Fragment>
}
export default NotificationPage;