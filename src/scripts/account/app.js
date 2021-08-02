// reads in our .env file and makes those values available as environment variables
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

//Connect to mongo database
require('mongoose').connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(connection => console.log('Connected to mongo ' + connection), error => console.log('Error: ' + error));

// create an instance of an express app
const app = express();
const path = require('path');
const baseUrl = path.join(__dirname + "/../../public");

// update express settings
app.use(express.urlencoded({ extended: false }), express.json(), cookieParser()); // parse application/x-www-form-urlencoded
// app.use('/', express.static(baseUrl));

app.get('/', (req, res) => res.sendFile(path.join(baseUrl, '/account/login.html')));

function errorHandler(err, req, res, next)
{
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err });
  console.error(err);
}

const pageNotFound = (req, res) => res.status(404).json({ message: '404 - Not Found' });

const securedRoutes = require('./secure');
const routes = require('./main');
const passport = require('./auth');

// main routes
app.use('/', routes, pageNotFound, errorHandler);
app.use(passport.authenticate('jwt', { session: false }), securedRoutes);

// have the server start listening on the provided port
app.listen(process.env.PORT || 3000, () => console.log(`Server started on port ${process.env.PORT || 3000}`));
