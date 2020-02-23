import {authenticationReducer} from "./authenticationReducer";
import {loadingReducer} from "./loadingReducer";

const rootReducer = ({loggedIn, loading}, action) => {
    //Middleware goes here

    return {
        loggedIn: authenticationReducer(loggedIn, action),
        loading: loadingReducer(loading, action)
    }
};

export default rootReducer;
