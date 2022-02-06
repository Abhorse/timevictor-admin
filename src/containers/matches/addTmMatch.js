import React from 'react';
import TMMatchDropdown from './tm_match_dropdown';

class CreateTmMatch extends React.Component {

    state = {
        matches: [],
    }

    componentDidMount () {
        
    }

    getAllTeamActiveMatches () {

    }

    render() {
        return (
            <React.Fragment>
                <center><h5><b>Create Match using Timemarks API</b></h5></center>
                <br /> 
                <TMMatchDropdown />
            </React.Fragment>
        )
    }
}

export default CreateTmMatch;