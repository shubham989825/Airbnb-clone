import express from "express";
import { cancelBooking, createBooking, getUserBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/my", protect, getUserBookings);
router.post("/:listingId", protect, createBooking);
router.delete("/:id", protect, cancelBooking);

export default router;