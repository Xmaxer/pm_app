const initialState = {
    loggedIn: false,
    loading: false,
    errors: {
        fetchError: null,
        httpError: null,
        graphQLErrors: null
    }
};
export default initialState;
