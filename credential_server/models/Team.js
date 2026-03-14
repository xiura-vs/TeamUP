const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  projectIdea: { type: String, required: true },
  description: { type: String, default: '' },
  requiredSkills: [{ type: String }],
  maxMembers: { type: Number, default: 5 },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Team', teamSchema);
