const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const multer = require('multer');
const sanitizeHTML = require('sanitize-html');

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

//@Retrieve all users
router.get('/', function (req, res) {
  db.collection('users')
    .find({}) //returns a cursor, a pointer to the result of a db query
    .toArray() //convert BSON data to a format consumable over HTTP
    .then((users) => {
      //An array of users documents
      if (!users) {
        throw 'The requested resource was not found';
      }
      console.log(users.length + ' documents retrieved');
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//@Create User
router.post('/', upload.single('file'), sanitizeForm, (req, res) => {
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
    .insertOne(req.cleanData)
    .then((info) => {
      return db.collection('users').findOne({ _id: ObjectId(info.insertedId) });
    })
    .then((newUser) => {
      if (!newUser) throw 'Unable to create user';
      res.status(201).json(newUser);
      console.log('Document inserted successfully!');
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
      res.sendStatus(204);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

//@Update user
router.patch('/:id', getUser, (req, res) => {
  db.collection('users')
    .updateOne({ _id: ObjectId(req.id) }, { $set: req.body }, { upsert: true })
    .then((result) => {
      console.log(result);
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

function sanitizeForm(req, res, next) {
  if (typeof req.body.first != 'string') req.body.first = '';
  if (typeof req.body.last != 'string') req.body.last = '';
  if (typeof req.body.title != 'string') req.body.title = '';
  if (typeof req.body.website != 'string') req.body.website = '';

  req.cleanData = {
    first: sanitizeHTML(req.body.first.trim(), {
      allowedTags: [],
      allowedAttributes: {}
    }),
    last: sanitizeHTML(req.body.last.trim(), {
      allowedTags: [],
      allowedAttributes: {}
    }),
    title: sanitizeHTML(req.body.title.trim(), {
      allowedTags: [],
      allowedAttributes: {}
    }),
    website: sanitizeHTML(req.body.website.trim(), {
      allowedTags: [],
      allowedAttributes: {}
    })
  };

  next();
}

module.exports = router;
