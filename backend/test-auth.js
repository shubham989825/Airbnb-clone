import express from "express";
import cors from "cors";
import mongoose from "mongoose";
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route without auth
app.get('/api/profile-test', async (req, res) => {
  try {
    const User = require('./models/User.js').default;
    const users = await User.find().select("-password").limit(1);
    res.json({ 
      message: "Profile test working",
      user: users[0] || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
});

// Test wishlist without auth
app.get('/api/wishlist-test', async (req, res) => {
  try {
    const Wishlist = require('./models/Wishlist.js').default;
    const wishlists = await Wishlist.find().limit(1);
    res.json({ 
      message: "Wishlist test working",
      data: wishlists,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
});

const PORT = 5001;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MONGODB');
    app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      console.log(`Test endpoints:`);
      console.log(`  Profile: http://localhost:${PORT}/api/profile-test`);
      console.log(`  Wishlist: http://localhost:${PORT}/api/wishlist-test`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MONGODB:', err);
    process.exit(1);
  });
