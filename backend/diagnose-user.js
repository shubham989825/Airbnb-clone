import mongoose from "mongoose";
import dotenv from "dotenv";
import Booking from "./models/Booking.js";
import User from "./models/User.js";
import Listing from "./models/Listing.js";

dotenv.config();

const diagnose = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get the test user we created
    const testUser = await User.findOne({ 
      email: "testuser1775160481503@example.com" 
    });

    if (!testUser) {
      console.error("❌ Test user not found!");
      process.exit(1);
    }

    console.log("👤 Test User Found:");
    console.log("   Name:", testUser.name);
    console.log("   Email:", testUser.email);
    console.log("   ID:", testUser._id);

    // Get bookings for this user
    const userBookings = await Booking.find({ user: testUser._id })
      .populate("listing");

    console.log("\n🎫 Bookings for this user:", userBookings.length);
    
    if (userBookings.length === 0) {
      console.log("   ❌ NO BOOKINGS FOUND!");
    } else {
      userBookings.forEach((b, i) => {
        console.log(`\n   ${i + 1}. ${b.listing?.title}`);
        console.log(`      Check-in: ${b.checkIn}`);
        console.log(`      Check-out: ${b.checkOut}`);
        console.log(`      Total Price: ₹${b.totalPrice}`);
        console.log(`      Created: ${b.createdAt}`);
      });
    }

    // Check ALL recent bookings (last 5)
    console.log("\n\n📊 Last 5 Bookings in Database:");
    const recentBookings = await Booking.find()
      .populate("user", "name email")
      .populate("listing", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    recentBookings.forEach((b, i) => {
      console.log(`   ${i + 1}. ${b.listing?.title} by ${b.user?.name} (${b.user?.email})`);
      console.log(`      ID: ${b.user?._id}`);
      console.log(`      Created: ${b.createdAt}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

diagnose();
