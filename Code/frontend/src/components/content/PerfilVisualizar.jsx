import React, { Component } from 'react'
import axios from 'axios'

import baseApiUrl from '../../global'
import BtnBlueWithRadius from './../content/buttons/BtnBlueWithRadius.jsx'

import './PerfilVisualizar.css'
import defaultProfileImage from './../../assets/images/default-user-profile-image.jpg'

import Viewer from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

const initialState = {
    user: {
        name: 'a',
        email: 'b',
        description: 'cdd',
        confirmPassword: '3',
        servicesProvidedRequested: 0, // TODO
        genre: '1',
        dateOfBirth: '2',
        address: {
            neighborhood: '4',
            cityId: 1
        },
        contacts: {
            numbers: ['5'],
        },
        specialities: [],
        curriculum: '',
        profileImage: ''
    },
    directoryCurriculum: '',
    directoryProfileImage: '',
}

class PerfilVisualizar extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }

        this.viewCurriculum = this.viewCurriculum.bind(this)
    }

    componentDidMount() {
        this.loadUser()
    }

    loadUser() {
        axios.get(`${baseApiUrl}/users/preview/${this.props.match.params.id}`) // Param do header
            .then(res => {
                const directoryProfileImage = `${baseApiUrl}/profile-images/${res.data.profileImage}`

                const directoryCurriculum = `${baseApiUrl}/curriculum/${res.data.curriculum}`

                this.setState({ user: res.data, directoryProfileImage, directoryCurriculum })
            })
            .catch(err => window.alert('Erro ao obter usuário por Id!'))
    }

    renderFormatedAge() {
        const dateOfBirth = new Date(this.state.user.dateOfBirth)
        const currentDate = new Date()

        const diff = Math.abs(currentDate.getTime() - dateOfBirth.getTime()); // Subtrai uma data pela outra
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 366)); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo).

        return `${years} anos`
    }

    renderContacts() {
        return this.state.user.contacts.numbers.map(number => {
            return ` ${number} -`
        })
    }

    viewCurriculum() {
        if (this.state.directoryCurriculum !== null) {
            //Segue o fluxo do link
        } else {
            window.alert('Você não possui nenhum currículo cadastrado!')
        }
    }

    render() {
        return (
            <div className='perfil-visualizar'>
                <div className="container col-sm-8 border-right">
                    <h1 className="mb-1">Perfil do Trampeiro</h1>
                    <hr />
                    <div class="row mb-2">
                        <div className="col-2 bold">Nome:</div>
                        <div className="col">{this.state.user.name}</div>
                    </div>
                    <div class="row mb-2">
                        <div className="col-2 bold">Idade:</div>
                        <div className="col">{this.renderFormatedAge()}</div>
                    </div>
                    <div class="row mb-2">
                        <div className="col-2 bold">Gênero:</div>
                        <div className="col">{this.state.user.genre === 'M' ? 'Masculino' : 'Feminino'}</div>
                    </div>
                    <div class="row mb-2">
                        <div className="col-2 bold">Contatos:</div>
                        <div className="col">{this.renderContacts()}</div>
                    </div>
                    <div class="row mb-2">
                        <div className="col-2 bold">E-mail:</div>
                        <div className="col">{this.state.user.email}</div>
                    </div>
                    <div class="row mb-2">
                        <div className="col-2 bold">Endereço:</div>
                        <div className="col">{`${this.state.user.address.city} - ${this.state.user.address.state}, ${this.state.user.address.country}`}</div>
                    </div>
                    <div class="row mb-2">
                        <div className="col-2 bold">Bairro:</div>
                        <div className="col">{this.state.user.address.neighborhood}</div>
                    </div>
                    <div class="row mb-2">
                        <div className="col-2 bold">Especialidades:</div>
                        <div className="col">{this.state.user.specialities.toString()}</div>
                    </div>
                    <div class="row mb-2">
                        <div className="col-2 bold">Currículo:</div>
                        <div className="col">
                            <a href={this.state.directoryCurriculum} target="blank">
                                <BtnBlueWithRadius label="Visualizar" click={this.viewCurriculum}></BtnBlueWithRadius>
                            </a>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div className="col-2 bold">Descrição:</div>
                        <div className="col">{this.state.user.description}</div>
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
                    <Viewer fileUrl="./anexo.pdf" />
                </div>
            </div>
        )
    }
}

export default PerfilVisualizar