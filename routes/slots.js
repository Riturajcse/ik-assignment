const {Slot, validate} = require('../models/slots'); 
const {User} = require('../models/user');
const {Teacher} = require('../models/teacher');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const slots = await Slot.find();
  res.send(slots);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);


  const slot = new Slot({ 
    startTime: new Date(req.body.startTime),
    endTime: new Date(req.body.endTime),
    isAssigned: false,
    isComplete: false,
  });
  await slot.save();
  
  res.send(slot);
});

// marks a slot complete once a student completes the test
router.post('/:id/complete', async (req, res) => {
  if (!req.body.studentId) {
    return res.status(400).send('Student ID is mandatory');
  }
  const isValid = mongoose.Types.ObjectId.isValid(req.body.studentId);
  if (!isValid) {
    return res.status(400).send('Student ID is invalid');
  }

  const student = await User.findOne({'_id':req.body.studentId},{'slots':1});
  if (!student) {
    return res.status(400).send('Student ID is invalid');
  }
  const updateObj = {
    studentId: req.body.studentId,
    grade: Math.floor(Math.random() * 5),
    isComplete: true,
  }
  const slot = await Slot.findByIdAndUpdate(req.params.id, updateObj);
  await User.findByIdAndUpdate(req.body.studentId, {$push:{slots: req.params.id}})
  res.send(slot);
});

//registers a free slot to a teacher
router.post('/:id/register', async (req, res) => {
    if (!req.body.teacherId) {
      return res.status(400).send('Teacher ID is mandatory');
    }
    const isValid = mongoose.Types.ObjectId.isValid(req.body.teacherId);
    if (!isValid) {
      return res.status(400).send('Teacher ID is invalid');
    }
  
    const teacher = await Teacher.findOne({'_id':req.body.teacherId});
    if (!teacher) {
      return res.status(400).send('Teacher ID is invalid');
    }
    const updateObj = {
      teacherId: req.body.teacherId,
      isAssigned: true,
    }
    const slot = await Slot.findByIdAndUpdate(req.params.id, updateObj);
    await Teacher.findByIdAndUpdate(req.body.teacherId, {$push:{slots: req.params.id}});
    res.send(slot);
});

module.exports = router; 