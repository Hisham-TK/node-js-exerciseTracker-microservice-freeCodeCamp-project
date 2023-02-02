const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

// Init express server
const app = express();

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(require('cors')());

// Serve static assets
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// General log middleware
app.use((req, res, next) => {
  const { ip, method, path, query, body, params, headers } = req;
  console.log({ ip, method, path, query, body, params /* , headers */ });
  next();
});

app.use('/api/users/', require('./routes/users.router'));

function main() {
  // Connect to mongoose
  mongoose.set('strictQuery', false);
  mongoose.connect(process.env.MONGO_URI, (err) => {
    if (err) console.error(err);
    console.log('connected successfully to MongoDB');
  });

  // Stars the server
  const port = parseInt(process.env.PORT || 3000);
  app.listen(port, () => {
    console.log('Server starts on ' + port);
  });
}

main();
