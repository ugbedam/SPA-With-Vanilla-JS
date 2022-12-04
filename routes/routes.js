const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { id } = require('monk');
const multer = require('multer');
const { message } = require('prompt');

//multer storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploaded-files');
  },

  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${Date.now()}-${Math.floor(Math.random() * 1e9)}.${ext}`);
  }
});

const upload = multer({
  storage: multerStorage
});

//@Get all users
router.get('/', function (req, res) {
  let users = [];

  db.collection('users')
    .find() //returns a cursor, a pointer to the result of a db query
    .forEach((user) => users.push(user))
    .then(() => {
      if (!users) {
        throw 'Could not fetch documents';
      }
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//@Create User
router.post('/', upload.single('file'), (req, res) => {
  let filename;

  // req.file is an object created by Multer if a file is loaded
  if (req.file) {
    const ext = req.file.mimetype.split('/')[1];
    filename = `${new Date().toISOString()}-${Math.floor(
      Math.random() * 1e9
    )}.${ext}`;
  }

  req.body.file = filename;
  console.dir(req.body);

  db.collection('users')
    .insertOne(req.body)
    .then((result) => {
      if (!result) throw 'Unable to create user';
      res.status(201).json(result);
      console.log('Document created successfully!');
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//@Get a user
router.get('/:id', getUser, (req, res) => {
  db.collection('users')
    .findOne({ _id: ObjectId(req.id) })
    .then((doc) => {
      if (!doc) throw `Document with id ${req.id} not found`;
      res.status(200).json(doc);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

//@Delete user
router.delete('/:id', getUser, (req, res) => {
  db.collection('users')
    .deleteOne({ _id: ObjectId(req.id) })
    .then((result) => {
      if (result.deletedCount == 0)
        throw `Document with id ${req.id} not found`;
      res.status(200).json({ message: 'Document deleted successfully' });
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

//@Update user
router.patch('/:id', getUser, (req, res) => {
  db.collection('users')
    .updateOne({ _id: ObjectId(req.id) }, { $set: req.body })
    .then((result) => {
      if (result.matchedCount == 0)
        throw `Document with id ${req.id} not found`;
      res.status(200).json({ message: 'Document successfully updated!' });
    })
    .catch((err) => {
      res.status(404).json({ error: err });
    });
});

//Middleware to get user by id
function getUser(req, res, next) {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.status(500).json({ error: 'Document Id not valid' });
    return;
  }
  req.id = id;
  next();
}

module.exports = router;
