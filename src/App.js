import React from 'react';
import Cookies from 'universal-cookie'
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import UnProtectedRoute from "./components/UnProtectedRoute";
import Register from "./pages/Register";
import initialState from "./state/initialState";
import theme from "./assets/theme";
import rootReducer from "./state/reducers/rootReducer";
import {StateProvider} from "./state/state";
import {ThemeProvider} from '@material-ui/styles';
import {ClientContext, GraphQLClient} from 'graphql-hooks'
import Company from "./pages/Company";

const cookies = new Cookies();


const client = new GraphQLClient({

    url: 'http://localhost:3005/api',
    headers: {
        Authorization: 'Basic ' + cookies.get('token')
    }
});

function App() {

    return (
        <ClientContext.Provider value={client}>
            <ThemeProvider theme={theme}>
                <StateProvider initialState={initialState} reducer={rootReducer}>
                    <BrowserRouter>
                        <Switch>
                            <ProtectedRoute path={"/dashboard"} component={Home} exact/>
                            <ProtectedRoute path={"/dashboard/company/:company_id"} component={Company} exact/>
                            <UnProtectedRoute path={"/login"} component={Login}/>
                            <UnProtectedRoute path={"/register"} component={Register}/>
                            <Redirect from={"/"} to={"/dashboard"}/>
                            <Route path={"*"} component={() => "404"}/>
                        </Switch>
                    </BrowserRouter>
                </StateProvider>
            </ThemeProvider>
        </ClientContext.Provider>
    );
}

export default App;
