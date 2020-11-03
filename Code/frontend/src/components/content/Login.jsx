import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { changeNavVisibility } from '../../store/actions/nav.js'
import { setUserData } from '../../store/actions/user.js'
import { changeDropdownVisibility } from '../../store/actions/userDropdown.js'
import { setHeaderItemsVisibility } from '../../store/actions/headerItems.js'


import baseApiUrl from './../../global.js'
import BtnGrayWithRadius from './buttons/BtnGrayWithRadius'
import Toast from '../toasts/Toast.jsx'

import './Login.css'

const initialState = {
    email: '',
    password: '',

    toastIsVisible: false,
    toastMessage: '',
    toastType: '',

    redirectToFeed: false
}

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = { ...initialState }

        const { navVisibility } = props

        this.login = this.login.bind(this)
    }

    componentWillMount() {
        this.props.changeMenuVisibility(false)
        this.props.setUserDropdownVisibility(false)
        this.props.changeHeaderItemsVisibility(true)
    }

    updateFieldEmail(e) {
        this.setState({ email: e.target.value })
    }

    updateFieldPassword(e) {
        this.setState({ password: e.target.value })
    }

    async login(e) {
        if (e) e.preventDefault()

        await axios.post(`${baseApiUrl}/signin`, this.state)
            .then(async res => {
                let user = res.data
                localStorage.removeItem('userData')
                localStorage.setItem('userData', JSON.stringify(user))

                this.showToast('Login realizado com sucesso...', 'success')
                this.props.setUserInStore(user)

                setTimeout(() => {
                    this.props.changeMenuVisibility(true)
                    this.props.setUserDropdownVisibility(true)
                    this.redirectToFeed()
                }, 1000)
            })
            .catch(err => this.showToast(err.response.data, 'error'))
    }

    showToast(toastMessage, toastType) {
        this.setState({ toastMessage: toastMessage, toastIsVisible: true, toastType: toastType })
        setTimeout(() => this.setState({ toastIsVisible: false }), 5000)
    }

    redirectToFeed() {
        this.setState({
            redirectToFeed: true
        })
    }

    render() {
        return (
            <>
                {Toast(this.state.toastMessage, this.state.toastIsVisible, this.state.toastType)}
                {this.state.redirectToFeed ? <Redirect to={`/feed`} /> : ''}
                <div className='login'>
                    <div className="description">
                        <h4>Why do we use it?</h4>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        <h4>Why do we use it?</h4>
                        <p>
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', ssssssssssssssssssssssdsdsd sds d
                        </p>
                    </div>
                    <div className="caixa-login">
                        <form>
                            <div class="form-group">
                                <label for="email">Endereço de email</label>
                                <input value={this.state.email} type="email" class="form-control" id="email" placeholder="Seu email" onChange={e => this.updateFieldEmail(e)} />
                            </div>
                            <div class="form-group">
                                <label for="password">Senha</label>
                                <input value={this.state.password} type="password" class="form-control" id="password" placeholder="Senha" onChange={e => this.updateFieldPassword(e)} />
                                <a href=""><small id="password-recovery" class="form-text">Esqueceu a senha?</small></a>
                            </div>
                            <div className="area-botao">
                                <BtnGrayWithRadius click={this.login} label="Entrar" />
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        navVisibility: state.nav.navVisibility
    }
}

function mapDispatchToProp(dispatch) {
    return {
        changeMenuVisibility(visibility) {
            const action = changeNavVisibility(visibility)
            dispatch(action)
        },
        setUserInStore(user) {
            const action = setUserData(user)
            dispatch(action)
        },
        setUserDropdownVisibility(visibility) {
            const action = changeDropdownVisibility(visibility)
            dispatch(action)
        },
        changeHeaderItemsVisibility(visibility) {
            const action = setHeaderItemsVisibility(visibility)
            dispatch(action)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProp)(Login)