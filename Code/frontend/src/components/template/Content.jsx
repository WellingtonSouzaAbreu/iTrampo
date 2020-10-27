import React from 'react'
import axios from 'axios'

import './Content.css'
import Router from './../../config/router.jsx'

export default function Content(props) {

    return (
        <div className="content">
            <Router></Router>
            {/* <DetalhesServicoTrampeiro/> Substituir esse componente por outro */}
            {/* <ServicosEmpregador/> */}
            {/* <Feed /> */}
        </div>
    )
}