const mongoose = require('mongoose');

const exercisesSchema = new mongoose.Schema(
  {
    username: { type: mongoose.Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: {
      type: Date,
      get: (date) => date.toDateString(),
    },
  },
  { toJSON: { getters: true, virtuals: false } }
);

const Exercises = mongoose.model('Exercises', exercisesSchema);

module.exports = Exercises;
