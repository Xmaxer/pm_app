import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CompaniesList from "../components/CompaniesList";
import ApiKeysList from "../components/ApiKeysList";

const useStyles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        width: '100%'
    }
}));

function Home(props) {
    const classes = useStyles();
    return (
        <div className={classes.content}>
            <CompaniesList summary={false}/>
            <ApiKeysList/>
        </div>
    );
}

export default Home;
