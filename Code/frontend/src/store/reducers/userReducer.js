import { USER_DATA } from '../actions/actionTypes.js'

const initialState = {
    id: 7,
    email: 'www@gmail.com',
    userType: 'empregador'
}

export default function (state = initialState, action) {
    // window.alert('Usuario setado na store')
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