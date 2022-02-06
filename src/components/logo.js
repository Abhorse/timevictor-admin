import React, { Component } from 'react';
import logo from '../assets/images/tvLogoFinal.png'
import './logo.css'

class Logo extends Component {
    render() {
        return (
            <div>
                <img className='logo' src={logo} />
            </div>
        )
    };
};

export default Logo;