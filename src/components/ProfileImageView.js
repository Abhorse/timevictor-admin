import React, { Component } from 'react';

class ProfileView extends Component {
    render() {
        return (
            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span className="mr-2 d-none d-lg-inline text-gray-600 small">{this.props.Name}</span>
                <img className="img-profile rounded-circle" src={this.props.ImageURL} />
            </a>

        );
    }
}

export default ProfileView;