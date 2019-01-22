import React from "react";
import {Game2, Header} from "components/"
import "./Game.css";

const GameLayout = () => (
    <React.Fragment>
        <Header />
        <div className="game-page">
            <div className="game">
                <Game2 />
            </div>
        </div>
    </React.Fragment>
);

export default GameLayout;