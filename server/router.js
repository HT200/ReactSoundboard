const multer = require('multer');
const controllers = require('./controllers');
const mid = require('./middleware');

const upload = multer({ dest: 'uploads/' });

const router = (app) => {
  app.get('/getAudios', mid.requiresLogin, controllers.Audio.getAudios);
  app.delete('/deleteAudio/:id', mid.requiresLogin, controllers.Audio.deleteAudio);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/soundboard', mid.requiresLogin, controllers.Audio.uploadAudioPage);

  app.get('/uploadAudio', mid.requiresLogin, controllers.Audio.uploadAudioPage);
  app.post('/uploadAudio', mid.requiresLogin, upload.single('audioFile'), controllers.Audio.uploadAudio);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
