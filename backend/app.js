const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const chartRoutes = require('./routes/chart');

app.use('/api/auth', authRoutes);
app.use('/api/charts', chartRoutes);

module.exports = app;
