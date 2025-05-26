require('dotenv').config();
const express = require('express');
const cors = require('cors');
const flashcardRoutes = require('./routes/flashcardRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/flashcards', flashcardRoutes);

// Error handling
app.use(errorHandler);

// Remove app.listen for serverless compatibility
// Instead export the app instance

module.exports = app;
