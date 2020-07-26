const {User, validate} = require('../models/user');
const {Slot} = require('../models/slots');
const _ = require('lodash');
const auth = require('../middleware/auth');
const bCrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find({},{'password':0}).sort('name');
  res.send(users);
});

router.post('/slots', async (req, res) => {
  //input request body validations
  if (!req.body.studentId) {
    return res.status(400).send('Student ID is mandatory');
  }
  if (!req.body.startDateTime) {
    return res.status(400).send('startDateTime is mandatory');
  }
  if (!req.body.endDateTime) {
    return res.status(400).send('endDateTime is mandatory');
  }

  const isValid = mongoose.Types.ObjectId.isValid(req.body.studentId);
  if (!isValid) {
    return res.status(400).send('Student ID is invalid');
  }

  const student = await User.findOne({'_id':req.body.studentId},{'slots':1});
  if (!student) {
    return res.status(400).send('Student ID is invalid');
  }
  const bookedSlots = student.slots;
  //if already taken 15 tests 
  if (bookedSlots.length >= 15) {
    return res.status(400).send('Already used all your interview credits');
  }
  let bookedSlotsObj = [];
  let teachersToSkip = [];
  let lastGrade = null;
  let secondLastGrade = null;
  if (!_.isEmpty(bookedSlots)) {
    //get all the slots which student has used, sort by updatedAt to calculate last two grades
    bookedSlotsObj = await Slot.find({'_id':{$in: bookedSlots}},{}).sort({updatedAt:-1});
    teachersToSkip = _.map(bookedSlotsObj, 'teacherId');
    lastGrade = bookedSlotsObj[0].grade;
    if (bookedSlotsObj.length > 1) {
      secondLastGrade = bookedSlotsObj[1].grade;
    }
  }
  //if last two tests has grade less than 1 do not allow any test
  if (lastGrade && secondLastGrade && (lastGrade < 1 && secondLastGrade < 1)) {
    return res.status(400).send('No more tests allowed: BAD GRADE!');
  }

  const availableSlots = await Slot.find({
    'isAssigned': true,
    'startTime': {$gte: new Date(req.body.startDateTime)},
    'endTime': {$lte: new Date(req.body.endDateTime)},
    'teacherId': {$nin: teachersToSkip}
  });

  //if no slots are available
  if (_.isEmpty(availableSlots)) {
    return res.status(400).send('Sorry! no slots available');
  }

  res.send(availableSlots);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if (user) return res.status(400).send('User already exists');

  user = new User({ name: req.body.name, email: req.body.email, password: req.body.password });
  const salt = await bCrypt.genSalt(10);
  const userPassword = await bCrypt.hash(user.password, salt);
  user.password = userPassword;
  user = await user.save();
  
  res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;