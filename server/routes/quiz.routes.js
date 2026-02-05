// server/routes/quiz.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth, facultyOnly } = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const { extractTextFromPDF } = require('../services/pdfService');
const { generateQuestions } = require('../services/questionGenerator');

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/create', auth, facultyOnly, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    if (!req.file.buffer) {
      return res.status(400).json({ error: 'Invalid file format' });
    }

    const pdfText = await extractTextFromPDF(req.file.buffer);
    if (!pdfText) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    const questions = await generateQuestions(pdfText);
    if (!questions || questions.length === 0) {
      return res.status(400).json({ error: 'Could not generate questions from PDF content' });
    }

    const quiz = new Quiz({
      title: req.body.title || 'New Quiz',
      createdBy: req.user._id,
      questions,
      pdfContent: pdfText
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Quiz creation error:', error);
    res.status(400).json({ error: error.message || 'Failed to create quiz' });
  }
});

router.get('/faculty', auth, facultyOnly, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id });
    res.json(quizzes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/student', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ active: true });
    res.json(quizzes);
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

// Get a single quiz by ID
router.get('/:id', auth, async (req, res) => {
  console.log('Fetching quiz with ID:', req.params.id);
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      console.log('Quiz not found');
      return res.status(404).json({ error: 'Quiz not found' });
    }
    console.log('Quiz found:', quiz);
    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;