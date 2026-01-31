const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  getInbox,
  markAsRead,
  authMiddleware,
  getConversations,
  getOrCreateConversation,
} = require("../controllers/chatController");

router.post("/send", authMiddleware, sendMessage);
router.get("/inbox", authMiddleware, getInbox);
router.get("/conversations", authMiddleware, getConversations);
router.get("/messages/:conversationId", authMiddleware, getMessages);
router.put("/read/:conversationId", authMiddleware, markAsRead);
router.get(
  "/conversation/:otherUserId",
  authMiddleware,
  getOrCreateConversation,
);

module.exports = router;
