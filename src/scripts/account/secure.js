const router = require('express').Router();

const setOkayResponse = (req, res) => res.status(200).json({ 'status': 'ok' });

const setGetUrls = (...urls) => urls.forEach(url => router.get(url, setOkayResponse));
const setPostUrls = (...urls) => urls.forEach(url => router.post(url, setOkayResponse));

setGetUrls('/scores');
setPostUrls('/submit-score');

module.exports = router;
