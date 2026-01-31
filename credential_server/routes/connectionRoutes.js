const express = require("express");
const router = express.Router();
const {
  sendRequest,
  getRequests,
  respondRequest,
  getConnectionsCount,
} = require("../controllers/connectionController");

const { authMiddleware } = require("../controllers/chatController");

router.post("/send", authMiddleware, sendRequest);
router.get("/requests", authMiddleware, getRequests);
router.post("/respond", authMiddleware, respondRequest);
router.get("/count", authMiddleware, getConnectionsCount);

module.exports = router;
