import StateMachine from 'javascript-state-machine';
import {World} from "p2";
import Controls, {player1LocalControls, player2LocalControls} from "./controls";
import {worldSetup, addBall, resetBall, hideBall, addPlayer, resetPlayer} from "./worldSetup";
import sleep from "utils/sleep";

export default class PushPongLocalGame {
    world = new World({gravity: [0, 0]});

    // Client state setup
    score = {
        player1: 0,
        player2: 0
    };

    constructor() {
        // Create the finite state machine
        this.fsm = new StateMachine({
            init: "countdown",
            transitions: [
                {name: "start", from: "countdown", to: "started"},
                {name: "goal", from: "started", to: () => this.isGameOver() ? "ended" : "started"},
                {name: "end", from: "started", to: "ended"}
            ],
            methods: {
                onEnterState: (lifecycle) => console.log(`Enter State: ${lifecycle.to}`),
                onLeaveCountdown: async (lifecycle) => await this.onCountdown(),
                onEnterStarted: () => this.onStart(),
                onEnterEnded: () => this.onEnd(),
                onBeforeGoal: (lifecycle, newScore) => this.onGoal(newScore),
                onInvalidTransition: (transition, from, to) => {
                    console.log(`Invalid transition "${transition}" from "${from}" to "${to}"`);
                }
            },
        });

        // Create objects (rigidbodies)
        worldSetup(this.world, this.onPlayer1Goal, this.onPlayer2Goal);

        this.player1Controls = new Controls(() => {}, player1LocalControls);
        this.player2Controls = new Controls(() => {}, player2LocalControls);

        this.ball = addBall(this.world);
        this.player1 = addPlayer(this.world, 1);
        this.player2 = addPlayer(this.world, 2);

        //this.setUpControls();
        this.setUpControlWorldEvents();

        this.fsm.start();
    };

    /* Sets p2 world events to move players at each physics tick */
    setUpControlWorldEvents() {
        this.world.on('postStep', () => {
            if (this.player1Controls.LEFT) {
                this.player1.setVelocity([-30, 0]);
            } else if (this.player1Controls.RIGHT) {
                this.player1.setVelocity([30, 0]);
            } else {
                this.player1.setVelocity([0, 0]);
            }
            if (this.player1Controls.BOOST) {
                const force = 128 * this.player1.bumper.mass;
                this.player1.bumper.applyForceLocal([0, force]);
            }
        });

        this.world.on('postStep', () => {
            if (this.player2Controls.LEFT) {
                this.player2.setVelocity([-30, 0]);
            } else if (this.player2Controls.RIGHT) {
                this.player2.setVelocity([30, 0]);
            } else {
                this.player2.setVelocity([0, 0]);
            }
            if (this.player2Controls.BOOST) {
                const force = 128 * this.player2.bumper.mass;
                this.player2.bumper.applyForceLocal([0, force]);
            }
        });
    };

    onKeyUp(e) {
        this.player1Controls.handleKeyUp(e);
        this.player2Controls.handleKeyUp(e);
    }

    onKeyDown(e) {
        this.player1Controls.handleKeyDown(e);
        this.player2Controls.handleKeyDown(e);
    }

    onPlayer1Goal = () => {
        this.score.player1++;
        this.fsm.goal();
    };

    onPlayer2Goal = () => {
        this.score.player2++;
        this.fsm.goal();
    };

    // State Machine Methods

    async onCountdown() {
        this.timer = 3;

        while (this.timer > 0) {
            await sleep(1000);
            this.timer--;
        }
    };

    onStart() {
        resetBall(this.ball);
    };

    onGoal() {
        resetPlayer(this.player1, 1);
        resetPlayer(this.player2, 2);
        resetBall(this.ball);
    };

    isGameOver() {
        return this.score.player1 >= 7 || this.score.player2 >= 7
    }

    onEnd() {
        hideBall(this.ball);
    };
}
