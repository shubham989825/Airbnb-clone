import Listing from "../models/Listing.js";
import cloudinary from "../config/cloudinary.js";

// CREATE LISTING (WITH IMAGE UPLOAD)
export const createListing = async (req, res) => {
  try {
    console.log(" Debug - Request body:", req.body);
    console.log(" Debug - Request files:", req.files);
    console.log(" Debug - All request fields:", Object.keys(req.body));
    
    const {
      title,
      description,
      price,
      location,
      amenities,
      category,
      guests,
      bedrooms,
      bathrooms,
    } = req.body;

      let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "airbnb-clone",
        });

         imageUrls.push({
      url: result.secure_url,
      public_id: result.public_id, 
    });

         
        fs.unlinkSync(file.path);
      }
    }

    console.log(" Cloudinary URLs:", imageUrls);
    const listing = await Listing.create({
      title,
      description,
      price,
      location,
      images: imagePaths, // store uploaded image paths
      amenities,
      category,
      guests,
      bedrooms,
      bathrooms,
      host: req.user._id,
      Phone: req.user.phone,
      Email: req.user.email,
    });

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });

  } catch (error) {
    console.error("Create Listing Error:", error);

    // 🔴 Validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    // 🔴 General error
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ GET ALL LISTINGS
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate("host", "name email");

    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });

  } catch (error) {
    console.error("Get All Listings Error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching listings",
      error: error.message,
    });
  }
};

// ✅ GET SINGLE LISTING BY ID
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "host",
      "name email"
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.status(200).json({
      success: true,
      listing,
    });

  } catch (error) {
    console.error("Get Listing By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching listing",
      error: error.message,
    });
  }
};
// ✅ DELETE LISTING
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Optional: check if user is owner
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this listing",
      });
    }
       if (listing.images && listing.images.length > 0) {
      for (const img of listing.images) {
        // Only delete if public_id exists (for old data safety)
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });

  } catch (error) {
    console.error("Delete Listing Error:", error);

    res.status(500).json({
      success: false,
      message: "Error deleting listing",
    });
  }
};