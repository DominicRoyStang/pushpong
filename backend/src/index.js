const app = require("./app");
const Match = require("./match");
const {normalizePort, onError, onListening} = require("utils/server");

let matches = [];

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
        console.log(match.id);

        // When the player requests a player number, emit its player number.
        socket.on("player", () => {
            if (match.player1.id === playerId) {
                socket.emit("player-number", 1);
            } else if (match.player2.id === playerId) {
                socket.emit("player-number", 2);
            }
        });

        // When a player sends their controls, forward the message to all other players in the room.
        socket.on("control", (data) => {
            console.log(data);
            socket.to(match.id).emit("opponent-control", data);
        });

        // When a player disconnects, remove him from the room
        socket.on("disconnect", () => {
            console.log(`${playerId} has disconnected.`);
            if (match.status === Match.STARTED) {  // if the match was started, set the opponent as winner by forfeit
                match.status = Match.ENDED;
                io.in(match).emit("match-end", "opponent forfeit");
            }
            match.removePlayer(playerId);
        })
    });
}

const joinMatch = (playerId) => {
    // try to join a match
    for(let i = 0; i < matches.length; i++) {
        switch(matches[i].status) {
            case Match.EMPTY:
                // empty match found, delete match
                matches.splice(i, 1);
                i--;
                break;
            case Match.WAITING_FOR_PLAYERS:
                matches[i].addPlayer(playerId);
                return matches[i];
            default:
                break;
        }
    }
    // no match found, create one
    const match = new Match();
    match.addPlayer(playerId);
    matches.push(match);
    return match;
}

const leaveMatch = (playerId) => {

}

main();
