import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Booking from "./models/Booking.js";
import Listing from "./models/Listing.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const createTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // 1. Create a test user
    const testEmail = `testuser${Date.now()}@example.com`;
    const testPassword = "TestPassword123!";
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    let testUser = await User.findOne({ email: testEmail });
    if (!testUser) {
      testUser = await User.create({
        name: "Test Booker",
        email: testEmail,
        password: hashedPassword
      });
      console.log("✅ Test user created:", testUser.email);
    }

    // 2. Get a listing
    const listing = await Listing.findOne();
    if (!listing) {
      console.error("❌ No listings found! Run seed.js first");
      process.exit(1);
    }
    console.log("✅ Using listing:", listing.title);

    // 3. Create a booking for this user
    const booking = await Booking.create({
      user: testUser._id,
      listing: listing._id,
      checkIn: new Date("2026-04-10"),
      checkOut: new Date("2026-04-15"),
      totalPrice: listing.price * 5
    });
    console.log("✅ Test booking created - ID:", booking._id);

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("\n📋 Test Credentials:");
    console.log("   Email:", testEmail);
    console.log("   Password:", testPassword);
    console.log("   Token:", token);
    console.log("   User ID:", testUser._id);

    console.log("\n🧪 Test Instructions:");
    console.log("1. Go to the login page and login with:");
    console.log("   Email:", testEmail);
    console.log("   Password:", testPassword);
    console.log("2. Go to 'My Bookings' page");
    console.log("3. You should see the test booking");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createTestData();
