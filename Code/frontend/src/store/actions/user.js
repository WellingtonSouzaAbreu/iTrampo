import {USER_DATA} from './actionTypes.js'

export function setUserData(user){
    return{
        type: USER_DATA,
        payload: user
    }
}