import React, { Component } from 'react';
import './welcome.css'
import logo from '../../assets/images/tvLogoFinal.png'
import { Button } from 'reactstrap';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class WelcomePage extends Component {
    redirectToLogin() {
        this.props.history.push('/login');

    }

    render() {
        return (
            <React.Fragment>
                <div className='Welcome' >

                    <img className='logo' src={logo} />
                    <p className='heading'> Welcome to Time Victor Admin Panel</p>
                    <Button
                        color='info'
                        className='loginBtn'
                        onClick={this.redirectToLogin.bind(this)}
                    >
                        Login
                    {/* <Link to="/login">Login</Link> */}
                    </Button>
                </div>
            </React.Fragment>
        );
    }

}

const mapStateToProps = (state) => {
    return {

    };
}

const mapDispatchToProps = dispatch => {
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WelcomePage));