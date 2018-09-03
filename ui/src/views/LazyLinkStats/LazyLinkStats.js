import React from 'react';
import ReactLoading from 'react-loading';
import {CONST} from '../../common/consts'
import {Alert, Grid, Col, Row} from 'react-bootstrap';
import LazyLinkVisitorInformation from './components/LazyLinkVisitorInformation/LazyLinkVisitorInformation'

export default class LazyLinkStats extends React.Component {
    constructor(props, context) {
        super(props, context);

        const {lazylink} = this.props.match.params;

        this.state = {
            lazyLinkId: lazylink,
            loaded: false,
            lazylink: null
        }
    }

    handleErrors(response) {
        if (!response.ok) {
            throw response
        }

        return response
    }

    loadStats() {
            // make API call to create lazylink
            fetch(CONST.API_BASE_URL + 'lazylink/' + this.state.lazyLinkId, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(this.handleErrors)
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    lazylink: response,
                    loaded:true
                })
            }).catch((e) => {
                // if the error doesn't contain json, render the error message
                if (!e.json) {
                    this.setState({
                        error: true, 
                        errorMessage: e.message
                    });
                    return;
                }
    
                // if the error is json, parse it and then print the message
                e.json().then((json) => {
                    this.setState({
                        error: true, 
                        errorMessage: json.message
                    });
                })
            }).finally(() => {
                this.setState({
                    loaded: true
                })
            })
        return (
            <div style={{margin: 'auto', display: 'inline-block'}}>
                <ReactLoading type='bubbles' color='#0FA' />
            </div>
        )
    }
    renderStats() {
        return (
            <div>
                <Grid>
                    <Col xs={4} md={4}>
                    LazyLink URI: <strong>{this.state.lazyLinkId}</strong>
                    </Col>
                    <Col xs={4} md={4}>
                    Original Link: <a href={this.state.lazylink.longlink}>{this.state.lazylink.longlink}</a>
                    </Col>
                    <Col xs={4} md={4}>
                    Number of Visitors: {this.state.lazylink.visitors ? this.state.lazylink.visitors.length: 0}
                    </Col>
                    <Col style={{borderBottomWidth: 1, borderBottomColor:'#0FA', borderBottomStyle:'solid'}}xs={18} md={12} />
                    {/* Add a separator line here */}
                    <Col style={{borderBottomWidth: 1, borderBottomColor:'#0FA', borderBottomStyle:'solid', paddingTop:'7rem'}}xs={18} md={12} />
                    <Col xs={18} md={12}>
                        Visitor Information
                    </Col>
                    <Col style={{borderBottomWidth: 1, borderBottomColor:'#0FA', borderBottomStyle:'solid'}}xs={18} md={12} />
                    <Row>
                        <Col xs={3} md={3}>
                            Time
                        </Col>
                        <Col xs={3} md={3}>
                            IP
                        </Col>
                        <Col xs={3} md={3}>
                            Operating System
                        </Col>
                        <Col xs={3} md={3}>
                            Browser
                        </Col>
                    </Row>
                    <Col style={{borderBottomWidth: 1, borderBottomColor:'#0FA', borderBottomStyle:'solid'}}xs={18} md={12} />

                    <Col xs={18} md={12}>
                        {
                            this.state.lazylink.visitors ?
                            <LazyLinkVisitorInformation visitors={this.state.lazylink.visitors} />
                            :''
                        }
                    </Col>
                    <Col style={{borderBottomWidth: 1, borderBottomColor:'#0FA', borderBottomStyle:'solid'}}xs={18} md={12} />
                </Grid>
            </div>
        )
    }

    renderError() {
       // display an alert banner if there's been an error
       var AlertBanner = (
            <Alert 
                bsStyle="danger">
                <strong>{ this.state.errorMessage }</strong>
            </Alert>
       )

       return (
           <div>
               {AlertBanner}
           </div>
       )
    }
    render() {
        const content = this.state.loaded ? 
                this.state.error ? this.renderError() : this.renderStats() 
            : this.loadStats();

        return (
            <div>
                <h1>Stats</h1>
                {content}
            </div>
        )
    }
}