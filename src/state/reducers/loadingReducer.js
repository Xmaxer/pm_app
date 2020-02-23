import {SET_LOADING} from "../actions";

export const loadingReducer = (state, action) => {
    switch (action.type) {
        case SET_LOADING:
            return action.loading;
        default:
            return state;
    }
};
