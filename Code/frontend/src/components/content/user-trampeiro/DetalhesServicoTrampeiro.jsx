import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import axios from 'axios'
import { Link } from 'react-router-dom'

import './DetalhesServicoTrampeiro.css'

import baseApiUrl from './../../../global.js'

import BtnBlueWithRadius from './../buttons/BtnBlueWithRadius.jsx'

const initialState = {
    interested: false,
    interestedInService: [],
    userType: 'trampeiro', // Enviado pelo header da requisição
    service: {
        serviceTitle: '',
        description: '',
        value: 0,
        termInDays: 0,
        status: false,
        numberOfVacancies: 0,
        numberOfStakeholders: 0,
        postDate: '',
        user: {},
        specialities: [],
        address: {}
    }
}
class DetalhesServicoTrampeiro extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.expressInterest = this.expressInterest.bind(this)
    }

    async componentDidMount() {
        await this.loadService()
        await this.getAlreadyInterested()
        await this.loadInterested()
    }


    async loadService() {
        await axios.get(`${baseApiUrl}/services/${this.props.match.params.id}`)
            .then(res => {
                this.setState({ service: res.data })
            })
    }

    async getAlreadyInterested() { // Aqui vai o id do usuário
        await axios.post(`${baseApiUrl}/interested-service/already-interested`, { userId: 1, serviceId: this.state.service.id })
            .then(res => {
                this.setState({ interested: res.data })
            })
    }

    async loadInterested() {
        await axios.get(`${baseApiUrl}/interested-service/${this.props.match.params.id}`)
            .then(res => this.setState({ interestedInService: res.data }))
    }

    async expressInterest(e) {
        if (e) e.preventDefault()
        await axios.post(`${baseApiUrl}/interested-service/`, { userId: 1, serviceId: this.state.service.id })
            .then(res => console.log(res.data))
            .catch(err => window.alert(err))

        this.loadService()
        this.getAlreadyInterested()
    }

    renderManifestArea() {
        if (this.state.service.status) {
            return (
                this.state.interested ?
                    <h3 className="already-interested">Você já manifestou interesse neste serviço.</h3> :
                    <BtnBlueWithRadius click={this.expressInterest} label='Manifestar interesse' />
            )
        } else {
            return <h3 className="already-interested">Esse serviço está fechado.</h3>
        }
    }

    renderTable() {
        return (
            <Table striped hover > {/*bordered   size="sm"   variant="dark"*/}
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Serviços Prestados</th>
                        <th>Avaliação</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </Table>
        )
    }

    renderRows() {
        return (
            this.state.interestedInService.map((interested) => {
                return (
                    <tr key={interested.id} onClick={_ => this.openInterested(interested.id)}>
                        <td>{interested.name}</td>
                        <td>{interested.servicesProvidedRequested}</td>
                        <td>{this.renderEvaluation(interested.averageEvaluation)}</td>
                    </tr>
                )
            })
        )
    }

    openInterested(idInterested) {
        let url = window.location.href.substring(0, 21)
        url += `/perfil-visualizar/${idInterested}`
        window.location.href = url
    }

    renderEvaluation(evaluation) {
        evaluation = evaluation ? evaluation : -0.9
        let stars = []
        for (let i = 1; i <= evaluation; i++) {
            stars.push(<i className="fa fa-star stars"></i>)
        }

        if (!Number.isInteger(evaluation)) {
            stars.push(<i className="fa fa-star-half-o stars"></i>)
        }

        for (evaluation = Math.ceil(evaluation); evaluation < 5; evaluation++) {
            stars.push(<i className="fa fa-star-o stars"></i>)
        }

        return stars
    }

    render() {
        return (
            <div className="detalhes-servico-trampeiro">
                <div className="detalhes-header">
                    <h1 className="titulo-servico">{this.state.service.serviceTitle}</h1>
                    <div className={`status-servico ${this.state.service.status ? 'aberto' : 'fechado'}`}>{this.state.service.status ? 'Aberto' : 'Fechado'}</div>
                </div>
                <div className="detalhes-body">
                    <div className="info-servico">
                        <div className="data-postagem info-label">Data de postagem:</div>
                        <div className="data-postagem-value">{this.state.service.postDate.split('T')[0]}</div>
                        <div className="local info-label">Local:</div>
                        <div className="local-value">{`${this.state.service.address.city} - ${this.state.service.address.state}, ${this.state.service.address.country}`}</div>
                        <div className="valor info-label">Valor:</div>
                        <div className="valor-value">{`R$ ${this.state.service.value},00`}</div>
                        <div className="prazo info-label">Prazo:</div>
                        <div className="prazo-value">{`${this.state.service.termInDays} dias`}</div>
                        <div className="vagas info-label">Vagas:</div>
                        <div className="vagas-value">{`${this.state.service.numberOfVacancies} vagas`}</div>
                        <div className="interessados info-label">Interessados:</div>
                        <div className="interessados-value">{this.state.service.numberOfStakeholders}</div>
                        <div className="competencias info-label">Competências:</div>
                        <div className="competencias-value">{this.state.service.specialities.toString()}</div>
                        <div className="empregador info-label">Empregador:</div>
                        <div className="empregador-value">
                            <Link to={`/perfil-visualizar/${this.state.service.user.id}`}>{this.state.service.user.name}</Link>
                        </div>
                    </div>
                    <hr />
                    <div className="descricao-servico">
                        <div className="titulo-descricao">
                            <h2>Descrição do trabalho</h2>
                        </div>
                        <div className="conteudo-descricao">
                            <p>
                                {this.state.service.description}
                                {/* Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. */}
                            </p>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="detalhes-footer">
                    {this.state.userType == 'empregador' ?
                        this.renderTable() :
                        this.renderManifestArea()
                    }
                </div>
            </div>
        )
    }
}

export default DetalhesServicoTrampeiro