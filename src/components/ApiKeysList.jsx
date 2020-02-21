import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@material-ui/core'
import {useQuery} from 'graphql-hooks'
import {API_KEYS_QUERY} from "../assets/queries";

const useStyles = makeStyles(theme => ({
    container: {
        backgroundColor: theme.palette.secondary.main,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    title: {
        padding: 10,
        color: theme.palette.common.white,
    }
}));

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
        textAlign: 'center',
    },
    body: {
        fontSize: 14,
        width: 200,
        textAlign: 'center',
        color: theme.palette.common.white,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.secondary.light,
        },
        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.secondary.dark,
        },
    },
}))(TableRow);

function ApiKeysList() {
    const classes = useStyles();

    const {loading, error, data} = useQuery(API_KEYS_QUERY, {
        variables: {
            first: 10
        }
    });

    return (
        <div className={classes.container}>
            <Typography variant={'h4'} className={classes.title}>API Keys</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Key</StyledTableCell>
                        <StyledTableCell>Owner</StyledTableCell>
                        <StyledTableCell>Last Used</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        loading ? "Loading" : data.apiKeys ? data.apiKeys.map(apiKey => (
                            <StyledTableRow key={apiKey.id}>
                                <StyledTableCell>{apiKey.name}</StyledTableCell>
                                <StyledTableCell>{apiKey.apiKey}</StyledTableCell>
                                <StyledTableCell>{apiKey.companyName}</StyledTableCell>
                                <StyledTableCell>To Be Implemented</StyledTableCell>
                            </StyledTableRow>
                        )) : "No API Keys to show!"
                    }
                </TableBody>
            </Table>
        </div>
    );
}

export default ApiKeysList;
