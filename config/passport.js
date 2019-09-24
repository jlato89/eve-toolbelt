const scopes =require('./scopes.js');

module.exports = function(passport, user) {
   const EveOnlineSsoStrategy = require('passport-eveonline-sso').Strategy;

   //* Serialize user
   passport.serializeUser(function(user, done) {
      done(null, user);
   });

   //* Deserialize user
   passport.deserializeUser(function(obj, done) {
      done(null, obj);
   });

   //* EveOnline Login
   passport.use(
      new EveOnlineSsoStrategy(
         {
            clientID: process.env.EVEONLINE_CLIENT_ID,
            clientSecret: process.env.EVEONLINE_SECRET_KEY,
            callbackURL: process.env.EVEONLINE_CALLBACK_URL,
            scope: scopes,
            state: process.env.EVEONLINE_STATE
         },
         function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
               // You could save the tokens to a database and/or call EVE Swaggger Interface (ESI) resources.
               // localStorage.setItem('accessToken', accessToken); //! Doesnt work on server
               // localStorage.setItem('refreshToken', refreshToken);

               console.log('=== New Login ===');
               console.log('accessToken:', accessToken);
               console.log('refreshToken:', refreshToken);
               // console.log('profile:', profile);

               const tokens = {
                  accessToken,
                  refreshToken
               }

               return done(null, profile, tokens);
            });
         }
      )
   );
};