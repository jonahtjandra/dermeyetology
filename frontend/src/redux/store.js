import { configureStore } from '@reduxjs/toolkit'
import logInReducer from './reducer';

const store = configureStore({reducer: logInReducer})

export default store;