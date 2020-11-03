import { defineState } from 'redux-localstore'
import { USER_DROPDOWN_VISIBILITY } from '../actions/actionTypes.js'

const defaultState = {
    dropdownVisibility: false
}

const initialState = defineState(defaultState)('userDropdown')

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_DROPDOWN_VISIBILITY:
            return {
                ...state,
                dropdownVisibility: action.payload
            }
        default:
            return state
    }
}