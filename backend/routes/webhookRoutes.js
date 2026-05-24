import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ PAYMENT SUCCESS EVENT
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const { userId, listingId, checkIn, checkOut } = session.metadata;

      try {
        // 1. check listing
        const listing = await Listing.findById(listingId);
        if (!listing) return;

        // 2. check duplicate booking
        const existing = await Booking.findOne({
          user: userId,
          listing: listingId,
          checkIn,
          checkOut,
          paymentStatus: "paid",
        });

        if (existing) return;

        const booking = await Booking.create({
          user: userId,
          listing: listingId,
          checkIn,
          checkOut,
          totalPrice: session.amount_total / 100,
          paymentStatus: "paid",
        });

        console.log("✅ Booking created:", booking._id);

      } catch (error) {
        console.error("Webhook booking error:", error);
      }
    }

    res.json({ received: true });
  }
);

export default router;