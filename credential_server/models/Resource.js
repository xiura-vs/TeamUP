const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resource', resourceSchema);
