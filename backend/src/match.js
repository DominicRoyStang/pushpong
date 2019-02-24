const uuidv4 = require("uuid/v4");

class Match {
    constructor(id) {
        this.id = uuidv4();
        this.players = [new Player(id)];
        this.status = Match.WAITING_FOR_PLAYERS;
    }

    start() {
        this.status = Match.STARTED;
    }

    removePlayer(id) {
        for(let i = 0; i < this.players.length; i++) {
            if (this.players[i].id == id) {
                this.players.splice(i, 1);
            }
        }
        if (this.players.length === 0) {
            this.status = Match.EMPTY;
        }
    }

    addPlayer(id) {
        this.players.push(new Player(id));
        if (this.players.length === 2) {
            this.start();
        }
    }
}

Match.WAITING_FOR_PLAYERS = "WAITING";
Match.STARTED = "STARTED";
Match.EMPTY = "EMPTY"; // empty matches will get deleted

class Player {
    constructor(id) {
        this.id = id;
        this.points = 0;
    }
}

module.exports = Match;