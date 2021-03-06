import React, { Component } from 'react'
import ActionCreators from '../../redux/actionCreators'
import { connect } from 'react-redux'
import { Button, Segment, Form } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'

import moment from 'moment'
import InputMoment from 'input-moment'
import 'input-moment/dist/input-moment.css'


class CreateRun extends Component{

    state = {
        friendly_name: '',
        duration: 0,
        distance: 0,
        created: moment(),
        error: ''
    }

    componentDidMount() {
        this.props.reset()
    }

    handleChange = fieldname => event => {
        this.setState({
            [fieldname]: event.target.value
        })
    }

    handleSave = () => {

        const dtLocal = moment.tz(this.state.created, this.props.auth.user.timezone)
        const dtFormatada = dtLocal.clone().utc().format('YYYY-MM-DD, H:mm:ss') // formato para salvar no BD
        console.log(dtFormatada)

        const unit = this.props.auth.user.unit
        const distance = this.state.distance

        this.props.create({
            friendly_name: this.state.friendly_name,
            duration: this.state.duration,
            distance: unit === 'metric' ? distance : distance*1.60934,
            created: dtFormatada
        })
    }

    render(){

        if(this.props.runs.saved) {
            return <Redirect to='/restrito/runs' />
        }

        return (
            <div>
                <h1>Criar Corrida</h1>

                {
                    this.props.runs.saved && <Segment color='green'>Corrida Criada com sucesso!</Segment>
                }

                {
                    !this.props.runs.saved && 
                    <Form>
                        <Form.Field>
                            <label >Nome:</label>
                            <input type='text' value={this.state.friendly_name} onChange={this.handleChange('friendly_name')} />
                        </Form.Field>
                        <Form.Field>
                            <label>Dura????o em segundos:</label>
                            <input type='number' value={this.state.duration} onChange={this.handleChange('duration')} />
                        </Form.Field>
                        <Form.Field>
                            <label >Distancia ({this.props.auth.user.unit === 'metric' ? 'Km': 'mi'}):</label>
                            <input type='number' value={this.state.distance} onChange={this.handleChange('distance')} />
                        </Form.Field>
                        <Form.Field>
                            <label>Data:</label>
                            <input type='text' value={this.state.created.format('DD/MM/YYYY, H:mm:ss')} onChange={this.handleChange('created')} />
                        </Form.Field>

                        <InputMoment
                            moment={this.state.created}
                            onChange={(val) => this.setState({ created: val })} />

                        <div>
                            <Button inverted color='blue' size='big' onClick={this.handleSave}>Salvar Corrida</Button>   
                        </div>
                    </Form>
                }
                
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        runs: state.runs
    }
}

const mapDispatchToProps = dispatch => {
    return {
        create: (run) => dispatch(ActionCreators.createRunRequest(run)),
        reset: () => dispatch(ActionCreators.createRunReset())

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRun)
