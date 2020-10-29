import {NAV_VISIBILITY} from '../actions/actionTypes.js'

const initialState={
    navVisibility: true
}

export default function(state = initialState, action){
    switch(action.type){
        case NAV_VISIBILITY:
            // window.alert('Trocou a visibilidade para ' + action.payload)
            return{
                ...state,
                navVisibility: action.payload
            }
        default: 
            return state
    }
}