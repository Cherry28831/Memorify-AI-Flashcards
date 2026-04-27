require('dotenv').config();
const express = require('express');
const cors = require('cors');
const flashcardRoutes = require('./routes/flashcardRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://memorifyaiflashcards.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.get('Origin'));
  console.log('Headers:', req.headers);
  next();
});

// Routes
app.use('/api/flashcards', flashcardRoutes);

// Error handling
app.use(errorHandler);

// ✅ Start server (Render will assign a dynamic port)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});