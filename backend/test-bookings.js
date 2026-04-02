import axios from "axios";

const testAPI = async () => {
  const BASE_URL = "http://localhost:5000/api";

  console.log("\n🧪 Testing Bookings API\n");

  // Test 1: Login as Gagan
  console.log("1️⃣  Logging in as Gagan...");
  try {
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: "gaganbhardwaj514@gmail.com",
      password: "password123" // Try common passwords
    });
    
    console.log("✅ LOGIN RESPONSE:");
    console.log("   Token:", loginRes.data.token.substring(0, 30) + "...");
    console.log("   User ID:", loginRes.data.user._id);
    console.log("   User Name:", loginRes.data.user.name);

    const token = loginRes.data.token;

    // Test 2: Fetch user's bookings
    console.log("\n2️⃣  Fetching user's bookings...");
    const bookingsRes = await axios.get(`${BASE_URL}/bookings/my`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("✅ BOOKINGS RESPONSE:");
    console.log("   Total bookings:", bookingsRes.data.length);
    
    if (bookingsRes.data.length > 0) {
      console.log("\n   📋 Bookings:");
      bookingsRes.data.forEach((b, i) => {
        console.log(`      ${i + 1}. ${b.listing?.title || "Unknown"}`);
        console.log(`         Check-in: ${b.checkIn}`);
        console.log(`         Check-out: ${b.checkOut}`);
        console.log(`         Price: ₹${b.totalPrice}`);
      });
    }

  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    
    console.log("\n2️⃣  Trying alternative password...");
    try {
      const altRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: "gaganbhardwaj514@gmail.com",
        password: "123456"
      });
      console.log("✅ Logged in with password: 123456");
      
      const bookingsRes = await axios.get(`${BASE_URL}/bookings/my`, {
        headers: { Authorization: `Bearer ${altRes.data.token}` }
      });
      console.log("✅ Bookings fetched:", bookingsRes.data.length);
    } catch (err) {
      console.error("❌ Alternative login failed:", err.response?.data?.message || err.message);
    }
  }
};

testAPI();
