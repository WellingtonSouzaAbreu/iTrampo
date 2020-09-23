import React from 'react'

import './Header.css'

import BtnGrayWithRadius from './../content/buttons/BtnGrayWithRadius.jsx'


export default function Header(props){

    return(
        <header className="header">
            <div className="logo">
                <h1>Logo</h1>
            </div>
            <div className="bt-cadastro">
                <BtnGrayWithRadius label="Cadastre-se"/>
            </div>
        </header>    
    )
}