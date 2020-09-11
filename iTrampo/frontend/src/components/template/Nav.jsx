import React, { Component } from 'react'

import './Nav.css'

const initialState = {
    selectedFeed: true,
    selectedServices: false,
    selectedHowItWorks: false,
    selectedProfile: false
}
export default class Nav extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }
    }

    selectNavItem(navItem) {
        let state = {...initialState}
        state.selectedFeed = false
        state[navItem] = true
        this.setState({...state})
    }
    
    render() {
        return (
            <nav>
                <div className="nav-items">
                    <div className={`nav-item ${this.state.selectedFeed ? 'selected' : ''}`}>
                        <a href="#" onClick={e => this.selectNavItem('selectedFeed')}>Feed</a>
                    </div>
                    <div className={`nav-item ${this.state.selectedServices ? 'selected' : ''}`}>
                        <a href="#" onClick={e => this.selectNavItem('selectedServices')}>Serviços</a>
                    </div>
                    <div className={`nav-item ${this.state.selectedHowItWorks ? 'selected' : ''}`}>
                        <a href="#" onClick={e => this.selectNavItem('selectedHowItWorks')}>Como funciona</a>
                    </div>
                    <div className={`nav-item ${this.state.selectedProfile ? 'selected' : ''}`}>
                        <a href="#" onClick={e => this.selectNavItem('selectedProfile')}>Perfil</a>
                    </div>
                </div>
            </nav>
        )
    }
}