import express from 'express';
import {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

export default router;