import {MENU_SELECTIONS} from './actionTypes.js'

export function setMenuSelections(menuSelections){
    return{
        type: MENU_SELECTIONS,
        payload: menuSelections
    }
}