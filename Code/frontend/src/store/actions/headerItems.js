import {HEADER_ITEMS} from './actionTypes.js'

export function setHeaderItemsVisibility(visibility){
    return{
        type: HEADER_ITEMS,
        payload: visibility
    }
}