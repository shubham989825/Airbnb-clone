import Listing from "../models/Listing.js";

// ✅ CREATE LISTING (WITH IMAGE UPLOAD)
export const createListing = async (req, res) => {
  try {
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

    // 🖼️ Get uploaded images from multer
    const imagePaths = req.files
      ? req.files.map((file) => file.path)
      : [];

    const listing = await Listing.create({
      title,
      description,
      price,
      location,
      images: imagePaths, // ✅ store uploaded image paths
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