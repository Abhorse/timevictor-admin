import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { VAR_STR } from '../Variables';
// import { isLogin } from '../utils';

const PrivateRoute = ({ component: Component, ...rest }) => {

    // const Role = () => {
    //     switch (rest.path) {
    //         case '/superAdmin':
    //             return "SuperAdmin";
    //         case '/admin':
    //             return "Admin";
    //         case '/EndUser':
    //             return "EndUser"

    //         default:
    //            return "/"
    //     }
    // }
    return (
        <Route
            {...rest}
            render={props => (
                (rest.role === VAR_STR.ADMIN) ? <Component {...props} /> : <Redirect to="/login" />
            )} />
    );
};

const mapStateToProps = state => {
    return {
        role: state.user.role
    }
}

export default connect(mapStateToProps)(PrivateRoute);