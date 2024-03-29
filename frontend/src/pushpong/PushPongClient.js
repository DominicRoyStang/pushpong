import io from "socket.io-client";
import StateMachine from 'javascript-state-machine';
import {World} from "p2";
import Controls, {opponentControls} from "./controls";
import {BACKEND_URL} from "../utils/environment";
import {worldSetup, addBall, resetBall, hideBall, addPlayer, resetPlayer} from "./worldSetup";
import {createSnapshot} from "./snapshots";

export default class PushPongClient {
    world = new World({gravity: [0, 0]});
    socket = io.connect(BACKEND_URL, {path: "/game-socket"});

    // Client state setup
    score = {
        player1: 0,
        player2: 0
    };

    constructor() {
        // Create the finite state machine
        this.fsm = new StateMachine({
            init: "joined",
            transitions: [
                {name: "receiveNumber", from: "joined", to: "waiting"},
                {name: "countdown", from: "waiting", to: "countdown"},
                {name: "start", from: "countdown", to: "started"},
                {name: "goal", from: "started", to: "started"},
                {name: "end", from: "started", to: "ended"},
                {name: "opponentDisconnect", from: "joined", to: "joined"},
                {name: "opponentDisconnect", from: ["countdown", "waiting"], to: "waiting"},
                {name: "opponentDisconnect", from: ["started", "ended"], to: "ended"}
            ],
            methods: {
                onEnterState: (lifecycle) => console.log(`Enter State: ${lifecycle.to}`),
                onAfterReceiveNumber: (lifecycle, playerNumber) => this.onReceiveNumber(playerNumber),
                onEnterCountdown: (lifecycle, time) => this.onCountdown(time),
                onEnterStarted: () => this.onStart(),
                onEnterEnded: () => this.onEnd(),
                onAfterGoal: (lifecycle, newScore) => this.onGoal(newScore),
                onAfterOpponentDisconnect: () => this.onOpponentDisconnect(),
                onInvalidTransition: (transition, from, to) => {
                    console.log(`Invalid transition "${transition}" from "${from}" to "${to}"`);
                }
            },
        });

        // Create objects (rigidbodies)
        worldSetup(this.world, this.onPlayer1Goal, this.onPlayer2Goal);

        this.controls = new Controls(this.onControlChange);
        this.opponentControls = new Controls(() => {}, opponentControls);

        this.ball = addBall(this.world);
        this.player1 = addPlayer(this.world, 1);
        this.player2 = addPlayer(this.world, 2);

        // Prepare sockets
        this.setUpSocketEvents();

        // Socket events are ready, notify the backend that we are ready to receive data.
        this.socket.emit("ready", "what is my player number?");
    };

    /* Sets up responses to socket.io events */
    setUpSocketEvents() {
        this.socket.on("player-number", playerNumber => this.fsm.receiveNumber(playerNumber));
        this.socket.on("countdown", time => this.fsm.countdown(time));
        this.socket.on("start", () => this.fsm.start());
        this.socket.on("goal", newScore => this.fsm.goal(newScore));
        this.socket.on("end", () => this.fsm.end());
        this.socket.on("opponent-disconnect", () => this.fsm.opponentDisconnect());
        this.socket.on("snapshot", message => this.onSnapshot(message));
        this.socket.on("ping", () => this.socket.emit("pong"));
    };

    /* Sets p2 world events to move players at each physics tick */
    setUpControlWorldEvents() {
        this.world.on('postStep', () => {
            if (this.controls.LEFT) {
                this.player.setVelocity([-30, 0]);
            } else if (this.controls.RIGHT) {
                this.player.setVelocity([30, 0]);
            } else {
                this.player.setVelocity([0, 0]);
            }
            if (this.controls.BOOST) {
                const force = 128 * this.player.bumper.mass;
                this.player.bumper.applyForceLocal([0, force]);
            }
        });

        this.world.on('postStep', () => {
            if (this.opponentControls.LEFT) {
                this.opponent.setVelocity([-30, 0]);
            } else if (this.opponentControls.RIGHT) {
                this.opponent.setVelocity([30, 0]);
            } else {
                this.opponent.setVelocity([0, 0]);
            }
            if (this.opponentControls.BOOST) {
                const force = 128 * this.opponent.bumper.mass;
                this.opponent.bumper.applyForceLocal([0, force]);
            }
        });
    };

    /* Sets control settings depending on the player number the client is given by the server */
    setUpControls() {
        if (this.playerNumber === 1) {
            this.player = this.player1;
            this.opponent = this.player2;
        } else if (this.playerNumber === 2) {
            this.player = this.player2;
            this.opponent = this.player1;
        }

        this.socket.on("opponent-control", (value) => {
            if (value === "LEFT") {
                this.opponentControls.LEFT = !this.opponentControls.LEFT;
            } else if (value === "RIGHT") {
                this.opponentControls.RIGHT = !this.opponentControls.RIGHT;
            } else if (value === "BOOST") {
                this.opponentControls.BOOST = !this.opponentControls.BOOST;
            }
        });
    };

    onKeyUp(e) {
        this.controls.handleKeyUp(e);
    }

    onKeyDown(e) {
        this.controls.handleKeyDown(e);
    }

    onPlayer1Goal = () => {
        this.socket.emit("goal", {player: 1});
    };

    onPlayer2Goal = () => {
        this.socket.emit("goal", {player: 2});
    };

    onControlChange = (value) => {
        this.socket.emit("control", value);
    };

    onSnapshot = (message) => {
        if (message.player) {
            this.opponent.setPosition(message.player.position);
            this.opponent.setVelocity(message.player.velocity);
        }
        if (message.ball) {
            this.ball.position = message.ball.position;
            this.ball.velocity = message.ball.velocity;
        }
    };

    // State Machine Methods

    onReceiveNumber(playerNumber) {
        this.playerNumber = playerNumber;
        console.log(`Player number: ${playerNumber}`);
        this.setUpControls();
        this.setUpControlWorldEvents();
    };

    onCountdown(time) {
        this.timer = time;
        while (time > 0) {
            setTimeout(() => this.timer--, time*1000);
            time--;
        }

        setInterval(() => {
            this.socket.emit("snapshot", createSnapshot(this.player, this.ball));
        }, 100);
    };

    onStart() {
        resetBall(this.ball);
    };

    onGoal(newScore) {
        this.score.player1 = newScore.player1;
        this.score.player2 = newScore.player2;

        resetPlayer(this.player1, 1);
        resetPlayer(this.player2, 2);
        resetBall(this.ball);
    };

    onEnd() {
        hideBall(this.ball);
    };

    onOpponentDisconnect() {
        hideBall(this.ball);
    };
}
