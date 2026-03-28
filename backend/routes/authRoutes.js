import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

// Add become-host endpoint
router.post('/become-host', protect, async (req, res) => {
    try {
        const User = require('../models/User.js').default;
        await User.findByIdAndUpdate(req.user.id, { isHost: true });
        res.json({ message: "You are now a host!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;