const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      jwtSecret: process.env.JWT_SECRET ? 'set' : 'not set',
      mongoUri: process.env.MONGODB_URI ? 'set' : 'not set'
    }
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MONGODB');
    app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MONGODB:', err);
    process.exit(1);
  });
