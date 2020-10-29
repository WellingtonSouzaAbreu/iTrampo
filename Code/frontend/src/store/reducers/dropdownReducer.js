import { DROPDOWN_VISIBILITY } from '../actions/actionTypes.js'

const initialState = {
    dropdownVisibility: true
}

export default function (state = initialState, action) {
    switch (action.type) {
        case DROPDOWN_VISIBILITY:
            return {
                ...state,
                dropdownVisibility: action.payload
            }
        default:
            return state
    }
}