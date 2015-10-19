var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');

var strategy = new LocalStrategy(
  {
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, callback) {
    console.log('Got HERE');
    // See if a user already has this email
    User.findOne({ 'local.email' : email }, function(err, user) {
      if (err) return callback(err);
      if (user) {
        // a user with this email already exists
        return callback(null, false, req.flash('error', 'This email is already taken.'));
      }
      else {
        // Create a new user.
        console.log('Creating a new user');
        var newUser = new User();
        newUser.first_name = req.body.first_name;
        newUser.last_name = req.body.last_name;
        newUser.location = req.body.location;
        newUser.local.email = email;
        newUser.local.password = newUser.encrypt(password);

        newUser.save(function(err) {
          return callback(err, newUser);
        });
      }
    });
  }
);

module.exports = strategy;
