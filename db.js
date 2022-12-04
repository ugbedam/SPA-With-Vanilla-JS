//load environment variables from .env into process.env
require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const monk = require('monk');

const url = process.env.DATABASE_URL;

let db;

function dbConnection(cb) {
  MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }) //returns a promise if no cb.
    .then((client) => {
      //interface to interact with the database
      db = client.db();
      console.log('Connected to MongoDb');
      return cb();
    })
    .catch((err) => {
      console.log(err);
      return cb(err);
    });
}

function getDB() {
  return db;
}

module.exports = { dbConnection, getDB };

// async function dbConnection() {
//   try {
//     const client = new MongoClient(url);
//     await client.connect();
//     db = client.db();
//     app.listen(PORT, () => {
//       console.log(`Server listening on port ${PORT}`);
//     });

//     console.log('Database connected!');

//     await listDatabases(client);
//   } catch (error) {
//     console.error('Connection to database failed');
//     process.exit();
//   }
// }

// dbConnection().catch(console.error);

// //get databases list
// async function listDatabases(client) {
//   let dbList = await client.db().admin().listDatabases();
//   console.log('Databases:');
//   dbList.databases.forEach((db) => console.log(` - ${db.name}`));
// }
