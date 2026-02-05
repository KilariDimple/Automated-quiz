// server/models/Quiz.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length === 4;
      },
      message: 'Options array must contain exactly 4 items'
    }
  },
  correctOption: {
    type: String, 
    required: true,
    enum: ["A", "B", "C", "D"]
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number,
    default: 15 // minutes
  },
  pdfContent: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  attemptedStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    completedAt: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
