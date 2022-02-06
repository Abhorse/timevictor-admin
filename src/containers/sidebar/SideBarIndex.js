import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { VAR_STR } from '../../Variables';
import BrandName from '../../components/BrandName';
// import BrandName from './BrandName';


class SideBar extends Component {
    routeName() {
        return 'admin';
    }

    render() {
        return (
            <div id="wrapper">
                <ul style={{ backgroundColor: `#151b26` }}
                    className={`navbar-nav sidebar sidebar-dark accordion ${this.props.isToggel}`}
                    id="accordionSidebar">

                    <BrandName visibility={true} />
                    <hr className="sidebar-divider my-0" />

                    <li className="nav-item">
                        <Link className="nav-link" to='/admin'>
                            <i className="fas fa-fw fa-tachometer-alt"></i>
                            <span>Dashboard</span></Link>
                    </li>

                    <hr className="sidebar-divider" />

                    <div className="sidebar-heading">
                        Admin Interface
                    </div>

                    {<li className="nav-item">
                        <a className="nav-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                            <i className="fas fa-users"></i>
                            <span>MATCHES</span>
                        </a>
                        <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">Timemarks Matches:</h6>
                                <Link className="collapse-item" to={`/${this.routeName()}/addMatch`} >ADD MATCH</Link>
                                <Link className="collapse-item" to={`/${this.routeName()}/addTmMatch`} >ADD TM MATCH</Link>
                                <Link className="collapse-item" to={`/${this.routeName()}/allMatches`} >MATCHES</Link>
                                <Link className="collapse-item" to={`/${this.routeName()}/awards`} >AWARDS</Link>

                            </div>
                        </div>
                    </li>}

                    <hr className="sidebar-divider" />

                    {<li className="nav-item">
                        <a className="nav-link collapsed" data-toggle="collapse" data-target="#collapseTest" aria-expanded="true" aria-controls="collapseTwo">
                            <i className="far fa-bell"></i>
                            <span>NOTIFICATION</span>
                        </a>
                        <div id="collapseTest" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">Admin's Components:</h6>
                                <Link className="collapse-item" to={`/${this.routeName()}/notification`} >NOTIFICATION</Link>
                            </div>
                        </div>
                    </li>}

                    <hr className="sidebar-divider" />
                    <li className="nav-item">
                        <a className="nav-link collapsed" data-toggle="collapse" data-target="#collapseUser" aria-expanded="true" aria-controls="collapseTwo">
                            <i className="fas fa-fw fa-cog"></i>
                            <span>ENDUSER</span>
                        </a>
                        <div id="collapseUser" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">End User's Components:</h6>
                                <Link className="collapse-item" to={`/${this.routeName()}/users`}>USERS</Link>

                                {/* <Link className="collapse-item" to={`/${this.routeName()}/demoTest`}>DEMO TEST</Link> */}
                                {/* <Link className="collapse-item" to={`/${this.routeName()}/testHostory`}>TEST HISTORY</Link> */}
                                {/* <Link className="collapse-item" to={`/${this.routeName()}/liveTests`}>LIVE TEST</Link>
                                <Link className="collapse-item" to={`/${this.routeName()}/liveQuizs`}>LIVE QUIZ</Link> */}

                            </div>
                        </div>
                    </li>

                    <hr className="sidebar-divider d-none d-md-block" />

                    <div className="text-center d-none d-md-inline">
                        <button onClick={this.props.isToggel === 'toggled' ? () => this.props.Toggel('') : () => this.props.Toggel('toggled')} className="rounded-circle border-0" id="sidebarToggle"></button>
                    </div>
                </ul>
            </div>

        );
    }
};

export default SideBar;