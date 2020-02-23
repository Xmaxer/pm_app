import React, {Component} from 'react';
import {Redirect, Route} from 'react-router-dom'
import useAuthenticated from "../hooks/useAuthenticated";
import SideBar from "./SideBar";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    }
}));

function ProtectedRoute({component: Component, ...rest}) {
    const classes = useStyles();
    const authenticated = useAuthenticated();

    if (authenticated === null) {
        return (<h1>LOADING SECURE</h1>)
    }
    return (
        <Route
            {...rest}
            render={props => {
                if (authenticated) {
                    return <div className={classes.root}>
                        <SideBar {...props}/>
                        <Component {...props} />
                    </div>;
                } else {
                    return <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
                }
            }}
        />
    );
}

export default ProtectedRoute;
