import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {Chip, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@material-ui/core'
import {useQuery} from 'graphql-hooks'
import {COMPANY_USERS_QUERY} from "../assets/queries";
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

function UsersList({summary = true, company_id}) {
    const classes = useStyles();

    const {loading, data, error} = useQuery(COMPANY_USERS_QUERY, {
        variables: {
            companyId: company_id
        }
    });

    if (loading) return <h1>Loading</h1>;
    if (error) return <h1>Errors</h1>;
    if (data.company === null) return <Redirect to={'/dashboard'}/>;

    return (
        <div className={classes.container}>
            <Typography variant={'h4'} className={classes.title}>Users</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>First Name</StyledTableCell>
                        <StyledTableCell>Last Name</StyledTableCell>
                        <StyledTableCell>Added on</StyledTableCell>
                        <StyledTableCell>Role</StyledTableCell>
                        {
                            summary ? null : <StyledTableCell>Actions</StyledTableCell>
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data.company.users ? data.company.users.map(user => (
                            <StyledTableRow key={user.id}>
                                <StyledTableCell>{user.firstName}</StyledTableCell>
                                <StyledTableCell>{user.lastName}</StyledTableCell>
                                <StyledTableCell>TO BE ADDED</StyledTableCell>
                                <StyledTableCell>{user.roles.map(role => (
                                    <div style={{display: 'flex'}}>
                                        {
                                            role.name === null ?
                                                <Chip label={"Owner"} style={{backgroundColor: "red"}}/> :
                                                <Chip label={role.name} style={{backgroundColor: role.colour}}/>
                                        }

                                    </div>
                                ))}</StyledTableCell>
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

export default UsersList;
