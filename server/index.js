const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json()); // Parse incoming JSON requests

// ── Health check route (test this first!) ──────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'LifeFlow API is running!' });
});

// ── Routes (will add in Week 2+) ───────────────────────
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/donors', require('./routes/donor'));
// app.use('/api/inventory', require('./routes/inventory'));
// app.use('/api/requests', require('./routes/request'));
// app.use('/api/donations', require('./routes/donation'));

// ── Global error handler (must be LAST) ────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});