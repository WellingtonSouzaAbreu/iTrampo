import React from 'react'

import './Footer.css'

export default function Footer(props){
    return(
        <div className="footer">
            <div className="footer-items">
                <a className="item" href="/como-funciona">Como funciona</a>
                <a className="item" href="/ajuda">Ajuda</a>
                <a className="item" href="/termos-condicoes">Termos e Condições</a>
                <a className="item" href="/sair">Sair</a>
            </div>
            </div>
    )
}