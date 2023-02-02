const express = require('express');
const mongoose = require('mongoose');

const Users = require('../models/Users.model');
const Exercises = require('../models/Exercises.model');

const usersRouter = express.Router();

usersRouter
  .route('')
  // Create a new user
  .post(async (req, res) => {
    const createdUser = await Users.create({ username: req.body.username });
    res.json(createdUser);
  })
  // Find all users
  .get(async (req, res) => {
    const allUsers = await Users.find({});
    res.json(allUsers);
  });

// Create a new exercises
usersRouter.post('/:userId/exercises', async (req, res) => {
  const { userId } = req.params;
  const { date, description, duration } = req.body;

  const foundUser = await Users.findById(userId);
  if (!foundUser) return res.status(400).json({ error: "Can't found a user with id:" + userId });

  const createdExercise = await Exercises.create({
    username: userId,
    description,
    duration,
    date: date || new Date(),
  });

  return res.json({
    _id: foundUser._id,
    username: foundUser.username,
    description: createdExercise.description,
    duration: createdExercise.duration,
    date: createdExercise.date,
  });
});

// Find all user logs
usersRouter.get('/:userId/logs', async (req, res) => {
  const { userId } = req.params;
  const { from, to, limit } = req.query;

  const foundUser = await Users.findById(userId);
  if (!foundUser) return res.status(400).json({ error: "Can't found a user with id:" + userId });

  // Find query
  const query = { username: foundUser._id };
  if (from && to) query.date = { $gte: from, $lte: to };
  else if (from) query.date = { $gte: from };
  else if (to) query.date = { $lte: to };

  const userExercisesLog = await Exercises.find(query, '-_id -username -__v', { limit });

  res.json({
    _id: foundUser._id,
    username: foundUser.username,
    log: userExercisesLog,
    count: userExercisesLog.length,
  });
});

module.exports = usersRouter;
