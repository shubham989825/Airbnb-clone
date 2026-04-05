import express from 'express';
import { createListing, getAllListings, getListingById } from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { hostOnly } from '../middleware/roleMiddleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate web-friendly filename
    const originalName = file.originalname;
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.split('.').slice(0, -1).join('.');
    // Remove special characters, keep only alphanumeric, spaces, hyphens, and underscores
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9\s_\-]/g, '');
    const timestamp = Date.now();
    const webFriendlyName = `${sanitizedName}-${timestamp}.${extension}`;
    cb(null, webFriendlyName);
  },
});

const upload = multer({ storage });

const router = express.Router();

// POST route with image upload
router.post("/",protect,hostOnly,upload.array("images", 5), createListing);
router.get("/", getAllListings);
router.get("/:id", getListingById);  

export default router;