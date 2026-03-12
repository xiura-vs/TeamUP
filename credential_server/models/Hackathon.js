const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, required: true },
  location: { type: String, default: 'Online' },
  country: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  isOnline: { type: Boolean, default: true },
  description: { type: String, default: '' },
  prize: { type: String, default: '' },
  url: { type: String, required: true },
  image: { type: String, default: '' },
  source: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

hackathonSchema.index({ url: 1 }, { unique: true });

module.exports = mongoose.model('Hackathon', hackathonSchema);
