import { combineReducers } from 'redux';
import authReducer from './authSlice';

const rootReducer = combineReducers({
  example: authReducer,
});

export default rootReducer;
