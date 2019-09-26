module.exports = function(app, passport) {
   
   app.get('/api/user', (req, res) => {
      if (!req.user) {
         console.log('User is NOT logged in!');
         res.redirect('/')
      } else {
         console.log('User is logged in');
         const user = req.user._json;
         // const accessToken = req.authInfo.accessToken;
         // const refreshToken = req.authInfo.refreshToken;
         // console.log('passport user: \n',req.user._json);
         console.log('passport tokens: \n',req.authInfo); //! not able to pass from passport
         res.json({
            // name: 'Josh',
            // location: 'Nashville, Tn',
            user
            // accessToken,
            // refreshToken
         })
      }
   })

   //  Login proccess
   app.get('/auth/eveonline', 
      passport.authenticate('eveonline-sso')
   );

   // Callback
   app.get(
      '/auth/eveonline/callback',
      passport.authenticate('eveonline-sso', {
         session: true,
         // successRedirect: 'http://localhost:3000/dashboard',
         failureRedirect: 'http://localhost:3000/error'
      }),
      function(req, res) {
         console.log('~~~ Made it to callback ~~~');
         // console.log('accessToken: \n',req.authInfo.accessToken);
         // console.log('refreshToken: \n',req.authInfo.refreshToken);
         // console.log('profile: \n', req.user._json);

         res.redirect('http://localhost:3000/dashboard');
      }
   );

   // Logout
   app.get('/logout', function(req, res) {
      req.session.destroy(function(err) {
         res.redirect('/');
      });
   });
};
