import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";

export const createBooking = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.body;
    const { listingId } = req.params;

    console.log("Creating booking - User:", req.user?._id, "Listing:", listingId);

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

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

    console.log("Booking created:", booking._id);

    res.status(201).json(booking);

  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: error.message });
  }
};
export const getUserBookings = async (req, res) => {
  try {
    console.log("Fetching bookings for user:", req.user?._id);
    
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing");

    console.log("Found bookings:", bookings.length);
    res.json(bookings);

  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if(!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    console.log("Cancel booking - User:", req.user._id, "Booking user:", booking.user.toString());
    
    if(booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({message: "Not authorized to cancel this booking"});
    }

    await booking.deleteOne();
    console.log("✅ Booking cancelled:", req.params.id);
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({message: error.message});
  }
};