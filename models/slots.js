const Joi = require('joi');
const mongoose = require('mongoose');

const Slot = mongoose.model('Slot', new mongoose.Schema({
  startTime: { 
    type: Date, 
    required: true
  },
  endTime: { 
    type: Date, 
    required: true
  },
  teacherId: { 
    type: String
  },
  studentId: { 
    type: String
  },
  isAssigned: { 
    type: Boolean, 
    default: false
  },
  isComplete: { 
    type: Boolean, 
    default: false
  },
  grade: { 
    type: Number, 
    min: 0,
    max: 5
  }
}));

function validateSlot(slot) {
  return true;
}

exports.Slot = Slot; 
exports.validate = validateSlot;