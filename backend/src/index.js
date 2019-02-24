const app = require("./app");
const Match = require("./match");
const {normalizePort, onError, onListening} = require("utils/server");

let matches = [];

const main = () => {
    const port = normalizePort(process.env.PORT || 5000);

    const server = app.listen(port);
    server.on("error", onError);
    server.on("listening", onListening(server));

    // socket stuff - to be moved
    const socketIO = require("socket.io");
    const options = {
        origins: "*:*",
        path: "/game-socket"
    };
    const io = socketIO(server, options);

    io.on("connection", (socket) => {
        console.log(`connection !!! id: ${socket.id}`);
        const match = joinMatch(socket.id);
        socket.join(match.id);
        console.log(`Match: ${match.id}`);

        socket.on("player", () => {
            if (match.players[0].id == socket.id) {
                socket.emit("player-number", "1");
            } else {
                socket.emit("player-number", "2");
            }
        });

        socket.on("control", (data) => {
            console.log(data);
            socket.to(match.id).emit("control", data);
        });
    });
}

const joinMatch = (player) => {
    for(let i = 0; i < matches.length; i++) {
        switch(matches[i].status) {
            case Match.EMPTY:
                // empty match found, delete match
                matches.splice(i, 1);
                i--;
                break;
            case Match.WAITING_FOR_PLAYERS:
                matches[i].addPlayer(player);
                return matches[i];
            default:
                break;
        }
    }
    // no match found, create one
    const match = new Match(player);
    matches.push(match);
    return match;
}

main();
