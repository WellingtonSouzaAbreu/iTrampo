import React, { Component } from 'react'
import axios from 'axios'
import { Button, Collapse } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { connect } from 'react-redux'
import { setHeaderItemsVisibility } from './../../store/actions/headerItems.js'


import baseApiUrl from './../../global.js'

import BtnGrayWithRadius from './buttons/BtnGrayWithRadius.jsx'
import BtnBlueWithoutRadius from './buttons/BtnBlueWithoutRadius.jsx'

import './Cadastro.css'
import defaultProfileImage from './../../assets/images/default-user-profile-image.jpg'

const initialState = {
    modalVisibility: false,
    collapseState: false,
    employerDescription: 'asd  sdsd sd ssdsdsdsd sds dsdsd  dss',
    trampDescription: 'kkkkkkkk khh jjhhh jhhhhj kkkjh',

    termsAndConditions: true, // TODO
    countries: [],
    states: [],
    cities: [],
    specialities: [],
    selectedSpecialitiesLabels: [],
    specialityIdSelected: 0,
    directoryProfileImage: '',

    user: {
        name: 'Keila',
        email: 'Keila2@gmail.com',
        description: 'Keilinha',
        password: 123,
        confirmPassword: 123,
        userType: '',
        currentPackage: 'Free',  // TODO A definir
        remainingPackageDays: 100, // TODO A definir
        genre: 'M',
        dateOfBirth: '06/03/2000',
        address: {
            neighborhood: 'Vila boa',
            cityId: 1
        },
        contacts: {
            numbers: ['2221']
        },
        specialities: [],
    }
}

