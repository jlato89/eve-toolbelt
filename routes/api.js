const request = require('request');
const axios = require('axios');

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
         });
      }
   });

   app.get('/api/test', (req, res) => {
      const rawData = {
         solar_system_id: 30004733,
         structure_id: 1026355025332,
         ship_item_id: 1020527701975,
         ship_name: 'Big Mamma',
         ship_type_id: 28352
      };
      const ids = [];
      const validIds = /character_id|corporation_id|alliance_id|station_id|system_id|constellation_id|region_id|type_id/g;

      for (const [key, value] of Object.entries(rawData)) {

         // Look for all KEYS ending in _id
         if (key.match(/_id/gi)) {

            // now look for specific _id KEYS
            if (key.match(validIds)) {
               ids.push(value)
               console.log('Match: ', key);
            } else {
               console.log('No Match: ', key);
            }
         }
      }
      console.log('Ids to be resolved: ', ids);
      
      axios.post(
         `https://esi.evetech.net/latest/universe/names/`, 
         ids
      )
      .then(data => {
         console.log('api.js DATA:\n', data.data);
         // console.log('axios get values: ', getValues(data.data, 'name'));

         console.log(Object.values(data.data));

         res.json(data.data);
      })
      .catch(err => {
         console.log('api.js ERROR:\n', err.response);
      });
   });

   // Dynamic API data Route
   app.post('/api/data', (req, res) => {
      const dataType = req.body.dataType;
      const characterID = req.body.characterID;
      const endPoint = req.body.endPoint;
      const queryUrl = `https://esi.evetech.net/latest/${dataType}/${characterID}/${endPoint}/`;

      db.token
         .findByPk(characterID)
         .then(data => {
            const accessToken = data.dataValues.accessToken;
            const updatedAt = new Date(data.dataValues.updatedAt);
            updatedAt.setMinutes(updatedAt.getMinutes() + 20);
            const tokenExpires = Math.round(
               new Date(updatedAt).getTime() / 1000
            );
            const date = Math.round(new Date().getTime() / 1000);

            // Check if token needs to be updated before running api call
            if (date > tokenExpires) {
               console.log('Access Token has expired, Please renew it.');
               // results.error = 'Token has expired, Please renew it.';

               // run token refresh route if token is expired
               axios.get(`http://localhost:8080/api/token/${characterID}`);
            } else {
               console.log('Token Valid');

               // Api call data
               axios(queryUrl, {
                  headers: {
                     Authorization: 'Bearer ' + accessToken
                  }
               })
                  .then(result => {
                     let data = result.data;
                     const idCheck = JSON.stringify(data).includes('_id');

                     // Check if any IDs exist in data. 
                     // If so resolve IDs to names using Axios
//////////////////////////////////////////////////////////////!
                     if (idCheck) {
                        console.log('******** ', endPoint, ' endPoint ********');
                        const validIds = /character_id|corporation_id|alliance_id|station_id|system_id|constellation_id|region_id|type_id/g;
                        const ids = [];

                        for (const [key, value] of Object.entries(data)) {
                           // Look for all KEYS ending in _id
                           if (key.match(/_id/gi)) {
                              // now look for specific _id KEYS
                              if (key.match(validIds)) {
                                 ids.push(value);
                                 console.log('Match: ', key);
                              }
                           }
                        }
                        console.log('Ids to be resolved: ', ids);
                        console.log('***********************************');


                        axios
                           .post(
                              `https://esi.evetech.net/latest/universe/names/`,
                              ids
                           )
                           .then(staticData => {
                              const array = staticData.data;
                              const arrayToObject = array =>
                                 array.reduce((obj, item) => {
                                    obj[item.id] = item.name;
                                    return obj;
                                 }, {});
                              const staticDataObj = arrayToObject(array);
                              console.log('arrayToObj Result:\n', staticDataObj);

                              // Send results to React
                              res.json({
                                 data,
                                 staticDataObj
                              });                    
                           })
                           .catch(err => {
                              console.log('api.js ERROR:\n', err.repsonse, '\n', err.response.data);
                              // throw err
                           });

                        // newObj[key] = data
                     } else {
                        res.json(data);
                     }
//////////////////////////////////////////////////////////////!
                  })
                  .catch(err => {
                     console.log(err);
                  });
            }
         })
         .catch(err => {
            throw err;
         });
   })

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
      db.token
         .findByPk(characterID)
         .then(data => {
            const accessToken = data.dataValues.accessToken;
            const updatedAt = new Date(data.dataValues.updatedAt);
               updatedAt.setMinutes(updatedAt.getMinutes() + 20);
            const tokenExpires = Math.round(
               new Date(updatedAt).getTime() / 1000
            );
            const date = Math.round(new Date().getTime() / 1000);

            // Check if token needs to be updated before running api call
            if (date > tokenExpires) {
               console.log('Access Token has expired, Please renew it.');
               results.error = 'Token has expired, Please renew it.';

               // run token refresh route if token is expired
               axios.get(`http://localhost:8080/api/token/${characterID}`);
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
                     console.log(
                        `API Error: \nStatus ${err.response.status} \n ${err.response.data.error}`
                     );
                  });
               }
            }
            setTimeout(function() {res.json(results);}, 2000); //! Testing purposes ONLY
         })
         .catch(err => {
            throw err;
         });
   });

   //* Refresh Tokens from EVE AUTH
   app.get('/api/token/:id', (req, res) => {
      const characterID = req.params.id;

      db.token.findByPk(characterID)
         .then(data => {
            const refreshToken = data.refreshToken;
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
            request(options, function(error, response, body) {
               if (error) throw new Error(error);
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
                  .then(res => {
                     console.log('DB Records Updated: ', res);
                  })
                  .catch(err => {
                     throw err;
                  });
            });
         });
      res.json({ msg: 'Token updated, Maybe, check logs' });
   });

   //*  EVE Online Login proccess
   app.get('/auth/eveonline', passport.authenticate('eveonline-sso'));

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


   // return an array of objects according to key, value, or key and value matching
   function getObjects(obj, key, val) {
      var objects = [];
      for (var i in obj) {
         if (!obj.hasOwnProperty(i)) continue;
         if (typeof obj[i] == 'object') {
               objects = objects.concat(getObjects(obj[i], key, val));    
         } else 
         //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
         if (i == key && obj[i] == val || i == key && val == '') { //
               objects.push(obj);
         } else if (obj[i] == val && key == ''){
               //only add if the object is not already in the array
               if (objects.lastIndexOf(obj) == -1){
                  objects.push(obj);
               }
         }
      }
      return objects;
   }

   function getValues(obj, key) {
      var objects = [];
      for (var i in obj) {
         if (!obj.hasOwnProperty(i)) continue;
         if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
         } else if (i == key) {
            objects.push(obj[i]);
         }
      }
      return objects;
   }
};