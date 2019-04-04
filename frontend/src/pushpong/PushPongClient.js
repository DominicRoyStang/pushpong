import io from "socket.io-client";
import StateMachine from 'javascript-state-machine';
import {World} from "p2";
import Controls, {player1DefaultControls, player2DefaultControls, opponentControls} from "./controls";
import {BACKEND_URL} from "config";
import {worldSetup, addBall, addPlayer} from "./worldSetup";

export default class PushPongClient {
    state = {
        status: "waiting",
        player1Score: 0,
        player2Score: 0
    }

    world = new World({gravity: [0, 0]});
    socket = io.connect(BACKEND_URL, {path: "/game-socket"});

    fsm = new StateMachine({
        init: "waiting",
        transitions: [
            {name: "receive-number", from: "created", to: "waiting"},
        ],
        methods: {
            onEnterState: (lifecycle) => console.log(`Enter State: ${lifecycle.to}`) 
        }
    });

    constructor() {
        // create objects
        worldSetup(this.world, this.onPlayer1Goal, this.onPlayer2Goal);
        
        // Ball will eventually be created once two players join.
        this.ball = addBall(this.world);
        const player1 = addPlayer(this.world, 1);
        const player2 = addPlayer(this.world, 2);

        this.controls = new Controls(this.onControlChange);
        this.opponentControls = new Controls(() => {}, opponentControls);

        // Prepare sockets
        this.socket.on("player-number", (playerNumber) => {
            console.log(`Player number: ${playerNumber}`);
            this.playerNumber = playerNumber;
            this.setUpControls(player1, player2);
            this.setUpControlWorldEvents();
        });
        this.socket.emit("player", "what is my player number?");
    };

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
    setUpControls(player1, player2) {
        if (this.playerNumber === 1) {
            this.controls.updateControls(player1DefaultControls);
            this.player = player1;
            this.opponent = player2;
        } else if (this.playerNumber === 2) {
            this.controls.updateControls(player2DefaultControls);
            this.player = player2;
            this.opponent = player1;
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
        this.state.player1Score++;
        console.log("player 1 scored");
    };

    onPlayer2Goal = () => {
        this.state.player2Score++;
        console.log("player 2 scored");
    };

    onControlChange = (value) => {
        this.socket.emit("control", value);
    };
}
