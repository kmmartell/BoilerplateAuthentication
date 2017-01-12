const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Schema is what we use to tell mongoose about the fields our model has

// Define our model
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true, required: true},
  password: {type: String, required: true}
});

// On save cook, encrypt password
// Before saving a model run this function - pre save. This is a hook before the user gets saved.
userSchema.pre('save', function(next) {
  const user = this; // Context of this function is the user model.

  // generate a salt- it takes some amount of time, so we will pass a callback function after the salt has been created
  bycrypt.genSalt(10, function(err, salt){
    if (err) { return next(err); }
    // Hash (encrypt) our password using the salt, this gives another callback
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if (err){ return next(err); }
      // Overwrite plain text password with encrypted password - next means go ahead and save the model
      user.password = hash;
      next();
    })
  })
});

//methods says - whenever we create a user object it will have access to any functions on the method property.

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  // this.password is reference to user model
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  }
}


//Create the model class - need to actually use mongoose
const ModelClass = mongoose.model('user', userSchema);
// can be use model though const model


// export the models so other files can use it
module.exports = ModelClass;d
