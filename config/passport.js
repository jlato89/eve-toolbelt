const scopes =require('./scopes.js');

module.exports = function(passport, db) {
   const EveOnlineSsoStrategy = require('passport-eveonline-sso').Strategy;

   //* Serialize user
   passport.serializeUser(function(user, done) {
      // assign userID
      // done(null, user.CharacterID);
      done(null, user);
   });

   //* Deserialize user
   passport.deserializeUser(function(obj, done) {
      // assign only character id to session
      // db.user.findOne(
         //    {
            //       where: {
               //          characterID: id
               //       }
               //    },
               //    (err, user) => {
                  //       console.log(user);
                  //       done(err, user);
                  //    }
                  // );

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

               // console.log('=== New Login ===');
               // console.log('accessToken:', accessToken);
               // console.log('refreshToken:', refreshToken);
               // console.log('profile:', profile);
               // console.log('=== End of Login ===');

               //* Add User to DB
               db.user.upsert({
                  characterID: profile.CharacterID,
                  characterName: profile.CharacterName,
                  characterOwnerHash: profile.CharacterOwnerHash,
                  expiresOn: profile.ExpiresOn,
                  scopes: profile.Scopes,
                  tokenType: profile.TokenType
               })
               .then(res => {
                  if (!res) { console.log('User Updated'); }
                  else { console.log('User Created'); }
               });

               //* Add tokens to DB
               db.token.upsert({
                  characterID: profile.CharacterID,
                  accessToken: accessToken,
                  refreshToken: refreshToken
               })
               .then(res => {
                  if (!res) { console.log('Token Updated'); }
                  else { console.log('Token Created'); }
               });
               
               return done(null, profile);
            });
         }
      )
   );
};