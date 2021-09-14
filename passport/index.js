const passport = require('passport');
const local = require('./localStrategy');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    done(null, authData);
  });

  local();
};
