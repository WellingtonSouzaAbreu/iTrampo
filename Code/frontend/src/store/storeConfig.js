import { createStore, combineReducers } from 'redux'

import navReducer from './reducers/navReducer.js'

const reducers = combineReducers({
    nav: navReducer
})

function storeConfig() {
    return createStore(reducers)
}

export default storeConfig