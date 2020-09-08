import React from 'react'

import './Header.css'

export default function Header(props){

    
    return(
        <header className="header">
            <div className="logo">
                <h1>Logo</h1>
            </div>
            <div className="cadastro">
                <button className="bt-cadastro">Cadastre-se</button>
            </div>
        </header>    
    )
}