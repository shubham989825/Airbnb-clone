import express from "express";
import Wishlist from "../models/Wishlist.js";
import Listing from "../models/Listing.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user's wishlist
router.get("/", protect, async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.user.id })
      .populate('listing')
      .sort({ createdAt: -1 });
    
    const listings = wishlistItems.map(item => item.listing);
    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Check if listing is in user's wishlist
router.get("/check/:listingId", protect, async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      user: req.user.id,
      listing: req.params.listingId
    });
    
    res.json({ isInWishlist: !!wishlistItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add to wishlist
router.post("/:listingId", protect, async (req, res) => {
  try {
    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({
      user: req.user.id,
      listing: req.params.listingId
    });

    if (existingItem) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    // Verify listing exists
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const wishlistItem = new Wishlist({
      user: req.user.id,
      listing: req.params.listingId
    });

    await wishlistItem.save();
    res.status(201).json({ message: "Added to wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from wishlist
router.delete("/:listingId", protect, async (req, res) => {
  try {
    const result = await Wishlist.deleteOne({
      user: req.user.id,
      listing: req.params.listingId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
