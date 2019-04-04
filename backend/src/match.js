const uuidv4 = require("uuid/v4");
const StateMachine = require('javascript-state-machine');
const logger = require("utils/logger");
const {getRandomInArray} = require("utils/math");
const {createLogger, transports} = require("winston");

class Match {
    constructor() {
        this.id = uuidv4();
        this.player1 = null;
        this.player2 = null;
        this.host = null;

        const init = "created";
        const transitions = [
            {name: "ready", from: "created", to: "waiting"},
            {name: "ready", from: "waiting", to: "countdown"},
            {name: "start", from: "countdown", to: "started"},
            {name: "end", from: "started", to: "ended"},
            {name: "leave", from: ["waiting", "created"], to: "empty"},
            {name: "leave", from: "countdown", to: "waiting"},
            {name: "leave", from: "started", to: "ended"},
            {name: "leave", from: "ended", to: () => this.player1 || this.player2 ? "ended" : "empty"}
        ];
        const methods = {
            onEnterState: (lifecycle) => {
                logger.info({message: `Enter State: ${lifecycle.to}`, match: this.id});
            },
            onEnterEmpty: () => {
                this.logMatch();
            },
            onEnterCountdown: () => {
                this.host = getRandomInArray([1, 2]) === 1 ? this.player1 : this.player2;
                logger.info({message: `Selected host: ${this.host.id}`});
            },
            onInvalidTransition: (transition, from, to) => {
                logger.error({message:`Invalid transition "${transition}" from "${from}" to "${to}"`, match: this.id});
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
    }

    addPlayer(id) {
        if (!this.player1) {
            this.player1 = new Player(id);
        } else if (!this.player2) {
            this.player2 = new Player(id);
        }
    }

    getState() {
        return this.fsm.state;
    }

    logMatch() {
        const options = {
            from: new Date() - (60 * 60 * 1000),  //logs from the last hour
            until: new Date(),
            order: "desc"
        }

        logger.query(options, (err, results) => {
            if(err) {
                throw err;
            }
            // grab logs from this match
            const matchLogs = results.file.filter((log) => log.match == this.id);
            // A bit of a hack, but convenient for now: The following creates a new logger.
            // The logger writes all logs from this game to a new log file.
            const matchLogger = createLogger({
                transports: [
                    new transports.File({
                        filename: `logs/matches/${this.id}.log.json`
                    })
                ]
            });
            matchLogger.info(matchLogs);
        });
    }
}

class Player {
    constructor(id) {
        this.id = id;
        this.points = 0;
    }
}

module.exports = Match;