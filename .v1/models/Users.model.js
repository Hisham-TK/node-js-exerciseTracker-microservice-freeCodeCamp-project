const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const Users = mongoose.model('User', usersSchema);

module.exports = Users;
