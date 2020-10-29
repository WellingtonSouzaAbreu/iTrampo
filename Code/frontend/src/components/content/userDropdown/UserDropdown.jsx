import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
// import Gravatar from 'react-gravatar' desistalar

import './UserDropdown.css'


function UserDropdown(props) {
    function logout() {
        localStorage.removeItem('userData')
    }

    return (
        <div className="user-dropdown">
            <div className="user-button">
                <span className="d-none d-sm-block">{'Wellington Souza Abreu'}</span>
                <i className="fa fa-angle-down ml-2"></i>
            </div>
            <div className="user-dropdown-content" onClick={e => logout()}>
                <Link to='/login'> <i className="fa fa-sign-out" ></i> Sair</Link>
            </div>
        </div>
    )
}

export default UserDropdown
