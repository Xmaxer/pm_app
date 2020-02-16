import React, {useState, useEffect} from 'react'
import {useGlobalState} from "../state/state";


export const useFetch = (url, options) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [{loading}, dispatch] = useGlobalState();

    useEffect(() => {
        const fetchData = async () => {

        }
    }, [])
};
