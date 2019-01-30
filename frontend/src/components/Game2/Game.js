import React from "react";
import io from "socket.io-client";
import {World} from "p2";
import P5 from "p5";
import Controls from "./controls";
import {BACKEND_URL} from "config";
import {canvasWidth, canvasHeight, boundWidth, paddleBoundSpacing, paddleOffset} from "./utils/dimensions";
import colors from "./utils/colors";
import {Boundary, Ball} from "./bodies";

export default class Game extends React.Component {

    constructor() {
        super();

        this.socket = io.connect(BACKEND_URL, {path: "/game-socket"});
        this.controls = new Controls(this.socket); //TODO: Remove dependency on socket from controls

        this.world = new World({
            //gravity: [0, 0]
        });
    }

    componentDidMount() {

        // Create circle bodies
        const ball = new Ball({
            position: [450, 300]
        });
        this.world.addBody(ball);
        const ground = new Boundary({
            position: [canvasWidth/2, 40]
        }, canvasWidth, 30);
        this.world.addBody(ground);

        const sketch = (p) => { // TODO: Move sketch to its own file; import it here.

            p.setup = () => {
                p.createCanvas(canvasWidth, canvasHeight);
            };

            p.draw = () => {
                p.background(colors.background);
                p.fill(0);
                for (const body of this.world.bodies) {
                    body.render(p);
                }
            };
        };

        let p5 = new P5(sketch, document.getElementById("game-render"));

        this.runEngine(this.world);

        console.log(this.world);
    }

    runEngine(world) {
        let maxSubSteps = 10;
        let fixedTimeStep = 1 / 60;
        let lastTimeSeconds;
        const animate = (t) => {
            requestAnimationFrame(animate);
            const timeSeconds = t / 1000;
            lastTimeSeconds = lastTimeSeconds || timeSeconds;
            const timeSinceLastCall = timeSeconds - lastTimeSeconds;
            world.step(fixedTimeStep, timeSinceLastCall, maxSubSteps);
        }
        requestAnimationFrame(animate);
    }

    render() {
        return (
            <div id="game-render" tabIndex="0">
                {
                    //game will be rendered here when the component mounts.
                }
            </div>
        );
    }
}
