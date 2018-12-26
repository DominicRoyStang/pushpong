import React, {Component} from "react";
import {Redirect, Route, Router, Switch} from "react-router-dom";
//import {Landing} from "./scenes"
import {Game} from "./scenes"
import "./App.css";

class App extends Component {
    render() {
        return (
            <div id="app">
                <Game />
            </div>
        );
    }
}

export default App;
