import React, { Component } from 'react'
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
}

class ServicosTrampeiro extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.loadServicesOfInterest = this.loadServicesOfInterest.bind(this)
        this.previousPage = this.previousPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
    }

    componentDidMount() {
        this.loadServicesOfInterest()
    }

    async loadServicesOfInterest() {
        await axios.get(`${baseApiUrl}/services/services-interested-by-user?page=${this.state.currentPage}&userId=1`)
            .then(res => {
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
                        <th>Especialidade</th>
                        <th>Valor</th>
                        <th>Local</th>
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
                    <tr key={service.id} onClick={_ => this.openService(service.id)}>
                        <td>{service.postDate}</td>
                        <td>{service.serviceTitle}</td>
                        <td>{service.specialities.toString()}</td>
                        <td>{service.value}</td>
                        <td>{`${service.address.city} - ${service.address.state}`}</td>
                    </tr>
                )
            })
        )
    }

    openService(serviceIid) {
        let url = window.location.href.substring(0, 21)
        url += `/detalhes-servico-trampeiro/${serviceIid}`
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
        )
    }
}

export default ServicosTrampeiro