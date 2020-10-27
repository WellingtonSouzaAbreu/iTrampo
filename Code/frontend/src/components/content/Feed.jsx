import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import axios from 'axios'

import './Feed.css'

import baseApiUrl from './../../global.js'
import { Redirect } from 'react-router'

import BtnGrayWithRadius from './buttons/BtnGrayWithRadius.jsx'
import BtnBlueWithoutRadius from './buttons/BtnBlueWithoutRadius.jsx'

const initialState = {
    servicesSummarized: [],
    count: 0,
    limit: 0,
    pages: [],
    currentPage: 1,
    specialities: [],
    selectedSpecialitiesLabel: [],
    searchFilters: {
        value: null,
        speciality: null,
        city: null
    },
    redirectToService: false,
    serviceClicked: null
}

class Feed extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.loadServices = this.loadServices.bind(this)
        this.previousPage = this.previousPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
    }

    componentDidMount() {
        this.loadServices()
        this.getSpecialitiesForComboBox()
    }

    async loadServices(e) {
        if (e) e.preventDefault()
        let filters = this.state.searchFilters.value ? `&value=${this.state.searchFilters.value}` : ''
        filters += this.state.searchFilters.speciality ? `&speciality=${this.state.searchFilters.speciality}` : ''
        filters += this.state.searchFilters.city ? `&city=${this.state.searchFilters.city}` : ''

        await axios.get(`${baseApiUrl}/services?page=${this.state.currentPage}${filters}`)
            .then(res => {
                let selectedSpecialitiesLabels = res.data.data.selectedSpecialitiesLabels
                delete res.data.data.selectedSpecialitiesLabels

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
            <Table striped hover > {/*bordered   size="sm"   variant="dark"*/}
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Serviço</th>
                        <th>Competências</th>
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
            this.state.servicesSummarized.map((service) => {
                return (
                    <tr key={service.id} onClick={_ => this.openService(service.id)}>
                        <td>{this.renderFormatedPostDate(service.postDate)}</td>
                        <td>{service.serviceTitle}</td>
                        <td>{service.selectedSpecialitiesLabels.toString()}</td>
                        <td>{service.value}</td>
                        <td>{`${service.address.city} - ${service.address.state}`}</td>
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

    setValueFilter(e) {
        let value = e.target.value
        this.setState({
            searchFilters: {
                value: value,
                speciality: this.state.searchFilters.speciality,
                city: this.state.searchFilters.city
            }
        })
    }

    setSpecialityFilter(e) {
        let speciality = e.target.value
        this.setState({
            searchFilters: {
                value: this.state.searchFilters.value,
                speciality: speciality,
                city: this.state.searchFilters.city
            }
        })
    }

    setCityFilter(e) {
        let city = e.target.value
        this.setState({
            searchFilters: {
                value: this.state.searchFilters.value,
                speciality: this.state.searchFilters.speciality,
                city: city
            }
        })
    }

    async getSpecialitiesForComboBox() {
        await axios.get(`${baseApiUrl}/specialities`)
            .then(res => this.setState({ specialities: res.data }))
    }

    setSpecialitiesOptions() {
        return (
            this.state.specialities.map(speciality => {
                return <option value={speciality.speciality}>{speciality.speciality}</option>
            })
        )
    }

    render() {
        return (
            <>
                {this.state.redirectToService ? <Redirect to={`/detalhes-servico/${this.state.serviceClicked}`} /> : ''}
                <div className='feed'>
                    <div className="filters">
                        <form>
                            <div className="form-row">
                                <div className="col-3">
                                    <label className="mb-0" for="value">Valor:</label>
                                    <select id="value" className="form-control" onChange={e => this.setValueFilter(e)}>
                                        <option selected value={[0, 99999]}>Selecione...</option>
                                        <option value={[0, 100]}>R$0,00 - R$100,00</option>
                                        <option value={[100, 200]}>R$100,00 - R$200,00</option>
                                        <option value={[200, 300]}>R$200,00 - R$300,00</option>
                                        <option value={[300, 400]}>R$300,00 - R$400,00</option>
                                        <option value={[400, 500]}>R$400,00 - R$500,00</option>
                                        <option value={[500, 99999]}>Acima de R$500,00</option>
                                    </select>
                                </div>
                                <div className="col-3">
                                    <label className="mb-0" for="especialidade">Especialidade:</label>
                                    <select id="speciality" className="form-control" onChange={e => this.setSpecialityFilter(e)}>
                                        <option selected value={''}>Selecione...</option>
                                        {this.setSpecialitiesOptions()}
                                    </select>
                                </div>
                                <div className="col-4">
                                    <label className="mb-0" for="cidade">Cidade:</label>
                                    <input id="city" type="text" className="form-control" placeholder="Cidade..." onChange={e => this.setCityFilter(e)} />
                                </div>
                                <div className="col-2 button-container">
                                    <BtnBlueWithoutRadius click={this.loadServices} label="Buscar" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="mt-4">
                        <div className="body-servicos-empregador">
                            {this.renderTable()}
                        </div>
                        <div className="footer-servicos-empregador">
                            <div className="paginador">
                                {this.showPager()}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}



export default Feed