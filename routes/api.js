module.exports = function(app, passport) {
   
   // Login
   app.get('/api/login', function(req, res) {
      res.redirect('/api/auth/eveonline');
   });

   //  Login proccess
   app.get('/api/auth/eveonline', 
      passport.authenticate('eveonline'), 
      function(req, res) {
         console.log('Made it to /api/auth/eveonline');
         res.status(200).json({
            success: true
         });
      }
   );

   // Callback
   app.get(
      '/api/auth/eveonline/callback',
      passport.authenticate('eveonline', {
         successRedirect: '/',
         failureRedirect: '/api/login'
      }),
      function(req, res) {
         var code = req.query.code;
         var state = req.query.state;
         console.log('Made it to callback');
         console.log(code);
         console.log(state);
         // Place something here
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
