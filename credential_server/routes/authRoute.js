const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  signup,
  login,
  authMiddleware,
  updateProfile,
  getProfile,
  getAllUsers,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.put("/profile", authMiddleware, updateProfile);
router.get("/profile", authMiddleware, getProfile);
router.get("/all-users", authMiddleware, getAllUsers);

router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
