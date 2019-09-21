const fs = require('fs')
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
         const code = req.query.code;
         const state = req.query.state;
         console.log('~~~ Made it to callback ~~~');
         console.log('Auth Code:\n',code);
         console.log('state:\n',state);
         console.log('orginalState:\n', process.env.EVEONLINE_STATE);


         // if (state === process.env.EVEONLINE_STATE) {
         //    console.log('States Match!');
         //    // insert DB Data here or in passport.js
         // } else {
         //    console.log('Staes DO NOT Match!!! Rejecting info');
         //    // Reject info and re-request
         // }
         res.redirect('http://localhost:3000/dashboard');
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
