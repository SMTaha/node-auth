var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://127.0.0.1:27017/node-auth');

var db = mongoose.connection;

// User Schema

var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    bcrypt: true
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  profileImage: {
    type: String
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByUsername = function (username, callback) {
  var query = {
    username: username
  };
  User.findOne(query, callback);
}

module.exports.createUser = function (newUser, callback) {
  bcrypt.hash(newUser.password, 10, function (err, hash) {
    if(err) throw err;
    // Set hashed password
    newUser.password = hash;
    // Create User
    newUser.save(callback);
  });
}
