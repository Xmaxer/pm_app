import React, {Component} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useGlobalState} from "../state/state";
import {Redirect, Route} from 'react-router-dom'
import useAuthenticated from "./Auth";

const useStyles = makeStyles(theme => ({}));

function UnProtectedRoute({component: Component, ...rest}) {

    const [{loggedIn}, dispatch] = useGlobalState();
    const authenticated = useAuthenticated();
    if (authenticated == null) { return (<h1>LOADING</h1>)}
    return (
        <Route
            {...rest}
            render={props => {
                if (!authenticated) {
                    return <Component {...props} />;
                } else {
                    return <Redirect to={{pathname: '/'}}/>
                }
            }}
        />
    );
}

export default UnProtectedRoute;
