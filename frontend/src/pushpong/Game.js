import io from "socket.io-client";
import {World} from "p2";
import Controls from "./controls";
import {BACKEND_URL} from "config";
//import {canvasHeight} from "./utils/dimensions";
import {worldSetup, addBall, addPlayer} from "./worldSetup";

export default class Game {

    constructor() {
        this.socket = io.connect(BACKEND_URL, {path: "/game-socket"});

        this.player1Controls = new Controls(this.onControlChange.bind(this)); //TODO: remove bind
        this.player2Controls = new Controls(() => {});

        this.world = new World({
            gravity: [0, 0]
        });

        // Create boundaries
        worldSetup(this.world);
        
        // Ball will eventually be created once two players join.
        addBall(this.world);

        // Create players
        const player1 = addPlayer(this.world, 0);
        const player2 = addPlayer(this.world, 1);

        this.runEngine(this.world);

        // Update the character controller after each physics tick.
        this.world.on('postStep', () => {
            const paddle = player1.paddle;
            const bumper = player1.bumper;
            if (this.player1Controls.LEFT) {
                const paddleVelocity = [-30, 0];
                paddle.vectorToWorldFrame(paddle.velocity, paddleVelocity);
                let currentLocal = [0, 0];
                bumper.vectorToLocalFrame(currentLocal, bumper.velocity);
                let desiredLocal = [-30, currentLocal[1]];
                bumper.vectorToWorldFrame(bumper.velocity, desiredLocal);
            } else if (this.player1Controls.RIGHT) {
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
            if (this.player1Controls.BOOST) {
                const force = 128 * bumper.mass;
                bumper.applyForceLocal([0, force]);
            }
        });

        this.world.on('postStep', () => {
            const paddle = player2.paddle;
            const bumper = player2.bumper;
            if (this.player2Controls.LEFT) {
                const paddleVelocity = [-30, 0];
                paddle.vectorToWorldFrame(paddle.velocity, paddleVelocity);
                let currentLocal = [0, 0];
                bumper.vectorToLocalFrame(currentLocal, bumper.velocity);
                let desiredLocal = [-30, currentLocal[1]];
                bumper.vectorToWorldFrame(bumper.velocity, desiredLocal);
            } else if (this.player2Controls.RIGHT) {
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
            if (this.player2Controls.BOOST) {
                const force = 128 * bumper.mass;
                bumper.applyForceLocal([0, force]);
            }
        });

        this.setUpSockets();

        console.log(this.world);
    }

    setUpSockets() {
        this.socket.on("control", (value) => {
            switch(value) {
                case "LEFT":
                    this.player2Controls.LEFT = !this.player2Controls.LEFT;
                    break;
                case "RIGHT":
                    this.player2Controls.RIGHT = !this.player2Controls.RIGHT;
                    break;
                case "BOOST":
                    this.player2Controls.BOOST = !this.player2Controls.BOOST;
                    break;
                default:
                    return;
            }
        });
    }

    onControlChange = (value) => {
        this.socket.emit("control", value);
    }

    // Runs the engine at a framerate-independent speed.
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

    //onMouseUp = (mouseEvent) => addBall(this.world, this.p5.mouseX, canvasHeight - this.p5.mouseY);

}
