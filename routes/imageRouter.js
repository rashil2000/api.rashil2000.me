var fs = require('fs');
const express = require('express');
const multer = require('multer');

const authenticate = require('../authenticate');
const cors = require('../cors');

const uploadRouter = express.Router();

uploadRouter.use(express.json());

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      var dir = 'public/images/' + req.query.location;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, file.originalname)
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
      return cb(new Error('You can upload only image files!'), false);
    cb(null, true);
  }
});


/**
 * @swagger
 * path:
 *  /image-upload:
 *    post:
 *      summary: Posts an image that can be served
 *      tags: [Images]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/authParam'
 *        - in: query
 *          name: location
 *          required: true
 *          schema:
 *            type: string
 *          description: The location where the image would be stored.
 *          examples:
 *            blogs:
 *              summary: "Folder: 'blogs', Sub-folder: 'first-blog'"
 *              value: blogs%2Ffirst-blog
 *            projects:
 *              summary: "Folder: 'projects', Sub-folder 'first-project'"
 *              value: blogs%2Ffirst-project
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                imageFile:
 *                  type: string
 *                  format: binary
 *      responses:
 *        "200":
 *          description: The posted image details.
 */

uploadRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, authenticate.verifyUser, upload.single('imageFile'), (req, res) => res.status(200).json(req.file));

module.exports = uploadRouter;
