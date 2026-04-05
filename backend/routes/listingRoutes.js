import express from 'express';
import { createListing, getAllListings, getListingById, deleteListing } from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { hostOnly } from '../middleware/roleMiddleware.js';
import upload from '../middleware/upload.js'; // ✅ Cloudinary upload

const router = express.Router();

// POST route with Cloudinary image upload
router.post("/", protect, hostOnly, upload.array("images", 5), createListing);

router.get("/", getAllListings);
router.get("/:id", getListingById);
router.delete("/:id", protect, deleteListing);

export default router;