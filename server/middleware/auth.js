// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Add error handling for expired tokens
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, "2b4844bf8f315779236b5076d4e8002faf0565299660b1b2b4c189d940e093a3f3bc5efb38a0eb5b7ee00725ba85041f2df21e31fa9595f66348a0da98323a9856d5ec7c3fa6c439a891f161decce0387323b83ee4529e2c49343d1638d136a4472d721d70efece16b70e7625c62e58d58ca4bc00c1f368aa95d8a1335a9f6c95f734df27de2784fcb010197d1ab17c21f3a45a2f876ea4013ad84d98b30dee881579586f1c67e3e9c26a0232a7f077bc435ee9efef97c9a08c2237088ad5529afe6889668418185c95dedeb384ec5eebc6d3cb85f99ac5fdb5f6b008825e80619500a012876980ae18b68f98e0cb2a52c2f6887e76e190866cc6c428d45b83a");
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

const facultyOnly = (req, res, next) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).json({ error: 'Faculty access required' });
  }
  next();
};

module.exports = { auth, facultyOnly };


