const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const UsersModel = mongoose.model('User', usersSchema);

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/exerciseTracker_freeCodeCamp', (err) => {
  if (err) console.error(err);
  console.log('connected successfully to MongoDB');
});

const req = {
  body: {},
  query: {
    // limit: 1,
    // from: '1990-1-4',
    // to: '1990-1-1',
  },
  params: { userId: '63d90569458cb61261e9a101' },
};

async function main() {
  const { userId } = req.params;
  const { from, to, limit } = req.query;

  const aggregation_pipelines = [
    {
      $match: {
        _id: mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: 'exercises',
        localField: '_id',
        foreignField: 'username',
        as: 'log',
      },
    },
  ];

  if (from || to || limit) {
    aggregation_pipelines.push({
      $unwind: {
        path: '$log',
      },
    });

    if (limit)
      aggregation_pipelines.push({
        $limit: 1.0,
      });

    if (from && to)
      aggregation_pipelines.push({
        $match: {
          'log.date': {
            // $gte: new Date(from),
            // $lte: new Date(to),
            $gte: new Date(to),
            $lte: new Date(from),
          },
        },
      });
    else if (from)
      aggregation_pipelines.push({
        $match: {
          'log.date': {
            $gte: new Date(from),
          },
        },
      });
    else if (to)
      aggregation_pipelines.push({
        $match: {
          'log.date': {
            $lte: new Date(to),
          },
        },
      });

    //  Group all unwind logs
    aggregation_pipelines.push({
      $group: {
        _id: '$_id',
        username: {
          $first: '$username',
        },
        count: {
          $sum: 1.0,
        },
        log: {
          $push: '$log',
        },
      },
    });
  }

  const result = await UsersModel.aggregate(aggregation_pipelines);

  console.dir(result, { depth: 3, showHidden: false });
}
main();