class Cadastro extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.hideUserTypeModal = this.hideUserTypeModal.bind(this)
        this.addNewContact = this.addNewContact.bind(this)
        this.addNewSpeciality = this.addNewSpeciality.bind(this)
        this.register = this.register.bind(this)
    }

    componentDidMount() {
        this.showUserTypeModal()
        this.loadCountries()
        this.loadSpecialities()
        
        this.props.changeHeaderItemsVisibility(false)// Esconde userDropdown e o botão de cadastro
    }

    selectUserTypeModal() {
        return (
            <Modal
                show={this.state.modalVisibility}
                onHide={this.hideUserTypeModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>Selecione o tipo de usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Dúvidas?
                    Clique em uma opção para saber mais
                    <div className="selecionar-tipo-usuario mt-4 mb-3">
                        <Button
                            variant={`${this.state.user.userType !== 'empregador' ? 'outline-' : ''}success`}
                            onClick={_ => this.updateFieldUserType('empregador')}
                            aria-controls="info-user-type"
                            aria-expanded={this.state.collapseState}
                        >
                            Empregador
                        </Button>
                        <Button
                            variant={`${this.state.user.userType !== 'trampeiro' ? 'outline-' : ''}success`}
                            onClick={_ => this.updateFieldUserType('trampeiro')}
                            aria-controls="info-user-type"
                            aria-expanded={this.state.collapseState}
                        >
                            Trampeiro
                        </Button>
                    </div>
                    <div className="p-3">
                        <Collapse in={this.state.collapseState}>
                            <div id="info-user-type">
                                {this.state.user.userType === 'trampeiro' ? this.state.trampDescription : this.state.employerDescription}
                            </div>
                        </Collapse>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.hideUserTypeModal}>Continuar</Button>
                </Modal.Footer>
            </Modal >
        )
    }

    showUserTypeModal() {
        this.setState({ modalVisibility: true })
    }

    hideUserTypeModal() {
        if (this.state.user.userType !== '') {
            this.setState({ modalVisibility: false })
        } else {
            window.alert('Por favor, selecione uma opção para continuar.')
        }
    }

    updateFieldUserType(userType) {
        if (userType === this.state.user.userType || this.state.user.userType === '') this.toggleCollapseState() // Se der true é porque foi clicado no mesmo botão. Se for diferente só encolhe o collapse

        let user = { ...this.state.user }
        user.userType = userType
        this.setState({ user })

    }

    toggleCollapseState() {
        this.setState({ collapseState: !this.state.collapseState })
    }

    updateFieldName(e) {
        let user = { ...this.state.user }
        user.name = e.target.value
        this.setState({ user })
    }

    updateFielddateOfBirth(e) {
        let user = { ...this.state.user }
        user.dateOfBirth = e.target.value
        this.setState({ user })
    }

    updateFieldGenre(e) {
        let user = { ...this.state.user }
        user.genre = e.target.value
        this.setState({ user })
    }

    renderContacts() {
        return this.state.user.contacts.numbers.map((number, i) => {
            return <>
                <label for="contact" className="col-sm-2 col-form-label">{`Contato ${i + 1}`}</label>
                <div className="col-sm-9 mb-1">
                    <input value={number} onChange={e => this.updateFieldContact(e, i)} type="text" className="form-control" id="contact" placeholder="Número" required />
                </div>
            </>
        })
    }

    updateFieldContact(e, i) {
        let user = { ...this.state.user }
        user.contacts.numbers[i] = e.target.value

        this.setState({ user })
    }

    addNewContact(e) {
        if (e) e.preventDefault()
        let user = { ...this.state.user }

        if (user.contacts.numbers[user.contacts.numbers.length - 1] != '') {
            user.contacts.numbers.push('')
            this.setState({ user })
        }
    }

    updateFieldEmail(e) {
        let user = { ...this.state.user }
        user.email = e.target.value
        this.setState({ user })
    }

    updateFieldPassword(e) {
        let user = { ...this.state.user }
        user.password = e.target.value
        this.setState({ user })
    }

    updateFieldConfirmPassword(e) {
        let user = { ...this.state.user }
        user.confirmPassword = e.target.value
        this.setState({ user })
    }

    async loadCountries() {
        await axios.get(`${baseApiUrl}/address/countries`)
            .then(res => this.setState({ countries: res.data }))
    }

    renderCountriesForComboBox() {
        return this.state.countries.map(country => {
            return <option value={country.id} >{country.name}</option>
        })
    }

    async loadStates(e) {
        let countryId = e.target.value
        await axios.get(`${baseApiUrl}/address/states/${countryId}`)
            .then(res => this.setState({ states: res.data }))
    }

    renderStatesForComboBox() {
        return this.state.states.map(state => {
            return <option value={state.id} >{state.name}</option>
        })
    }

    async loadCities(e) {
        let stateId = e.target.value
        await axios.get(`${baseApiUrl}/address/cities/${stateId}`)
            .then(res => this.setState({ cities: res.data }))
    }

    renderCitiesForComboBox() {
        return this.state.cities.map(city => {
            return <option value={city.id} selected={city.id === 1}>{city.name}</option>
        })
    }

    updateFieldCity(e) {
        let user = { ...this.state.user }
        user.address.cityId = e.target.value
        this.setState({ user })
    }

    updateFieldNeighborhood(e) {
        let user = { ...this.state.user }
        user.address.neighborhood = e.target.value
        this.setState({ user })
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

        let user = { ...this.state.user }
        let selectedSpecialitiesLabels = this.state.selectedSpecialitiesLabels

        if (this.state.specialityIdSelected > 0) {
            if (user.specialities.indexOf(this.state.specialityIdSelected) === -1) {
                selectedSpecialitiesLabels.push(this.state.specialities[this.state.specialityIdSelected - 1].speciality)
                user.specialities.push(this.state.specialityIdSelected)
            } else {
                window.alert('Você já adicionou essa especialidade!')
            }
        } else {
            window.alert('Selecione uma Especialidade válida!')
        }

        this.setState({ user, selectedSpecialitiesLabels })
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
        let user = { ...this.state.user }
        let selectedSpecialitiesLabels = this.state.selectedSpecialitiesLabels
        let specialityIndex = selectedSpecialitiesLabels.indexOf(selectedSpeciality)

        selectedSpecialitiesLabels.splice([specialityIndex], 1)
        user.specialities.splice([specialityIndex], 1)

        this.setState({ user, selectedSpecialitiesLabels })
    }

    updateFieldDescription(e) {
        let user = { ...this.state.user }
        user.description = e.target.value
        this.setState({ user })
    }

    updateFieldTermsAndConditions(e) {
        let termsAndConditions = e.target.value
        this.setState({ termsAndConditions })
    }

    async updateFieldProfileImage(e) {
        if (e.target.files[0].type.split('/')[0] === 'image') {
            this.renderPreviewProfileImage(e.target.files[0])
        } else {
            window.alert('O arquivo deve ser uma imagem!')
            return
        }

        let formData = new FormData();
        formData.append(e.target.name, e.target.files[0])

        this.setState({ profileImage: formData })
    }

    renderPreviewProfileImage(file) {
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
            this.setState({ directoryProfileImage: fileReader.result })
        }
        fileReader.readAsDataURL(file)
    }

    async register() {
        if (this.state.termsAndConditions) {
            await axios.post(`${baseApiUrl}/users`, this.state.user)
                .then(res => {
                    let idUser = res.data
                    window.alert('Cadastrado com sucesso')
                    this.registerProfileImage(idUser)
                })
                .catch(err => window.alert(err.response.data))

        } else {
            window.alert('Aceite os termos e condições para continuar')
        }
    }

    async registerProfileImage(idUser) {
        if (this.state.profileImage != null) {
            await axios.post(`${baseApiUrl}/profile-image/${idUser}`, this.state.profileImage)
                .then(res => {
                    window.alert('Foto de perfil cadastrada com sucesso!')
                })
                .catch(err => window.alert(err.response.data))
        } else {
            window.alert('Não foi definida uma foto do perfil')
        }
    }

    render() {
        return (
            <div className='cadastro'>
                {this.state.modalVisibility ? this.selectUserTypeModal() : ''}

                <div className="formulario col-sm-8 border-right">
                    <h1 className="mb-4">Cadastre-se</h1>
                    <form>
                        <div className="form-group row">
                            <label for="name" className="col-sm-2 col-form-label">Nome</label>
                            <div className="col">
                                <input value={this.state.user.name} onChange={e => this.updateFieldName(e)} type="email" className="form-control" id="name" placeholder="Nome" required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="birth" className="col-sm-2 col-form-label">Nascimento</label>
                            <div className="col">
                                <input value={this.state.user.dateOfBirth} onChange={e => this.updateFielddateOfBirth(e)} type="date" className="form-control" id="birth" placeholder="Nascimento" required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="genre" className="col-sm-2 col-form-label">Gênero</label>
                            <div className="form-check form-check-inline ml-3">
                                <input onChange={e => this.updateFieldGenre(e)} className="form-check-input" name="radio-genre" type="radio" id="rb-masculino" checked={this.state.user.genre == 'M'} value="M" />
                                <label className="form-check-label" for="rb-masculino">Masculino</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input onChange={e => this.updateFieldGenre(e)} className="form-check-input" name="radio-genre" type="radio" id="rb-feminino" checked={this.state.user.genre == 'F'} value="F" />
                                <label className="form-check-label" for="rb-feminino">Feminino</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            {this.renderContacts()}
                            <BtnGrayWithRadius label="+" click={this.addNewContact} />
                        </div>
                        <div className="form-group row">
                            <label for="email" className="col-sm-2 col-form-label">Email</label>
                            <div className="col">
                                <input value={this.state.user.email} onChange={e => this.updateFieldEmail(e)} type="email" className="form-control" id="email" placeholder="Email" required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="password" className="col-sm-2 col-form-label">Senha</label>
                            <div className="col">
                                <input value={this.state.user.password} onChange={e => this.updateFieldPassword(e)} type="password" className="form-control" id="password" placeholder="Senha" required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="confirm-password" className="col-sm-2 col-form-label">Repetir Senha</label>
                            <div className="col">
                                <input onChange={e => this.updateFieldConfirmPassword(e)} value={this.state.user.confirmPassword} type="password" className="form-control" id="confirm-password" placeholder="Repetir Senha" required />
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
                                <input value={this.state.user.address.neighborhood} onChange={e => this.updateFieldNeighborhood(e)} type="text" className="form-control" id="neighborhood" placeholder="Bairro" required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="speciality" className="col-sm-2 col-form-label">Especialidades</label>
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
                            <label for="description">Descreva o que você sabe fazer:</label>
                            <textarea value={this.state.user.description} onChange={e => this.updateFieldDescription(e)} className="form-control" id="description" rows="5" required></textarea>
                        </div>
                        <div className="form-group">
                            <div className="form-check terms-and-conditions">
                                <input value={this.state.termsAndConditions} onChange={e => this.updateFieldTermsAndConditions(e)} checked={this.state.termsAndConditions} className="form-check-input" type="checkbox" id="terms-and-conditions" required />
                                <label className="form-check-label" for="terms-and-conditions">
                                    Concordo com o termos e condições do iTrampo
                                </label>
                            </div>
                        </div>
                    </form>
                    <div className="formulario-footer">
                        <BtnBlueWithoutRadius label="Cadastrar" click={this.register} />
                    </div>

                </div>
                <div className="area-foto-perfil mt-4">
                    <div className="foto-perfil-header pl-4">
                        <h5>Imagem de perfil</h5>
                    </div>
                    <div className="foto-perfil-body">
                        <div className="foto-perfil">
                            <img src={this.state.directoryProfileImage || defaultProfileImage} className="img-perfil" height='100%' width='100%' />
                        </div>
                    </div>
                    <div className="foto-perfil-footer">
                        <div>
                            <div className="area-file">
                                <input hidden type="file" id="profile-image" name="profile-image" onChange={e => this.updateFieldProfileImage(e)} />
                                <label for="profile-image" className="label-profile-image">Escolher Foto</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}


function mapPropsToState(dispatch) {
    return {
        changeHeaderItemsVisibility(visibility) {
            const action = setHeaderItemsVisibility(visibility)
            dispatch(action)
        }
    }
}

export default connect(null, mapPropsToState)(Cadastro)