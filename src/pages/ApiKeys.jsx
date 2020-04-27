import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ApiKeysList from "../components/ApiKeysList";

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

function ApiKeys() {
    const classes = useStyles();
    return (
        <div className={classes.content}>
            <ApiKeysList/>
        </div>
    );
}

export default ApiKeys;
