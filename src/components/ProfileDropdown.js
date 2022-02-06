import React, { Component } from 'react';
import {Link} from 'react-router-dom'

class ProfileDropdown extends Component {
   
    render() {
        return (
            // <div className="dropdown-item">
              //  {/* <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i> */}
                
                <Link className="dropdown-item"  onClick={this.props.logoutUser} to={this.props.route}>
                    <i className={`${this.props.className}  fa-sm fa-fw mr-2 text-gray-400`}></i>
                    <span>{this.props.text}</span>
                    </Link>
            // </div>
        );
    }
};

export default ProfileDropdown;