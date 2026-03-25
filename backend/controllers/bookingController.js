import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";

export const createBooking = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.body;
    const { listingId } = req.params;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

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
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing");

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if(!booking) {
      return res.status(404).json({ message: "Boooking Not Found"});
    }
    if(booking.user.toString() !== req.user.id) {
      return res.status(401).json({message: "Not Authorized"});
    }

    await booking.deleteOne();
    res.json({ message: "Booking cancelled"});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};