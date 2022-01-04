const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy, 
ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../model/user');


passport.use(new LocalStrategy(
    function(username, password, next) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return next(err); }
        if (!user) return next(null, false);
        user.validatePassword(password, next); //req.user;
      });
    }
));

passport.use(
    new JwtStrategy(
      {
        secretOrKey: process.env.SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (payload, next) => {
        try {
          let user = await User.findById(payload.subject);
          if (user) {
            return next(null, user);
          }
          return next(null, false);
        } catch (error) {
          console.log(error);
          return next(error, false);
        }
      },
    ),
  );

