const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({ origin: 'https://memorify-ai-flashcards.vercel.app' }));
app.use(express.json());

// In-memory storage (resets on serverless restart)
let flashcards = [];

// Routes
app.get('/api/flashcards', (req, res) => {
  res.json(flashcards);
});

app.post('/api/flashcards', (req, res) => {
  const { term, definition } = req.body;
  if (!term || !definition) {
    return res.status(400).json({ error: 'Term and definition required' });
  }
  const newCard = { id: flashcards.length + 1, term, definition };
  flashcards.push(newCard);
  res.status(201).json(newCard);
});

// Export as Vercel Serverless Function
module.exports = serverless(app);