import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useGlobalState} from "../state/state";
import Snackbar from '@material-ui/core/Snackbar';
import {REMOVE_ERRORS} from "../state/actions";
import MuiAlert from '@material-ui/lab/Alert';
import {ERROR} from "../assets/severities";

const useStyles = makeStyles(theme => ({}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Error() {
    const [{errors}, dispatch] = useGlobalState();

    const onClose = (event, reason) => {
        dispatch({type: REMOVE_ERRORS})
    };
    return (
        <>
            <Snackbar open={errors.fetchError} onClose={onClose} autoHideDuration={5000}>
                <Alert severity={ERROR}
                       onClose={onClose}>{errors && errors.fetchError ? errors.fetchError.message : ""}</Alert>
            </Snackbar>
            <Snackbar open={errors.graphQLErrors} onClose={onClose} autoHideDuration={5000} severity={"error"}>
                <Alert severity={ERROR}
                       onClose={onClose}>{errors && errors.graphQLErrors ? errors.graphQLErrors.map((m) => m.message + "\n") : ""}</Alert>
            </Snackbar>
            <Snackbar open={errors.httpError} onClose={onClose} autoHideDuration={5000} severity={"error"}>
                <Alert severity={ERROR}
                       onClose={onClose}>{errors && errors.httpError ? errors.httpError.statusText : ""}</Alert>
            </Snackbar>
        </>
    );
}

export default Error;
