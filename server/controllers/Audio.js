// Importing required modules
const fs = require('fs');
const Audio = require('../models/Audio.js');
const Account = require('../models/Account.js');

// Controller for adding a new audio file
const uploadAudio = async (req, res) => {
  try {
    const { title, fileType } = req.body;

    // Check if the account is premium
    const accountId = req.session.account._id;
    const account = await Account.findById(accountId);

    // If the account is not premium and has already uploaded 3 audio files, reject the upload
    if (!account.premium) {
      const uploadedAudioCount = await Audio.countDocuments({ owner: accountId });
      if (uploadedAudioCount >= 3) {
        return res.status(403).json({ error: 'Free accounts are limited to 3 audio uploads.' });
      }
    }

    // Creating an audio object
    const newAudio = new Audio({
      title,
      fileType,
      filePath: req.file.path,
      owner: req.session.account._id,
    });

    // Saving the new audio file to the database
    const savedAudio = await newAudio.save();
    return res.status(201).json({title: savedAudio.title, fileType: savedAudio.fileType});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Render the upload audio page
const uploadAudioPage = (req, res) => res.render('app');

// Controller for deleting an audio file
const deleteAudio = async (req, res) => {
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
const getAudios = async (req, res) => {
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

module.exports = {
  uploadAudio,
  uploadAudioPage,
  deleteAudio,
  getAudios,
};
