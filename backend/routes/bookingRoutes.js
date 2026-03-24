import express from "express";
import { createBooking, getUserBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/my", protect, getUserBookings);
router.post("/:listingId", protect, createBooking);

export default router;