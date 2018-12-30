const express = require("express");
const bodyParser = require("body-parser");
const {usersController} = require("routes/users");

const API_ROOT = "/api/v1";

// App setup
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(`${API_ROOT}/user`, usersController);

module.exports = app;
