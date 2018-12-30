const app = require("./app");
const {normalizePort, onError, onListening} = require("utils/server");

const main = () => {
    const port = normalizePort(process.env.PORT || 8080);

    const server = app.listen(port);
    server.on("error", onError);
    server.on("listening", onListening(server));
}

main();