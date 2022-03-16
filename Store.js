import userReducer from './reducers/UserReducer'

import { createStore, combineReducers } from 'redux';


const rootReducer = combineReducers({
  userReducer: userReducer,
  
})

const configureStore = createStore(rootReducer);
export default configureStore;