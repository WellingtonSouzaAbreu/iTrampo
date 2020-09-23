import React, { Component } from 'react'
import BtnGrayWithRadius from './buttons/BtnGrayWithRadius.jsx'

import './Cadastro.css'

const initialState = {

}

class Cadastro extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }
    }
    render() {
        return (
            <div className='cadastro'>
                <div className="formulario col-sm-7 border-right">
                    <form>
                        <div class="form-group row">
                            <label for="name" class="col-sm-3 col-form-label">Nome</label>
                            <div class="col">
                                <input type="email" class="form-control" id="name" placeholder="Nome" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="birth" class="col-sm-3 col-form-label">Nascimento</label>
                            <div class="col">
                                <input type="text" class="form-control" id="birth" placeholder="Nascimento" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="genre" class="col-sm-3 col-form-label">Gênero</label>
                            <div class="form-check form-check-inline ml-3">
                                <input class="form-check-input" type="radio" id="rb-masculino" value="M" />
                                <label class="form-check-label" for="rb-masculino">Masculino</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" id="rb-feminino" value="F" />
                                <label class="form-check-label" for="rb-feminino">Feminino</label>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="contact" class="col-sm-3 col-form-label">Contato</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control" id="contact" placeholder="Número" />
                            </div>
                            <button>+</button>
                        </div>
                        <div class="form-group row">
                            <label for="email" class="col-sm-3 col-form-label">Email</label>
                            <div class="col">
                                <input type="email" class="form-control" id="email" placeholder="Email" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="password" class="col-sm-3 col-form-label">Senha</label>
                            <div class="col">
                                <input type="password" class="form-control" id="password" placeholder="Senha" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="repeat-password" class="col-sm-3 col-form-label">Repetir Senha</label>
                            <div class="col">
                                <input type="password" class="form-control" id="repeat-password" placeholder="Repetir Senha" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="address" class="col-sm-3 col-form-label">Endereço</label>
                            <div class="col">
                                <select className="form-control">
                                    <option value="">Brasil</option>
                                    <option value="">Alemanha</option>
                                </select>
                            </div>
                            <div className="col">
                                <select className="form-control">
                                    <option value="">Rondônia</option>
                                    <option value="">Auschuitz</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="city" class="col-sm-3 col-form-label">Cidade</label>
                            <div class="col">
                                <input type="text" class="form-control" id="city" placeholder="Cidade" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="neighborhood" class="col-sm-3 col-form-label">Bairro</label>
                            <div class="col">
                                <input type="text" class="form-control" id="neighborhood" placeholder="Cidade" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="speciality" class="col-sm-3 col-form-label">Especialidades</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control" id="speciality" placeholder="Defina suas competências" />
                            </div>
                            <button>+</button>
                        </div>
                        <div class="form-group row">
                            <label for="curriculum" class="col-sm-3 col-form-label">Currículo</label>
                            <div class="col">
                                <button>Anexar currículo</button>
                                <strong className="ml-4">Currículo-Wellington-Souza.pdf</strong>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-check terms-and-conditions">
                                <input class="form-check-input" type="checkbox" id="terms-and-conditions" />
                                <label class="form-check-label" for="terms-and-conditions">
                                    Concordo com o termos e condições do iTrampo
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="foto-perfil">

                </div>
            </div>
        )
    }
}

export default Cadastro