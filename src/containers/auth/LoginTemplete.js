import React, { Component } from 'react';
// import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router';
import { VAR_STR } from '../../Variables';
import Authentication from '../../backend/authentication';
import { Loader } from '../../components/loader';
// import { Loader } from '../Loader/Index';
import './auth.css';
import { Button } from 'reactstrap';

class LoginTemplete extends Component {
    state = {
        isLoading: false,
        errorMsg: '',
        hidePassword: true,
    }
    togglePassword = () => {
        this.setState(state => state.hidePassword = !state.hidePassword)

    }
    SetLoading = (bool) => {
        this.setState(state => state.isLoading = bool)
    };
    setErrorMsg = (msg) => {
        this.setState(state => state.errorMsg = msg)
    };
    onFormSubmit = (e) => {
        e.preventDefault();
        this.setErrorMsg('');
        const data = new FormData(e.target);
        const loginCredential = {
            email: data.get('email'),
            password: data.get('password')
        }
        if (loginCredential.email === '' || loginCredential.password === '') {
            this.setErrorMsg('Please Enter Login Credentilas!!!');
            return
        }
        this.SetLoading(true);
        new Authentication().login(loginCredential.email, loginCredential.password).then((user) => {
            console.log("user at firebase", user);
            console.log(user.user.uid, user.user);
            this.props.getUser({
                uid: user.user.uid,
                name: 'Admin',
                UserName: 'Admin',
                email: user.user.email,
                role: 'Admin'
            });
            this.SetLoading(false);
            this.props.history.push('/admin');
        }).catch((e) => {
            console.log('error', e);
            this.SetLoading(false);
            this.setErrorMsg(e.message);
        })
        // const data = new FormData(e.target);
        // const loginCredential = {
        //     email: data.get('email'),
        //     password: data.get('password')
        // }
        // this.SetLoading(true);
        // axios.post(`${VAR_STR.API}users/AuthUser`, JSON.stringify(loginCredential),
        //     {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     }).then(response => {
        //         if (response.data) {

        //             this.SetLoading(false);
        //             // console.log(response.data);
        //             this.props.getUser(response.data)
        //             const role = response.data.role;
        //             switch (role) {
        //                 case "SuperAdmin":
        //                     // <Route path='/superAdmin' Component={Dashboard} />
        //                     this.props.history.push('/superAdmin');
        //                     break;
        //                 case "Admin":
        //                     this.props.history.push('/Admin');
        //                     break;
        //                 case "EndUser":
        //                     this.props.history.push('/EndUser');
        //                     break;
        //                 default:
        //                     this.props.history.push('/Login');
        //                     break;
        //             }
        //         }else {
        //             this.SetLoading(false);
        //             alert('Incorrect Password!!'+ response.data)
        //         }
        //     }).catch(err => {
        //         this.SetLoading(false);
        //         alert(err);
        //     })


    }

    render() {
        return (
            <div style={{ backgroundColor: "#282c34" }}>
                <div className="container">

                    {this.state.isLoading && <Loader />}
                    {!this.state.isLoading && <div className="row justify-content-center">

                        <div className="col-xl-10 col-lg-12 col-md-9">

                            <div className="card o-hidden border-0 shadow-lg my-5">
                                <div className="card-body p-0">

                                    <div className="row">
                                        <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                        <div className="col-lg-6">
                                            <div className="p-5">
                                                <div>
                                                    <p style={{ color: 'red' }}>{this.state.errorMsg}</p>
                                                </div>
                                                <div className="text-center">
                                                    <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                                </div>
                                                <form onSubmit={this.onFormSubmit} className="user">

                                                    <div className="form-group">
                                                        <input type="email" name='email' className="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter Email Address..." />
                                                    </div>
                                                    <div className="form-group">
                                                        <input type={this.state.hidePassword ? "password" : 'text'} name='password' className="form-control form-control-user" id="exampleInputPassword" placeholder="Password" />
                                                        <i onClick={this.togglePassword.bind(this)} className={this.state.hidePassword ? 'fa fa-eye password-icon' : 'fa fa-eye-slash password-icon'} />
                                                    </div>

                                                    {/* <div className="form-group">
                                                        <div className="custom-control custom-checkbox small">
                                                            <input type="checkbox" className="custom-control-input" id="customCheck" />
                                                            <label className="custom-control-label" htmlFor="customCheck">Remember Me</label>
                                                        </div>
                                                    </div> */}

                                                    <button className="btn btn-primary btn-user btn-block" type='submit'>Login</button>

                                                </form>
                                                <hr />
                                                {/* <div className="text-center">
                                                    <a className="small" href="forgot-password.html">Forgot Password?</a>
                                                </div> */}
                                                <div className="text-center">
                                                    <Link to="/">Home</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>}

                </div>
            </div>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        isLogin: state.isLogin,
        user: state.user
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getUser: (user) => dispatch({ type: 'GET_USER', userData: { user } })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginTemplete));