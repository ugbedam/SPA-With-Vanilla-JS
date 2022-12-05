require('dotenv').config();
const express = require('express');
const { dbConnection, getDB } = require('./db');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const usersRouter = require('./routes/routes');
const fse = require('fs-extra');
const app = express();

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

global.db;
//database connection
dbConnection((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
    db = getDB();
  }
});

//ensure public/uploaded-photos folder exist
fse.ensureDirSync(path.join('public', 'uploaded-files'));

//parses any JSON request body
app.use(bodyParser.json());
//parser url-encoded request bodies/form data in the request body
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());
app.use('/api/users', usersRouter);

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

//setup for view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

//home page route
app.get('/', function (req, res) {
  res.status(200).render('index', { title: 'Single Page App' });
});
