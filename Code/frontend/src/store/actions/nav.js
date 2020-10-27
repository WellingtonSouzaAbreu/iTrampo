import {NAV_VISIBILITY} from './actionTypes.js'

export function changeNavVisibility(visibility){
    return{
        type: NAV_VISIBILITY,
        payload: visibility
    }
}