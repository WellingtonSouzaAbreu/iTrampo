import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import baseApiUrl from './../../global.js'

import './Nav.css'

const initialState = {
    selectedFeed: true,
    selectedServices: false,
    selectedHowItWorks: false,
    selectedProfile: false,

    userType: null
}
class Nav extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }
    }

    componentWillMount() {
        this.getUserTypeFromToken()
    }

    async getUserTypeFromToken() {
        const userType = await axios.get(`${baseApiUrl}/extract-from-token?dataType=userType`)
            .then(res => {
                this.setState({ userType: res.data })
            })
            .catch(err => window.alert('Erro: Por favor faça login novamente'))
    }

    selectNavItem(navItem) {
        let state = { ...initialState }
        state.selectedFeed = false
        state[navItem] = true
        this.setState({ ...state })

        this.getUserTypeFromToken()
    }

    render() {
        return (
            <>
                <nav className={`${this.props.navVisibility ? '' : 'hide-nav'}`}>
                    <div className="nav-items">
                        <div className={`nav-item ${this.state.selectedFeed ? 'selected' : ''}`}>
                            <Link to="/feed" onClick={e => this.selectNavItem('selectedFeed')}>Feed</Link>
                        </div>
                        <div className={`nav-item ${this.state.selectedServices ? 'selected' : ''}`}>
                            <Link to={`/servicos-${this.state.userType}`} onClick={e => this.selectNavItem('selectedServices')}>Serviços</Link>
                        </div>
                        <div className={`nav-item ${this.state.selectedHowItWorks ? 'selected' : ''}`}>
                            <Link to="/como-funciona" onClick={e => this.selectNavItem('selectedHowItWorks')}>Como funciona</Link>
                        </div>
                        <div className={`nav-item ${this.state.selectedProfile ? 'selected' : ''}`}>
                            <Link to="/perfil-proprio" onClick={e => this.selectNavItem('selectedProfile')}>Perfil</Link>
                        </div>
                    </div>
                </nav>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        navVisibility: state.nav.navVisibility,
        user: state.user.user
    }
}

export default connect(mapStateToProps)(Nav)