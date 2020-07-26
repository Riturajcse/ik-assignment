const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const config = require('config');
const users = require('./routes/users');
const auth = require('./routes/auth');
const teacher = require('./routes/teacher');
const slots = require('./routes/slots');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/ik')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

if(!config.get('jwtPrivateKey')) {
  console.log('FATAL Error:- jwtPrivateKey is not available');
  process.exit();
}

app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/slots', slots);
app.use('/api/teacher', teacher);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));