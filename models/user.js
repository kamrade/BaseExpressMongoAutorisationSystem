import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

mongoose.connect('mongodb://localhost/loginapp');
let db = mongoose.connection;

// USER SCHEMA
let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  }
});



let User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      console.log(hash);
      newUser.password = hash;
      newUser.save(callback);
    })
  })
}

module.exports.getUserByUsername = (username, callback) => {
  let query = { username: username};
  User.findOne(query, callback);
}

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) { throw err }
    callback(null, isMatch);
  });
}
