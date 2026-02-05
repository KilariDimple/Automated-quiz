// server/routes/result.routes.js
const express = require('express');
const router = express.Router();
const { auth, facultyOnly } = require('../middleware/auth');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');

router.post('/submit', auth, async (req, res) => {
  try {
    const { quizId, answers, timeSpent } = req.body;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    const opt = ["A", "B", "C", "D"]
    // Calculate score
    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (quiz.questions[index].correctOption === opt[answer.selectedOption]) {
        correctCount++;
      }
    });

    const score = (correctCount / quiz.questions.length) * 100;

    const result = new Result({
      quiz: quizId,
      student: req.user._id,
      answers,
      score,
      timeSpent
    });

    await result.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/student/:quizId', auth, async (req, res) => {
  try {
    const result = await Result.findOne({
      quiz: req.params.quizId,
      student: req.user._id
    }).populate('quiz');
    
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/faculty/quiz/:quizId', auth, facultyOnly, async (req, res) => {
  try {
    const results = await Result.find({ quiz: req.params.quizId })
      .populate('student', 'name email')
      .sort('-createdAt');
    res.json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/score/:id', auth, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate({
        path: 'quiz',
        select: 'title questions'
      });
    
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;