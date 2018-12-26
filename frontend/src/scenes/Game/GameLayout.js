import React from "react";
import {Game, Header} from "components/"
import "./Game.css";

const GameLayout = () => (
    <React.Fragment>
        <Header />
        <div className="game-page">
            <div className="game">
                <Game />
            </div>
        </div>
    </React.Fragment>
);

export default GameLayout;