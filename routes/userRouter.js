var express = require('express');
var passport = require('passport');
var crypto = require("crypto");
var userRouter = express.Router();

var authenticate = require('../authenticate');
var cors = require('../cors');

const cryptoKey = crypto.scryptSync(process.env.SECRET_KEY, 'salt', 24);
const cryptoIv = Buffer.alloc(16, 0);

userRouter.use(express.json());
userRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

/* var Users = require('../models/users');
userRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
  try {
    const users = await Users.find({});
    res.status(200).json(users);
  } catch (err) { next(err); }
});
userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
  Users.register(new Users({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) res.status(500).json({ err });
      else {
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;

        user.save((err, user) => {
          if (err) return res.status(500).json({ err });
          passport.authenticate('local')(req, res, () =>
            res.status(200).json({ success: true, status: 'Registration Successful!' })
          );
        });
      }
    });
}); */


/**
 * @swagger
 * path:
 *  /users/login:
 *    post:
 *      summary: Logs in the user
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *              required:
 *                - username
 *                - password
 *      responses:
 *        "200":
 *          description: Authentication token and encrypted credentials. This token is valid only for 3600 seconds.
 */

userRouter.post('/login', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) res.status(401).json({ success: false, status: 'Login Unsuccessful!', info });

    req.logIn(user, err => {
      if (err) res.status(401).json({ success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!' });

      var token = authenticate.getToken({ _id: req.user._id });
      const cipher = crypto.createCipheriv("aes-192-cbc", cryptoKey, cryptoIv);
      var encrypted = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');
      res.status(200).json({ success: true, status: 'Login Successful!', token, localData: { username: req.body.username, encryptedPassword: encrypted } });
    });
  })(req, res, next);
});


/**
 * @swagger
 * path:
 *  /users/auth-refresh:
 *    post:
 *      summary: Refreshes JWT if it's no longer valid
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                encryptedpassword:
 *                  type: string
 *              required:
 *                - username
 *                - encryptedpassword
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - $ref: '#/components/parameters/authParam'
 *      responses:
 *        "200":
 *          description: The refreshed JWT.
 */

userRouter.post('/auth-refresh', cors.corsWithOptions, (req, res, next) => {
  const decipher = crypto.createDecipheriv("aes-192-cbc", cryptoKey, cryptoIv);
  var decrypted = decipher.update(req.body.encryptedPassword, 'hex', 'utf8') + decipher.final('utf8');

  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      console.log('JWT invalid, logging in again...');
      req.body = { username: req.body.username, password: decrypted };
      passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) res.status(401).json({ success: false, status: 'Refresh Unsuccessful!', refreshStatus: false, info });

        req.logIn(user, err => {
          if (err) res.status(401).json({ success: false, status: 'Refresh Unsuccessful!', refreshStatus: false, err: 'Could not refresh log in!' });

          var token = authenticate.getToken({ _id: req.user._id });
          res.status(200).json({ success: true, status: 'Refresh Successful!', refreshStatus: true, token });
        });
      })(req, res, next);
    } else
      return res.status(200).json({ success: true, status: 'JWT valid!', refreshStatus: false, user });
  })(req, res);
});

module.exports = userRouter;
