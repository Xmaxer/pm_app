import React from 'react';
import {ThemeProvider} from '@material-ui/styles';
import theme from "./assets/theme";
import {StateProvider} from "./state/state";
import initialState from "./state/initialState";
import rootReducer from "./state/reducers/rootReducer";
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import home from "./pages/home";

function App() {
  return (
      <ThemeProvider theme={theme}>
        <StateProvider initialState={initialState} reducer={rootReducer}>
          <BrowserRouter>
            <Switch>
              <Route path={"/"} component={home} exact/>
            </Switch>
          </BrowserRouter>
        </StateProvider>
      </ThemeProvider>
  );
}

export default App;
