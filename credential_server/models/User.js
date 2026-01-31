const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    college: { type: String, required: true, trim: true },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary", "prefer-not-to-say"],
      default: "prefer-not-to-say",
    },
    password: { type: String, required: true },
    bio: {
      type: String,
      maxlength: 120,
      trim: true,
    },
    skills: { type: [String], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
