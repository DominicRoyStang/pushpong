import io from "socket.io-client";
import StateMachine from 'javascript-state-machine';
import {World} from "p2";
import Controls, {player1DefaultControls, player2DefaultControls, opponentControls} from "./controls";
import {BACKEND_URL} from "config";
import {worldSetup, addBall, addPlayer} from "./worldSetup";

export default class PushPongClient {
    world = new World({gravity: [0, 0]});
    socket = io.connect(BACKEND_URL, {path: "/game-socket"});

    // Client state setup
    score = {
        player1: 0,
        player2: 0
    }

    constructor() {
        // Create the finite state machine
        this.fsm = new StateMachine({
            init: "joined",
            transitions: [
                {name: "receiveNumber", from: "joined", to: "waiting"},
                {name: "countdown", from: "waiting", to: "countdown"},
                {name: "start", from: "countdown", to: "started"},
                {name: "goal", from: "started", to: "started"},
                {name: "end", from: "started", to: "ended"}
            ],
            methods: {
                onEnterState: (lifecycle) => {
                    console.log(`Enter State: ${lifecycle.to}`);
                },
                onEnterReceiveNumber: (lifecycle, playerNumber) => {
                    this.onReceiveNumber(playerNumber);
                },
                onEnterCountdown: (lifecycle, time) => {
                    this.onCountdown(time);
                },
                onStart: (lifecycle) => {
                    this.onStart();
                },
                onInvalidTransition: (transition, from, to) => {
                    console.log(`Invalid transition "${transition}" from "${from}" to "${to}"`);
                }
            },
        });

        // Create objects (rigidbodies)
        worldSetup(this.world, this.onPlayer1Goal, this.onPlayer2Goal);

        this.controls = new Controls(this.onControlChange);
        this.opponentControls = new Controls(() => {}, opponentControls);
        
        // Ball will eventually be created once two players join.
        this.ball = addBall(this.world);
        this.player1 = addPlayer(this.world, 1);
        this.player2 = addPlayer(this.world, 2);

        // Prepare sockets
        this.setUpSocketEvents();

        // Socket events are ready, notify the backend that we are ready to receive data.
        this.socket.emit("ready", "what is my player number?");
    };

    setUpSocketEvents() {
        this.socket.on("player-number", (playerNumber) => {
            this.playerNumber = playerNumber;
            console.log(`Player number: ${playerNumber}`);
            this.setUpControls();
            this.setUpControlWorldEvents();
            this.fsm.receiveNumber(playerNumber);
        });

        this.socket.on("countdown", (time) => {
            this.fsm.countdown(time);
        });

        this.socket.on("start", () => {
            this.fsm.start();
        });

        this.socket.on("goal", (playerNumber) => {
            if (playerNumber === 1) {
                this.onPlayer1Goal();
            } else if (playerNumber === 2) {
                this.onPlayer2Goal();
            }
        })
    }

    /* Sets p2 world events to move players at each physics tick*/
    setUpControlWorldEvents() {
        this.world.on('postStep', () => {
            if (this.controls.LEFT) {
                this.player.setVelocity(-30, 0);
            } else if (this.controls.RIGHT) {
                this.player.setVelocity(30, 0);
            } else {
                this.player.setVelocity(0, 0);
            }
            if (this.controls.BOOST) {
                const force = 128 * this.player.bumper.mass;
                this.player.bumper.applyForceLocal([0, force]);
            }
        });

        this.world.on('postStep', () => {
            if (this.opponentControls.LEFT) {
                this.opponent.setVelocity(-30, 0);
            } else if (this.opponentControls.RIGHT) {
                this.opponent.setVelocity(30, 0);
            } else {
                this.opponent.setVelocity(0, 0);
            }
            if (this.opponentControls.BOOST) {
                const force = 128 * this.opponent.bumper.mass;
                this.opponent.bumper.applyForceLocal([0, force]);
            }
        });

        console.log(this.world);
    };

    /* Sets control settings depending on the player number the client is given by the server */
    setUpControls() {
        if (this.playerNumber === 1) {
            this.controls.updateControls(player1DefaultControls);
            this.player = this.player1;
            this.opponent = this.player2;
        } else if (this.playerNumber === 2) {
            this.controls.updateControls(player2DefaultControls);
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

    onPlayer1Goal = () => {
        this.score.player1++;
        console.log("player 1 scored");
    };

    onPlayer2Goal = () => {
        this.score.player2++;
        console.log("player 2 scored");
    };

    onControlChange = (value) => {
        this.socket.emit("control", value);
    };

    // State Machine Methods

    onReceiveNumber(playerNumber) {
        this.playerNumber = playerNumber;
        console.log(`Player number: ${playerNumber}`);
        this.setUpControls();
        this.setUpControlWorldEvents();
    }

    onCountdown(time) {
        this.timer = time;
        while (time > 0) {
            setTimeout(() => this.timer--, time*1000);
            time--;
        }
    }

    onStart() {
        // do nothing
    }
}
