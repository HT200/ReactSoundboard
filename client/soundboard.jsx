const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleAudio = (e) => {
  e.preventDefault();
  // helper.hideError();

  // helper.sendPost(e.target.action, {name, age, type}, loadAudiosFromServer);

  return false;
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
      <label htmlFor="duration">Duration (seconds):</label>
      <input type="number" name="duration" min="0" required />
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
      <button type="submit">Upload Audio File</button>
    </form>
  )
};

const AudioGrid = (audios) => {
  const handleDelete = async (id) => {
    const response = await fetch(`/deleteAudio/${id}`, { method: 'DELETE' });
    if (response.ok) {
      loadAudiosFromServer();
    } else {
      console.error(`Failed to delete audio with id: ${id}`);
    }
  };

  if (audios.length === 0) {
    return (
      <div className="audioGrid">
        <h3 className="emptyAudio">No audio files yet</h3>
      </div>
    );
  }

  return (
    <div className="audioGrid">
      {audios.map((audio) => (
        <div key={audio._id} className="audioItem">
          <h3 className="audioName">Title: {audio.title}</h3>
          <audio controls>
            <source src={`/uploads/${audio._id}`} type={`audio/${audio.fileType || 'mpeg'}`} />
            Your browser does not support the audio element.
          </audio>
          <button onClick={() => handleDelete(audio._id)} className="deleteAudio">Delete</button>
        </div>
      ))}
    </div>
  );
};

const loadAudiosFromServer = async () => {
  const response = await fetch('/getAudios');
  const data = await response.json();
  ReactDOM.render(
    <AudioGrid audios={data} />, 
    document.getElementById('audios')
  );
};

const init = () => {
  ReactDOM.render(
    <AudioForm />, 
    document.getElementById('makeAudio')
  );

  ReactDOM.render(
    <AudioGrid audios={[]} />, 
    document.getElementById('audios')
  );

  loadAudiosFromServer();
}

window.onload = init;