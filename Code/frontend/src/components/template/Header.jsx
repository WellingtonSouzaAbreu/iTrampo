import React from 'react'
import { connect } from 'react-redux'

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
                    props.headerItemsIsVisible
                        ? props.userDropdownVisibility
                            ? <UserDropdown />
                            : <BtnGrayWithRadius click={register} label="Cadastre-se" />

                        : <span style={{color: 'white'}}>Conclua seu cadastro e tenha acesso total à nossa plataforma!</span>
                }
            </div>
        </header>
    )
}

function mapStateToProps(state) {
    return {
        userData: state.userData,
        userDropdownVisibility: state.userDropdown.dropdownVisibility,
        headerItemsIsVisible: state.headerItems.visibility
    }
}

export default connect(mapStateToProps)(Header)