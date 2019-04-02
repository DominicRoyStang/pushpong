import io from "socket.io-client";
import {World} from "p2";
import Controls, {player1DefaultControls, player2DefaultControls, opponentControls} from "./controls";
import {BACKEND_URL} from "config";
//import {canvasHeight} from "./utils/dimensions";
import {worldSetup, addBall, addPlayer, runEngine} from "./worldSetup";

export default class Game {

    state = {
        status: "waiting",
        player1Score: 0,
        player2Score: 0
    }

    world = new World({gravity: [0, 0]});
    socket = io.connect(BACKEND_URL, {path: "/game-socket"});

    constructor() {
        // create objects
        worldSetup(this.world, this.onPlayer1Goal, this.onPlayer2Goal);
        
        // Ball will eventually be created once two players join.
        this.ball = addBall(this.world);

        this.controls = new Controls(this.onControlChange);
        this.opponentControls = new Controls(() => {}, opponentControls);

        // Prepare sockets
        this.socket.on("player-number", (value) => {
            console.log(`Player number: ${value}`);
            this.playerNumber = value
            switch(this.playerNumber) {
                case 1:
                    this.controls.updateControls(player1DefaultControls);
                    break;
                case 2:
                    this.controls.updateControls(player2DefaultControls);
                    break;
                default:
                    return;
            }
            this.setUpOpponent();
            this.setUpWorld();
        });

        this.socket.emit("player", "what is my player number?");
    }

    setUpWorld() {
        // Create players
        const player1 = addPlayer(this.world, 1);
        const player2 = addPlayer(this.world, 2);
        runEngine(this.world);

        // Update the character controller after each physics tick.
        this.world.on('postStep', () => {
            let paddle = null;
            let bumper = null;
            if(this.playerNumber === 1) {
                paddle = player1.paddle;
                bumper = player1.bumper;    
            } else {
                paddle = player2.paddle;
                bumper = player2.bumper;
            }
            if (this.controls.LEFT) {
                const paddleVelocity = [-30, 0];
                paddle.vectorToWorldFrame(paddle.velocity, paddleVelocity);
                let currentLocal = [0, 0];
                bumper.vectorToLocalFrame(currentLocal, bumper.velocity);
                let desiredLocal = [-30, currentLocal[1]];
                bumper.vectorToWorldFrame(bumper.velocity, desiredLocal);
            } else if (this.controls.RIGHT) {
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

        this.world.on('postStep', () => {
            let paddle = null;
            let bumper = null;
            if(this.playerNumber === 1) {
                paddle = player2.paddle;
                bumper = player2.bumper;    
            } else {
                paddle = player1.paddle;
                bumper = player1.bumper;
            }
            if (this.opponentControls.LEFT) {
                const paddleVelocity = [-30, 0];
                paddle.vectorToWorldFrame(paddle.velocity, paddleVelocity);
                let currentLocal = [0, 0];
                bumper.vectorToLocalFrame(currentLocal, bumper.velocity);
                let desiredLocal = [-30, currentLocal[1]];
                bumper.vectorToWorldFrame(bumper.velocity, desiredLocal);
            } else if (this.opponentControls.RIGHT) {
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
            if (this.opponentControls.BOOST) {
                const force = 128 * bumper.mass;
                bumper.applyForceLocal([0, force]);
            }
        });

        console.log(this.world);
    }

    setUpOpponent() {
        this.socket.on("opponent-control", (value) => {
            switch(value) {
                case "LEFT":
                    this.opponentControls.LEFT = !this.opponentControls.LEFT;
                    break;
                case "RIGHT":
                    this.opponentControls.RIGHT = !this.opponentControls.RIGHT;
                    break;
                case "BOOST":
                    this.opponentControls.BOOST = !this.opponentControls.BOOST;
                    break;
                default:
                    return;
            }
        });
    }

    onPlayer1Goal = () => {
        this.state.player1Score++;
        console.log("player 1 scored");
    };

    onPlayer2Goal = () => {
        this.state.player2Score++;
        console.log("player 2 scored");
    };

    onControlChange = (value) => {
        this.socket.emit("control", value);
    }
}
