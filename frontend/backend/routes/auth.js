const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Hardcoded credentials
const VALID_USERNAME = 'Usha';
const VALID_PASSWORD = 'Usha';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
