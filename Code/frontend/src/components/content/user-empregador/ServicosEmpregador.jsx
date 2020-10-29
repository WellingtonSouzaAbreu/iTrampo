import React, { Component } from 'react'
import axios from 'axios'
import { Table } from 'react-bootstrap'
import { Redirect } from 'react-router'


import baseApiUrl from './../../../global.js'
import ControlButtons from './../buttons/ControlButtons.jsx'
import BtnGrayWithRadius from './../buttons/BtnGrayWithRadius.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import './ServicosEmpregador.css'

import BtnBlueWithRadius from './../buttons/BtnBlueWithRadius.jsx'

const initialState = {
    idUser: null,
    servicesSummarized: [],
    count: 0,
    limit: 0,
    pages: [],
    currentPage: 1,
    redirectToService: false,
    serviceClicked: null
}

class ServicosEmpregador extends Component {

    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.loadServices = this.loadServices.bind(this)
        this.previousPage = this.previousPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.confirmService = this.confirmService.bind(this)
        this.editService = this.editService.bind(this)
        this.deleteService = this.deleteService.bind(this)
    }

    async componentDidMount() {
        await this.getIdUserFromToken()
        await this.loadServices()
    }

    async getIdUserFromToken() {
        await axios.get(`${baseApiUrl}/extract-from-token?dataType=id`)
            .then(res => {
                this.setState({ idUser: res.data })
            })
            .catch(err => window.alert('Erro: Por favor faça login novamente'))
    }

    async loadServices(e) {
        if (e) e.preventDefault()

        await axios.get(`${baseApiUrl}/services/employer/${this.state.idUser}?page=${this.state.currentPage}`)
            .then(res => {
                let selectedSpecialitiesLabels = res.data.selectedSpecialitiesLabels
                delete res.data.selectedSpecialitiesLabels

                this.setState({
                    servicesSummarized: res.data.data,
                    count: res.data.count,
                    limit: res.data.limit
                })
            })
            .then(_ => this.configurePager())
    }

    renderTable() {
        return (
            <Table striped /* bordered */ hover>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Serviço</th>
                        <th>Competências</th>
                        <th>Valor</th>
                        <th>Local</th>
                        <th>Status</th>
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
            this.state.servicesSummarized.map((service) => {
                return (
                    <>
                        <tr key={service.id}>
                            <td onClick={e => this.openService(service.id)}>{this.renderFormatedPostDate(service.postDate)}</td>
                            <td onClick={e => this.openService(service.id)}>{service.serviceTitle}</td>
                            <td onClick={e => this.openService(service.id)}>{service.selectedSpecialitiesLabels.toString()}</td>
                            <td onClick={e => this.openService(service.id)}>{`R$ ${service.value},00`}</td>
                            <td onClick={e => this.openService(service.id)}>{`${service.address.city} - ${service.address.state}`}</td>
                            <td onClick={e => this.openService(service.id)}>{service.status ? 'Aberto' : 'Fechado'}</td>
                            <td className="area-acoes"><ControlButtons idService={service.id} confirm={this.confirmService} edit={this.editService} delete={this.deleteService} /></td>
                        </tr>
                    </>
                )
            })
        )
    }

    openService(idService) {
        this.setState({
            serviceClicked: idService,
            redirectToService: true
        })
    }

    renderFormatedPostDate(postDate) {
        let dateFormated = postDate.split('T')[0]
        dateFormated = dateFormated.split('-')
        dateFormated = dateFormated.reverse().toString().replace(/,/g, '/')

        return `${dateFormated}`
    }

    async confirmService(idService, e) {
        window.alert('Por favor, avalie todos o trampeiro que trabalharam para você!')
        if (e) e.preventDefault()

        await axios.post(`${baseApiUrl}/services/check-evaluation/${idService}`)
            .then(res => window.alert('Serviço finalizado com sucesso'))
            .catch(err => window.alert(err.response.data))

    }

    editService(idService, e) {
        if (e) e.preventDefault()
        let url = window.location.href.substring(0, 21)
        url += `/solicitacao-servico/${idService}`
        window.location.href = url
    }

    async deleteService(idService, e) {
        window.alert(idService)
        if (e) e.preventDefault()
        await axios.delete(`${baseApiUrl}/services/${idService}`)
            .then(res => {
                window.alert('Serviço deletado com sucesso!')
                this.loadServices()
            })
            .catch(err => window.alert('Erro ao deletar serviço'))
    }

    newService() {
        let url = window.location.href.substring(0, 21)
        url += `/solicitacao-servico`
        window.location.href = url
    }

    configurePager() {
        let numberOfPages = Math.ceil(this.state.count / this.state.limit)
        let pages = []
        for (let i = 1; i <= numberOfPages; i++) {
            pages.push(i)
        }
        this.setState({ pages: pages })
    }

    showPager() {
        return (
            <>
                <BtnGrayWithRadius click={this.previousPage} label={'<<'} />
                <ul className="pagination mb-0">
                    {this.state.pages.map((page) => {
                        return (
                            <li class={`page-item ${this.setActivePage(page)}`} onClick={e => this.setCurrentPage(page, e)}>
                                <a class="page-link " href="">{page}</a>
                            </li>
                        )
                    })
                    }
                </ul>
                <BtnGrayWithRadius click={this.nextPage} label={'>>'} />
            </>
        )
    }

    setActivePage(pageNumber) {
        return this.state.currentPage === pageNumber ? 'active' : ''
    }

    async setCurrentPage(currentPage, e) {
        if (e) e.preventDefault()
        await this.setState({ currentPage })
        this.loadServices()
    }

    previousPage(e) {
        if (e) e.preventDefault()
        let { currentPage } = this.state
        this.setCurrentPage(currentPage > 1 ? --currentPage : currentPage)
    }

    nextPage(e) {
        if (e) e.preventDefault()
        let { currentPage, pages } = this.state
        this.setCurrentPage(currentPage < pages.length ? ++currentPage : currentPage)
    }

    render() {
        return (
            <>
                {this.state.redirectToService ? <Redirect to={`/detalhes-servico/${this.state.serviceClicked}`} /> : ''}
                <div className="servicos-empregador" >
                    <div className="header-servicos-empregador">
                        <h1>Serviços Solicitados</h1>
                        <BtnBlueWithRadius label='Novo Serviço' click={this.newService} />
                    </div>
                    <div className="body-servicos-empregador">
                        {this.renderTable()}
                    </div>
                    <div className="footer-servicos-empregador">
                        <div className="paginador">
                            {this.showPager()}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ServicosEmpregador