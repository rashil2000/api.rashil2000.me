const fs = require('fs');
const express = require('express');
const multer = require('multer');

const authenticate = require('../authenticate');
const cors = require('../cors');

const assetRouter = express.Router();

assetRouter.use(express.json());

const dirpath = loc => require('path').join('public', loc === undefined ? '' : loc);

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      var dir = dirpath(req.query.location);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, file.originalname)
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(new RegExp(process.env.ASSET_REGEX, 'i')))
      return cb(new Error(`Uploaded files should match ${process.env.ASSET_REGEX}.`), false);
    cb(null, true);
  }
});

assetRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => res.status(200).json(require('directory-tree')(dirpath(req.query.location))))
  .post(cors.corsWithOptions, authenticate.verifyUser, upload.single('uploadedFile'), (req, res) => res.status(200).json(req.file))
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    var dir = dirpath(req.query.location);
    if (fs.existsSync(dir)) {
      fs.rmdirSync(dir, { recursive: true });
      res.status(200).json({ success: true, location: dir })
    } else
      res.status(200).json({ success: false, location: dir })
  });

module.exports = assetRouter;
