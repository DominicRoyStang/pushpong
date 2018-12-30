
const express = require("express");
const {asyncMiddleware} = require("middleware");
const User = require("./user");

const router = express.Router();

router.get("/", (req, res) => {
    res.send({status: "success"});
});

module.exports = router;
