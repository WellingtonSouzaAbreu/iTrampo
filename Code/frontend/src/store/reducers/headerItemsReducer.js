import { defineState } from 'redux-localstore'
import { HEADER_ITEMS } from '../actions/actionTypes.js'

const defaultState = {
    visibility: true
}

const initialState = defineState(defaultState)('headerItems')

export default function (state = initialState, action) {
    switch (action.type) {
        case HEADER_ITEMS:
            return {
                ...state,
                visibility: action.payload
            }
        default:
            return state
    }
}