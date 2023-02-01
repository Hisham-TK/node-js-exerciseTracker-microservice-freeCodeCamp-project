const mongoose = require('mongoose');

const exercisesSchema = new mongoose.Schema({
  username: { type: mongoose.Schema.Types.ObjectId },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Exercises = mongoose.model('Exercises', exercisesSchema);

module.exports = Exercises;
