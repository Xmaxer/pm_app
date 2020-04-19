import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useQuery} from 'graphql-hooks'
import {API_KEYS_QUERY} from "../assets/queries";
import {StyledTableCell, StyledTableRow} from "../assets/styledElements";
import GenericList from "./GenericList";

const useStyles = makeStyles(theme => ({}));

function ApiKeysList() {
    const {loading, error, data} = useQuery(API_KEYS_QUERY, {
        variables: {
            first: 10
        }
    });

    let rows = data && data.apiKeys ? data.apiKeys.map((row) => (
        <StyledTableRow key={row.id}>
            <StyledTableCell>{row.name}</StyledTableCell>
            <StyledTableCell>{row.companyName}</StyledTableCell>
            <StyledTableCell>{row.apiKey}</StyledTableCell>
            <StyledTableCell>{row.lastUsed ? row.lastUsed : "Never"}</StyledTableCell>
        </StyledTableRow>
    )) : null;

    return (
        <GenericList headers={["API Key Name", "Owner", "API Key", "Last Used"]} rows={rows}
                     loading={loading} title={"API Keys"}/>
    );
}

export default ApiKeysList;
