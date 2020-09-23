import React, { Component } from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

import './DetalhesServicoTrampeiro.css'

import baseApiUrl from './../../../global.js'

import BtnBlueWithRadius from './../buttons/BtnBlueWithRadius.jsx'

const initialState = {
    interested: false,
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
    }

    async getAlreadyInterested() { // Aqui vai o id do usuário
        await axios.post(`${baseApiUrl}/interested-service/already-interested`, { userId: 1, serviceId: this.state.service.id })
            .then(res => {
                this.setState({ interested: res.data })
            })
    }

    async loadService() {
        await axios.get(`${baseApiUrl}/services/${this.props.match.params.id}`)
            .then(res => {
                this.setState({ service: res.data })
            })
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
                        <div className="data-postagem-value">{this.state.service.postDate}</div>
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
                    {this.renderManifestArea()}
                </div>
            </div>
        )
    }
}

export default DetalhesServicoTrampeiro