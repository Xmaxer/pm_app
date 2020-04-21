import {ADD_ERRORS, REMOVE_ERRORS} from "../actions";
import initialState from "../initialState";

export const errorReducer = (state, action) => {
    switch (action.type) {
        case ADD_ERRORS:
            return action.errors;
        case REMOVE_ERRORS:
            return initialState.errors;
        default:
            return state;
    }
};
