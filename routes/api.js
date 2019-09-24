module.exports = function(app, passport) {
   
   app.get('/user', (req, res) => {
      res.json({
         user: {
            name: 'Josh',
            location: 'Nashville, Tn'
         }
      })
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
         const accessToken = req.authInfo.accessToken;
         const refreshToken = req.authInfo.refreshToken;
         const user = req.user._json;

         const tokens = {
            accessToken,
            refreshToken
         };

         console.log('~~~ Made it to callback ~~~');
         // console.log('accessToken: \n',accessToken);
         // console.log('refreshToken: \n',refreshToken);
         // console.log('User: \n', user);
         console.log('profile: \n', user);

         res.json({
            user
         }); //! trying to pass result to react
         // res.redirect('http://localhost:3000/dashboard');
      }
   );

   // Logout
   app.get('/logout', function(req, res) {
      req.session.destroy(function(err) {
         res.redirect('/');
      });
   });

   //* FUNCTIONS
   function isLoggedIn(req, res, next) {
      if (req.isAuthenticated()) {
         return next();
      }
      res.redirect('/');
   }
};
