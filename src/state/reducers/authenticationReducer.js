import {LOGIN_ACTION, LOGOUT_ACTION} from "../actions";

export const authenticationReducer = (state, action) => {
    switch(action.type) {
        case LOGIN_ACTION:
            return {...state, loggedIn: true};
        case LOGOUT_ACTION:
            return {...state, loggedIn: false};
        default:
            return state;
    }
};
