import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useGlobalState} from "../state/state";
import {REMOVE_INFO} from "../state/actions";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {SUCCESS} from "../assets/severities";

const useStyles = makeStyles(theme => ({}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function InformationSnackbar() {
    const [{info}, dispatch] = useGlobalState();

    const onClose = (event, reason) => {
        dispatch({type: REMOVE_INFO})
    };

    return (
        <Snackbar open={info.message !== null} onClose={onClose} autoHideDuration={5000}>
            <Alert severity={info.type ? info.type : SUCCESS}
                   onClose={onClose}>{info.message ? info.message : ""}</Alert>
        </Snackbar>
    );
}

export default InformationSnackbar;
