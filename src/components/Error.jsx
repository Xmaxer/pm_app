import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useGlobalState} from "../state/state";
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import {REMOVE_ERRORS} from "../state/actions";

const useStyles = makeStyles(theme => ({}));

function Error() {
    const [{errors}, dispatch] = useGlobalState();

    const onClose = () => {
        dispatch({type: REMOVE_ERRORS})
    };
    return (
        <>
            <Snackbar open={errors.fetchError} onClose={onClose} autoHideDuration={5000} severity={"error"}>
                <SnackbarContent message={errors.fetchError ? errors.fetchError.message : ""}/>
            </Snackbar>
            <Snackbar open={errors.graphQLErrors} onClose={onClose} autoHideDuration={5000} severity={"error"}>
                <SnackbarContent
                    message={errors.graphQLErrors ? errors.graphQLErrors.map((m) => m.message + "\n") : ""}/>
            </Snackbar>
            <Snackbar open={errors.httpError} onClose={onClose} autoHideDuration={5000} severity={"error"}>
                <SnackbarContent message={errors.httpError ? errors.httpError.statusText : ""}/>
            </Snackbar>
        </>
    );
}

export default Error;
