const Joi = require('joi');
const mongoose = require('mongoose');

const Student = mongoose.model('Student', new mongoose.Schema({
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

function validateStudent(student) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  };

  return Joi.validate(student, schema);
}

exports.Student = Student; 
exports.validate = validateStudent;