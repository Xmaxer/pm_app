import Cookies from 'universal-cookie';
import React, {useState, useEffect, useContext} from 'react'
import {IS_AUTHENTICATED_QUERY} from "../assets/queries";
import { useManualQuery, ClientContext } from 'graphql-hooks'

function useAuthenticated() {
    const cookies = new Cookies();
    const client = useContext(ClientContext);
    client.setHeader('Authorization', 'Basic ' + cookies.get('token'));
    const [authenticated, setAuthenticated] = useState(null);
    const [check, { loading, error, data }] = useManualQuery(IS_AUTHENTICATED_QUERY);

    useEffect(() => {
        let cancel = false;
        check().then((response) => {
            if(!cancel) {
                response.error ? setAuthenticated(false) : setAuthenticated(response.data.isAuthenticated)
            }
        });
        return  () => {
            cancel = true;
        }
    },[]);

    return authenticated
}

export default useAuthenticated
