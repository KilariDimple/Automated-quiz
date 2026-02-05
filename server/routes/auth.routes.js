// server/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Validate role
    if (!['student', 'faculty'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password, // Password will be hashed by the pre-save middleware
      role
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      "2b4844bf8f315779236b5076d4e8002faf0565299660b1b2b4c189d940e093a3f3bc5efb38a0eb5b7ee00725ba85041f2df21e31fa9595f66348a0da98323a9856d5ec7c3fa6c439a891f161decce0387323b83ee4529e2c49343d1638d136a4472d721d70efece16b70e7625c62e58d58ca4bc00c1f368aa95d8a1335a9f6c95f734df27de2784fcb010197d1ab17c21f3a45a2f876ea4013ad84d98b30dee881579586f1c67e3e9c26a0232a7f077bc435ee9efef97c9a08c2237088ad5529afe6889668418185c95dedeb384ec5eebc6d3cb85f99ac5fdb5f6b008825e80619500a012876980ae18b68f98e0cb2a52c2f6887e76e190866cc6c428d45b83a",
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      "2b4844bf8f315779236b5076d4e8002faf0565299660b1b2b4c189d940e093a3f3bc5efb38a0eb5b7ee00725ba85041f2df21e31fa9595f66348a0da98323a9856d5ec7c3fa6c439a891f161decce0387323b83ee4529e2c49343d1638d136a4472d721d70efece16b70e7625c62e58d58ca4bc00c1f368aa95d8a1335a9f6c95f734df27de2784fcb010197d1ab17c21f3a45a2f876ea4013ad84d98b30dee881579586f1c67e3e9c26a0232a7f077bc435ee9efef97c9a08c2237088ad5529afe6889668418185c95dedeb384ec5eebc6d3cb85f99ac5fdb5f6b008825e80619500a012876980ae18b68f98e0cb2a52c2f6887e76e190866cc6c428d45b83a",
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
