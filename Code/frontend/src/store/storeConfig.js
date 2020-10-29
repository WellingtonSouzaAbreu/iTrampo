import { createStore, combineReducers } from 'redux'

import navReducer from './reducers/navReducer.js'
import userReducer from './reducers/userReducer.js'

const reducers = combineReducers({
    nav: navReducer,
    user: userReducer
})

function storeConfig() {
    return createStore(reducers)
}

export default storeConfig