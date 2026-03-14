const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  email: { type: String, required: true, lowercase: true },
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 }, // 7-day TTL
});

module.exports = mongoose.model('Invite', inviteSchema);
