import React, {useEffect, useRef} from "react";
import P5 from "p5";
import {PushPongClient, PushPongLocalGame} from "pushpong";
import {canvasWidth, canvasHeight} from "pushpong/utils/dimensions";
import colors from "pushpong/utils/colors";
import {writeScore, writeTitle, writeSubtitle} from "pushpong/render/text";
import "./GameRender.scss";

const GameRender = ({local}) => {
    let game;
    if (local) {
        game = new PushPongLocalGame();
    } else {
        game = new PushPongClient();
    }

    const world = game.world;
    const fsm = game.fsm;
    const ref = useRef(null);

    const createSketch = () => {
        return (p) => {
            p.setup = () => {
                p.createCanvas(canvasWidth, canvasHeight);
                p.push();
                p.noStroke();
                p.angleMode(p.RADIANS);
                p.rectMode(p.CENTER);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(28);
            };

            p.draw = () => {
                p.background(colors.background);

                switch (fsm.state) {
                    case "joined":
                    case "waiting":
                        writeTitle(p, "Waiting for opponent");
                        break;
                    case "countdown":
                        writeTitle(p, `${game.timer}`);
                        break;
                    case "ended":
                        writeScore(p, `Final Score: ${game.score.player1} - ${game.score.player2}`);
                        const player1Winner = game.score.player1 >= 7;
                        const player2Winner = game.score.player2 >= 7;
                        if (!player1Winner && !player2Winner) {
                            writeTitle(p, "YOU WIN");
                            writeSubtitle(p, "opponent forfeit");
                        } else if (local && player1Winner) {
                            writeTitle(p, "PLAYER 1 WINS");
                        } else if (local && player2Winner) {
                            writeTitle(p, "PLAYER 2 WINS");
                        } else if ((player1Winner && game.playerNumber === 1) || (player2Winner && game.playerNumber === 2)) {
                            writeTitle(p, "YOU WIN");
                        } else if ((player1Winner && game.playerNumber === 2) || (player2Winner && game.playerNumber === 1)) {
                            writeTitle(p, "YOU LOSE");
                        }
                        break;
                    default:
                        writeScore(p, `Score: ${game.score.player1} - ${game.score.player2}`);
                }

                for (const body of world.bodies) {
                    body.render(p);
                }

                for (const spring of world.springs) {
                    spring.render(p);
                }
            };
        };
    }

    useEffect(() => {
        // Create and autofocus on renderer
        const sketch = createSketch();
        new P5(sketch, ref.current);
        ref.current.focus();
    }, []);

    return (
        <div id="game-render" tabIndex="0" ref={ref} onKeyDown={(e) => game.onKeyDown(e)} onKeyUp={(e) => game.onKeyUp(e)}>
            {/* Game will be rendered here when the component mounts. */}
        </div>
    );
}

export default GameRender;
