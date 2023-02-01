const express = require('express');
const mongoose = require('mongoose');

const Users = require('../models/Users.model');

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

// Find user, and him all exercises
usersRouter.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = await Users.findById(userId);
  res.json(user);
});

// Find all user logs
usersRouter.get('/:userId/logs', async (req, res) => {
  const { userId } = req.params;
  const { from, to, limit } = req.query;

  const foundUser = await Users.findById(userId);
  res.json(foundUser);
});

// Create a new exercises
usersRouter.post('/:userId/exercises', async (req, res) => {
  const { userId } = req.params;
  const foundUser = await Users.findById(userId);
  const { date, description, duration } = req.body;

  if (!foundUser) return res.status(400).json({ error: "Can't found a user with id:" + userId });

  foundUser.count += 1;
  foundUser.log.push({
    description,
    duration: +duration,
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
  });
  const userWithExercises = await foundUser.save();
  const createdExercise = userWithExercises.log[userWithExercises.log.length - 1].toJSON();

  res.json({
    _id: userWithExercises._id,
    username: userWithExercises.username,
    description: createdExercise.description,
    duration: createdExercise.duration,
    date: createdExercise.date,
  });
});

module.exports = usersRouter;
