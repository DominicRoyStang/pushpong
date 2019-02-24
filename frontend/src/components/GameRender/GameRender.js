import React from "react";
import P5 from "p5";
import {canvasWidth, canvasHeight} from "./utils/dimensions";
import colors from "./utils/colors";
import Game from "./Game";

export default class GameRender extends React.Component {

    constructor() {
        super();
        const game = new Game();
        this.game = game;
        this.world = game.world;
        this.controls = game.player1Controls;
    }

    componentDidMount() {
        // Create sketch
        const sketch = (p) => {

            p.setup = () => {
                p.createCanvas(canvasWidth, canvasHeight);
                p.push();
                p.noStroke();
                p.angleMode(p.RADIANS);
                p.rectMode(p.CENTER);
            };

            p.draw = () => {
                p.background(colors.background);
                p.fill(colors.defaultColor);
                for (const body of this.world.bodies) {
                    body.render(p);
                }
                for (const spring of this.world.springs) {
                    spring.render(p);
                }
            };
        };

        // Create and autofocus on renderer
        this.p5 = new P5(sketch, document.getElementById("game-render"));
        document.getElementById("game-render").focus();
    }

    render() {
        return (
            <div id="game-render" tabIndex="0" onKeyDown={this.controls.handleKeyDown} onKeyUp={this.controls.handleKeyUp} /*onMouseUp={this.onMouseUp}*/>
                {
                    //game will be rendered here when the component mounts.
                }
            </div>
        );
    }
}
