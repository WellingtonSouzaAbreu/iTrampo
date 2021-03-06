import { defineState } from 'redux-localstore'
import { NAV_VISIBILITY } from '../actions/actionTypes.js'

const defaultState = {
    navVisibility: false
}

const initialState = defineState(defaultState)('nav')

export default function (state = initialState, action) {
    switch (action.type) {
        case NAV_VISIBILITY:
            return {
                ...state,
                navVisibility: action.payload
            }
        default:
            return state
    }
}