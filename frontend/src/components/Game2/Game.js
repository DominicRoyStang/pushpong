import React from "react";
import io from "socket.io-client";
import {World} from "p2";
import P5 from "p5";
import Controls from "./controls";
import {BACKEND_URL} from "config";
import {canvasWidth, canvasHeight, boundWidth, paddleOffset} from "./utils/dimensions";
import colors from "./utils/colors";
import {Boundary, Ball, Player} from "./bodies";

export default class Game extends React.Component {

    constructor() {
        super();

        this.socket = io.connect(BACKEND_URL, {path: "/game-socket"});
        this.controls = new Controls(this.socket); //TODO: Remove dependency on socket from controls

        this.world = new World({
            gravity: [0, 0]
        });
    }

    componentDidMount() {

        // Create walls
        const ground = new Boundary({
            position: [canvasWidth/2, 0 - boundWidth/2]
        }, canvasWidth, boundWidth);
        const ceiling = new Boundary({
            position: [canvasWidth/2, canvasHeight + boundWidth/2]
        }, canvasWidth, boundWidth);
        
        // Create players
        const player1 = new Player({
            position: [paddleOffset, canvasHeight/2]
        });

        console.log(player1);

        // Create ball
        const ball = new Ball({
            position: [450, canvasHeight/2]
        });

        this.world.addBody(ground);
        this.world.addBody(ceiling);
        this.world.addBody(player1);
        this.world.addBody(ball);

        const sketch = (p) => { // TODO: Move sketch to its own file; import it here.

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
            };
        };

        let p5 = new P5(sketch, document.getElementById("game-render"));
        // autofocus on the renderer
        document.getElementById("game-render").focus();

        this.runEngine(this.world);

        // Update the character controller after each physics tick.
        this.world.on('postStep', () => {
            if (this.controls.UP) {
                player1.velocity[1] = 30;
            } else if (this.controls.DOWN) {
                player1.velocity[1] = -30;
            } else {
                player1.velocity[1] = 0;
            }
            if (this.controls.BOOST) {
                console.log("BOOST");
            }
            //player1.applyForce([5,5]);
        });
        console.log(this.controls);
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
            <div id="game-render" tabIndex="0" onKeyDown={this.controls.handleKeyDown} onKeyUp={this.controls.handleKeyUp}>
                {
                    //game will be rendered here when the component mounts.
                }
            </div>
        );
    }
}
