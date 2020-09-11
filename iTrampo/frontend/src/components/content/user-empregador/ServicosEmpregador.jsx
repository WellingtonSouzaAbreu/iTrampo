import React from 'react'
import { Table } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import './ServicosEmpregador.css'

import BtnBlueWithRadius from './../buttons/BtnBlueWithRadius.jsx'
import ControlButtons from './../buttons/ControlButtons.jsx'
import Paginator from './../buttons/Paginador.jsx'

function compFunc(props) {

    function renderTable() {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Serviço</th>
                        <th>Especialidade</th>
                        <th>Valor</th>
                        <th>Local</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                {renderRows()}
            </Table>
        )
    }

    function renderRows() {
        return (
            <>
                <tr /* key={} */>
                    <td>06.06.2020</td>
                    <td>Criação de software para a padaria TemPão, Tem</td>
                    <td>Faxineiro</td>
                    <td>R$300 - R$500</td>
                    <td>Novo Horizonte - RO - Brasil</td>
                    <td><ControlButtons /></td>
                </tr>
                <tr /* key={} */>
                    <td>06.06.2020</td>
                    <td>Criação de software para a padaria TemPão, Tem</td>
                    <td>Faxineiro</td>
                    <td>R$300 - R$500</td>
                    <td>Novo Horizonte - RO - Brasil</td>
                    <td><ControlButtons /></td>
                </tr>
            </>
        )
    }

    return (
        <div className="servicos-empregador">
            <div className="header-servicos-empregador">
                <h1>Serviços Solicitados</h1>
                <BtnBlueWithRadius label='Novo Serviço' />
            </div>
            <div className="body-servicos-empregador">
                {renderTable()}
            </div>
            <div className="footer-servicos-empregador">
                <Paginator/>
            </div>
        </div>
    )
}

export default compFunc