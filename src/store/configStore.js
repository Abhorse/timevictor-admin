import {createStore, applyMiddleware} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import logger from 'redux-logger';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import rootReducer from './reducer'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export  let store = createStore(persistedReducer, applyMiddleware(logger));
export  let persistor = persistStore(store)
