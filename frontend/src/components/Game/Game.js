import React from "react";
import io from "socket.io-client";
import {Bodies, Body, Composite, Engine, Events, Render, World} from "matter-js";
import {BACKEND_URL} from "config";
import {canvasWidth, canvasHeight, boundWidth, paddleBoundSpacing, paddleOffset} from "./utils/dimensions";
import colors from "./utils/colors";
import Controls from "./controls";
import {Player, PaddleBoundPair} from "./bodies";
import "./Game.css";

export default class Game extends React.Component {

    constructor() {
        super();
        this.engine = Engine.create();

        this.socket = io.connect(BACKEND_URL, {path: "/game-socket"});

        // create two players
        this.player = new Player(paddleOffset + paddleBoundSpacing/2, canvasHeight/2);
        this.opponent = new Player(canvasWidth - paddleOffset, canvasHeight/2);
        
        // make the players face each other
        Composite.rotate(this.player, Math.PI/2, {x: paddleOffset, y: canvasHeight/2});
        Composite.rotate(this.opponent, -Math.PI/2, {x: canvasWidth - paddleOffset, y: canvasHeight/2});

        this.controls = new Controls(this.socket); //TODO: Remove dependency on socket from controls

        this.createWorld(); //TODO: move create world, players, and rotation to a separate world initialization file
    }

    componentDidMount() {
        // create the renderer
        this.render = Render.create({
            element: document.getElementById("game-render"), //attaches game canvas to the div#game-render HTML element
            engine: this.engine,
            options: {
                background: colors.background,
                height: canvasHeight,
                width: canvasWidth,
                wireframes: false
            }
        });
        // autofocus on the renderer
        document.getElementById("game-render").focus();

        this.run();
    }

    createWorld() {
        this.engine.world.gravity.y = 0;

        // create two boxes and a ground
        let boxA = Bodies.rectangle(400, 200, 80, 80);
        let boxB = Bodies.rectangle(450, 50, 80, 80);
        let boxC = Bodies.rectangle(350, 100, 50, 50, {
            render: {
                fillStyle: "white",
                strokeStyle: "blue",
                lineWidth: 3
            },
        });
        boxA.restitution = 0.9;
        boxB.restitution = 0.9;
        boxC.restitution = 0.9;

        // create thick borders, but ensure only 10px of thickness are visible
        const ceiling = Bodies.rectangle(canvasWidth/2, 0, canvasWidth + boundWidth, boundWidth, {isStatic: true});
        const ground = Bodies.rectangle(canvasWidth/2, canvasHeight, canvasWidth + boundWidth, boundWidth, {isStatic: true});

        const player1Bounds = new PaddleBoundPair(paddleOffset + paddleBoundSpacing/2);
        const player2Bounds = new PaddleBoundPair(canvasWidth - paddleOffset - paddleBoundSpacing/2);

        Events.on(this.engine, "beforeUpdate", (event) => {
            // react to key commands and apply force as needed
            if (this.controls.UP) {
                let paddle = this.player.bodies[0];
                Body.setVelocity(paddle, {x: 0, y: -4});
            } else if (this.controls.DOWN) {
                let paddle = this.player.bodies[0];
                Body.setVelocity(paddle, {x: 0, y: 4});
            } else {
                let paddle = this.player.bodies[0];
                Body.setVelocity(paddle, {x: 0, y: 0});
            }
            if (this.controls.BOOST) {
                let paddle = this.player.bodies[0];
                let bumper = this.player.bodies[1];
                let force = (0.001  * paddle.mass);
                let forceAngle = paddle.angle - Math.PI/2;
                let xForce = Math.cos(forceAngle) * force;
                let yForce = Math.sin(forceAngle) * force; 
                Body.applyForce(bumper, bumper.position, {x: xForce, y: yForce})
            }
        });

        // add all of the bodies to the world
        World.add(this.engine.world, [this.player, this.opponent, player1Bounds, player2Bounds, boxA, boxB, boxC, ceiling, ground]);
    }

    run() {
        // run the engine
        Engine.run(this.engine);

        // run the renderer
        Render.run(this.render);
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
