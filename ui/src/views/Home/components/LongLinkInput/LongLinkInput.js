import React from 'react'
import { Button, FormGroup, FormControl} from 'react-bootstrap'
import {CONST} from '../../../../common/consts'
import './LongLinkInput.css'

class LongLinkInput extends React.Component {
    constructor(props, context) {
        super(props, context)

        this.handleChange = this.handleChange.bind(this)
        this.submitFunction = props.submitFunction;

        this.state = {
            value: '',
            isValid: false,
            validationState: 'error',
        }
    }
    getValidationState(value) {
        const match = value.match(CONST.URL_VALIDATION_REGEX);

        if (match === null || value.length === 0) {
            this.setState({isValid: false, validationState: 'error'})
            return
        }

        this.setState({isValid: true, validationState: 'success'})
    }

    handleChange(e) {
        this.setState({value: e.target.value})
        this.getValidationState(e.target.value)
    }
    submit() {
        this.submitFunction(this.state.value);
    }
    render() {
        return (
            <div className="LongLink">
                <FormGroup
                    controlId="longUrlText"
                    validationState={this.state.validationState}>

                    <FormControl type="text"
                        onChange={this.handleChange} />
                    <Button type="button" 
                        bsStyle="primary"
                        disabled={!this.state.isValid}
                        onClick={this.submit.bind(this)}>
                            Generate
                    </Button>
                </FormGroup>
            </div>
        )
    }
}

export default LongLinkInput