const express = require('express');
const Exercises = require('../models/Exercises.model');

const exercisesRouter = express.Router();

exercisesRouter
  .route('/:userId/exercises')
  // Find all exercises
  .get(async (req, res) => {
    const allExercises = await Exercises.find({ username: req.params.userId });
    res.json(allExercises);
  })
  // Create a new exercises
  .post(async (req, res) => {
    const createdExercise = await Exercises.create({
      username: req.params.userId,
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date,
    });
    console.log(createdExercise);

    res.json(createdExercise);
  });

module.exports = exercisesRouter;
