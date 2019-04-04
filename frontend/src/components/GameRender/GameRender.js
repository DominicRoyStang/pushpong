import React, {useEffect, useRef} from "react";
import P5 from "p5";
import {canvasWidth, canvasHeight} from "pushpong/utils/dimensions";
import colors from "pushpong/utils/colors";
import PushPongClient from "pushpong";
import "./GameRender.scss";

const GameRender = () => {
    const game = new PushPongClient();
    const world = game.world;
    const controls = game.controls;
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

                const score = `Score: ${game.score.player1} - ${game.score.player2}`;
                p.text(score, canvasWidth/2, p.textAscent());

                p.push();
                p.text("Waiting for opponent", canvasWidth/2, canvasHeight/2);
                p.pop();

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
        <div id="game-render" tabIndex="0" ref={ref} onKeyDown={controls.handleKeyDown} onKeyUp={controls.handleKeyUp}>
            {/* Game will be rendered here when the component mounts. */}
        </div>
    );
}

export default GameRender;