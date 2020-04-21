import React, {useEffect} from 'react'
import {useMutation} from 'graphql-hooks'
import {useGlobalState} from "../state/state";
import {ADD_ERRORS} from "../state/actions";

function useMutationApi(query, options = {}) {
    const [call, {loading, error, data}] = useMutation(query, options);
    const [{}, dispatch] = useGlobalState();

    useEffect(() => {

        let cancel = false;
        call().then((response) => {
            if (!cancel && response.error) {
                dispatch({type: ADD_ERRORS, errors: [response.error]})
            }
        });
        return () => {
            cancel = true;
        }
    }, []);

    return {loading, error, data}
}

export default useMutationApi
