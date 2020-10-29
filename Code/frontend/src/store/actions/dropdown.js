import { DROPDOWN_VISIBILITY } from './actionTypes.js'

export default function changeDropdownVisibility(visibility) {
    return {
        type: DROPDOWN_VISIBILITY,
        payload: visibility
    }
}