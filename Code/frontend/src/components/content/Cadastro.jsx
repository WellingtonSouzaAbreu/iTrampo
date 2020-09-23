import React, { Component } from 'react'

import BtnGrayWithRadius from './buttons/BtnGrayWithRadius.jsx'
import BtnBlueWithRadius from './buttons/BtnBlueWithRadius.jsx'
import BtnBlueWithoutRadius from './buttons/BtnBlueWithoutRadius.jsx'

import FotoPerfil from './nos.png'
import './Cadastro.css'

const initialState = {
    termsAndConditions: false,
    user: {
        name: 'Keila',
        email: 'Keila2@gmail.com',
        description: 'Keilinha', // TODO - falta na UI
        password: 123,
        confirmPassword: 123,
        userType: 'Empregador',  //TODO
        currentPackage: 'Free',  // TODO
        genre: 'M',
        dateOfBirth: '06 / 03 / 2000',
        remainingPackageDays: 100, // TODO
        address: {
            neighborhood: 'centro',
            cityId: 1
        },
        contacts: {
            numbers: ['69 98446 - 5997', '69 98492 - 6095']
        }
    }
}

class Cadastro extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }
    }

    updateFieldName(e) {
        const user = { ...this.state.user }
        user.name = e.target.value
        this.setState({ user })
    }

    updateFielddateOfBirth(e) {
        const user = { ...this.state.user }
        user.dateOfBirth = e.target.value
        this.setState({ user })
    }

    updateFieldGenre(e) {
        const user = { ...this.state.user }
        user.genre = e.target.value
        this.setState({ user })
    }

    updateFieldContact(e, i) {
        const user = { ...this.state.user }
        user.contacts.numbers[i] = e.target.value
        this.setState({ user })
    }

    updateFieldEmail(e) {
        const user = { ...this.state.user }
        user.email = e.target.value
        this.setState({ user })
    }

    updateFieldPassword(e) {
        const user = { ...this.state.user }
        user.password = e.target.value
        this.setState({ user })
    }

    updateFieldConfirmPassword(e) {
        const user = { ...this.state.user }
        user.confirmPassword = e.target.value
        this.setState({ user })
    }

    //Countries
    //States
    //Cities

    updateFieldNeighborhood(e) {
        const user = { ...this.state.user }
        user.address.neighborhood = e.target.value
        this.setState({ user })
    }

    //Specialities
    //Curriculum

    updateFieldTermsAndConditions(e) {
        const user = { ...this.state.user }
        user.termsAndConditions = e.target.value
        this.setState({ user })
    }

    renderContacts() {
        return this.state.user.contacts.numbers.map((number, i) => {
            return <>
                <label for="contact" class="col-sm-2 col-form-label">{`Contato ${i + 1}`}</label>
                <div class="col-sm-9">
                    <input value={number} onChange={e => this.updateFieldContact(e, i)} type="text" class="form-control" id="contact" placeholder="Número" />
                </div>
            </>
        })
    }

    render() {
        return (
            <div className='cadastro'>
                <div className="formulario col-sm-8 border-right">
                    <h1 className="mb-4">Cadastre-se</h1>
                    <form>
                        <div class="form-group row">
                            <label for="name" class="col-sm-2 col-form-label">Nome</label>
                            <div class="col">
                                <input value={this.state.user.name} onChange={e => this.updateFieldName(e)} type="email" class="form-control" id="name" placeholder="Nome" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="birth" class="col-sm-2 col-form-label">Nascimento</label>
                            <div class="col">
                                <input value={this.state.user.dateOfBirth} onChange={e => this.updateFielddateOfBirth(e)} type="date" class="form-control" id="birth" placeholder="Nascimento" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="genre" class="col-sm-2 col-form-label">Gênero</label>
                            <div class="form-check form-check-inline ml-3">
                                <input onChange={e => this.updateFieldGenre(e)} class="form-check-input" name="radio-genre" type="radio" id="rb-masculino" checked={this.state.user.genre == 'M'} value="M" />
                                <label class="form-check-label" for="rb-masculino">Masculino</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input onChange={e => this.updateFieldGenre(e)} class="form-check-input" name="radio-genre" type="radio" id="rb-feminino" checked={this.state.user.genre == 'F'} value="F" />
                                <label class="form-check-label" for="rb-feminino">Feminino</label>
                            </div>
                        </div>
                        <div class="form-group row">
                            {this.renderContacts()}
                            <BtnGrayWithRadius label="+" />
                        </div>
                        <div class="form-group row">
                            <label for="email" class="col-sm-2 col-form-label">Email</label>
                            <div class="col">
                                <input value={this.state.user.email} onChange={e => this.updateFieldEmail(e)} type="email" class="form-control" id="email" placeholder="Email" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="password" class="col-sm-2 col-form-label">Senha</label>
                            <div class="col">
                                <input value={this.state.user.password} onChange={e => this.updateFieldPassword(e)} type="password" class="form-control" id="password" placeholder="Senha" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="confirm-password" class="col-sm-2 col-form-label">Repetir Senha</label>
                            <div class="col">
                                <input onChange={e => this.updateFieldConfirmPassword(e)} value={this.state.user.confirmPassword} type="password" class="form-control" id="confirm-password" placeholder="Repetir Senha" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="address" class="col-sm-2 col-form-label">Endereço</label>
                            <div class="col">
                                <select className="form-control">
                                    <option value=''>Pais...</option>
                                    {/* {this.renderCountriesForComboBox()} */}
                                </select>
                            </div>
                            <div className="col">
                                <select className="form-control">
                                    <option value=''>Estado...</option>
                                    {/* {this.renderStatesForComboBox()} */}
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="city" class="col-sm-2 col-form-label">Cidade</label>
                            <div class="col">
                                <select className="form-control">
                                    <option value=''>Cidade...</option>
                                    {/* {this.renderCitiesForComboBox()} */}
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="neighborhood" class="col-sm-2 col-form-label">Bairro</label>
                            <div class="col">
                                <input value={this.state.user.address.neighborhood} onChange={e => this.updateFieldNeighborhood(e)} type="text" class="form-control" id="neighborhood" placeholder="Bairro" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="speciality" class="col-sm-2 col-form-label">Especialidades</label>
                            <div class="col-sm-9">
                                <input value={this.state.user.specialities} onChange={e => this.updateFieldSpecialities(e)} type="text" class="form-control" id="speciality" placeholder="Defina suas competências" />
                            </div>
                            <BtnGrayWithRadius label="+" />
                        </div>
                        <div class="form-group row">
                            <label for="curriculum" class="col-sm-2 col-form-label">Currículo</label>
                            <div class="col">
                                {/* <button>Anexar currículo</button> */}
                                <BtnGrayWithRadius label="Anexar currículo" />
                                <strong className="ml-4">Currículo-Wellington-Souza.pdf</strong>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-check terms-and-conditions">
                                <input value={this.state.termsAndConditions} onChange={e => this.updateFieldTermsAndConditions(e)} checked={this.state.termsAndConditions} class="form-check-input" type="checkbox" id="terms-and-conditions" />
                                <label class="form-check-label" for="terms-and-conditions">
                                    Concordo com o termos e condições do iTrampo
                                </label>
                            </div>
                        </div>
                    </form>
                    <div className="formulario-footer">
                        <BtnBlueWithoutRadius label="Cadastrar" />
                    </div>

                </div>
                <div className="area-foto-perfil mt-4">
                    <div className="foto-perfil-header pl-4">
                        <h5>Imagem de perfil</h5>
                    </div>
                    <div className="foto-perfil-body">
                        <div className="foto-perfil">
                            <img className="img-perfil" src={FotoPerfil} height={'100%'} width={'100%'} />
                        </div>
                    </div>
                    <div className="foto-perfil-footer">
                        <div>
                            <BtnBlueWithRadius label="Escolher foto" />
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Cadastro