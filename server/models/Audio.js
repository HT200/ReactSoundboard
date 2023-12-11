const mongoose = require('mongoose');

const AudioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: Number,
  fileType: {
    type: String,
    enum: ['mp3', 'wav', 'ogg', 'flac'],
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
});

const Audio = mongoose.model('Audio', AudioSchema);

module.exports = Audio;
