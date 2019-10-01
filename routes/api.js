const request = require('request');
const axios = require('axios')
const moment = require('moment')

module.exports = function(app, passport, db) {
   
   //* Grab user Info from DB
   app.get('/api/user', (req, res) => {
      if (!req.user) {
         console.log('SERVER: User not logged in.');
         // res.redirect('/')
      } else {
         const characterID = req.user.CharacterID;
         const characterName = req.user.CharacterName;
         
         res.json({
            characterID,
            characterName
         })
      }
   });

   //* EVE Online Api Data Call
   app.get('/api/eve/:id', (req, res) => {
      const characterID = req.params.id;
      const url = 'https://esi.evetech.net/latest';
      const requests = {
         characterIsk: `/characters/${characterID}/wallet/`,
         characterLocation: `/characters/${characterID}/location/`,
         characterActiveShip: `/characters/${characterID}/ship/`,
         characterUnreadMailCount: `/characters/${characterID}/mail/labels/`,
         characterSkillQueue: `/characters/${characterID}/skillqueue/`
      };
      let results = {};

      // Grab token info
      db.token.findByPk(characterID).then(data => {
         const accessToken = data.dataValues.accessToken;
         const updatedAt = new Date(data.dataValues.updatedAt);
         updatedAt.setMinutes(updatedAt.getMinutes() + 20);
         const tokenExpires = Math.round(new Date(updatedAt).getTime() / 1000);
         const date = Math.round(new Date().getTime()/1000);

         // Check if token needs to be updated before running api call
         if (date > tokenExpires) {
            console.log('Access Token has expired, Please renew it.');
            results.error = 'Token has expired, Please renew it.';
         } else {
            console.log('Token Valid');

            // Start looping through axios calls
            for (const [key, value] of Object.entries(requests)) {
               const queryUrl = url + value;

               // Api call data
               axios(queryUrl, {
                  headers: {
                     Authorization: 'Bearer ' + accessToken
                  }
               })
                  .then(result => {
                     // Result of api call sent to results array
                     results[key] = result.data;
                  })
                  .catch(err => {
                     console.log(`API Error: \nStatus ${err.response.status} \n ${err.response.data.error}`);
                  });
            }
         }
         // res.json(results); //! WORKING but may need to find async/wait solution
         setTimeout(function() {res.json(results);}, 2000); //! Testing purposes ONLY
      })
      .catch(err => {
         throw err
      });
   });


   //* Refresh Tokens from EVE AUTH
   app.get('/api/token/:id', (req, res) => {
      const characterID = req.params.id;

      db.token.findByPk(characterID).then(data => {
            const refreshToken = data.refreshToken;
            const rawAuth = process.env.EVEONLINE_CLIENT_ID+':'+process.env.EVEONLINE_SECRET_KEY;
            const buff = new Buffer.from(rawAuth); // Encode into base64
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
               const data = JSON.parse(body); // Convert body to JSON
               db.token
                  .update(
                     {
                        accessToken: data.access_token,
                        refreshToken: data.refresh_token
                     }, {
                        where: {
                           characterID: characterID
                        }
                     }
                  )
                  .then(res => {
                     console.log('DB Records Updated: ', res);
                  })
                  .catch(err => {
                     throw err;
                  });
            });
      });
      res.json({msg: 'Token updated, Maybe, check logs'});
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
