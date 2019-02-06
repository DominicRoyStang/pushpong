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

        this.world.defaultContactMaterial.restitution = 1;
    }

    componentDidMount() {

        // Create walls
        const ground = new Boundary({
            position: [canvasWidth/2, 0 - boundWidth/2]
        }, canvasWidth, boundWidth);
        const ceiling = new Boundary({
            position: [canvasWidth/2, canvasHeight + boundWidth/2]
        }, canvasWidth, boundWidth);

        // Create ball
        const ball = new Ball({
            position: [paddleOffset*9, canvasHeight/2]
        });
        
        // Add bodies to world
        this.world.addBody(ground);
        this.world.addBody(ceiling);
        this.world.addBody(ball);
        
        // Create players
        const player1 = new Player(paddleOffset*4, canvasHeight/2, -Math.PI/2);
        const player2 = new Player(canvasWidth - paddleOffset*4, canvasHeight/2, Math.PI/2);
        const player3 = new Player(400, 30, 0);
        
        // Add player composites to world
        player1.addToWorld(this.world);
        player2.addToWorld(this.world);
        player3.addToWorld(this.world);
        
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

    onMouseUp = (mouseEvent) => {
        this.world.addBody(
            new Ball({
                position: [
                    this.p5.mouseX,
                    canvasHeight - this.p5.mouseY]
            })
        );
    }

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
