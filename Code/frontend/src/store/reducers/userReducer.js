import { defineState } from 'redux-localstore'
import { USER_DATA } from '../actions/actionTypes.js'

const defaultState = {
    user: {
        id: 100,
        name: 'Usuário Mock',
        email: 'moc@gmail.com',
        userType: 'empregador'
    }
}

const initialState = defineState(defaultState)('user')

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_DATA:
            return {
                ...state,
                user: action.payload
            }
        default:
            return state
    }
}