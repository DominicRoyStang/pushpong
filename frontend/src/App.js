import React, {Component} from "react";
import {Route, Router, Switch} from "react-router-dom";
import history from "utils/history";
import {Game, Landing} from "./scenes"
import "./App.scss";

class App extends Component {
    render() {
        return (
            <div id="app">
                <Router history={history}>
                    <Switch>
                        <Route
                            path="/game"
                            render={(props) => (
                                <Game {...props} />
                            )}
                        />
                        <Route
                            path="/"
                            render={(props) => (
                                <Landing {...props} />
                            )}
                        />
                    </Switch>                
                </Router>
            </div>
        );
    }
}

export default App;
