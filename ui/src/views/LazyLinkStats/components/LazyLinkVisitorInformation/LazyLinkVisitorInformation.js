import React from 'react'
import {Row, Grid, Col} from 'react-bootstrap';

export default class LazyLinkVisitorInformation extends React.Component {
    constructor(props, context) {
        super(props, context);

        const {visitors} = props;
        this.state = {
            visitors
        }
    }

    buildVisitorTable() {
        console.log(this.props)
        const itemRows = this.state.visitors.map((visitor) => {
            return (
                <Row style={{borderBottomWidth: 1, borderBottomColor:'#AAA', borderBottomStyle:'dotted'}}>
                    <Col xs={3} md={3}>
                        {visitor.time}
                    </Col>
                    <Col xs={3} md={3}>
                        {visitor.ip}
                    </Col>
                    <Col xs={3} md={3}>
                        {visitor.os}
                    </Col>
                    <Col xs={3} md={3}>
                        {visitor.browser}
                    </Col>
                </Row>
            )
        });

        const headerRow = (
            <div style={{width:'101%'}}>
                {/* Add a separator line here */}
                {itemRows}
            </div>
        )
       

        return headerRow
    }
    render() {
        return this.buildVisitorTable()
    }
}