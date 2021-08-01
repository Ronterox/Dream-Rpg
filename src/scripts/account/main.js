const asyncMiddleware = require("./asyncMiddleware");
const UserModel = require("./userModel");
const router = require('express').Router();

const setOkayResponse = (req, res) => res.status(200).json({ 'status': 'ok' });

const setGetUrls = (...urls) => urls.forEach(url => router.get(url, setOkayResponse));
const setPostUrls = (...urls) => urls.forEach(url => router.post(url, setOkayResponse));

setGetUrls('/status');
setPostUrls('/login', '/logout', '/token');

router.post('/signup', asyncMiddleware(async (req, res) =>
  {
    const { name, email, password } = req.body;
    await UserModel.create({ email, password, name });
    setOkayResponse(req, res);
  })
);

module.exports = router;
