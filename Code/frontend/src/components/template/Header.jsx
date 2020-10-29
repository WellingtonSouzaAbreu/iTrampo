import React from 'react'
import {connect} from 'react-redux'

import './Header.css'

import BtnGrayWithRadius from './../content/buttons/BtnGrayWithRadius.jsx'
import UserDropdown from './../content/userDropdown/UserDropdown.jsx'

function Header(props) {

    function register(serviceIid) {
        let url = window.location.href.substring(0, 21)
        url += `/cadastro`
        window.location.href = url
    }

    return (
        <header className="header">
            <div className="logo">
                <h1>Logo</h1>
            </div>
            <div className="bt-cadastro">
                {
                    props.dropdownVisibility === true || window.location.pathname !== '/login'
                        ? <UserDropdown />
                        : <BtnGrayWithRadius click={register} label="Cadastre-se" />
                }
            </div>
        </header>
    )
}

function mapStateToProps(state) {
    return {
        dropdownVisibility: state.dropdown.dropdownVisibility
    }
}

export default connect(mapStateToProps)(Header)