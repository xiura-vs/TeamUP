const Connection = require("../models/Connections");

exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({
        status: "invalid",
        message: "Cannot connect with yourself",
      });
    }

    const existing = await Connection.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existing) {
      if (existing.status === "pending") {
        return res.status(409).json({
          status: "pending",
          message: "Connection request already sent",
        });
      }

      if (existing.status === "accepted") {
        return res.status(409).json({
          status: "accepted",
          message: "Already connected",
        });
      }

      if (existing.status === "rejected") {
        existing.status = "pending";
        await existing.save();

        return res.status(200).json({
          status: "resent",
          message: "Connection request sent again",
        });
      }
    }

    const reverse = await Connection.findOne({
      sender: receiverId,
      receiver: senderId,
    });

    if (reverse && reverse.status === "pending") {
      return res.status(409).json({
        status: "incoming",
        message: "User has already sent you a request",
      });
    }

    const request = await Connection.create({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    res.status(201).json({
      status: "pending",
      message: "Connection request sent",
      request,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to send request",
    });
  }
};

exports.getRequests = async (req, res) => {
  const userId = req.user.id;

  const requests = await Connection.find({
    receiver: userId,
    status: "pending",
  }).populate("sender", "fullName college");

  res.json({ requests });
};

exports.respondRequest = async (req, res) => {
  const { requestId, action } = req.body;

  if (!["accepted", "rejected"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  const request = await Connection.findById(requestId);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  request.status = action;
  await request.save();

  res.json({ success: true });
};

exports.getConnectionsCount = async (req, res) => {
  const userId = req.user.id;

  const count = await Connection.countDocuments({
    status: "accepted",
    $or: [{ sender: userId }, { receiver: userId }],
  });

  res.json({ count });
};
