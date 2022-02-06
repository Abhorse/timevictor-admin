import React, { Component } from 'react';
import FirestoreDatabase from '../../backend/firestoreDatabase';
import { Loader } from '../../components/loader';
import Match from '../../models/match';
import { ListGroup, ListGroupItem, Row, Col, Nav, NavItem, NavLink, Button } from 'reactstrap';
import MatchTeamLogo from '../../components/matchTeamLogo';
import { withRouter } from 'react-router';
import FormatDateTime from '../../utils/dateTimeFormator';

class AllMatches extends Component {
    state = {
        isLoading: false,
        tab: 2,
        matches: []
    }

    toggleLoading(bool) {
        this.setState(state => state.isLoading = bool);
    }

    componentDidMount() {
        this.toggleLoading(true);
        FirestoreDatabase.getAllMatches().then((querySnapshot) => {
            const data = querySnapshot.docs.map(doc => doc.data());
            // console.log(data);
            //  console.log(new Match(data[1]));
            var matchData = data.map((e) => new Match(e))
            this.setState(state => state.matches = matchData);
            console.log(matchData);

        }).catch((e) => {
            console.log('Error', e);
        }).finally(() => {
            this.toggleLoading(false);
        })
    }

    getMatchInfo(matchId) {
        this.props.history.push(`/admin/match/${matchId}`);
    }

    async deleteMatch(e, matchID) {
        e.stopPropagation();
        var response = prompt('are you sure to delete the match? if yes then please write YES in the box.')
        if (response === 'YES') {
            console.log('delete match with id: ', matchID);
            try {
                this.toggleLoading(true);
                await FirestoreDatabase.deleteMatch(matchID);
                alert('Successfully deleted match with id: ', matchID);
                this.componentDidMount();
            } catch (e) {
                alert(e.message);
            } finally {
                this.toggleLoading(false);
            }
        } else {
            console.log('dont delete match with id: ', matchID);
        }
    }

    async approveMatch(e, matchID, status) {
        e.stopPropagation();
        var response = prompt(`are you sure to ${status ? 'approve the match' : 'move the match to draft'}? if yes then please write YES in the box.`)
        if (response === 'YES') {
            console.log('approve match with id: ', matchID);
            try {
                this.toggleLoading(true);
                await FirestoreDatabase.changeMatchStatus(matchID, status);
                this.componentDidMount();
            } catch (e) {
                alert(e.message);
            } finally {
                this.toggleLoading(false);
            }
        } else {
            console.log('dont approve match with id: ', matchID);
        }
    }

    matchCard(match, allowEdit, isUpcoming) {
        return <ListGroupItem
            onClick={() => this.getMatchInfo(match.id)}
            style={{ margin: 5 }}
            key={`key-${match.id}`}>
            <Row>
                <Col>
                    <MatchTeamLogo imageURL={match.teamAImageURL} />
                    <h5><b>{match.teamAName}</b> </h5>
                </Col>

                <Col style={{ textAlign: 'center' }}>
                    <b>  Vs </b>
                    <div>{FormatDateTime.format(match.startTime.toDate())}</div>
                    <div>
                        {match.totalPools} <b>Contests</b>
                    </div>

                </Col>
                <Col style={{ textAlign: 'end' }}>
                    <MatchTeamLogo imageURL={match.teamBImageURL} />
                    <h5><b>{match.teamBName}</b> </h5>
                </Col>
            </Row>
            {allowEdit && <Row>
                <Col style={{ textAlign: 'center' }}>
                    <Button
                        onClick={(e) => this.deleteMatch(e, match.id)}
                        color='' >
                        <i style={{ color: 'red' }} className="fas fa-trash-alt"> </i>
                    </Button>
                    <Button
                        onClick={(e) => this.approveMatch(e, match.id, true)}
                        color=''>
                        <i style={{ color: 'green' }} className="far fa-thumbs-up"></i>
                    </Button>
                </Col>
            </Row>}
            {isUpcoming && <Row>
                <Col>
                    <Button
                        onClick={(e) => this.approveMatch(e, match.id, false)}
                        color=''>
                        <i style={{ color: 'green' }} className="far fa-thumbs-down"></i>
                    </Button>
                </Col>
            </Row>}
        </ListGroupItem>;
    }

