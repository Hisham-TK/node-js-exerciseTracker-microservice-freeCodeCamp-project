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

usersRouter
  // Find all user logs
  .get('/:userId/logs', async (req, res) => {
    const { userId } = req.params;
    const { from, to, limit } = req.query;

    const exercises_pipelines = [
      {
        $match: {
          username: mongoose.Types.ObjectId(userId),
          // expr: { $eq: ['$$userId', '$username'] },
        },
      },
      {
        $project: {
          date: 1,
          description: 1,
          duration: 1,
        },
      },
    ];

    // Handle filter by dates
    if (from && to) exercises_pipelines[0]['$match'].date = { $gte: new Date(to), $lte: new Date(from) };
    else if (from) exercises_pipelines[0]['$match'].date = { $gte: new Date(from) };
    else if (to) exercises_pipelines[0]['$match'].date = { $lte: new Date(to) };

    // Limit results
    if (limit) exercises_pipelines.push({ $limit: limit });

    const user_pipelines = [
      {
        $match: {
          _id: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'exercises',
          // localField: '_id',
          // foreignField: 'username',
          // let: { userId: '$_id' },
          pipeline: exercises_pipelines,
          as: 'log',
        },
      },
      {
        $set: {
          count: { $size: '$log' },
        },
      },
    ];

    const result = await Users.aggregate(user_pipelines);
    res.json(result[0]);
  });

//   .get('/:userId/logs', async (req, res) => {
//     const { userId } = req.params;
//     const { from, to, limit } = req.query;

//     const aggregation_pipelines = [
//       {
//         $match: {
//           _id: mongoose.Types.ObjectId(userId),
//         },
//       },
//       {
//         $lookup: {
//           from: 'exercises',
//           localField: '_id',
//           foreignField: 'username',
//           as: 'log',
//         },
//       },
//     ];

//     if (from || to || limit) {
//       aggregation_pipelines.push({
//         $unwind: {
//           path: '$log',
//         },
//       });

//       if (limit)
//         aggregation_pipelines.push({
//           $limit: 1.0,
//         });

//       if (from && to)
//         aggregation_pipelines.push({
//           $match: {
//             'log.date': {
//               // $gte: new Date(from),
//               // $lte: new Date(to),
//               $gte: new Date(to),
//               $lte: new Date(from),
//             },
//           },
//         });
//       else if (from)
//         aggregation_pipelines.push({
//           $match: {
//             'log.date': {
//               $gte: new Date(from),
//             },
//           },
//         });
//       else if (to)
//         aggregation_pipelines.push({
//           $match: {
//             'log.date': {
//               $lte: new Date(to),
//             },
//           },
//         });

//       //  Group all unwind logs
//       aggregation_pipelines.push({
//         $group: {
//           _id: '$_id',
//           username: {
//             $first: '$username',
//           },
//           count: {
//             $sum: 1.0,
//           },
//           log: {
//             $push: '$log',
//           },
//         },
//       });
//     } else {
//         // For non parametrized requests

//     }

//     const userExercises = await Users.aggregate(aggregation_pipelines);

//     res.json(userExercises);
//   });

module.exports = usersRouter;
