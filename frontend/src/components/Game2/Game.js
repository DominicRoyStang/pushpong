import React from "react";
import io from "socket.io-client";
import {Body, Box, Circle, World} from "p2";
import P5 from "p5";
import Controls from "./controls";
import {BACKEND_URL} from "config";
import {canvasWidth, canvasHeight, boundWidth, paddleBoundSpacing, paddleOffset} from "./utils/dimensions";
import colors from "./utils/colors";
import {drawCircle} from "./render";

export default class Game extends React.Component {

    constructor() {
        super();

        this.socket = io.connect(BACKEND_URL, {path: "/game-socket"});
        this.controls = new Controls(this.socket); //TODO: Remove dependency on socket from controls

        this.world = new World({
            //gravity: [0, 0]
        });

        this.createBounds();
    }

    componentDidMount() {

        // Create circle bodies
        const shape = new Circle({ radius: 10 }); //TODO: add ball radius to dimensions and use that
        const ball = new Body({
            mass: 1,
            position: [450, 300],
            //velocity: [1,0], // 100,0
            ccdSpeedThreshold: 0 // -1
        });
        ball.addShape(shape);
        this.world.addBody(ball);

        const sketch = (p) => { // TODO: Move sketch to its own file; import it here.

            p.setup = () => {
                p.createCanvas(900, 600);
            };

            p.draw = () => {
                p.background(colors.background);
                p.fill(0);
                // have to do canvas height - y because p5 (canvas) uses top left corner as (0,0)
                // whereas p2 (physics) uses the top right corner as (0,0)
                drawCircle(p, ball)
            };
        };
        console.log(ball);

        let p5 = new P5(sketch, document.getElementById("game-render"));

        this.runEngine(this.world);

        console.log(this.world);
    }

    createBounds() {
        const shape = new Box({
            width: canvasWidth,
            height: boundWidth
        });
        const floor = new Body({
            mass: 0,
            position: [0, 0]
        });
        floor.addShape(shape);
        this.world.addBody(floor);
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
