// Importing required modules
const fs = require('fs');
const Audio = require('../models/Audio.js');

// Controller for adding a new audio file
exports.uploadAudio = async (req, res) => {
  try {
    const { title, duration, fileType } = req.body;

    // Creating an audio object
    const newAudio = new Audio({
      title,
      duration,
      fileType,
      filePath: req.file.path,
      owner: req.session.account._id,
    });

    // Saving the new audio file to the database
    const savedAudio = await newAudio.save();
    res.status(201).json(savedAudio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Render the upload audio page
exports.uploadAudioPage = (req, res) => res.render('app');

// Controller for deleting an audio file
exports.deleteAudio = async (req, res) => {
  try {
    const audioId = req.params.id;
    const ownerId = req.session.account._id;

    // Finding and deleting the audio file from the database
    const deletedAudio = await Audio.findOneAndDelete({ _id: audioId, owner: ownerId });

    // If the audio file is not found, return an error message
    if (!deletedAudio) {
      return res.status(404).json({ error: 'Audio file not found!' });
    }

    // Deleting the audio file from the file system
    fs.unlinkSync(deletedAudio.filePath);

    return res.status(200).json({ message: 'Audio file deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting audio!' });
  }
};

// Controller for retrieving all audio files
exports.getAudios = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };

    // Finding all audio files owned by the current user
    const audios = await Audio.find(query);

    return res.json({ audios });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error retrieving audio files!' });
  }
};
