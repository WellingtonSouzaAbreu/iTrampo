import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { setMenuSelections } from './../../store/actions/menuSelections.js'

import baseApiUrl from './../../global.js'

import './Nav.css'

const initialState = {
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
            .catch(err => window.alert(err.response.data)) // Redirecionar para login
    }

    selectNavItem(navItem) {
        this.getUserTypeFromToken()
        let menuSelections = { ...this.props.menuSelections }

        menuSelections.selectedFeed = false
        menuSelections.selectedServices = false
        menuSelections.selectedHowItWorks = false
        menuSelections.selectedProfile = false

        menuSelections[navItem] = true

        this.props.changeMenuSelections(menuSelections) // Redux
    }

    render() {
        return (
            <>
                <nav className={`${this.props.navVisibility ? '' : 'hide-nav'}`}>
                    <div className="nav-items">
                        <div className={`nav-item ${this.props.menuSelections.selectedFeed ? 'selected' : ''}`}>
                            <Link to="/feed" onClick={e => this.selectNavItem('selectedFeed')}>Feed</Link>
                        </div>
                        <div className={`nav-item ${this.props.menuSelections.selectedServices ? 'selected' : ''}`}>
                            <Link to={`/servicos-${this.state.userType}`} onClick={e => this.selectNavItem('selectedServices')}>Serviços</Link>
                        </div>
                        <div className={`nav-item ${this.props.menuSelections.selectedHowItWorks ? 'selected' : ''}`}>
                            <Link to="/como-funciona" onClick={e => this.selectNavItem('selectedHowItWorks')}>Como funciona</Link>
                        </div>
                        <div className={`nav-item ${this.props.menuSelections.selectedProfile ? 'selected' : ''}`}>
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
        user: state.user.user,
        menuSelections: state.menuSelections.menuSelections
    }
}

function mapPropsToState(dispatch) {
    return {
        changeMenuSelections(menuSelections) {
            const action = setMenuSelections(menuSelections)
            dispatch(action)
        }
    }
}

export default connect(mapStateToProps, mapPropsToState)(Nav)