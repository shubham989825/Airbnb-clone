import express from "express";
import { createBooking } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);

export default router;