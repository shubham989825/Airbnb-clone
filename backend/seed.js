import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "./models/Listing.js";

dotenv.config({ path: "./.env" });

console.log("MONGO:", process.env.MONGODB_URI);

const listings = [
  {
    title: "Luxury Villa",
    city: "Goa",
    location: "Goa, India",
    price: 5000,
    images: ["https://picsum.photos/seed/villa1/800/600.jpg"],
    description: "Beautiful villa near beach",
    host: new mongoose.Types.ObjectId(),
    bathrooms: 2,
    bedrooms: 3,
    guests: 5,
    category: "villa"
  },
  {
    title: "Mountain Retreat",
    city: "Manali",
    location: "Manali, India",
    price: 3000,
    images: ["https://picsum.photos/seed/cabin1/800/600.jpg"],
    description: "Peaceful mountain stay",
    host: new mongoose.Types.ObjectId(),
    bathrooms: 1,
    bedrooms: 2,
    guests: 4,
    category: "cabin"
  },
  {
    title: "City Apartment",
    city: "Mumbai",
    location: "Mumbai, India",
    price: 4000,
    images: ["https://picsum.photos/seed/apartment1/800/600.jpg"],
    description: "Modern apartment in city",
    host: new mongoose.Types.ObjectId(),
    bathrooms: 2,
    bedrooms: 2,
    guests: 4,
    category: "apartment"
  },
  {
    title: "Desert Camp",
    city: "Jaisalmer",
    location: "Jaisalmer, India",
    price: 2500,
    images: ["https://picsum.photos/seed/desert1/800/600.jpg"],
    description: "Experience desert life",
    host: new mongoose.Types.ObjectId(),
    bathrooms: 1,
    bedrooms: 1,
    guests: 2,
    category: "camp"
  },
  {
    title: "Lake House",
    city: "Udaipur",
    location: "Udaipur, India",
    price: 4500,
    images: ["https://picsum.photos/seed/lake1/800/600.jpg"],
    description: "Stay near lake",
    host: new mongoose.Types.ObjectId(),
    bathrooms: 2,
    bedrooms: 3,
    guests: 6,
    category: "house"
  },
  {
    title: "Beach House",
    city: "Goa",
    location: "Goa, India",
    price: 6000,
    images: ["https://picsum.photos/seed/beach1/800/600.jpg"],
    description: "Get Beach View",
    host: new mongoose.Types.ObjectId(),
    bathrooms: 2,
    bedrooms: 3,
    guests: 5,
    category: "beach"
  },
  {
    title: "Hilltop Cottage",
    city: "Shimla",
    location: "Shimla, India",
    price: 3500,
    images: ["https://picsum.photos/seed/cottage1/800/600.jpg"],
    description: "Cozy cottage with hill view",
    host: new mongoose.Types.ObjectId(),
    bathrooms: 1,
    bedrooms: 2,
    guests: 4,
    category: "cottage"
  },
  {
    title: "Luxury Penthouse",
    city: "Delhi",
    location: "Delhi, India",
    price: 8000,
    images: ["https://picsum.photos/seed/penthouse1/800/600.jpg"],
    description: "Premium penthouse with skyline view",
    host: new mongoose.Types.ObjectId(),
    bathrooms: 3,
    bedrooms: 4,
    guests: 8,
    category: "apartment"
  },
  {
    title: "Farm Stay",
    city: "Punjab",
    location: "Punjab, India",
    price: 2000,
    images: ["https://picsum.photos/seed/farm1/800/600.jpg"],
    description: "Enjoy peaceful farm life",
    host: new mongoose.Types.ObjectId(),
    bathrooms: 1,
    bedrooms: 2,
    guests: 5,
    category: "farm"
  },
  {
    title: "Backwater House",
    city: "Kerala",
    location: "Kerala, India",
    price: 5500,
    images: ["https://picsum.photos/seed/backwater1/800/600.jpg"],
    description: "Stay near serene backwaters",
    host: new mongoose.Types.ObjectId(),
    bathrooms: 2,
    bedrooms: 3,
    guests: 6,
    category: "house"
  },
  {
    title: "Forest Treehouse",
    city: "Rishikesh",
    location: "Rishikesh, India",
    price: 4500,
    images: ["https://picsum.photos/seed/treehouse1/800/600.jpg"],
    description: "Unique treehouse in forest",
    host: new mongoose.Types.ObjectId(),
    bathrooms: 1,
    bedrooms: 1,
    guests: 2,
    category: "treehouse"
  },
  {
    title: "Budget Hostel",
    city: "Bangalore",
    location: "Bangalore, India",
    price: 800,
    images: ["https://picsum.photos/seed/hostel1/800/600.jpg"],
    description: "Affordable stay for travelers",
    host: new mongoose.Types.ObjectId(),
    bathrooms: 2,
    bedrooms: 6,
    guests: 10,
    category: "hostel"
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Listing.deleteMany();
    await Listing.insertMany(listings);

    console.log("✅ Data seeded!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
