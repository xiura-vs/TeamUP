const express = require("express");
const router = express.Router();

const { matchTeammates, authMiddleware} = require("../controllers/matchController");

router.post("/", authMiddleware, matchTeammates);

module.exports = router;
