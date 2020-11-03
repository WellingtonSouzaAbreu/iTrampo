import { defineState } from 'redux-localstore'
import { MENU_SELECTIONS } from '../actions/actionTypes.js'

const defaultState = {
    menuSelections: {
        selectedFeed: true,
        selectedServices: false,
        selectedHowItWorks: false,
        selectedProfile: false,
    }
}

const initialState = defineState(defaultState)('menuSelections')

export default function (state = initialState, action) {
    switch (action.type) {
        case MENU_SELECTIONS:
            return {
                ...state,
                menuSelections: action.payload
            }
        default:
            return state
    }
}