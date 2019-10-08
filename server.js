const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
require('moment');
require('dotenv').config();


// Assign port and Start Express Server
const PORT = process.env.PORT || 8080;
const app = express();

//Setup BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup passport
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
const db = require('./models');
require('./config/passport.js')(passport, db);

// Setup Misc
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Define Routes
require('./routes/api')(app, passport, db);

// app.get('/', function(req, res) {
//    res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

db.sequelize.sync({ force: false }).then(function() {
   app.listen(PORT, function() {
      console.log(
         '==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.',
         PORT,
         PORT
      );
   });
});
