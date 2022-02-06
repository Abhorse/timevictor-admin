import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavLink, Row } from 'reactstrap';
import Logo from '../assets/images/tvLogoFinal.png';

class BrandName extends Component {
    isVisible() {
        return this.props.visibility ? "visible" : 'hidden';
    }
    render() {
        return (
            <NavLink href={this.props.To} style={{ visibility: this.isVisible() }} className="sidebar-brand d-flex align-items-center justify-content-center">
                {/* <div className="sidebar-brand-icon rotate-n-15">
                    <font size='6'>
                        <i className="fas fa-book-dead fa-sm fa-fw mr-0 text-gray-400"></i>
                    </font>
                </div> */}
                {/* <Logo /> */}
                {/* <div className="sidebar-brand-icon">
                    <font size='6'>
                        <img src='LetsTest_Logo.png' />
                    </font>
                </div> */}
                {/* <Row>
                    <Logo />
                </Row> */}
                <Row>
                    {/* <img className="img-profile rounded-circle " src={Logo} /> */}
                    <div className="sidebar-brand-text mx-3"><font size='5' color='white'><b>TimeVictor</b></font></div>

                </Row>
            </NavLink>
        );
    }

};

export default BrandName;