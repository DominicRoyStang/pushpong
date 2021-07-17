import React from "react";
import {Route, Router, Switch} from "react-router-dom";
import history from "utils/history";
import {ONLINE_MULTIPLAYER_ENABLED} from "utils/environment";
import {OnlineGame, LocalGame, Landing} from "scenes"
import "./App.scss";

const App = () => (
    <div id="app">
        <Router history={history}>
            <Switch>
                {ONLINE_MULTIPLAYER_ENABLED && <Route path="/online" component={OnlineGame} />}
                <Route path="/local" component={LocalGame} />
                <Route path="/" component={Landing} />
            </Switch>
        </Router>
    </div>
);

export default App;
