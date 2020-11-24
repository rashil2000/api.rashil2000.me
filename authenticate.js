var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var Users = require('./models/users');

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

exports.getToken = user => jwt.sign(user, process.env.SECRET_KEY, { expiresIn: 3600 });

exports.jwtPassport = passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY
}, (jwt_payload, done) => {
  Users.findOne({ _id: jwt_payload._id }, (err, user) => {
    if (err)
      return done(err, false);
    else if (user)
      return done(null, user);
    else
      return done(null, false);
  });
}));

exports.verifyUser = passport.authenticate('jwt', { session: false });
