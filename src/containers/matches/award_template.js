import React, { useState, useEffect } from 'react';
import { NavItem, NavLink, Nav, TabContent, TabPane, ListGroupItem, ListGroup, Col, Row, FormGroup, Label, Input, Form, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import FirestoreDatabase from '../../backend/firestoreDatabase';
import { Loader } from '../../components/loader';
import ShowAwardTemplate from './show_award_temp_modal';

const AwardTemplates = (props) => {
    const {
        data
    } = props;

    const [tab, setTab] = useState(1);

    const [templates, setTemplates] = useState([]);
    const [loader, setLoader] = useState(false);
    const [formLoader, setFormLoader] = useState(false);

    const [newTemplate, setNewTemplate] = useState({ awards: [] });
    const [newTemplateName, setNewTemplateName] = useState('');

    async function fetchData() {
        try {
            setLoader(true);
            const querySnapshot = await FirestoreDatabase.getPrizeTemplates();
            const awardTemplates = querySnapshot.docs.map(doc => doc.data());
            setTemplates(awardTemplates);
        } catch (e) {
            alert(e.message);
        } finally {
            setLoader(false);
        }
        // ...

    }

    useEffect(() => {
        // async function fetchData() {
        //     try {
        //         setLoader(true);
        //         const querySnapshot = await FirestoreDatabase.getPrizeTemplates();
        //         const awardTemplates = querySnapshot.docs.map(doc => doc.data());
        //         setTemplates(awardTemplates);
        //     } catch (e) {
        //         alert(e.message);
        //     } finally {
        //         setLoader(false);
        //     }
        //     // ...
        // }
        fetchData();
    }, []);

    const tabs = () => {
        return <Nav tabs>
            <NavItem>
                <NavLink
                    className={` ${tab === 1 ? 'active' : ''}`}
                    onClick={() => { setTab(1); }}>
                    Templates
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={` ${tab === 2 ? 'active' : ''}`}
                    onClick={() => { setTab(2); }}>
                    Create Template
                </NavLink>
            </NavItem>
        </Nav>
    }

    const createTemplate = async () => {
        if (newTemplateName) {
            try {
                setFormLoader(true);
                await FirestoreDatabase.createPrizeTemplates({ awards: newTemplate.awards, name: newTemplateName });
                fetchData();
                alert('Successfully create template. If you\'re not able to see the template then please refresh the page.')

            } catch (e) {
                alert(e.message);
            } finally {
                setFormLoader(false);
            }
        } else {
            alert('please enter template name.')
        }
    }

    const addPrize = (e) => {
        e.preventDefault();

        const data = new FormData(e.target);
        const from = data.get('from');
        const to = data.get('to');
        const prize = data.get('prize');

        if (from && to && prize) {
            // console.log(from, to, prize);
            const oldAward = newTemplate.awards;
            // console.log(oldAward);
            setNewTemplate({
                awards: oldAward.concat([{ from: parseInt(from), to: parseInt(to), prize: parseInt(prize), }]),
            })
        } else {
            alert('Please fill all fields.');
        }


    }

    const awardForm = () => {
        return <div>
            <Form onSubmit={addPrize}>
                <Row>
                    <Col sm='6'>
                        <FormGroup>
                            <Label for='name'>Template Name (unique) </Label>
                            <Input type='text' name='name' id='name' onChange={(e) => setNewTemplateName(e.target.value)} value={newTemplateName} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label for='from'>From</Label>
                            <Input type='number' name='from' id='from' />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for='to'>To</Label>
                            <Input type='number' name='to' id='to' />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for='prize'>Prize</Label>
                            <Input type='number' name='prize' id='prize' />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button color='primary' type='submit'>Add</Button>
                    </Col>
                </Row>
            </Form>
            <hr />
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
                        {newTemplate.awards.map((a, index) => <ListGroupItem key={`award-${index}`}>
                            <Row >
                                <Col style={{ textAlign: 'center' }}>#{a.from === a.to ? a.from : `${a.from} - ${a.to}`}</Col>
                                <Col style={{ textAlign: 'center' }}> {a.prize} %</Col>
                            </Row>
                        </ListGroupItem>)}
                    </ListGroup>
                </Col>
            </Row>
            <br />
            <hr />
            <Row>
                <Col>
                    <Button color='danger' onClick={createTemplate}>Create</Button>
                </Col>
            </Row>
            <br />
        </div>
    }

    const tabContents = () => {
        return <TabContent activeTab={`${tab}`}>
            <TabPane tabId='1'>

                <ListGroup>
                    {templates.map((award, index) => <ListGroupItem style={{ margin: 5 }} key={`award-${index}`} >
                        <Row>
                            <Col>
                                {award.name}
                            </Col>
                            <Col>
                                <ShowAwardTemplate
                                    award={award}
                                    buttonLabel={<i className='far fa-eye'></i>}
                                />
                            </Col>
                        </Row>
                    </ListGroupItem>)}
                </ListGroup>
            </TabPane>
            <TabPane tabId='2'>
                {formLoader && <Loader />}
                {!formLoader && awardForm()}


            </TabPane>

        </TabContent>
    }

    return <React.Fragment>
        <center><h5><b>Award Templatess</b></h5></center>
        {tabs()}
        <br />
        {loader && <Loader />}
        {!loader && tabContents()}
    </React.Fragment>
}
export default AwardTemplates;