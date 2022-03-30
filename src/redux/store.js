import {createStore,combineReducers} from "redux";
import {CollapsedReducer} from "./reducer/CollapsedReducer";
import {LoadingReducer} from "./reducer/LoadingReducer"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    storage,
    blacklist:['LoadingReducer']
}

const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)


const store = createStore(persistedReducer)
const persistor = persistStore(store)

export {
    store,
    persistor
}


/*
*
* store.dispatch()
* store.subscribe()
*
*/