import React from 'react'

import './Content.css'
import DetalhesServicoTrampeiro from './../content/user-trampeiro/DetalhesServicoTrampeiro.jsx'
import ServicosEmpregador from './../content/user-empregador/ServicosEmpregador.jsx'

export default function Content(props) {
    return (
        <div className="content">
            <DetalhesServicoTrampeiro/>{/*  Substituir esse componente por outro */}
            {/* <ServicosEmpregador/> */}
        </div>
    )
}