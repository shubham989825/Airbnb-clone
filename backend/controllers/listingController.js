import Listing from "../models/Listing.js";

export const createListing = async (req, res) => {
    try {
        const listing = await Listing.create({
            ...req.body,
            host: req.user._id
        });
        res.status(201).json(listing);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find().populate("host", "name email");
        res.json(listings);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};