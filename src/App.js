import React from 'react';
import {ThemeProvider} from '@material-ui/styles';
import theme from "./assets/theme";
import {StateProvider} from "./state/state";
import initialState from "./state/initialState";
import rootReducer from "./state/reducers/rootReducer";
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import home from "./pages/home";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/login";
import {ClientContext, GraphQLClient} from 'graphql-hooks'
import UnProtectedRoute from "./components/UnProtectedRoute";
import Register from "./pages/register";

const client = new GraphQLClient({
    url: 'http://localhost:3005/api'
});

function App() {
    return (
        <ClientContext.Provider value={client}>
            <ThemeProvider theme={theme}>
                <StateProvider initialState={initialState} reducer={rootReducer}>
                    <BrowserRouter>
                        <Switch>
                            <ProtectedRoute path={["/", "/dashboard"]} component={home} exact/>
                            <UnProtectedRoute path={"/login"} component={Login}/>
                            <UnProtectedRoute path={"/register"} component={Register}/>
                            <Route path={"*"} component={() => "404"}/>
                        </Switch>
                    </BrowserRouter>
                </StateProvider>
            </ThemeProvider>
        </ClientContext.Provider>
    );
}

export default App;
