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
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const router = express.Router();

// router.post("/", protect, hostOnly, createListing);

router.post("/",protect,hostOnly,upload.array("images", 5), createListing);
router.get("/", getAllListings);
router.get("/:id", getListingById);  

export default router;