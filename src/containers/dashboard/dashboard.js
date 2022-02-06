import React, { Component } from 'react';
import HomePage from '../home/home'
import SideBar from '../sidebar/SideBarIndex';
import { Route } from 'react-router-dom';
import Footer from '../../components/Footer';
import ProfileView from '../../components/ProfileImageView';
import ProfileDropdown from '../../components/ProfileDropdown';
import logo from '../../assets/images/tvLogoFinal.png'
import Authentication from '../../backend/authentication';
import { connect } from 'react-redux';
import AddMatch from '../matches/addMatch';
import AllMatches from '../matches/viewMatches';
import MatchInfo from '../matches/matchInfo';
import AwardTemplates from '../matches/award_template';
import UsersView from '../users/users';
import NotificationPage from '../notification/notification';
import CreateTmMatch from '../matches/addTmMatch';

class DashBoard extends Component {
    logoutUser() {
        new Authentication().logout().then((res) => {
            // console.log(res);
            // if (res.data) {
            this.props.LogoutUser();
            // this.props.LogoutUser();
            console.log('logout user');
            // }
        }).catch((e) => {
            console.log(e);
        })
    }
    render() {
        return (
            <div id="wrapper">
                <SideBar isToggel={this.props.isToggel} Toggel={this.props.Toggel} role='admin' />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                            <button onClick={this.props.isToggel === 'toggled' ? () => this.props.Toggel('') : () => this.props.Toggel('toggled')} id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                                <i className="fa fa-bars"></i>
                            </button>
                            {/* <SearchInput /> */}
                            <ul className="navbar-nav ml-auto">
                                <div className="topbar-divider d-none d-sm-block"></div>
                                <li className="nav-item dropdown no-arrow">
                                    <ProfileView Name={this.props.name} ImageURL={logo} />
                                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                                        <ProfileDropdown logoutUser={this.logoutUser.bind(this)} className='fa fa-sign-out-alt' route='/' text='Logout' />
                                    </div>
                                </li>

                            </ul>
                        </nav>
                        <div className="container-fluid">
                            <Route path="/admin" exact component={HomePage} />
                            <Route path="/admin/addMatch" exact component={AddMatch} />
                            <Route path="/admin/addTmMatch" exact component={CreateTmMatch} />
                            <Route path="/admin/allMatches" exact component={AllMatches} />
                            <Route path="/admin/match/:id?" exact component={MatchInfo} />
                            <Route path="/admin/awards" exact component={AwardTemplates} />
                            <Route path="/admin/users" exact component={UsersView} />
                            <Route path="/admin/notification" exact component={NotificationPage} />
                        </div>
                    </div>
                    <Footer />
                </div>


            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLogin: state.isLogin,
        role: state.user.role,
        name: state.user.name,
        email: state.user.email,
        isToggel: state.toggler.IsToggeled
    };
}

const mapDispatchToProps = dispatch => {
    return {
        LogoutUser: () => dispatch({ type: 'LOGOUT_USER' }),
        Toggel: (IsToggeled) => dispatch({ type: 'TOGGEL_SIDEBAR', isToggel: { IsToggeled } })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);