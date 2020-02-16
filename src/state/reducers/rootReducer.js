// TODO Import reducers and use them here
import {authenticationReducer} from "./authenticationReducer";
import {loadingReducer} from "./loadingReducer";

const rootReducer = ({auth, loading}, action) => {
    //Middleware goes here

    return {
        auth: authenticationReducer(auth, action),
        loading: loadingReducer(loading, action)
    }
};

export default rootReducer;
