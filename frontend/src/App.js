import React, {Component} from "react";
//import {Landing} from "./scenes"
import {Game} from "./scenes"
import "./App.css";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Game />
            </div>
        );
    }
}

export default App;
