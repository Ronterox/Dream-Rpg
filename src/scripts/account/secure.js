const asyncMiddleware = require('./asyncMiddleware');
const UserModel = require('./userModel');
const router = require('express').Router();

const setOkayResponse = (req, res) => res.status(200).json({ 'status': 'ok' });

router.post('/submit-score', asyncMiddleware(async (req, res) =>
{
  const { email, score } = req.body;
  await UserModel.updateOne({ email }, { highScore: score });
  setOkayResponse(req, res);
}));

router.get('/scores', asyncMiddleware(async (req, res) =>
{
  const users = await UserModel.find({}, 'name highScore -_id').sort({ highScore: -1 }).limit(10);
  res.status(200).json(users);
}));

module.exports = router;
