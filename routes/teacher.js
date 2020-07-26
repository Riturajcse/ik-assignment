const {Teacher, validate} = require('../models/teacher'); 
const {Slot} = require('../models/slots');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
const {Teacher, validate} = require('../models/teacher'); 
  const teachers = await Teacher.find().sort('name');
  res.send(teachers);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let teacher = new Teacher({ 
    name: req.body.name,
    slots: []
  });
  teacher = await teacher.save();
  
  res.send(teacher);
});

module.exports = router; 