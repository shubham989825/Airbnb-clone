import express from 'express';
import { createListing, getAllListings } from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { hostOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post("/", protect, hostOnly, createListing);
router.get("/", getAllListings);

export default router;