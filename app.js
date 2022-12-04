const express = require('express');
const mongodb = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 8000;

//Database connection
let db;

const url = process.env.DATABASE_URL;
const dbConn = mongodb.MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

dbConn.then(function (client) {
  db = client.db();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
  console.log('Database Connected!');
});

//serve static files in the public folder
app.use(express.static(path.resolve(__dirname, 'public')));

//read the body of incoming JSON/form object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const wrap =
  (fn) =>
  (...args) =>
    fn(...args).catch(args[2]);

//@Get Users
app.get(
  '/',
  wrap((req, res) => {
    db.collection('users')
      .find({})
      .toArray()
      .then(function (users) {
        res.status(200).json(users);
      });
  })
);

//@Create Users
app.post('/api/users', function (req, res) {
  db.collection('users')
    .insertOne(req.body)
    .then((result) => {
      if (result) {
        res.status(201).json(result);
        console.log('Document inserted successfully');
      } else {
        throw new Error('User could not be created');
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//The form-handler is typically a file on the server with a script for
//processing input data.

module.exports = app;
