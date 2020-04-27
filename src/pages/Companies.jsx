import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CompaniesList from "../components/CompaniesList";

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        width: '100%',
        '& > *': {
            marginBottom: 20
        }
    }
}));

function Companies() {
    const classes = useStyles();
    return (
        <div className={classes.content}>
            <CompaniesList/>
        </div>
    );
}

export default Companies;
