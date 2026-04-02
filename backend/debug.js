import mongoose from "mongoose";
import dotenv from "dotenv";
import Booking from "./models/Booking.js";
import User from "./models/User.js";
import Listing from "./models/Listing.js";

dotenv.config();

const debugDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Count collections
    const users = await User.countDocuments();
    const listings = await Listing.countDocuments();
    const bookings = await Booking.countDocuments();

    console.log("\n📊 Database Stats:");
    console.log(`   Users: ${users}`);
    console.log(`   Listings: ${listings}`);
    console.log(`   Bookings: ${bookings}`);

    // List all users
    console.log("\n👥 All Users:");
    const allUsers = await User.find().select("-password");
    if (allUsers.length === 0) {
      console.log("   No users found!");
    } else {
      allUsers.forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.name} (${u.email}) - ID: ${u._id}`);
      });
    }

    // List all bookings with details
    console.log("\n🎫 All Bookings:");
    const allBookings = await Booking.find().populate("user").populate("listing");
    if (allBookings.length === 0) {
      console.log("   No bookings found!");
    } else {
      allBookings.forEach((b, i) => {
        console.log(`   ${i + 1}. User: ${b.user?.name} (${b.user?._id})`);
        console.log(`      Listing: ${b.listing?.title} (${b.listing?._id})`);
        console.log(`      Dates: ${b.checkIn} → ${b.checkOut}`);
        console.log(`      Price: ₹${b.totalPrice}`);
      });
    }

    // Try to show sample listing
    console.log("\n🏠 Sample Listings:");
    const sampleListings = await Listing.find().limit(3);
    if (sampleListings.length === 0) {
      console.log("   No listings found! Run seed.js first");
    } else {
      sampleListings.forEach((l, i) => {
        console.log(`   ${i + 1}. ${l.title} - ₹${l.price}/night - ID: ${l._id}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

debugDatabase();
