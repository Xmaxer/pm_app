import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {StyledTableCell, StyledTableRow} from "../assets/styledElements";
import {ADD_ERRORS} from "../state/actions";
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import {Table, TableBody, TableHead} from '@material-ui/core'
import {useManualQuery} from 'graphql-hooks'
import {API_KEY_QUERY} from "../assets/queries";
import {useGlobalState} from "../state/state";
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        '& > *': {
            marginTop: 20
        },
        backgroundColor: theme.palette.secondary.dark,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    disabled: {
        backgroundColor: theme.palette.error.main
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ApiKeyHistory({open, closeHandler, api_key_id}) {
    const [getApiKey, {loading}] = useManualQuery(API_KEY_QUERY);
    const [apiKey, setApiKey] = useState(null);
    const [{}, dispatch] = useGlobalState();

    const classes = useStyles();

    useEffect(() => {
        if (open === true) {
            getApiKey({variables: {id: api_key_id}}).then((res) => {
                if (!res.error && res.data && res.data.apiKey) {
                    setApiKey(res.data.apiKey)
                } else {
                    dispatch({
                        type: ADD_ERRORS,
                        errors: res.error
                    })
                }
            })
        }
    }, [open]);

    return (
        <Dialog fullScreen={true} open={open} TransitionComponent={Transition} onClose={closeHandler}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Tooltip title={"Close"}>
                        <IconButton onClick={closeHandler}>
                            <CloseIcon/>
                        </IconButton>
                    </Tooltip>
                    <Typography
                        variant={'h6'}>{"Api Key history for " + (apiKey ? apiKey.name : "Unknown")}</Typography>
                </Toolbar>
            </AppBar>
            <Table>
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>Date</StyledTableCell>
                        <StyledTableCell>Query</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {
                        apiKey && apiKey.history && apiKey.history.map((history) => {
                            return <StyledTableRow>
                                <StyledTableCell>{history.createdAt}</StyledTableCell>
                                <StyledTableCell>{history.query}</StyledTableCell>
                            </StyledTableRow>
                        })
                    }
                </TableBody>
            </Table>
        </Dialog>
    );
}

export default ApiKeyHistory;
