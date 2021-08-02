const passport = require('passport');
const UserModel = require('./userModel');
const JWTstrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;

// handle user registration
passport.use('signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) =>
{
  try
  {
    const { name } = req.body;
    const user = await UserModel.create({ email, password, name });
    return done(null, user);
  }
  catch (error)
  {
    done(error);
  }
}));

// handle user login
passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) =>
{
  try
  {
    const user = await UserModel.findOne({ email });
    if (!user) return done(null, false, { message: 'User not found' });
    return await user.isValidPassword(password) ? done(null, user, { message: 'Logged in Successfully' }) : done(null, false, { message: 'Wrong Password' });
  }
  catch (error)
  {
    return done(error);
  }
}));

// verify token is valid
passport.use('jwt', new JWTstrategy({
  secretOrKey: 'top_secret',
  jwtFromRequest: function (req)
  {
    return req && req.cookies ? req.cookies['jwt'] : null;
  }
}, async (token, done) =>
{
  try
  {
    return done(null, token.user);
  }
  catch (error)
  {
    done(error);
  }
}));

module.exports = passport;
