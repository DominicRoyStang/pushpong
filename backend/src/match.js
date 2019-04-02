const uuidv4 = require("uuid/v4");

const WAITING_FOR_PLAYERS = "WAITING";
const STARTED = "STARTED";
const ENDED = "ENDED";
const EMPTY = "EMPTY"; // empty matches will get deleted

class Match {
    constructor() {
        this.id = uuidv4();
        this.player1 = null; //new Player(id);
        this.player2 = null;
        this.status = WAITING_FOR_PLAYERS;
    }

    removePlayer(id) {
        if (id === this.player1.id) {
            this.player1 = null;
        } else if (id === this.player2.id) {
            this.player2 = null;
        }

        this.updateStatus();
    }

    addPlayer(id) {
        if (!this.player1) {
            this.player1 = new Player(id);
        } else if (!this.player2) {
            this.player2 = new Player(id);
        }

        this.updateStatus();
        console.log(`player 1: ${this.player1}, player2: ${this.player2}, STATUS: ${this.status}`);
    }

    updateStatus() {
        if (!this.player1 && !this.player2) {
            this.status = EMPTY;
        } else if (!this.player1 || !this.player2) {
            this.status = WAITING_FOR_PLAYERS;
        } else if (this.player1 && this.player2) {
            this.status = STARTED;
        }
    }
}

// Append constants to the object so that they can be exported with it and accessible under the Match namespace.
Match.WAITING_FOR_PLAYERS = "WAITING";
Match.STARTED = "STARTED";
Match.ENDED = "ENDED";
Match.EMPTY = "EMPTY"; // empty matches will get deleted

class Player {
    constructor(id) {
        this.id = id;
        this.points = 0;
    }
}

module.exports = Match;