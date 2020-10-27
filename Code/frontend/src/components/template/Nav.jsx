import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import './Nav.css'

const initialState = {
    selectedFeed: true,
    selectedServices: false,
    selectedHowItWorks: false,
    selectedProfile: false
}
class Nav extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }
    }

    componentDidMount() {
        this.setUserType()
        window.alert(this.props.navVisibility)
    }

    setUserType() {
        if (JSON.parse(localStorage.getItem('userData'))) this.setState({ userType: `${JSON.parse(localStorage.getItem('userData')).userType}` })
    }

    selectNavItem(navItem) {
        let state = { ...initialState }
        state.selectedFeed = false
        state[navItem] = true
        this.setState({ ...state })
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
    console.log(state)
    return {
        navVisibility: state.nav.navVisibility
    }
}

export default connect(mapStateToProps)(Nav)