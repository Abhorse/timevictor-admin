import React, { Component } from 'react';
import './matchTeamLogo.css'

class MatchTeamLogo extends Component {
    render() {
        return (
            <div>
                <img className='matchTeamLogo' src={this.props.imageURL} />
            </div>
        )
    }
}

export default MatchTeamLogo;