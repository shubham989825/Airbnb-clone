import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9\.\-_]/g, "_");
    cb(null, `${timestamp}-${sanitized}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for ID proof"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

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
const getUserProfile = async (req, res) => {
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
};

router.get("/", protect, getUserProfile);
router.get("/profile", protect, getUserProfile);

// Update user profile
const updateUserProfile = async (req, res) => {
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
};

router.put("/", protect, updateUserProfile);
router.put("/profile", protect, updateUserProfile);

// Become a host
router.post("/become-host", protect, upload.single("idProof"), async (req, res) => {
  try {
    const { phone } = req.body;
    const file = req.file;

    if (!phone || !file) {
      return res.status(400).json({
        message: "Phone number and ID proof file are required to become a host"
      });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit phone number"
      });
    }

    const idProofUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        phone,
        idProof: idProofUrl,
        isHost: true,
        role: "host",
        verificationStatus: "pending"
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Host application submitted! Your application is under review.",
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }
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
