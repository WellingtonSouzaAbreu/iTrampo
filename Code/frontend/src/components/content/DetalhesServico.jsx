import React, { Component } from 'react'
import { Table, Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import { Link } from 'react-router-dom'


import './DetalhesServico.css'

import baseApiUrl from '../../global.js'

import BtnBlueWithRadius from './buttons/BtnBlueWithRadius.jsx'

const initialState = {
    selectedSpecialitiesLabels: [],
    interested: false,
    interestedInService: [],
    userType: 'trampeiro', // Enviado pelo header da requisição
    idUser: null, // Id do usuário logado
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
    },
    userSelectedForEvaluation: null,
    modalVisibility: false,
    evaluation: {
        qualityStars: 0,
        professionalismStars: 0,
        comunicationStars: 0,
        deadlineStars: 0,
    }
}
class DetalhesServicoTrampeiro extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.expressInterest = this.expressInterest.bind(this)
        this.evaluateInterested = this.evaluateInterested.bind(this)
    }

    async componentDidMount() {
        this.setUserTypeFromLocalStorage()
        this.setIdUserFromLocalStorage()
        await this.loadService()
        await this.getAlreadyInterested()
        await this.loadInterested()
        this.hideEvaluationModal = this.hideEvaluationModal.bind(this)
    }

    setUserTypeFromLocalStorage() {
        this.setState({ userType: `${JSON.parse(localStorage.getItem('userData')).userType}` })
    }

    setIdUserFromLocalStorage() {
        this.setState({ idUser: JSON.parse(localStorage.getItem('userData')).id })
    }

    async loadService() {
        await axios.get(`${baseApiUrl}/services/${this.props.match.params.id}`)
            .then(res => {
                let selectedSpecialitiesLabels = res.data.selectedSpecialitiesLabels
                delete res.data.selectedSpecialitiesLabels

                this.setState({ service: res.data, selectedSpecialitiesLabels })
            })
    }

    async getAlreadyInterested() { // Aqui vai o id do usuário
        await axios.post(`${baseApiUrl}/interested-service/already-interested`, { userId: JSON.parse(localStorage.getItem('userData')).id, serviceId: this.state.service.id })
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
        await axios.post(`${baseApiUrl}/interested-service/`, { userId: JSON.parse(localStorage.getItem('userData')).id, serviceId: this.state.service.id })
            .then(res => console.log(res.data))
            .catch(err => window.alert(err.response.data))

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

    renderTableWithInterested() {
        return (
            <Table striped hover > {/*bordered   size="sm"   variant="dark"*/}
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Serviços Prestados</th>
                        <th>Avaliação</th>
                        <th>Ações</th>
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
                    <tr key={interested.id} >
                        <td onClick={_ => this.openInterested(interested.id)}>{interested.name}</td>
                        <td onClick={_ => this.openInterested(interested.id)}>{interested.servicesProvidedRequested}</td>
                        <td onClick={_ => this.openInterested(interested.id)}>{this.renderEvaluation(interested.averageEvaluation)}</td>
                        <td>
                            <button className="btn btn-success" onClick={e => this.selectInterestedForEvaluation(e, interested.id)}><i className="fa fa-check"></i></button>
                            <button className="btn btn-danger ml-2" onClick={e => this.deleteInterested(e, interested.id)}><i className="fa fa-trash"></i></button>
                        </td>
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
        evaluation = evaluation ? evaluation : -0.09
        let stars = []
        for (let i = 1; i <= evaluation; i++) {
            stars.push(<i className="fa fa-star stars"></i>)
        }

        if (!Number.isInteger(evaluation) && evaluation > 0) {
            stars.push(<i className="fa fa-star-half-o stars"></i>)
        }

        for (evaluation = Math.ceil(evaluation); evaluation < 5; evaluation++) {
            stars.push(<i className="fa fa-star-o stars"></i>)
        }

        return stars
    }

    selectInterestedForEvaluation(e, idInterested) {
        if (e) e.preventDefault()
        this.setState({ userSelectedForEvaluation: idInterested })
        this.showEvaluationModal()
    }

    async deleteInterested(e, idInterested) {
        if (e) e.preventDefault()
        await axios.delete(`${baseApiUrl}/interested-service/${this.state.service.id}/${idInterested}`)
            .then(res => window.alert('Deletado com sucesso!'))
            .catch(err => window.alert(err.response.data))

        this.loadInterested()
    }

    showEvaluationModal() {
        this.setState({ modalVisibility: true })
    }

    hideEvaluationModal() {
        this.setState({ modalVisibility: false })
    }

    evaluationModal() {
        return (
            <>
                <Modal
                    show={this.state.modalVisibility}
                    onHide={this.hideEvaluationModal}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Avalie</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Avalie com atenção, sua avaliação é importante!
                        <div className="ml-3 mt-2">
                            <div className="row  mt-2">
                                <div className="col-4">
                                    Qualidade:
                                </div>
                                <div className="col">
                                    {this.renderQualityStars()}
                                </div>
                            </div>
                            <div className="row  mt-2">
                                <div className="col-4">
                                    Profissionalismo:
                                </div>
                                <div className="col">
                                    {this.renderProfessionalismStars()}
                                </div>
                            </div>
                            <div className="row  mt-2">
                                <div className="col-4">
                                    Prazo:
                                </div>
                                <div className="col">
                                    {this.renderDeadlineStars()}
                                </div>
                            </div>
                            <div className="row  mt-2">
                                <div className="col-4">
                                    Comunicação:
                                </div>
                                <div className="col">
                                    {this.renderComunicationStars()}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.evaluateInterested}>Avaliar</Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

    renderQualityStars() {
        const numberOfStars = this.state.evaluation.qualityStars

        let qualityStars = []
        for (let i = 1; i <= numberOfStars; i++) {
            qualityStars.push(<i className="fa fa-star stars" onClick={e => this.setActiveStar(e, 'qualityStars')} value={i}> </i>)
        }

        if (numberOfStars < 5) {
            for (let i = numberOfStars + 1; i <= 5; i++) { // 5 é o máximo de estrelas
                qualityStars.push(<i className="fa fa-star-o stars" onClick={e => this.setActiveStar(e, 'qualityStars')} value={i}> </i>)
            }
        }

        return qualityStars
    }

    renderProfessionalismStars() {
        const numberOfStars = this.state.evaluation.professionalismStars

        let professionalismStars = []
        for (let i = 1; i <= numberOfStars; i++) {
            professionalismStars.push(<i className="fa fa-star stars" onClick={e => this.setActiveStar(e, 'professionalismStars')} value={i}> </i>)
        }

        if (numberOfStars < 5) {
            for (let i = numberOfStars + 1; i <= 5; i++) { // 5 é o máximo de estrelas
                professionalismStars.push(<i className="fa fa-star-o stars" onClick={e => this.setActiveStar(e, 'professionalismStars')} value={i}> </i>)
            }
        }

        return professionalismStars
    }

    renderDeadlineStars() {
        const numberOfStars = this.state.evaluation.deadlineStars

        let deadlineStars = []
        for (let i = 1; i <= numberOfStars; i++) {
            deadlineStars.push(<i className="fa fa-star stars" onClick={e => this.setActiveStar(e, 'deadlineStars')} value={i}> </i>)
        }

        if (numberOfStars < 5) {
            for (let i = numberOfStars + 1; i <= 5; i++) { // 5 é o máximo de estrelas
                deadlineStars.push(<i className="fa fa-star-o stars" onClick={e => this.setActiveStar(e, 'deadlineStars')} value={i}> </i>)
            }
        }

        return deadlineStars
    }

    renderComunicationStars() {
        const numberOfStars = this.state.evaluation.comunicationStars

        let comunicationStars = []
        for (let i = 1; i <= numberOfStars; i++) {
            comunicationStars.push(<i className="fa fa-star stars" onClick={e => this.setActiveStar(e, 'comunicationStars')} value={i}> </i>)
        }

        if (numberOfStars < 5) {
            for (let i = numberOfStars + 1; i <= 5; i++) { // 5 é o máximo de estrelas
                comunicationStars.push(<i className="fa fa-star-o stars" onClick={e => this.setActiveStar(e, 'comunicationStars')} value={i}> </i>)
            }
        }

        return comunicationStars
    }

    setActiveStar(e, question) {
        const numberOfStars = e.target.getAttribute('value')

        let evaluation = this.state.evaluation
        evaluation[question] = parseInt(numberOfStars)

        this.setState({ evaluation })
    }

    async evaluateInterested() {
        const { evaluation } = this.state

        await axios.post(`${baseApiUrl}/evaluation/${this.state.userSelectedForEvaluation}/${this.state.service.id}`, { evaluation, userId: this.state.idUser })
            .then(res => {
                window.alert('Avaliação realizada com sucesso!')
                this.hideEvaluationModal()
            })
            .catch(err => window.alert(err.response.data))
    }

    renderFooter() {
        if (this.state.userType === 'empregador' && this.state.idUser == this.state.service.user.id) {
            return this.renderTableWithInterested()
        } else {
            if (this.state.userType === 'trampeiro') {
                return this.renderManifestArea()
            } else {
                return
            }
        }
    }

    render() {
        return (
            <div className="detalhes-servico-trampeiro">
                {this.state.modalVisibility ? this.evaluationModal() : ''}
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
                        <div className="competencias-value">{this.state.selectedSpecialitiesLabels.toString()}</div>
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
                {this.state.userType === 'empregador' && this.state.idUser == this.state.service.user.id? <h2 className="ml-3"> Interessados</h2> : ''}
                <div className="detalhes-footer">
                    {this.renderFooter()}
                </div>
            </div>
        )
    }
}

export default DetalhesServicoTrampeiro