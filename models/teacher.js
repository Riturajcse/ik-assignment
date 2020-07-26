const Joi = require('joi');
const mongoose = require('mongoose');

const Teacher = mongoose.model('Teacher', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  slots: [{
    type: String
  }]
}));

function validateTeacher(teacher) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  };

  return Joi.validate(teacher, schema);
}

exports.Teacher = Teacher; 
exports.validate = validateTeacher;