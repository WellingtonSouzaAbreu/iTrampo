import { createStore, combineReducers } from 'redux'
import storeSynchronize from 'redux-localstore'

import navReducer from './reducers/navReducer.js'
import userReducer from './reducers/userReducer.js'
import userDropdownReducer from './reducers/userDropdownReducer.js'
import headerItemsReducer from './reducers/headerItemsReducer.js'
import menuSelectionsReducer from './reducers/menuSelectionsReducer.js'

const reducers = combineReducers({
    nav: navReducer,
    user: userReducer,
    userDropdown: userDropdownReducer,
    headerItems: headerItemsReducer,
    menuSelections: menuSelectionsReducer
})

const store = createStore(reducers)

storeSynchronize(store)

export default store
