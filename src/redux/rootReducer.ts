import { combineReducers } from 'redux';
import authReducer from './authSlice';
import themeReducer from './themeSlice'; // Assuming you have a themeSlice for managing dark mode

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer, // Add themeReducer to manage dark mode state
});

export default rootReducer;
