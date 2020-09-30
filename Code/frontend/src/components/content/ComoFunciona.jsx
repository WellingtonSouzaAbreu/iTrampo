import React, { Component } from 'react'

import Card from './Card.jsx'

import './ComoFunciona.css'

const initialState = {

}

class ComoFunciona extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }
    }
    render() {
        return (
            <div className="como-funciona">
                <h1 className="mb-3 ml-2">Como funciona</h1>
                <hr/>
                <Card title='Trampeiro'/>
                <hr/>
                <Card title='Empregador'/>
                <hr/>
                <Card title='Contas'/>
            </div>
        )
    }
}

export default ComoFunciona