import React from "react";
import {GameRender, Header} from "components/"

const GameLayout = () => (
    <React.Fragment>
        <Header />
        <div className="game-page">
            <div className="game">
                <GameRender local={true} />
            </div>
        </div>
    </React.Fragment>
);

export default GameLayout;
