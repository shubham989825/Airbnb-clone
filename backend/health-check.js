import express from "express";
import cors from "cors";
import mongoose from "mongoose";
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running!',
    timestamp: new Date().toISOString(),
    routes: {
      profile: '/api/profile/*',
      wishlist: '/api/wishlist/*',
      auth: '/api/auth/*'
    }
  });
});

// Test wishlist without auth
app.get('/api/wishlist-test', (req, res) => {
  res.json({ message: 'Wishlist routes are mounted' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/airbnb-clone')
  .then(() => {
    console.log('Connected to MONGODB');
    app.listen(PORT, () => {
      console.log(`Health check server running on port ${PORT}`);
      console.log(`Test endpoints:`);
      console.log(`  Health: http://localhost:${PORT}/api/health`);
      console.log(`  Wishlist: http://localhost:${PORT}/api/wishlist-test`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MONGODB:', err);
    process.exit(1);
  });
