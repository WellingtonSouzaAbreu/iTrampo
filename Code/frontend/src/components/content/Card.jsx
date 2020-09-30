import React from 'react'

import './Card.css'

function Card(props) {
    return (
        <>
            <div className="card p-3">
                <div className="card-title">
                    <h3>{props.title}</h3>
                </div>
                <div className="card-content">
                    <ul className="list">
                        <li>
                            <p className="card-text">
                                Escolher um pacote que atenda melhor a sua necessidade
                                Acessar o feed para ter acesso aos serviços
                                Escolher um pacote que atenda melhor a sua necessidade
                                Acessar o feed para ter acesso aos serviços
                                Escolher um pacote que atenda melhor a sua necessidade
                                Acessar o feed para ter acesso aos serviços
                                Escolher um pacote que atenda melhor a sua necessidade
                                Acessar o feed para ter acesso aos serviços
                                Escolher um pacote que atenda melhor a sua necessidade
                                Acessar o feed para ter acesso aos serviços
                                </p>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Card