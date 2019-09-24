module.exports = function(app, passport) {
   

   //  Login proccess
   app.get('/auth/eveonline', 
      passport.authenticate('eveonline-sso')
   );

   // Callback
   app.get(
      '/auth/eveonline/callback',
      passport.authenticate('eveonline-sso', {
         session: true,
         failureRedirect: '/error'
      }),
      function(req, res) {
         const accessToken = req.authInfo.accessToken;
         const refreshToken = req.authInfo.refreshToken;
         const user = req.user._json;

         const profile = {
            accessToken: accessToken,
            refreshToken:refreshToken,
            user: user
         }

         console.log('~~~ Made it to callback ~~~');
         // console.log('accessToken: \n',accessToken);
         // console.log('refreshToken: \n',refreshToken);
         // console.log('User: \n', user);
         console.log('profile: \n', profile);


         res.redirect('http://localhost:3000/dashboard', profile);
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
