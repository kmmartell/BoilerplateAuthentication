// We will export a function from this file and import it into our index.js file

// To export codein a NodeJS environment we have module.exports

const Authentication = require('./controllers/authentication');
const passportServices = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });

// When a user is authenticated don't try to create a session. By default passport tries to make a cookie session ,but we are using JWT we dont want it to do this

const requireSignin = passport.authenticate('local', { session: false});


module.exports = function(app){
  //We have access to our express app which is the brains of the entire application
  // force everything to go through requireauth middleware!
  app.get('/', requireAuth, function(req, res){
      res.send({'hi':'there'});
  });
  app.post('/signin', requireSignin,  Authentication.signin);
  app.post('/signup', Authentication.signup);
  // This is a very regular way to specify a route
  // On app we call get. This is just an HTTP type.
  // could do app.post
  // The first argument is the route we are trying to handle
  // The function gets called with req, res and next
  // req = request -> represents the incoming http request a bunch of data about the request
  // res = response -> Wheneer we deal with response this is how we do it
  // next is mostly for error handling


}
