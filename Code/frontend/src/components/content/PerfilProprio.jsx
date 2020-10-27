import React, { Component } from 'react'
import axios from 'axios'

import baseApiUrl from './../../global.js'

import BtnGrayWithRadius from './buttons/BtnGrayWithRadius.jsx'
import BtnBlueWithRadius from './buttons/BtnBlueWithRadius.jsx'
import Toast from '../toasts/Toast.jsx'

import './PerfilProprio.css'
import defaultProfileImage from './../../assets/images/default-user-profile-image.jpg'

const initialState = {
    toastMessage: '',
    toastIsVisible: false,
    toastType: '',
    mode: 'save',
    countries: [],
    states: [],
    cities: [],
    specialities: [],
    selectedSpecialitiesLabels: [],
    specialityIdSelected: 0,
    directoryProfileImage: '',
    directoryCurriculum: '',
    curriculum: null,
    profileImage: null,
    user: {
        id: 217,
        name: '',
        email: '',
        description: '',
        password: '',
        confirmPassword: '',
        userType: '',  //TODO A definir
        currentPackage: '',  // TODO A definir
        remainingPackageDays: 0, // TODO A definir
        servicesProvidedRequested: 0, // TODO
        genre: '',
        dateOfBirth: '',
        address: {
            neighborhood: '',
            cityId: 1
        },
        contacts: {
            numbers: [''],
        },
        specialities: [],
    }
}

