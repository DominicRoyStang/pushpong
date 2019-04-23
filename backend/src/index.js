const app = require("./app");
const Match = require("./match");
const {normalizePort, onError, onListening} = require("utils/server");
const logger = require("utils/logger");

let matches = []; // TODO: use a linkedlist instead (yallist)

const main = () => {
    const port = normalizePort(process.env.PORT || 5000);

    const server = app.listen(port);
    server.on("error", onError(port));
    server.on("listening", onListening(server));

    // Socket setup
    const socketIO = require("socket.io");
    const options = {
        origins: "*:*",
        path: "/game-socket",
        pingTimeout: 60000,  // Terminate connection after one minute without ping response.
        pingInterval: 4000  // Ping the player every 4 seconds.
    };
    const io = socketIO(server, options);

    // Player connection and match handling
    io.on("connection", (socket) => {
        // Use the socket id to identify the player.
        const playerId = socket.id;
        console.log(`Connection! Player id: ${playerId}`);

        // Create a match and a socket.io room for the match.
        const match = joinMatch(playerId);
        socket.join(match.id);

        const pingMilliseconds = 0;
        socket.emit("ping");
        const lastPingTimeMilliseconds = Date.now();
        socket.on("pong", () => {
            pingMilliseconds = Date.now() - lastPingTimeMilliseconds;
            setTimeout(() => { // ping every 4 seconds.
                socket.emit("ping");
                lastPingTimeMilliseconds = Date.now();
            }, 4000);
        });

        // When the player is ready, emit its player number.
        socket.on("ready", () => {
            if (match.player1 && match.player1.id === playerId) {
                socket.emit("player-number", 1);
            } else if (match.player2 && match.player2.id === playerId) {
                socket.emit("player-number", 2);
            }

            match.fsm.ready();

            if (match.fsm.is("countdown")) {
                // Countdown
                const countdownTimeSeconds = 5;
                io.in(match.id).emit("countdown", countdownTimeSeconds);
                logger.info({message: "countdown started", match: match.id});
    
                // Start (asynchronously) when timer ends
                setTimeout(() => {
                    if (match.fsm.cannot("start")) {
                        // Player probably disconnected so state changed during countdown
                        return;
                    }
                    match.fsm.start();
                    io.in(match.id).emit("start", "opponent forfeit");
                    logger.info({message: "match started", match: match.id});
                }, countdownTimeSeconds*1000);
            }
        });

        socket.on("goal", (data) => {
            if (!match.host || playerId !== match.host.id) {
                return;
            }

            const player = match.getPlayerByNumber(data.player);
            player.points += 1;
            io.in(match.id).emit("goal", match.getScore());
            logger.info({message: `goal scored by: ${data.player}`, match: match.id});

            if (player.points >= 7) {
                match.fsm.end();
                io.in(match.id).emit("end", "max score");
            }
        });

        // When a player sends their controls, forward the message to all other players in the room.
        socket.on("control", (data) => {
            socket.to(match.id).emit("opponent-control", data);
            logger.silly({message: `${playerId} control: ${data}`, match: match.id});
        });

        socket.on("snapshot", (data) => {
            if (!match.host || playerId !== match.host.id) { // Don't send ball position if not host
                data = {player: data.player};
            }
            data.ping = pingMilliseconds;
            socket.to(match.id).emit("snapshot", data);
            logger.info({message: `${playerId} snapshot.`, match: match.id});
        });

        // When a player disconnects, remove him from the room
        socket.on("disconnect", () => {
            logger.info({message: `${playerId} has disconnected.`, match: match.id});
            match.removePlayer(playerId);

            match.fsm.leave();
            
            io.in(match.id).emit("opponent-disconnect");
        });
    });
}

const joinMatch = (playerId) => {
    // try to join a match
    for(let i = 0; i < matches.length; i++) {
        const match = matches[i]
        if (match.fsm.is("empty")) {
            // empty match found, delete match
            matches.splice(i, 1);
            i--;
        } else if (match.fsm.is("waiting")) {
            match.addPlayer(playerId);
            return match;
        }
    }

    // no match found, create one
    const match = new Match();
    match.addPlayer(playerId);
    matches.push(match);
    return match;
}

setInterval(() => {logger.silly("Number of matches: " + matches.length)}, 10000);

main();
