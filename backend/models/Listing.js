import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
     title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    images: [
      {
        type: String
      }
    ],
    amenities: [
      {
        type: String
      }
    ],
    category: {
      type: String,
      required: true
    },
    guests: {
      type: Number,
      required: true
    },
    bedrooms: {
      type: Number,
      required: true
    },
    bathrooms: {
      type: Number,
      required: true
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
}, {timestamps: true});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;