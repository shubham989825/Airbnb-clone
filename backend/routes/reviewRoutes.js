import express from "express";
import { createReview, getReviewsByListing, getMyReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/my", protect, getMyReviews);
router.get("/:listingId", getReviewsByListing);

export default router;
