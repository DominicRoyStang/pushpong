import React from "react";
import {GameRender, Header} from "components/"
import "./Game.css";

const GameLayout = () => (
    <React.Fragment>
        <Header />
        <div className="game-page">
            <div className="game">
                <GameRender />
            </div>
        </div>
    </React.Fragment>
);

export default GameLayout;