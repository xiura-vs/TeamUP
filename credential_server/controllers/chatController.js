const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");

/**
 * SEND MESSAGE (REST + REALTIME)
 */
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, text } = req.body;

    if (!senderId || !receiverId || !text?.trim()) {
      return res.status(400).json({ message: "Missing data" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: senderId,
      receiver: receiverId,
      text,
      seen: false,
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    const io = req.app.get("io");
    if (io) {
      io.to(receiverId).emit("receiveMessage", message);
      io.to(senderId).emit("receiveMessage", message);
      io.to(receiverId).emit("inboxUpdate", {
        conversationId: conversation._id,
        lastMessage: message,
      });
    }

    res.status(201).json({ message });
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/**
 * GET MESSAGES FOR A CONVERSATION
 */
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({
      conversation: conversationId,
    }).sort({ createdAt: 1 });

    res.json({ messages });
  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

/**
 * GET INBOX (LEFT PANEL)
 */
exports.getInbox = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender receiver",
          select: "fullName college",
        },
      })
      .populate("participants", "fullName college gender")
      .sort({ updatedAt: -1 });

    const inbox = conversations.map((conv) => {
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== userId,
      );

      return {
        conversationId: conv._id,
        user: otherUser,
        lastMessage: conv.lastMessage?.text || "",
        lastMessageAt: conv.updatedAt,
        unread:
          conv.lastMessage &&
          !conv.lastMessage.seen &&
          conv.lastMessage.receiver?.toString() === userId,
      };
    });

    res.json({ inbox });
  } catch (err) {
    console.error("GET INBOX ERROR:", err);
    res.status(500).json({ message: "Failed to load inbox" });
  }
};

/**
 * MARK MESSAGES AS READ
 */
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: userId,
        seen: false,
      },
      { seen: true },
    );

    res.json({ success: true });
  } catch (err) {
    console.error("MARK AS READ ERROR:", err);
    res.status(500).json({ message: "Failed to update read status" });
  }
};

/**
 * GET CONVERSATIONS (OPTIONAL API)
 */
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "fullName college")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json({ conversations });
  } catch (err) {
    console.error("GET CONVERSATIONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

/**
 * AUTH MIDDLEWARE
 */
module.exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Token invalid" });
  }
};

exports.getOrCreateConversation = async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.params;

  let conversation = await Conversation.findOne({
    participants: { $all: [userId, otherUserId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, otherUserId],
    });
  }

  res.json({ conversationId: conversation._id });
};
