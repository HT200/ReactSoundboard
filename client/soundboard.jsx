const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// Function to handle audio form submission
const handleAudio = async (e) => {
  e.preventDefault();
  console.log(e.target);
  const title = e.target.title.value;
  const fileType = e.target.fileType.value;
  const filePath = e.target.audioFile.value;
  const owner = await getCurrentAccountID();

  try {
    const response = await fetch('/uploadAudio', {
      method: 'POST',
      body: {title, fileType, filePath, owner},
    });

    if (response.ok) {
      await loadAudiosFromServer();
    } else {
      console.error('Failed to upload audio:', response.status);
    }
  } catch (error) {
    console.error('Failed to upload audio:', error);
  }
  return false;
};

const getCurrentAccountID = async () => {
  try {
    const response = await fetch('/getID');
    const data = await response.json();
    const accountID = data.accountID;
    return accountID;
  } catch (error) {
    console.error('Failed to get current account ID:', error);
  }
};

const AudioForm = (props) => {
  return (
    <form id="audioForm" 
          //onSubmit={handleAudio} 
          name="audioForm" 
          action="/uploadAudio" 
          method="POST" 
          enctype="multipart/form-data"
    >
      <label htmlFor="title">Title:</label>
      <input type="text" name="title" required />
      <br/>
      <label htmlFor="fileType">File Type:</label>
      <select name="fileType" required>
        <option value="mp3">MP3</option>
        <option value="wav">WAV</option>
        <option value="ogg">OGG</option>
        <option value="flac">FLAC</option>
      </select>
      <br/>
      <label htmlFor="audioFile">Choose Audio File:</label>
      <input type="file" name="audioFile" accept=".mp3, .wav, .ogg, .flac" required />
      <br/>
      <button type="submit" className='submit'>Upload Audio File</button>
    </form>
  )
};

const AudioGrid = ({audios}) => {
  // Delete audio item
  const handleDelete = async (id) => {
    const response = await fetch(`/deleteAudio/${id}`, { method: 'DELETE' });
    if (response.ok) {
      loadAudiosFromServer();
    } else {
      console.error(`Failed to delete audio with id: ${id}`);
    }
  };

  const getFilePath = (filePath) => {
    return filePath.includes('/') ? filePath.split('/')[1] : filePath.split('\\')[1];
  }

  console.log(audios);

  // If no audio files are available, display a message
  if (audios.length == 0 || audios == null) {
    return (
      <div className="audioGrid">
        <h3 className="emptyAudio">No audio files yet</h3>
      </div>
    );
  }

  // Render audio items
  const AudioNodes = audios.map((audio) => (
    <div key={audio._id} className="audioItem">
      <h3 className="audioName">{audio.title}</h3>
      <audio controls>
        <source src={`/uploads/${getFilePath(audio.filePath)}`} type={`audio/${audio.fileType || 'mpeg'}`} />
        Your browser does not support the audio element.
      </audio>
      <button onClick={() => {document.querySelector('audio').currentTime = 0}} className="resetAudio">Reset</button>
      <button onClick={() => handleDelete(audio._id)} className="deleteAudio">Delete</button>
    </div>
  ))

  return (
    <div className="audioGrid">
      {AudioNodes}
    </div>
  );
};

const getPremium = async () => {
  const response = await fetch('/getPremiumStatus');
  const data = await response.json();
  ReactDOM.render(
    <PremiumToggle premium={data.premium} />, 
    document.getElementById('premium')
  );
};

const handleToggle = async () => {
  try {
    const response = await fetch('/togglePremium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      getPremium();
    } else {
      console.error('Failed to toggle premium status');
    }
  } catch (error) {
    console.error('Error toggling premium status', error);
  }
};

const PremiumToggle = (premium) => {
  return (
    <div>Current premium status: {premium.premium.toString()}</div>
  )
};

const loadAudiosFromServer = async () => {
  const response = await fetch('/getAudios');
  const data = await response.json();
  ReactDOM.render(
    <AudioGrid audios={data.audios} />, 
    document.getElementById('audios')
  );
};

const init = () => {
  const pButton = document.querySelector('#premiumButton');
  pButton.addEventListener('click', (e) => {
    e.preventDefault();
    handleToggle();
    return false;
  });

  ReactDOM.render(
    <AudioForm />, 
    document.getElementById('makeAudio')
  );

  ReactDOM.render(
    <AudioGrid audios={[]} />, 
    document.getElementById('audios')
  );

  loadAudiosFromServer();
  getPremium();
}

window.onload = init;