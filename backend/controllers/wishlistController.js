import Wishlist from "../models/Wishlist.js";
import wishlist from "../models/Wishlist.js";

export const toggleWishlist = async (req, res) => {
    try {
        const {listingId} = req.params;

        const existing = await Wishlist.findOne({
            user: req.user._id,
            listing: listingId,
        });
        if (existing) {
            await existing.deleteOne();
            return res.json({message: "Removed from wishlist"});
        }
        const wishlist = await Wishlist.create({
            user: req.user._id,
            listing: listingId,
        });
        res.status(201).json(wishlist);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getWishlist = async (req, res) => {
    try {
        const items = await Wishlist.find({user: req.user._id})
        .populate("listing");

        res.json(items);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};