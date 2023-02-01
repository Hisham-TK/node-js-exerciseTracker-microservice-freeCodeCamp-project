const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const Users = mongoose.model('User', usersSchema);

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/exerciseTracker_freeCodeCamp', (err) => {
  if (err) console.error(err);
  console.log('connected successfully to MongoDB');
});

const req = {
  body: {},
  query: {
    // limit: 1,
    // from: '1990-1-3',
    // to: '1990-1-2',
  },
  params: { userId: '63d90569458cb61261e9a101' },
};

async function main() {
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
  ];

  const result = await Users.aggregate(user_pipelines);

  console.dir(result, { depth: 5, showHidden: false });
}
main();
