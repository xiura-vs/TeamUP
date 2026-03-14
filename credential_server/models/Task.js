const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  title: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['todo', 'inprogress', 'completed'], default: 'todo' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