    matchCardList() {
        return <ListGroup> {this.state.matches.map((match) => this.matchCard(match))} </ListGroup>
    }

    toggleTab(tab) {
        if (this.state.tab !== tab) {
            this.setState(state => state.tab = tab);
        }
    }

    getMatchTabs() {
        return <Nav tabs>
            <NavItem>
                <NavLink
                    className={` ${this.state.tab === 1 ? 'active' : ''}`}
                    onClick={() => { this.toggleTab(1); }}>
                    Drafts
            </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={` ${this.state.tab === 2 ? 'active' : ''}`}
                    // className={classnames({ active: this.state.tab === 2 })}
                    onClick={() => { this.toggleTab(2); }}>
                    Upcoming
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={` ${this.state.tab === 3 ? 'active' : ''}`}
                    // className={classnames({ active: this.state.tab === 2 })}
                    onClick={() => { this.toggleTab(3); }}>
                    Live
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={` ${this.state.tab === 4 ? 'active' : ''}`}
                    // className={classnames({ active: this.state.tab === 2 })}
                    onClick={() => { this.toggleTab(4); }}>
                    Closed
                </NavLink>
            </NavItem>
        </Nav>
    }

    getTabContent() {
        switch (this.state.tab) {
            case 1:
                const draftMatches = this.state.matches.filter((m) => !m.showToAll);
                if (draftMatches.length === 0) return <center><b style={{ color: 'red' }}>There are no matches in the draft.</b></center>

                return <ListGroup> {draftMatches.map((match) => this.matchCard(match, true))} </ListGroup>;
            case 2:
                const upcomingMatches = this.state.matches.filter((m) => m.showToAll && FormatDateTime.isUpcoming(m.startTime));
                if (upcomingMatches.length === 0) return <center><b style={{ color: 'red' }}>There are no upcoming matches.</b></center>
                return <ListGroup> {upcomingMatches.map((match) => this.matchCard(match, false, true))} </ListGroup>;
            case 3:
                const liveMatches = this.state.matches.filter((m) => m.showToAll && FormatDateTime.isLive(m.startTime, m.duration, m.endTime));
                if (liveMatches.length === 0) return <center><b style={{ color: 'red' }}>There are no live matches.</b></center>

                return <ListGroup> {liveMatches.map((match) => this.matchCard(match))} </ListGroup>;
            case 4:
                const closedMatches = this.state.matches.filter((m) => m.showToAll && FormatDateTime.isClosed(m.endTime));
                if (closedMatches.length === 0) return <center><b style={{ color: 'red' }}>There are no closed matches.</b></center>
                return <ListGroup> {closedMatches.map((match) => this.matchCard(match))} </ListGroup>;
            default:
                return <div>Error</div>
        }
    }

    getHeader() {
        return <Row>
            <Col sm='10'>
                <center><h4><b> All Matches</b> </h4></center>
            </Col>
            <Col sm='2'>
                <Button
                    onClick={this.reloadPage.bind(this)}
                    color='primary'>
                    <i className="fas fa-redo"></i>
                </Button>
            </Col>
        </Row>;
    }

    reloadPage() {
        this.componentDidMount();
    }

    render() {
        return (
            <React.Fragment>
                {this.state.isLoading && <Loader />}
                {!this.state.isLoading && this.getHeader()}
                {!this.state.isLoading && this.getMatchTabs()}
                {!this.state.isLoading && this.getTabContent()}
                {/* {!this.state.isLoading && this.matchCardList()} */}
            </React.Fragment>
        );
    }
}

export default withRouter(AllMatches);