import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useManualQuery, useMutation} from 'graphql-hooks'
import {API_KEYS_QUERY, DELETE_API_KEY_MUTATION} from "../assets/queries";
import {StyledIconButton, StyledTableCell, StyledTableRow} from "../assets/styledElements";
import GenericList from "./GenericList";
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({}));

function ApiKeysList() {
    const [getApiKeys, {loading, error}] = useManualQuery(API_KEYS_QUERY, {
        variables: {
            first: 10
        }
    });

    const [renderForm, setRenderForm] = useState(false);
    const [apiKeys, setApiKeys] = useState([]);
    const [deleteApiKeyMutation, {loading3}] = useMutation(DELETE_API_KEY_MUTATION);

    useEffect(() => {
        getApiKeys().then((res) => {
            setApiKeys(res.data.apiKeys)
        })
    }, []);

    const handleDelete = (id) => {
        deleteApiKeyMutation({variables: {id: id}}).then((res) => {
            let newApiKeys = [];
            apiKeys.forEach((apiKey) => {
                if (apiKey.id !== id) {
                    newApiKeys.push(apiKey)
                }
            });
            if (res.data.deleteApiKey && res.data.deleteApiKey.apiKey) {
                setApiKeys(newApiKeys)
            }

        })
    };

    let rows = apiKeys.length !== 0 ? apiKeys.map((row) => (
        <StyledTableRow key={row.id}>
            <StyledTableCell>{row.name}</StyledTableCell>
            <StyledTableCell>{row.companyName}</StyledTableCell>
            <StyledTableCell>{row.apiKey}</StyledTableCell>
            <StyledTableCell>{row.lastUsed ? row.lastUsed : "Never"}</StyledTableCell>
            <StyledTableCell>
                <StyledIconButton onClick={() => {
                    handleDelete(row.id)
                }}>
                    <DeleteIcon/>
                </StyledIconButton>
            </StyledTableCell>
        </StyledTableRow>
    )) : null;

    return (
        <GenericList headers={["API Key Name", "Owner", "API Key", "Last Used", "Actions"]} rows={rows}
                     loading={loading} title={"API Keys"}/>
    );
}

export default ApiKeysList;
