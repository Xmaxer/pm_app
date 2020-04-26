import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useGlobalState} from "../state/state";
import {REMOVE_INFO} from "../state/actions";
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const useStyles = makeStyles(theme => ({}));

function InformationSnackbar() {
    const [{info}, dispatch] = useGlobalState();

    const onClose = () => {
        dispatch({type: REMOVE_INFO})
    };

    return (
        <Snackbar open={info.message !== null} onClose={onClose} autoHideDuration={5000} severity={info.type}>
            <SnackbarContent message={info.message}/>
        </Snackbar>
    );
}

export default InformationSnackbar;
