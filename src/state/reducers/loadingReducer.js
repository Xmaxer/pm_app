import {START_LOADING_ACTION, STOP_LOADING_ACTION} from "../actions";

export const loadingReducer = (state, action) => {
    switch(action.type) {
        case START_LOADING_ACTION:
            return {...state, loading: true};
        case STOP_LOADING_ACTION:
            return {...state, loading: false};
        default:
            return state;
    }
};
