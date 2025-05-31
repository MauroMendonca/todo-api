const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: {
    type: [String],
    default: []
  },
  date: {
    type: Date,
    default: null
  },
  done: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Task', taskSchema);