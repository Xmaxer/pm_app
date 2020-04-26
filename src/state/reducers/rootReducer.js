import {authenticationReducer} from "./authenticationReducer";
import {loadingReducer} from "./loadingReducer";
import {errorReducer} from "./errorReducer";
import {infoReducer} from "./infoReducer";

const rootReducer = ({loggedIn, loading, errors, info}, action) => {
    //Middleware goes here, but I got none.

    return {
        loggedIn: authenticationReducer(loggedIn, action),
        loading: loadingReducer(loading, action),
        errors: errorReducer(errors, action),
        info: infoReducer(info, action)
    }
};

export default rootReducer;
