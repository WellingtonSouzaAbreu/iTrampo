import React, { Component } from 'react'
import { Redirect } from 'react-router'
import axios from 'axios'
import { Table } from 'react-bootstrap'

import baseApiUrl from '../../../global'
import BtnGrayWithRadius from './../buttons/BtnGrayWithRadius.jsx'

const initialState = {
    servicesOfInterest: [],
    count: 0,
    limit: 0,
    pages: [],
    currentPage: 1,

    redirectToService: false,
    serviceClicked: null
}

class ServicosTrampeiro extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.loadServicesOfInterest = this.loadServicesOfInterest.bind(this)
        this.previousPage = this.previousPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.deleteInterestInService = this.deleteInterestInService.bind(this)
    }

    componentDidMount() {
        this.loadServicesOfInterest()
    }

    async loadServicesOfInterest() {
        const idUser = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).id : ''
        await axios.get(`${baseApiUrl}/services/services-interested-by-user?page=${this.state.currentPage}&userId=${idUser}`)
            .then(res => {
                let selectedSpecialitiesLabels = res.data.data.selectedSpecialitiesLabels
                delete res.data.data.selectedSpecialitiesLabels

                this.setState({
                    servicesOfInterest: res.data.data,
                    count: res.data.count,
                    limit: res.data.limit
                })
                return
            })
            .then(_ => this.configurePager())
    }

    renderTable() {
        return (
            <Table striped hover > {/*bordered   size="sm"   variant="dark"*/}
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Serviço</th>
                        <th>Competências</th>
                        <th>Valor</th>
                        <th>Local</th>
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
            this.state.servicesOfInterest.map((service) => {
                return (
                    <tr key={service.id}>
                        <td onClick={_ => this.openService(service.id)}>{this.renderFormatedPostDate(service.postDate)}</td>
                        <td onClick={_ => this.openService(service.id)}>{service.serviceTitle}</td>
                        <td onClick={_ => this.openService(service.id)}>{service.selectedSpecialitiesLabels.toString()}</td>
                        <td onClick={_ => this.openService(service.id)}>{service.value}</td>
                        <td onClick={_ => this.openService(service.id)}>{`${service.address.city} - ${service.address.state}`}</td>
                        <td><button className="btn btn-danger" onClick={e => this.deleteInterestInService(e, service.id)}><i className="fa fa-trash"></i></button></td>
                    </tr>
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

    async deleteInterestInService(e, idService) {
        const idUser = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).id : ''
        if (e) e.preventDefault()
        await axios.delete(`${baseApiUrl}/interested-service/del-interest/${idService}/${idUser}`)
            .then(res => window.alert('Serviço deletado com sucesso!'))
            .catch(err => window.alert(err.response.data))

        this.loadServicesOfInterest()
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
                {this.state.redirectToService ? <Redirect to={`/detalhes-servico/${this.state.serviceClicked}`} /> : ''}
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

    async setCurrentPage(currentPage, e) {
        if (e) e.preventDefault()
        await this.setState({ currentPage })
        this.loadServicesOfInterest()
    }

    render() {
        return (
            <>
                <div className='servicos-trampeiro'>
                    <div className="header-servicos-trampeiro">
                        <h1 className="ml-3">Interesses</h1>
                    </div>
                    <div className="body-servicos-trampeiro">
                        {this.renderTable()}
                    </div>
                    <div className="footer-servicos-trampeiro">
                        <div className="paginador">
                            {this.showPager()}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ServicosTrampeiro