import {REMOVE_INFO, SET_INFO} from "../actions";
import initialState from "../initialState";

export const infoReducer = (state, action) => {
    switch (action.type) {
        case SET_INFO:
            return action.info;
        case REMOVE_INFO:
            return initialState.info;
        default:
            return state;
    }
};
