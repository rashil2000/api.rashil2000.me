const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  github: {
    type: String,
    required: true
  },
  preview: {
    type: String
  }
});

module.exports = mongoose.model('Project', projectSchema);