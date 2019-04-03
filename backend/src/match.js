const uuidv4 = require("uuid/v4");
const StateMachine = require('javascript-state-machine');

class Match {
    constructor() {
        this.id = uuidv4();
        this.player1 = null;
        this.player2 = null;
        const init = "created";
        const transitions = [
            {name: "join", from: "created", to: "waiting"},
            {name: "join", from: "waiting", to: "countdown"},
            {name: "start", from: "countdown", to: "started"},
            {name: "end", from: "started", to: "ended"},
            {name: "leave", from: "waiting", to: "empty"},
            {name: "leave", from: "countdown", to: "waiting"},
            {name: "leave", from: "started", to: "ended"},
            {name: "leave", from: "ended", to: () => this.player1 || this.player2 ? "ended" : "empty"}
        ];
        const methods = {
            onEnterState: (lifecycle) => {
                console.log("Enter:" + lifecycle.to);
            },
            onInvalidTransition: (transition, from, to) => {
                throw new Exception(`Invalid transition ${transition} from ${from} to ${to}`);
            }
        };
        this.fsm = new StateMachine({init, transitions, methods});
    }

    removePlayer(id) {
        if (this.player1 && id === this.player1.id) {
            this.player1 = null;
        } else if (this.player2 && id === this.player2.id) {
            this.player2 = null;
        }

        this.fsm.leave();
    }

    addPlayer(id) {
        if (!this.player1) {
            this.player1 = new Player(id);
        } else if (!this.player2) {
            this.player2 = new Player(id);
        }

        this.fsm.join();
    }

    getState() {
        return this.fsm.state;
    }
}

class Player {
    constructor(id) {
        this.id = id;
        this.points = 0;
    }
}

module.exports = Match;