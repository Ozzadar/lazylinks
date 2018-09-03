import React from 'react';
import {CONST} from '../../common/consts'
import ReactLoading from 'react-loading';
import {Alert} from 'react-bootstrap';
import {Link} from 'react-router-dom'

export default class LazyRedirect extends React.Component {
    constructor(props, context) {
        super(props, context);
        const {lazylink} = this.props.match.params;

        this.state = {
            lazyLinkId: lazylink,
            loaded: false,
            lazylink : null
        }
    }

    visitLazyLink() {
        fetch(CONST.API_BASE_URL + 'lazylink/' + this.state.lazyLinkId + '/visit', {
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
                loaded: true,
                lazylink: response
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
 
    }

    renderRedirecting() {
        return (
            <div style={{textAlign:'left', margin: 'auto', display: 'inline-block'}}>
                <span>Redirecting to link...</span>
                <ReactLoading type='bubbles' color='#0FA' />
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
                <Link to="/">Go back to Home</Link>
            </div>
        )
     }

    render() {

        if (this.state.loaded) {
            if (this.state.lazylink) {
                // Redirect to url
                window.location.href = this.state.lazylink.longlink;
                return this.renderRedirecting()
            } else {
                return this.renderError()
            }
        } else {
            this.visitLazyLink();
            return this.renderRedirecting()
        }
    }
}