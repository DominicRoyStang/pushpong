import React from "react";
import {Header} from "components/"
import "./Game.css";

const GameLayout = () => (
    <React.Fragment>
        <Header />
        <div className="game">
            <h1>Game</h1>
        </div>
    </React.Fragment>
);

export default GameLayout;