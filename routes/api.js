module.exports = function(app, passport) {
   
   // Login
   // app.get('/api/login', function(req, res) {
   //    console.log('made it to /api/login');
   //    res.redirect('http:google.com');
   // });


   //  Login proccess
   app.get('/auth/eveonline', 
      passport.authenticate('eveonline-sso')
   );

   // Callback
   app.get(
      '/auth/eveonline/callback',
      passport.authenticate('eveonline-sso', {
         session: false
         // successRedirect: '/dashboard',
         // failureRedirect: '/error'
      }),
      function(req, res) {
      //    var code = req.query.code;
      //    var state = req.query.state;
      //    console.log('Made it to callback');
      //    console.log(code);
      //    console.log(state);
      //    // Place something here
      res.redirect('/dashboard')
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
