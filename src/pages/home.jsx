import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import SideBar from "../components/SideBar";
import CompaniesList from "../components/CompaniesList";
import ApiKeysList from "../components/ApiKeysList";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        width: '100%'
    }
}));

function Home(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <SideBar title={"Dashboard"} location={props.location.pathname}/>
            <div className={classes.content}>
                <CompaniesList/>
                <ApiKeysList/>
            </div>
        </div>
    );
}

export default Home;
