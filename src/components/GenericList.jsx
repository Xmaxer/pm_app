import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Table, TableBody, TableHead, TableRow, TextField, Typography} from '@material-ui/core'
import {Skeleton} from '@material-ui/lab';
import {StyledTableCell, StyledTableRow} from "../assets/styledElements";

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
    },
    table: {
        minHeight: 500,
        midWidth: 700
    },
    skeletons: {
        width: '95%',
        padding: theme.spacing(2)
    }
}));

function GenericList({rows = [], loading, title, headers = [], canAdd = true}) {

    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Typography variant={'h4'} className={classes.title}>{title}</Typography>
            {
                loading ? <div className={classes.skeletons}>
                    <Skeleton variant={'text'} height={100} animation="wave"/>
                    <Skeleton variant={'rect'} height={300} animation="wave"/>
                </div> : <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            {
                                headers.map(header => (<StyledTableCell>{header}</StyledTableCell>))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            rows.length !== 0 ? rows.map(row => (
                                row
                            )) : "No data to show!"
                        }
                        {
                            canAdd ?
                                <StyledTableRow>
                                    <StyledTableCell> <TextField type={'text'} required={true}
                                                                 placeholder={'Company Name'}
                                                                 style={{width: '100%'}} name={"password"}
                                                                 onInput={null}/></StyledTableCell>

                                </StyledTableRow> : null
                        }
                    </TableBody>
                </Table>
            }
        </div>
    );
}

export default GenericList;
