import {SET_LOGIN} from "../actions";

export const authenticationReducer = (state, action) => {
    switch (action.type) {
        case SET_LOGIN:
            return action.authenticated;
        default:
            return state;
    }
};
