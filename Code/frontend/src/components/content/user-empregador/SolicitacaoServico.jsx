import React, { Component } from 'react'
import axios from 'axios'

import baseApiUrl from './../../../global.js'
import BtnGrayWithRadius from './../buttons/BtnGrayWithRadius.jsx'
import BtnBlueWithoutRadius from './../buttons/BtnBlueWithoutRadius.jsx'

import './SolicitacaoServico.css'

const initialState = {
    countries: [],
    states: [],
    cities: [],
    specialities: [],
    selectedSpecialitiesLabels: [],
    specialityIdSelected: 0,
    mode: 'register',

    service: {
        serviceTitle: 'titulo',
        value: 100,
        termInDays: 22,
        numberOfVacancies: 2,
        description: 'descricao',
        userId: null,
        status: true,
        specialities: [1],
        address: {
            neighborhood: 'Centro',
            cityId: 1
        }
    }
}

class SolicitacaoServico extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.addNewSpeciality = this.addNewSpeciality.bind(this)
        this.registerService = this.registerService.bind(this)
        this.saveService = this.saveService.bind(this)
    }

    async componentDidMount() {
        await this.setMode()
        await this.getIdUserFromToken()
        if (this.state.mode === 'edit') this.loadServiceToEdit()
        await this.loadCountries()
        await this.loadSpecialities()
    }

    setMode() {
        if (this.props.match.params.id) this.setState({ mode: 'edit' })
    }

    async getIdUserFromToken() {
        await axios.get(`${baseApiUrl}/extract-from-token?dataType=id`)
            .then(res => {
                let {service} = this.state
                service.userId = res.data
                window.alert(res.data)
                this.setState({ service })
            })
            .catch(err => window.alert('Erro: Por favor faça login novamente'))
    }

    async loadServiceToEdit() {
        await axios.get(`${baseApiUrl}/services/${this.props.match.params.id}`)
            .then(res => {
                let selectedSpecialitiesLabels = res.data.selectedSpecialitiesLabels
                delete res.data.selectedSpecialitiesLabels

                this.setState({ service: res.data, selectedSpecialitiesLabels })
            })

        await this.loadStates()
        await this.loadCities()
    }

    updateFieldServiceTitle(e) {
        let service = { ...this.state.service }
        service.serviceTitle = e.target.value
        this.setState({ service })
    }

    updateFieldValue(e) {
        let service = { ...this.state.service }
        service.value = e.target.value
        this.setState({ service })
    }

    updateFieldTermsInDays(e) {
        let service = { ...this.state.service }
        service.termInDays = e.target.value
        this.setState({ service })
    }

    updateFieldNumberOfVacancies(e) {
        let service = { ...this.state.service }
        service.numberOfVacancies = e.target.value
        this.setState({ service })
    }

    updateFieldStatus(e) {
        let service = { ...this.state.service }
        service.status = e.target.value
        this.setState({ service })
    }

    async loadCountries() {
        await axios.get(`${baseApiUrl}/address/countries`)
            .then(res => this.setState({ countries: res.data }))
    }

    renderCountriesForComboBox() {
        let idCountry = this.state.service.address.idCountry
        return this.state.countries.map(country => {
            return <option value={country.id} selected={country.id === idCountry}>{country.name}</option>
        })
    }

    async loadStates(e) {
        let countryId = e ? e.target.value : this.state.service.address.idCountry
        await axios.get(`${baseApiUrl}/address/states/${countryId}`)
            .then(res => this.setState({ states: res.data }))
    }

    renderStatesForComboBox() {
        let idState = this.state.service.address.idState
        return this.state.states.map(state => {
            return <option value={state.id} selected={state.id === idState}>{state.name}</option>
        })
    }

    async loadCities(e) {
        let stateId = e ? e.target.value : this.state.service.address.idState
        await axios.get(`${baseApiUrl}/address/cities/${stateId}`)
            .then(res => this.setState({ cities: res.data }))
    }

    renderCitiesForComboBox() {
        let idCity = this.state.service.address.cityId
        return this.state.cities.map(city => {
            return <option value={city.id} selected={city.id === idCity}>{city.name}</option>
        })
    }

    updateFieldCity(e) {
        let service = { ...this.state.service }
        service.address.cityId = e.target.value
        this.setState({ service })
    }

    updateFieldNeighborhood(e) {
        let service = { ...this.state.service }
        service.address.neighborhood = e.target.value
        this.setState({ service })
    }

    async loadSpecialities() {
        await axios.get(`${baseApiUrl}/specialities`)
            .then(res => this.setState({ specialities: res.data }))
    }

    renderSpecialitiesForComboBox() {
        return this.state.specialities.map(speciality => {
            return <option value={speciality.id}>{speciality.speciality}</option>
        })
    }

    updateFieldSpecialities(e) {
        window.alert(e.target.value)
        let specialityIdSelected = parseInt(e.target.value)
        this.setState({ specialityIdSelected })
    }

    addNewSpeciality(e) {
        if (e) e.preventDefault()

        let service = { ...this.state.service }
        let selectedSpecialitiesLabels = this.state.selectedSpecialitiesLabels

        if (this.state.specialityIdSelected > 0) {
            if (service.specialities.indexOf(this.state.specialityIdSelected) === -1) {
                selectedSpecialitiesLabels.push(this.state.specialities[this.state.specialityIdSelected - 1].speciality)
                service.specialities.push(this.state.specialityIdSelected)
            } else {
                window.alert('Você já adicionou essa especialidade!')
            }
        } else {
            window.alert('Selecione uma Especialidade válida!')
        }

        this.setState({ service, selectedSpecialitiesLabels })
    }

    renderSelectedSpecialities() {
        return this.state.selectedSpecialitiesLabels.map(selectedSpeciality => {
            return (
                <span className="specialidade-selecionada" onClick={e => this.removeSpeciality(selectedSpeciality)}>
                    {` ${selectedSpeciality} X`}
                </span>
            )
        })
    }

    removeSpeciality(selectedSpeciality) {
        let service = { ...this.state.service }
        let selectedSpecialitiesLabels = this.state.selectedSpecialitiesLabels
        let specialityIndex = selectedSpecialitiesLabels.indexOf(selectedSpeciality)

        selectedSpecialitiesLabels.splice([specialityIndex], 1)
        service.specialities.splice([specialityIndex], 1)

        this.setState({ service, selectedSpecialitiesLabels })
    }

    updateFieldDescription(e) {
        let service = { ...this.state.service }
        service.description = e.target.value
        this.setState({ service })
    }

    async registerService() {
        console.log(this.state.service)
        await axios.post(`${baseApiUrl}/services`, this.state.service)
            .then(res => window.alert('Serviço cadastrado com sucesso!'))
            .catch(err => console.log(err.response.data))
    }

    async saveService() {
        console.log(this.state.service)
        await axios.put(`${baseApiUrl}/services/${this.state.service.id}`, this.state.service)
            .then(res => window.alert('Serviço cadastrado com sucesso!'))
            .catch(err => window.alert(err.response.data))
    }

    render() {
        return (
            <div className='solicitacao-servico'>
                <div className="formulario-servico col-sm-11">
                    <h1 className="mb-4">{this.state.mode === 'register' ? 'Cadastrar novo Serviço' : 'Dados do Serviço'} </h1>
                    <form>
                        <div className="form-group row">
                            <label for="service-title" className="col-sm-2 col-form-label">Título do Serviço</label>
                            <div className="col">
                                <input value={this.state.service.serviceTitle} onChange={e => this.updateFieldServiceTitle(e)} type="text" className="form-control" id="service-title" placeholder="Título do serviço" required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="value" className="col-sm-2 col-form-label">Valor</label>
                            <div className="col">
                                <input value={this.state.service.value} onChange={e => this.updateFieldValue(e)} type="text" className="form-control" id="value" placeholder="Valor pago pelo serviço" required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="terms-in-days" className="col-sm-2 col-form-label">Prazo</label>
                            <div className="col">
                                <input value={this.state.service.termInDays} onChange={e => this.updateFieldTermsInDays(e)} type="text" className="form-control" id="terms-in-days" placeholder="Prazo" required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="number-of-vacancies" className="col-sm-2 col-form-label">Vagas</label>
                            <div className="col">
                                <input value={this.state.service.numberOfVacancies} onChange={e => this.updateFieldNumberOfVacancies(e)} type="text" className="form-control" id="number-of-vacancies" placeholder="Número de vagas" required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="address" className="col-sm-2 col-form-label">Endereço</label>
                            <div className="col">
                                <select className="form-control" onChange={e => this.loadStates(e)}>
                                    <option value={0}>País...</option>
                                    {this.renderCountriesForComboBox()}
                                </select>
                            </div>
                            <div className="col">
                                <select className="form-control" onChange={e => this.loadCities(e)}>
                                    <option value={0}>Estado...</option>
                                    {this.renderStatesForComboBox()}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="city" className="col-sm-2 col-form-label">Cidade</label>
                            <div className="col">
                                <select className="form-control" onChange={e => this.updateFieldCity(e)} required>
                                    <option value=''>Cidade...</option>
                                    {this.renderCitiesForComboBox()}
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label for="neighborhood" className="col-sm-2 col-form-label">Bairro</label>
                            <div className="col">
                                <input value={this.state.service.address.neighborhood} onChange={e => this.updateFieldNeighborhood(e)} type="text" className="form-control" id="neighborhood" placeholder="Bairro" required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="speciality" className="col-sm-2 col-form-label">Competências</label>
                            <div className="col-sm-9">
                                <select className="form-control" onChange={e => this.updateFieldSpecialities(e)} id="speciality" required>
                                    <option value={0}>Selecione ...</option>
                                    {this.renderSpecialitiesForComboBox()}
                                </select>
                            </div>
                            <BtnGrayWithRadius label="+" click={this.addNewSpeciality} />
                            <div className="col-2"></div>
                            <div className="col-9">
                                <small className="form-text text-muted ml-1">{this.renderSelectedSpecialities()}</small>
                            </div>
                        </div>
                        <div className="form-group col-form-label">
                            <label for="description">Descreva o serviço:</label>
                            <textarea value={this.state.service.description} onChange={e => this.updateFieldDescription(e)} className="form-control" id="description" rows="5" required></textarea>
                        </div>
                    </form>
                    <div className="formulario-footer">
                        {this.state.mode === 'register' ?
                            <BtnBlueWithoutRadius label="Cadastrar" click={this.registerService} /> :
                            <BtnBlueWithoutRadius label="Salvar alterações" click={this.saveService} />
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default SolicitacaoServico