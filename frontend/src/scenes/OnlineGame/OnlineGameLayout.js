import React from "react";
import {GameRender, Header} from "components/"

const OnlineGameLayout = () => (
    <React.Fragment>
        <Header />
        <div className="game-page">
            <div className="game">
                <GameRender local={false} />
            </div>
        </div>
    </React.Fragment>
);

export default OnlineGameLayout;