class PerfilProprio extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.addNewContact = this.addNewContact.bind(this)
        this.addNewSpeciality = this.addNewSpeciality.bind(this)
        this.edit = this.edit.bind(this)
        this.viewCurriculum = this.viewCurriculum.bind(this)
        this.save = this.save.bind(this)
    }

    componentDidMount() {
        this.loadUser()
        this.loadCountries()
        this.loadSpecialities()
    }

    async loadUser() {
        const idUser = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).id : ''

        await axios.get(`${baseApiUrl}/users/${idUser}`)
            .then(res => {
                let selectedSpecialitiesLabels = res.data.selectedSpecialitiesLabels
                delete res.data.selectedSpecialitiesLabels

                let directoryProfileImage
                if (res.data.profileImage) directoryProfileImage = `${baseApiUrl}/profile-images/${res.data.profileImage}`

                let directoryCurriculum
                if (res.data.curriculum) directoryCurriculum = `${baseApiUrl}/curriculum/${res.data.curriculum}`

                this.setState({ user: res.data, directoryProfileImage, directoryCurriculum, selectedSpecialitiesLabels })
            })
            .catch(err => window.alert('Erro ao consultar usuário pelo Id!'))

        this.loadStates()
        this.loadCities()
    }

    checkMode() {
        return this.state.mode === 'save' ? true : false
    }

    updateFieldName(e) {
        let user = { ...this.state.user }
        user.name = e.target.value
        this.setState({ user })
    }

    updateFieldDateOfBirth(e) {
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
                <label for="contact" class="col-sm-2 col-form-label">{`Contato ${i + 1}`}</label>
                <div class="col-sm-9 mb-1">
                    <input value={number} onChange={e => this.updateFieldContact(e, i)} type="text" class="form-control" id="contact" placeholder="Número" required disabled={this.checkMode()} />
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
        let idCountry = this.state.user.address.idCountry
        return this.state.countries.map(country => {
            return <option value={country.id} selected={country.id === idCountry}>{country.name}</option>
        })
    }

    async loadStates(e) {
        let countryId = e ? e.target.value : this.state.user.address.idCountry
        await axios.get(`${baseApiUrl}/address/states/${countryId}`)
            .then(res => this.setState({ states: res.data }))
    }

    renderStatesForComboBox() {
        let idState = this.state.user.address.idState
        return this.state.states.map(state => {
            return <option value={state.id} selected={state.id === idState}>{state.name}</option>
        })
    }

    async loadCities(e) {
        let stateId = e ? e.target.value : this.state.user.address.idState
        await axios.get(`${baseApiUrl}/address/cities/${stateId}`)
            .then(res => this.setState({ cities: res.data }))
    }

    renderCitiesForComboBox() {
        let cityId = this.state.user.address.cityId
        return this.state.cities.map(city => {
            return <option value={city.id} selected={city.id === cityId}>{city.name}</option>
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
        if (this.checkMode()) return // Verifica de está no modo de edição
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

    edit() {
        if (this.state.mode === 'save') {
            this.setState({ mode: 'edit' })
        }
    }

    updateFieldProfileImage(e) {
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

    viewCurriculum() {
        if (this.state.directoryCurriculum != null) {
            //Segue o fluxo do link
        } else {
            window.alert('Você não possui nenhum currículo cadastrado!')
        }
    }

    updateFieldCurriculum(e) {
        if (e.target.files[0].type === 'application/pdf') {
        } else {
            window.alert('O arquivo deve estar no formato PDF!')
            return
        }

        let formData = new FormData();
        formData.append(e.target.name, e.target.files[0])
        console.log(e.target.files[0])

        this.setState({ curriculum: formData })
    }

    async save() {
        await axios.put(`${baseApiUrl}/users/${this.state.user.id}`, this.state.user)
            .then(async res => {
                let idUser = res.data
                // window.alert('Perfil atualizado com sucesso')
                this.showToast('Perfil atualizado com sucesso!', 'success')
                await this.registerProfileImage(idUser)
                await this.registerCurriculum(idUser)
                await this.loadUser()
                this.setState({ mode: 'save' })
            })
            .catch(err => this.showToast(err.response.data,'error'))
    }

    showToast(toastMessage, toastType) {
        this.setState({ toastMessage: toastMessage, toastIsVisible: true , toastType: toastType})
        setTimeout(() => this.setState({ toastIsVisible: false }), 4000)
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

    async registerCurriculum(idUser) {
        if (this.state.curriculum != null) {
            await axios.post(`${baseApiUrl}/curriculum/${idUser}`, this.state.curriculum)
                .then(res => {
                    window.alert('Currículo cadastrado com sucesso!')
                })
                .catch(err => window.alert(err.response.data))
        } else {
            window.alert('Não foi definido um currículo!')
        }
    }

    render() {
        return (
            <>
                {Toast(this.state.toastMessage, this.state.toastIsVisible, this.state.toastType)}
                <div className='perfil-proprio'>
                    <div className="formulario col-sm-8 border-right">
                        <h1 className="mb-4">Meus dados</h1>
                        <form>
                            <div class="form-group row">
                                <label for="name" class="col-sm-2 col-form-label">Nome</label>
                                <div class="col">
                                    <input value={this.state.user.name} onChange={e => this.updateFieldName(e)} type="email" class="form-control" id="name" placeholder="Nome" required disabled={this.checkMode()} />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="birth" class="col-sm-2 col-form-label">Nascimento</label>
                                <div class="col">
                                    <input value={this.state.user.dateOfBirth.split('T')[0]} onChange={e => this.updateFieldDateOfBirth(e)} type="date" class="form-control" id="birth" placeholder="Nascimento" required disabled={this.checkMode()} />
                                </div>
                            </div>
                            <div class="form-group row" >
                                <label for="genre" class="col-sm-2 col-form-label">Gênero</label>
                                <div class="form-check form-check-inline ml-3" >
                                    <input onChange={e => this.updateFieldGenre(e)} class="form-check-input" name="radio-genre" type="radio" id="rb-masculino" checked={this.state.user.genre == 'M'} value="M" disabled={this.checkMode()} />
                                    <label class="form-check-label" for="rb-masculino">Masculino</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input onChange={e => this.updateFieldGenre(e)} class="form-check-input" name="radio-genre" type="radio" id="rb-feminino" checked={this.state.user.genre == 'F'} value="F" disabled={this.checkMode()} />
                                    <label class="form-check-label" for="rb-feminino">Feminino</label>
                                </div>
                            </div>
                            <div class="form-group row">
                                {this.renderContacts()}
                                <BtnGrayWithRadius label="+" click={this.addNewContact} />
                            </div>
                            <div class="form-group row">
                                <label for="email" class="col-sm-2 col-form-label">Email</label>
                                <div class="col">
                                    <input value={this.state.user.email} onChange={e => this.updateFieldEmail(e)} type="email" class="form-control" id="email" placeholder="Email" required disabled={this.checkMode()} />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="password" class="col-sm-2 col-form-label">Senha</label>
                                <div class="col">
                                    <input value={this.state.user.password} onChange={e => this.updateFieldPassword(e)} type="password" class="form-control" id="password" placeholder="Senha" required disabled={this.checkMode()} />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="confirm-password" class="col-sm-2 col-form-label">Repetir Senha</label>
                                <div class="col">
                                    <input onChange={e => this.updateFieldConfirmPassword(e)} value={this.state.user.confirmPassword} type="password" class="form-control" id="confirm-password" placeholder="Repetir Senha" required disabled={this.checkMode()} />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="address" class="col-sm-2 col-form-label">Endereço</label>
                                <div class="col">
                                    <select className="form-control" onChange={e => this.loadStates(e)} disabled={this.checkMode()}>
                                        <option value={0}>País...</option>
                                        {this.renderCountriesForComboBox()}
                                    </select>
                                </div>
                                <div className="col">
                                    <select className="form-control" onChange={e => this.loadCities(e)} disabled={this.checkMode()}>
                                        <option value={0}>Estado...</option>
                                        {this.renderStatesForComboBox()}
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="city" class="col-sm-2 col-form-label">Cidade</label>
                                <div class="col">
                                    <select className="form-control" onChange={e => this.updateFieldCity(e)} required disabled={this.checkMode()}>
                                        <option value=''>Cidade...</option>
                                        {this.renderCitiesForComboBox()}
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="neighborhood" class="col-sm-2 col-form-label">Bairro</label>
                                <div class="col">
                                    <input value={this.state.user.address.neighborhood} onChange={e => this.updateFieldNeighborhood(e)} type="text" class="form-control" id="neighborhood" placeholder="Bairro" required disabled={this.checkMode()} />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="speciality" class="col-sm-2 col-form-label">Especialidades</label>
                                <div class="col-sm-9">
                                    <select className="form-control" onChange={e => this.updateFieldSpecialities(e)} id="speciality" required disabled={this.checkMode()}>
                                        <option value={0}>Selecione ...</option>
                                        {this.renderSpecialitiesForComboBox()}
                                    </select>
                                </div>
                                <BtnGrayWithRadius label="+" click={this.addNewSpeciality} />
                                <div className="col-2"></div>
                                <div className="col-9">
                                    <small class="form-text text-muted ml-1">{this.renderSelectedSpecialities()}</small>
                                </div>
                            </div>
                            <div class="form-group col-form-label">
                                <label for="description">Descreva o que você sabe fazer:</label>
                                <textarea value={this.state.user.description} onChange={e => this.updateFieldDescription(e)} class="form-control" id="description" rows="5" required disabled={this.checkMode()}></textarea>
                            </div>
                        </form>
                        <div className="formulario-footer">
                            <div><BtnBlueWithRadius label="Editar" style={'bg-edit'} click={this.edit} /></div>
                            {
                                this.state.mode === 'edit' ?
                                    <div className="formulario-footer-button"><BtnBlueWithRadius label="Salvar" click={this.save} /></div>
                                    : ''
                            }
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
                                <div className="area-file" >
                                    <input hidden type="file" id="profile-image" name="profile-image" onChange={e => this.updateFieldProfileImage(e)} />
                                    <label for="profile-image" className="label-profile-image">Escolher Foto</label>
                                </div>
                            </div>
                        </div>
                        <div className="informacoes-adicionais">
                            <hr />
                            <div>
                                <div class="container">
                                    <div class="row mb-2 mt-4">
                                        <div class="col">
                                            Tipo de Usuário:
                                    </div>
                                        <div class="col">
                                            {this.state.user.userType}
                                        </div>
                                    </div>
                                    {
                                        <div class="row mb-2">
                                            <div className="col">
                                                {`Serviços ${this.state.user.userType === 'trampeiro' ? 'Prestados' : 'Solicitados'}`}:
                                        </div>
                                            <div className="col">
                                                {this.state.user.servicesProvidedRequested}
                                            </div>
                                        </div>
                                    }
                                    <div className="row mb-2">
                                        <div class="col">
                                            Pacote Atual:
                                    </div>
                                        <div class="col">
                                            Free
                                    </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div class="col">
                                            Dias restantes:
                                    </div>
                                        <div class="col">
                                            {this.state.user.remainingPackageDays}
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div class="col">
                                            <div className="area-curriculo">
                                                Currículo:
                                            <div className="curriculo-controles">
                                                    <a href={this.state.directoryCurriculum} target="blank">
                                                        <BtnBlueWithRadius label="Visualizar" click={this.viewCurriculum}></BtnBlueWithRadius>
                                                    </a>
                                                    <input hidden type="file" id="curriculum" name="curriculum" onChange={e => this.updateFieldCurriculum(e)} />
                                                    <label for="curriculum" className="label-curriculum ml-2">Anexar</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default PerfilProprio