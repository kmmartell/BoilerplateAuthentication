const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user){
  //1st arg - what we want to code
  //2nd arg - how we will encrypt it
  // sub is a json convention - sub means the subject, the subject of the token is this very specific user
  // we will also add on a timestamp
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next){
  // user has already had their email and password auth'd we just need to give them a token
  // we just need the user id - the done callback we have called before has been called -- passport automatically puts req.user !!!
  res.send({ token: tokenForUser(req.user) });


}

exports.signup = function (req, res, next){
  // See if a user with a given email exists
  // FOR POST REQUEST req.body!!!
  // FOR ACTUAL JSON YOU nEED double QUOTES AROUND BOTH KEY AND VALUE!

  const email = req.body.email;
  const password = req.body.password;

  // If a user with email does exist, return an error
  User.findOne({ email: email }, function(err, existingUser){
    if (err){
      return next(err);
    }
    if (existingUser){
      return res.status(422).send({error:'Email is in user'});
    }
    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      passsword: password
    });

    user.save(function(err){
      if (error) { return next(err);}


      res.json({ token: tokenForUser(user)});
    }); //actually saves the record

      // Respond to request indicating user was created

  });



}

// Read in a user and check to see if it exists, if does not exist then save record and response that user has succesullf corrected
