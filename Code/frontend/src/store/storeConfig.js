import { createStore, combineReducers } from 'redux'

import navReducer from './reducers/navReducer.js'
import userReducer from './reducers/userReducer.js'
import dropdownReducer from './reducers/dropdownReducer.js'

const reducers = combineReducers({
    nav: navReducer,
    user: userReducer,
    dropdown: dropdownReducer
})

function storeConfig() {
    return createStore(reducers)
}

export default storeConfig