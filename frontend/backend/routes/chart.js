const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db'); // adjust the path if your file structure is different

// ✅ Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ✅ GET /api/charts/summary - fetch from clean_energy_summary table
router.get('/summary', verifyToken, (req, res) => {
  const query = 'SELECT source, percentage FROM clean_energy_summary';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ MySQL error on /summary:', err);
      return res.status(500).json({ error: 'Failed to fetch summary data' });
    }

    const labels = results.map(row => row.source);
    const values = results.map(row => row.percentage);

    res.json({ labels, values });
  });
});

// ✅ GET /api/charts/reports - fetch from both line and bar chart tables
router.get('/reports', verifyToken, async (req, res) => {
  try {
    const [lineResults] = await db.promise().query(
      'SELECT year, investment FROM clean_energy_reports ORDER BY year'
    );

    const [barResults] = await db.promise().query(
      'SELECT technology, investment FROM clean_energy_tech'
    );

    const lineChart = {
      labels: lineResults.map(row => row.year),
      values: lineResults.map(row => row.investment)
    };

    const barChart = {
      labels: barResults.map(row => row.technology),
      values: barResults.map(row => row.investment)
    };

    res.json({ lineChart, barChart });
  } catch (err) {
    console.error('❌ Error fetching report data:', err);
    res.status(500).json({ error: 'Failed to fetch report data' });
  }
});

module.exports = router;
