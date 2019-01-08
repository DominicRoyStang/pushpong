import React from "react";
import io from "socket.io-client";
import {Bodies, Body, Engine, Events, Render, World} from "matter-js";
import {BACKEND_URL} from "config";
import Controls from "./controls";
import Player from "./bodies/player";
import "./Game.css";

export default class Game extends React.Component {

    constructor() {
        super();
        this.engine = Engine.create();

        this.socket = io.connect(BACKEND_URL, {path: "/game-socket"});
        this.player = new Player(0);
        //const opponent = new Player(1);
        this.controls = new Controls(this.socket); //TODO: Remove dependency on socket from controls

        this.createWorld();
    }

    componentDidMount() {
        // create the renderer
        this.render = Render.create({
            element: document.getElementById("game-render"), //attaches game canvas to the div#game-render HTML element
            engine: this.engine,
            options: {
                background: "#ffffff",
                height: 600,
                width: 900,
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

        let ground = Bodies.rectangle(450, 590, 910, 40, {isStatic: true});

        Events.on(this.engine, "beforeUpdate", (event) => {
            // react to key commands and apply force as needed
            if (this.controls.UP) {
                let spine = this.player.bodies[0];
                let force = (-0.006 * spine.mass);
                Body.applyForce(spine, spine.position, {x: 0, y: force});
            }
            if (this.controls.DOWN) {
                let spine = this.player.bodies[0];
                let force = (0.006 * spine.mass);
                Body.applyForce(spine, spine.position, {x: 0, y: force});
            }
            if (this.controls.BOOST) {
                let spine = this.player.bodies[0];
                let bumper = this.player.bodies[1];
                let force = (0.001 * spine.mass);
                Body.applyForce(bumper, bumper.position, {x: force, y: 0})
            }
        });

        // add all of the bodies to the world
        World.add(this.engine.world, [this.player, boxA, boxB, boxC, ground]);
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
