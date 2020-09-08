import React from 'react'

import './DetalhesServicoTrampeiro.css'

function DetalhesServicoTrampeiro(props) {
    return (
        <div className="detalhes-servico-trampeiro">
            <div className="detalhes-header">
                <h1 className="titulo-servico">Desenvolver um sistema mobile para padaria</h1>
                <div className="status-servico">Aberto</div>
            </div>
            <div className="detalhes-body">
                <div className="info-servico">
                    <div className="data-postagem info-label">Data de postagem:</div>
                    <div className="data-postagem-value">06/03/2020</div>
                    <div className="local info-label">Local:</div>
                    <div className="local-value">Rolim de Moura - RO</div>
                    <div className="valor info-label">Valor:</div>
                    <div className="valor-value">R$300,00 - R$500,00</div>
                    <div className="prazo info-label">Prazo:</div>
                    <div className="prazo-value">35 dias</div>
                    <div className="vagas info-label">Vagas:</div>
                    <div className="vagas-value">2</div>
                    <div className="interessados info-label">Interessados:</div>
                    <div className="interessados-value">5 interessados</div>
                </div>
                <hr />
                <div className="descricao-servico">
                    <div className="titulo-descricao">
                        <h2>Descrição do trabalho</h2>
                    </div>
                    <div className="conteudo-descricao">
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>
                    </div>
                </div>
            </div>
            <hr />
            <div className="detalhes-footer">
                <button className="bt-manifestar-interesse">Manifestar interesse</button>
            </div>
        </div>
    )
}

export default DetalhesServicoTrampeiro