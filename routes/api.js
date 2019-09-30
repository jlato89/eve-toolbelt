const request = require('request');

module.exports = function(app, passport, db) {
   
   //* Grab user Info from DB
   app.get('/api/user', (req, res) => {
      if (!req.user) {
         console.log('SERVER: User not logged in.');
         // res.redirect('/')
      } else {
         // Grab user data from ID of currently logged in user
         const currentUser = req.user.CharacterID;
         db.user.findOne({
            where: {
               characterID: currentUser
            }
         })
         .then((data) => {
            const user = data.dataValues
            res.json({
               characterID: user.characterID,
               characterName: user.characterName,
               accessToken: user.accessToken
            })
         });
      }
   });

   //* Refresh Tokens from EVE AUTH
   app.get('/api/token/:id', (req, res) => {
      const characterID = req.params.id;
      // console.log('ID: ', characterID);

      db.user
         .findOne({
            where: {
               characterID: characterID
            }
         })
         .then(data => {
            const refreshToken = data.refreshToken;
            const rawAuth =
               process.env.EVEONLINE_CLIENT_ID +
               ':' +
               process.env.EVEONLINE_SECRET_KEY;
            // Encode into base64
            const buff = new Buffer.from(rawAuth);
            const auth64 = buff.toString('base64');

            const options = {
               method: 'POST',
               url: 'https://login.eveonline.com/v2/oauth/token',
               headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  Host: 'login.eveonline.com',
                  Authorization: 'Basic ' + auth64
               },
               form: {
                  grant_type: 'refresh_token',
                  refresh_token: refreshToken
               }
            };

            request(options, function(error, response, body) {
               if (error) throw new Error(error);

               // Convert body to JSON
               const data = JSON.parse(body)

               db.user
                  .update(
                     {
                        accessToken: data.access_token,
                        refreshToken: data.refresh_token
                     },
                     {
                        where: {
                           characterID: characterID
                        }
                     }
                  )
                  .then(res => {
                     console.log('DB Records Updated: ', res);
                  })
                  .catch(err => {
                     console.log('DB Error: ', err);
                  });
               });
            res.json(data.accessToken);
         });
   })

   //*  EVE Online Login proccess
   app.get('/auth/eveonline', 
      passport.authenticate('eveonline-sso')
   );

   //* EVE Online Callback
   app.get(
      '/auth/eveonline/callback',
      passport.authenticate('eveonline-sso', {
         session: true,
         failureRedirect: 'http://localhost:3000/error'
      }),
      function(req, res) {
         console.log('~~~ Made it to callback ~~~');
         // console.log('profile: \n', req.user._json);
         
         res.redirect('http://localhost:3000/dashboard');
      }
   );

   //* Logout
   app.get('/logout', function(req, res) {
      req.session.destroy(function(err) {
         res.redirect('/');
      });
   });
};
