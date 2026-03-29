import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import bookingRoutes from "./routes/bookingRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import propertyRoutes from './routes/propertyRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://airbnb-clone-three-orcin.vercel.app' 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use("/api", propertyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/profile", profileRoutes);

app.get('/', (req, res) => {
    res.send("API is running.........");
});

// Debug route to test if routes are mounted
app.get('/api/debug', (req, res) => {
    res.json({ 
        message: "Debug route working",
        routes: {
            auth: "/api/auth",
            profile: "/api/profile", 
            wishlist: "/api/wishlist"
        },
        timestamp: new Date().toISOString()
    });
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MONGODB"))
.catch((err) => console.log("Error connecting to MONGODB:", err));

const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8080 : 5000);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});