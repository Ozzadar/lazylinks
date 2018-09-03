import React from 'react'
import LongLinkInput from './components/LongLinkInput/LongLinkInput'
import {Alert} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import {CONST} from '../../common/consts'
import './Home.css'

export default class Home extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: false,
            errorMessage: 'There\'s been an error',
            redirect : null
        }
    }
    
    render() {

        if (this.state.redirect) {
            return (
                <Redirect to={'/' + this.state.redirect.lazylink + '/stats'} />
            )
        }

        // display an alert banner if there's been an error
        var AlertBanner = this.state.error ? (
            <Alert 
                bsStyle="danger">
                <strong>{ this.state.errorMessage }</strong>
            </Alert>
        ) : null;

        return (
            <div className='Home'>
                <p className="App-intro">
                Enter your long URL below to receive your LazyLink
                </p>
                
                {AlertBanner}
                <LongLinkInput submitFunction={this.submitLazyLink.bind(this)} />
            </div>
        );
    }

    handleErrors(response) {
        if (!response.ok) {
            throw response
        }

        return response
    }
    // function to submit new lazy link
    submitLazyLink(url) {
        const data = {
            longlink:url
        }

        // make API call to create lazylink
        fetch(CONST.API_BASE_URL + 'lazylink', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(this.handleErrors)
        .then(response => response.json())
        .then((response) => {
            this.props.history.push('/'+ response.id +'/stats')
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
        })

     

        // redirect to received lazylink stats page
       // 
    }
}