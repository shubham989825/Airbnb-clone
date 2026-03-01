import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";

export const createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check for date conflict
    const conflictingBooking = await Booking.findOne({
      listing: listingId,
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) }
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: "Dates already booked" });
    }

    const nights =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    const totalPrice = nights * listing.price;

    const booking = await Booking.create({
      user: req.user._id,
      listing: listingId,
      checkIn,
      checkOut,
      totalPrice
    });

    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
