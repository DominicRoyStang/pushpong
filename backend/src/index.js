const app = require("./app");
const {normalizePort, onError, onListening} = require("utils/server");

const main = () => {
    const port = normalizePort(process.env.PORT || 5000);

    const server = app.listen(port);
    server.on("error", onError);
    server.on("listening", onListening(server));

    // socket stuff - to be moved
    const socketIO = require("socket.io");
    const io = socketIO(server);

    io.on("connection", (socket) => {
        console.log("connection!!!");
        console.log(socket);
    });
}

main();