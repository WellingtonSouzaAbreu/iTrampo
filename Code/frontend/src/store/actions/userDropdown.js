import { USER_DROPDOWN_VISIBILITY } from './actionTypes.js'

export function changeDropdownVisibility(visibility) {
    return {
        type: USER_DROPDOWN_VISIBILITY,
        payload: visibility
    }
}