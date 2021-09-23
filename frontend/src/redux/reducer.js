import { combineReducers } from 'redux'

const initialState = {value : false, id : 0, secret : 0}

function logInReducer(state = initialState, action) {
    if (action.type == 'logIn/login') {
        return {
            ...state,
            value: true,
            id: action.payload.id,
            secret: action.payload.secret
        }
    } else if (action.type === 'logIn/logout') {
        return {
            ...state,
            value:false,
            id: action.payload.id,
            secret: action.payload.secret
        }
    }
    return state
}

export default logInReducer;