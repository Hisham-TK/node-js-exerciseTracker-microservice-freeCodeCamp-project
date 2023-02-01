const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
// mongoose.connect('mongodb+srv://dev:MWrIuYllawyPlU6h@cluster0.u15ykwi.mongodb.net/freeCodeCamp?retryWrites=true&w=majority', (err) => {
mongoose.connect('mongodb://192.168.1.14/freeCodeCamp', (err) => {
  if (err) console.error({ err });
  console.log('connected successfully to MongoDB');
});


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

const Users = mongoose.model('User', usersSchema);

const req = {
  body: {},
  query: {
    limit: 1,
    // from: '1990-1-3',
    // to: '1990-1-2',

    // to: '1990-1-3',
    // from: '1990-1-2',
  },
  params: { userId: '63d98cf0de61a4d900870ed2' },
};

async function main() {
  const { userId } = req.params;
  const { limit, from, to } = req.query;
  // await/
  // Users.create({ username: 'Hisham' });
  // const logs_pipeline = [
  //   {
  //     $match: { _id: mongoose.Types.ObjectId(userId) },
  //   },
  // ];

  // //   if (limit || from || to) {
  // //     logs_pipeline.push({ $unwind: '$log' });

  // //     // Handle filter by dates
  // //     if (from && to) logs_pipeline.push({ $match: { date: { $gte: new Date(to), $lte: new Date(from) } } });
  // //     else if (from) logs_pipeline.push({ $match: { date: { $gte: new Date(from) } } });
  // //     else if (to) logs_pipeline.push({ $match: { date: { $lte: new Date(to).toDateString() } } });

  // //     // Limit results
  // //     if (limit) logs_pipeline.push({ $limit: limit });

  // //     logs_pipeline.push({
  // //       $group: {
  // //         _id: '$_id',
  // //         username: { $first: '$username' },
  // //         count: { $sum: 1 },
  // //         log: { $push: '$log' },
  // //       },
  // //     });
  // //   }
  // if (limit || from || to) {
  //   const condition = {};
  //   const projectStage = {
  //     $project: {
  //       log: {
  //         $filter: {
  //           input: '$log',
  //           as: 'logs',
  //           cond: {},
  //         },
  //       },
  //     },
  //   };
  //   console.log(projectStage.$project.log.$filter);
  //   if (limit) projectStage.$project.log.$filter.limit = limit;
  //   // console.log(projectStage);

  //   logs_pipeline.push(projectStage);
  // }

  // const logs_result = await Users.aggregate(logs_pipeline);

  // return logs_result[0];
}

main()
  .then((res) => console.dir(res, { depth: 5, showHidden: false }))
  .catch((err) => console.error(err));
