const mongoose = require('mongoose');

const exercisesSchema = new mongoose.Schema({
  username: { type: mongoose.Schema.Types.ObjectId },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String },
});

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  count: { type: Number, default: 0 },
  log: { type: [exercisesSchema] },
});

const Users = mongoose.model('User_2', usersSchema);

module.exports = Users;
