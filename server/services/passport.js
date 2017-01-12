const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const LocalStrategy = require('passport-local');

// need to tel local strategy what to use.
const localOptions={ usernameField: 'email'};
// I will post an email and password for login - the password is handled automatically, we need to tell it when you want to get access to the username look at the email property of the request

const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  // Verify this username and password, cal done with the user if it is the correct username and password otherwise call done with false
  User.findOne({email: email}), function(err, user) {
    if (error) { return done(err);}
    if (!user) { return done(null, false;
    }

    // compare passwords - isthis password correct?
    // we need to somehow decrypt and compare to plain text!!
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }
      // False means no we didn't find a user

      return done(null, user);

    })
  });

})

// Setup option for JWT strategy
// 1) We are expecting that thi sJWT strategy is somehow going to get access to the JWT on the REQUEST
// However aJWT token can sit ANYWHERE (body, URL? headers?) - we need to tell the strategy where to look! pass it from request...
// In this case, you must look at a header and specifically the header authorization
// Also we do not magically have a payload, so we also tell it the secret to decode the token
const jwtOptions  = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};


// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // Done is a function we need to call depending on whether we can authenticate user
  // We want to see if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // Otherwise call done without a user object
  // If we successfully find a user with the id then we pass it to the done callback - we founda  user it's valid great you're allowed to have access. Otherwise call done with nothing
  // on payload we have sub which has ID
  User.findById(payload.sub, function(err, user){
    if(err) {return done(err, false);}
    if (user){
      done(null, user);  // User is authenticated, no error, here is the user
    }
    else{
      done(null, false); // User is not authenticated - no errors = null, but false because no user found
    }

  });

});

// Tell passport to use this strategy strategy
passport.use(jwtLogin);
passport.use(localLogin);
