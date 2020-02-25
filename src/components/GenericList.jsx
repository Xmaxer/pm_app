import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button, IconButton, Table, TableBody, TableHead, TableRow, Typography} from '@material-ui/core'
import {Skeleton} from '@material-ui/lab';
import {StyledTableCell, StyledTableRow} from "../assets/styledElements";
import AddIcon from '@material-ui/icons/Add';

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
        midWidth: 700
    },
    skeletons: {
        width: '95%',
        padding: theme.spacing(2)
    }
}));

function GenericList({rows = [], loading, title, headers = [], canAdd = false, newForm = [], onSubmitAction}) {

    const classes = useStyles();
    const [renderForm, setRenderForm] = useState(false);
    const shouldAddForm = canAdd && newForm.length > 0;

    const onAddClick = () => {
        setRenderForm(!renderForm)
    };

    const mainComponent = <div className={classes.container}>
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
                        rows && rows.length !== 0 ? rows.map(row => (
                                row
                            )) :
                            <StyledTableRow><StyledTableCell colSpan={headers.length}>No data to show!</StyledTableCell></StyledTableRow>
                    }
                    {
                        canAdd && newForm.length > 0 ? renderForm ? <><StyledTableRow key={"form"}>
                                {newForm.map(cell => cell)}
                                {newForm.length < headers.length &&
                                <StyledTableCell colSpan={headers.length - newForm.length}/>}
                            </StyledTableRow><StyledTableRow key={"submitButtons"}>
                                <StyledTableCell colSpan={headers.length}>
                                    <Button variant={'contained'} color={'primary'} type={'submit'}>Create</Button>
                                    <Button variant={'contained'} color={'primary'} onClick={onAddClick}>Cancel</Button>
                                </StyledTableCell>
                            </StyledTableRow> </> :
                            <StyledTableRow key={"formAdd"}>
                                <StyledTableCell colSpan={headers.length}><IconButton
                                    style={{width: '100%', backgroundColor: 'transparent'}} disableRipple={true}
                                    disableFocusRipple={true} onClick={onAddClick}><AddIcon/></IconButton>
                                </StyledTableCell>
                            </StyledTableRow> : null
                    }
                </TableBody>
            </Table>
        }
    </div>;

    return (shouldAddForm ?
            <form onSubmit={onSubmitAction}>
                {mainComponent}
            </form> : mainComponent
    );
}

export default GenericList;
