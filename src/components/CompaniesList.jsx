import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@material-ui/core'
import {useQuery} from 'graphql-hooks'
import {COMPANIES_QUERY} from "../assets/queries";
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Build';

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
    },
    action: {
        color: theme.palette.tertiary.main
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

function CompaniesList({summary = true}) {
    const classes = useStyles();

    const {loading, error, data} = useQuery(COMPANIES_QUERY, {
        variables: {
            first: 10
        }
    });

    return (
        <div className={classes.container}>
            <Typography variant={'h4'} className={classes.title}>Companies</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Company Name</StyledTableCell>
                        <StyledTableCell>Number of Assets</StyledTableCell>
                        <StyledTableCell>Data</StyledTableCell>
                        <StyledTableCell>Avg Accuracy</StyledTableCell>
                        {
                            summary ? null : <StyledTableCell>Actions</StyledTableCell>
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        loading ? "Loading" : data.companies ? data.companies.map(company => (
                            <StyledTableRow key={company.id}>
                                <StyledTableCell>{company.name}</StyledTableCell>
                                <StyledTableCell>{company.numberOfAssets}</StyledTableCell>
                                <StyledTableCell>1.0gb</StyledTableCell>
                                <StyledTableCell>50%</StyledTableCell>
                                {
                                    summary ? null : <StyledTableCell>
                                        <IconButton className={classes.action}>
                                            <DeleteIcon/>
                                        </IconButton>
                                        <IconButton href={'/dashboard/company/' + company.id}
                                                    className={classes.action}><SettingsIcon/></IconButton>
                                    </StyledTableCell>
                                }
                            </StyledTableRow>
                        )) : "No companies to show!"
                    }
                </TableBody>
            </Table>
        </div>
    );
}

export default CompaniesList;
