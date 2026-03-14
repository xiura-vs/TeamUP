const mongoose = require('mongoose');

const teamMessageSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TeamMessage', teamMessageSchema);
