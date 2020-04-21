import {authenticationReducer} from "./authenticationReducer";
import {loadingReducer} from "./loadingReducer";
import {errorReducer} from "./errorReducer";

const rootReducer = ({loggedIn, loading, errors}, action) => {
    //Middleware goes here, but I got none.

    return {
        loggedIn: authenticationReducer(loggedIn, action),
        loading: loadingReducer(loading, action),
        errors: errorReducer(errors, action)
    }
};

export default rootReducer;
