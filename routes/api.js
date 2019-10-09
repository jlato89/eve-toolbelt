const request = require('request');
const axios = require('axios');

module.exports = function(app, passport, db) {
   //* Grab user Info from DB
   app.get('/api/user', (req, res) => {
      if (!req.user) {
         console.log('SERVER: User not logged in.');
         res.redirect('/');
      } else {
         const characterID = req.user.CharacterID;
         const characterName = req.user.CharacterName;

         res.json({
            characterID,
            characterName
         });
      }
   });

   //* Test Group API
   app.get('/api/test', (req, res) => {
      db.token
         .findByPk(95271542)
         .then(user => {
            const accessToken = user.dataValues.accessToken;
            const updatedAt = new Date(user.dataValues.updatedAt);
               updatedAt.setMinutes(updatedAt.getMinutes() + 20);
            const tokenExpires = Math.round(new Date(updatedAt).getTime() / 1000);
            const date = Math.round(new Date().getTime() / 1000);

            // Check if token needs to be updated before running api call
            if (date > tokenExpires) {
               console.log('Access Token has expired, Renewing');

               // Refresh Token
               axios.get(`http://localhost:8080/api/token/95271542`);
            } else {
               const options = {
                  headers: {
                     Authorization: 'Bearer ' + accessToken
                  }
               };

               axios
                  .all([
                     axios.get(
                        'https://esi.evetech.net/latest/characters/95271542/skillqueue',
                        options
                     ),
                     axios.get(
                        'https://esi.evetech.net/latest/characters/95271542/portrait',
                        options
                     ),
                     axios.get(
                        'https://esi.evetech.net/latest/characters/95271542/wallet',
                        options
                     ),
                     axios.get(
                        'https://esi.evetech.net/latest/characters/95271542/location',
                        options
                     ),
                     axios.get(
                        'https://esi.evetech.net/latest/characters/95271542/ship',
                        options
                     )
                  ])
                  .then(
                     axios.spread(
                        (skillqueue, portrait, wallet, location, ship) => {
                           const data ={
                              skillqueue: skillqueue.data,
                              portrait: portrait.data,
                              wallet: wallet.data,
                              location: location.data,
                              ship: ship.data
                           }
                           res.json(data);
                        }
                     )
                  )
                  .catch(err => console.log(err));
            }
         });
   });

   
   //* Dynamic API data Route
   app.post('/api/data', (req, res) => {
      const dataType = req.body.dataType;          //? Data type requested by React
      const characterID = req.body.characterID;    //? Character Id sent by React
      const endPoint = req.body.endPoint;          //? Data endpoint requested by React
      let queryUrl = `https://esi.evetech.net/latest/${dataType}/${characterID}/${endPoint}/`;
      
      // Check if this is a universe search
      if (dataType == 'universe') {
         const id = req.body.id;    //? Id sent by React
         queryUrl = `https://esi.evetech.net/latest/${dataType}/${endPoint}/${id}/`;
      }
      db.token
         .findByPk(characterID)
         .then(user => {
            const accessToken = user.dataValues.accessToken;
            const updatedAt = new Date(user.dataValues.updatedAt);
               updatedAt.setMinutes(updatedAt.getMinutes() + 20);
            const tokenExpires = Math.round(new Date(updatedAt).getTime() / 1000);
            const date = Math.round(new Date().getTime() / 1000);

            // Check if token needs to be updated before running api call
            if (date > tokenExpires) {
               console.log('Access Token has expired, Renewing');

               // Refresh Token
               axios.get(`http://localhost:8080/api/token/${characterID}`);
            } else {

               // Actual API call
               axios(queryUrl, {
                  headers: {
                     Authorization: 'Bearer ' + accessToken
                  }
               })
                  .then(result => {
                     let data = result.data;
                     console.log(result.config.url);
                     res.json(data);
                  })
                  .catch(err => console.log('Axios Data ERROR:\n', err));
            }
         })
         .catch(err => console.log('DB FindByPK ERROR:\n', err));
   })

   //* Refresh Tokens from EVE AUTH
   app.get('/api/token/:id', (req, res) => {
      const characterID = req.params.id;

      db.token.findByPk(characterID)
         .then(user => {
            const refreshToken = user.refreshToken;
            const rawAuth =
               process.env.EVEONLINE_CLIENT_ID +
               ':' +
               process.env.EVEONLINE_SECRET_KEY;
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
            request(options, function(err, response, body) {
               if (err) {
                  console.log('Token Request ERROR:\n', err);
               }
               const data = JSON.parse(body); // Convert body to JSON
               db.token
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
                  .then(res => console.log('DB Records Updated: ', res))
                  .catch(err => console.log('Token DB Update ERROR:\n', err));
            });
         });
   });


   //*  EVE Online Login proccess
   app.get('/auth/eveonline', passport.authenticate('eveonline-sso'));

   //* EVE Online Callback
   app.get('/auth/eveonline/callback',
      passport.authenticate('eveonline-sso', {
         session: true,
         failureRedirect: 'http://localhost:3000/error',
         successRedirect: 'http://localhost:3000/dashboard'
      })
   );

   //* Logout
   app.get('/logout', function(req, res) {
      req.session.destroy(function(err) {
         res.redirect('/');
      });
   });
};