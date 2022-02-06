import React from 'react';
import { Spinner, Row } from 'reactstrap';

export const Loader = () => {
    const style = {
        marginTop: '30%',
        marginLeft: '50%'
    };
    return <Row style={style}>
        {/* <Col sm={{ size: 3, offset: 5 }} md={{ size: 3, offset: 5 }}> */}
            <Spinner color="secondary" />

        {/* </Col> */}
    </Row>
} 