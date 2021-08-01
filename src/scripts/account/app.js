// reads in our .env file and makes those values available as environment variables
require('dotenv').config();
const express = require('express');

const securedRoutes = require('./secure');
const routes = require('./main');

const mongoose = require('mongoose');

// create an instance of an express app
const app = express();
const setErrorMessage = (req, res) => res.status(404).json({ message: '404 - Not Found' });

// update express settings
app.use(express.urlencoded({ extended: false }), express.json()); // parse application/x-www-form-urlencoded

// main routes
app.use('/', routes, securedRoutes, setErrorMessage);

// handle errors
app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err }));

// have the server start listening on the provided port
app.listen(process.env.PORT || 3000, () => console.log(`Server started on port ${process.env.PORT || 3000}`));

mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(connection => console.log('Connected to mongo ' + connection), error => console.log('Error: ' + error));
