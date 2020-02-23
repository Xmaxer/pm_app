import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@material-ui/core'
import {useQuery} from 'graphql-hooks'
import {COMPANY_ASSETS_QUERY} from "../assets/queries";
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Build';
import {Redirect} from 'react-router-dom'

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

function AssetsList({summary = true, company_id}) {
    const classes = useStyles();

    const {loading, data, error} = useQuery(COMPANY_ASSETS_QUERY, {
        variables: {
            companyId: company_id
        }
    });

    if (loading) return <h1>Loading</h1>;
    if (error) return <h1>Errors</h1>;
    if (data.company === null) return <Redirect to={'/dashboard'}/>;

    return (
        <div className={classes.container}>
            <Typography variant={'h4'} className={classes.title}>Assets</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Data</StyledTableCell>
                        <StyledTableCell>Accuracy</StyledTableCell>
                        <StyledTableCell>Algorithm</StyledTableCell>
                        <StyledTableCell>Description</StyledTableCell>
                        {
                            summary ? null : <StyledTableCell>Actions</StyledTableCell>
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data.company.assets ? data.company.assets.map(asset => (
                            <StyledTableRow key={asset.id}>
                                <StyledTableCell>{asset.name}</StyledTableCell>
                                <StyledTableCell>1.0gb</StyledTableCell>
                                <StyledTableCell>50%</StyledTableCell>
                                <StyledTableCell>X</StyledTableCell>
                                <StyledTableCell>{asset.description}</StyledTableCell>
                                {
                                    summary ? null : <StyledTableCell>
                                        <IconButton className={classes.action}>
                                            <DeleteIcon/>
                                        </IconButton>
                                        <IconButton className={classes.action}><SettingsIcon/></IconButton>
                                    </StyledTableCell>
                                }
                            </StyledTableRow>
                        )) : "No assets to show!"
                    }
                </TableBody>
            </Table>
        </div>
    );
}

export default AssetsList;
