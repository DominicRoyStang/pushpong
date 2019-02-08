import React from "react";
import io from "socket.io-client";
import {World} from "p2";
import P5 from "p5";
import Controls from "./controls";
import {BACKEND_URL} from "config";
import {canvasWidth, canvasHeight} from "./utils/dimensions";
import colors from "./utils/colors";
import {worldSetup, addBall, addPlayer} from "./worldSetup";

export default class Game extends React.Component {

    constructor() {
        super();

        this.socket = io.connect(BACKEND_URL, {path: "/game-socket"});
        this.controls = new Controls(this.socket); //TODO: Remove dependency on socket from controls

        this.world = new World({
            gravity: [0, 0]
        });

        this.world.defaultContactMaterial.restitution = 1;
        this.world.defaultContactMaterial.contactSkinSize = 0;
    }

    componentDidMount() {

        // Create boundaries
        worldSetup(this.world);
        
        // Ball will eventually be created once two players join.
        addBall(this.world);

        // Create players
        const player1 = addPlayer(this.world, 0);
        const player2 = addPlayer(this.world, 1);
        
        // Create sketch
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
                for (const spring of this.world.springs) {
                    spring.render(p);
                }
            };
        };

        // Create and autofocus on renderer
        this.p5 = new P5(sketch, document.getElementById("game-render"));
        document.getElementById("game-render").focus();

        this.runEngine(this.world);

        // Update the character controller after each physics tick.
        this.world.on('postStep', () => {
            const paddle = player1.paddle;
            const bumper = player1.bumper;
            if (this.controls.UP) {
                const paddleVelocity = [-30, 0];
                paddle.vectorToWorldFrame(paddle.velocity, paddleVelocity);
                let currentLocal = [0, 0];
                bumper.vectorToLocalFrame(currentLocal, bumper.velocity);
                let desiredLocal = [-30, currentLocal[1]];
                bumper.vectorToWorldFrame(bumper.velocity, desiredLocal);
            } else if (this.controls.DOWN) {
                const paddleVelocity = [30, 0];
                paddle.vectorToWorldFrame(paddle.velocity, paddleVelocity);
                let currentLocal = [0, 0];
                bumper.vectorToLocalFrame(currentLocal, bumper.velocity);
                let desiredLocal = [30, currentLocal[1]];
                bumper.vectorToWorldFrame(bumper.velocity, desiredLocal);
            } else {
                const paddleVelocity = [0, 0];
                paddle.vectorToWorldFrame(paddle.velocity, paddleVelocity);
                let currentLocal = [0, 0];
                bumper.vectorToLocalFrame(currentLocal, bumper.velocity);
                let desiredLocal = [0, currentLocal[1]];
                bumper.vectorToWorldFrame(bumper.velocity, desiredLocal);
            }
            if (this.controls.BOOST) {
                const force = 128 * bumper.mass;
                bumper.applyForceLocal([0, force]);
            }
        });

        console.log(this.world);
    }

    runEngine(world) {
        let maxSubSteps = 10;
        let fixedTimeStep = 1/60;
        let lastTimeSeconds;
        const animate = (t) => {
            requestAnimationFrame(animate);
            const timeSeconds = t/1000;
            lastTimeSeconds = lastTimeSeconds || timeSeconds;
            const timeSinceLastCall = timeSeconds - lastTimeSeconds;
            world.step(fixedTimeStep, timeSinceLastCall, maxSubSteps);
        }
        requestAnimationFrame(animate);
    }

    onMouseUp = (mouseEvent) => addBall(this.world, this.p5.mouseX, canvasHeight - this.p5.mouseY);

    render() {
        return (
            <div id="game-render" tabIndex="0" onKeyDown={this.controls.handleKeyDown} onKeyUp={this.controls.handleKeyUp} onMouseUp={this.onMouseUp}>
                {
                    //game will be rendered here when the component mounts.
                }
            </div>
        );
    }
}
