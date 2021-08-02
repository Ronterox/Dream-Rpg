const passport = require('./auth');
const express = require('express');
const jwt = require('jsonwebtoken');
const tokenList = {};
const router = express.Router();

const setOkayJson = (res, json) => res.status(200).json(json);
const jwtCookie = 'jwt', jwtRefreshCookie = 'refreshJwt';

router.get('/status', (req, res) => setOkayJson(res, { status: 'ok' }));

router.post('/signup', passport.authenticate('signup', { session: false }),
  async (req, res) => setOkayJson(res, { message: 'signup successful' }));

router.post('/login', async (req, res, next) =>
{
  passport.authenticate('login', async (err, user) =>
  {
    try
    {
      if (err || !user) return next(new Error('An Error occurred'));

      req.login(user, { session: false }, async (error) =>
      {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, 'top_secret', { expiresIn: 300 });
        const refreshToken = jwt.sign({ user: body }, 'top_secret_refresh', { expiresIn: 86400 });

        // store tokens in cookie
        res.cookie(jwtCookie, token);
        res.cookie(jwtRefreshCookie, refreshToken);

        // store tokens in memory
        tokenList[refreshToken] = {
          token,
          refreshToken,
          email: user.email,
          _id: user._id
        };

        //Send back the token to the user
        return setOkayJson(res, { token, refreshToken });
      });
    }
    catch (error)
    {
      return next(error);
    }
  })
});

router.post('/token', (req, res) =>
{
  const { email, refreshToken } = req.body;
  if ((refreshToken in tokenList) && (tokenList[refreshToken].email === email))
  {
    const body = { email, _id: tokenList[refreshToken]._id };
    const token = jwt.sign({ user: body }, 'top_secret', { expiresIn: 300 });
    // update jwt
    res.cookie(jwtCookie, token);
    tokenList[refreshToken].token = token;
    setOkayJson(res, { token });
  }
  else
    res.status(401).json({ message: 'Unauthorized' });
});

router.post('/logout', (req, res) =>
{
  if (req.cookies)
  {
    const refreshToken = req.cookies[jwtRefreshCookie];
    if (refreshToken in tokenList) delete tokenList[refreshToken]
    res.clearCookie(jwtCookie);
    res.clearCookie(jwtRefreshCookie);
  }
  setOkayJson(res, { message: 'logged out' })
});

module.exports = router;
