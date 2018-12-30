// If the BACKEND values aren't set, this means we are running in development mode locally.
// Otherwise, they are substituded by the production Node server into the root index.html.
if (window.BACKEND_HOST === "__BACKEND_HOST__") {
    window.BACKEND_HOST = "localhost";
}

if (window.BACKEND_PORT === "__BACKEND_PORT__") {
    window.BACKEND_PORT = "5000";
}

if (window.BACKEND_PROTOCOL === "__BACKEND_PROTOCOL__") {
    window.BACKEND_PROTOCOL = "http";
}

if (window.FRONTEND_HOST === "__FRONTEND_HOST__") {
    window.FRONTEND_HOST = "localhost";
}

if (window.FRONTEND_PORT === "__FRONTEND_PORT__") {
    window.FRONTEND_PORT = "3000";
}

if (window.FRONTEND_PROTOCOL === "__FRONTEND_PROTOCOL__") {
    window.FRONTEND_PROTOCOL = "http";
}

let BACKEND_URL = `${window.BACKEND_PROTOCOL}://${window.BACKEND_HOST}`;
let FRONTEND_URL = `${window.FRONTEND_PROTOCOL}://${window.FRONTEND_HOST}`;

if (window.BACKEND_PORT !== "80" && window.BACKEND_PORT !== "443") {
    BACKEND_URL = `${BACKEND_URL}:${window.BACKEND_PORT}`;
}

if (window.FRONTEND_PORT !== "80" && window.FRONTEND_PORT !== "443") {
    FRONTEND_URL = `${FRONTEND_URL}:${window.FRONTEND_PORT}`;
}

export {
    BACKEND_URL,
    FRONTEND_URL
};