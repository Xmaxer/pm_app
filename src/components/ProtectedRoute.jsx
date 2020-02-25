import React, {Component} from 'react';
import {Redirect, Route} from 'react-router-dom'
import useAuthenticated from "../hooks/useAuthenticated";
import SideBar from "./SideBar";
import {makeStyles} from '@material-ui/core/styles';
import {LinearProgress} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: '100%'
    }
}));

function ProtectedRoute({component: Component, ...rest}) {
    const classes = useStyles();
    const authenticated = useAuthenticated();

    if (authenticated === null) {
        return (<div style={{width: '100%'}}><LinearProgress color={"secondary"}/></div>)
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
