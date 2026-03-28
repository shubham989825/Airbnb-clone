import express from "express";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Test route without auth
router.get("/test", async (req, res) => {
  try {
    const users = await User.find().select("-password").limit(1);
    res.json({ message: "Profile routes working", user: users[0] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, bio },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Become a host
router.post("/become-host", protect, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { isHost: true },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "You are now a host!", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's bookings
router.get("/bookings", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('listing')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's listings
router.get("/listings", protect, async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user.id })
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
