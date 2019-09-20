const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
require('moment');
require('dotenv').config();

// Assign port and Start Express Server
const PORT = process.env.PORT || 8080;
const app = express();

//Setup BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Setup passport
app.use(
   session({
      secret: 'process.env.PASSPORT_SECRET_KEY',
      resave: true,
      saveUninitialized: true
   })
);
app.use(passport.initialize());
app.use(passport.session());

//Load passport strategies
require('./config/passport.js')(passport);

// Setup Misc
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const db = require('./models');

// Define Routes
require('./routes/api')(app, passport);

// Send every other request to the React app(FOR BUILT APP)
// app.get('*', (req, res) => {
//    res.sendFile(path.join(__dirname, './client/build/index.html'));
// });

app.listen(PORT, function() {
   console.log(
      'Listening on port %s. Visit http://localhost:%s/ in your browser.',
      PORT,
      PORT
   );
});

// // Listen on a specific host via the HOST environment variable
// var host = process.env.HOST || '0.0.0.0';
// // Listen on a specific port via the PORT environment variable
// var port = process.env.PORT || 8080;

// var cors_proxy = require('cors-anywhere');
// cors_proxy.createServer({
//     originWhitelist: [], // Allow all origins
//     requireHeader: ['origin', 'x-requested-with'],
//     removeHeaders: ['cookie', 'cookie2']
// }).listen(port, host, function() {
//     console.log('Running CORS Anywhere on ' + host + ':' + port);
// });

// module.exports = app; //! prob don't need
