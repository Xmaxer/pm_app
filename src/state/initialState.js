const initialState = {
    loggedIn: false,
    loading: false,
    errors: {
        fetchError: null,
        httpError: null,
        graphQLErrors: null
    },
    info: {
        type: null,
        message: null
    }
};
export default initialState;
