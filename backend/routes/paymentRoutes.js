import express from "express";
import stripe from "../config/stripe.js";
import { protect } from "../middleware/authMiddleware.js";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import fs from "fs";
import path from "path";
import transporter from "../config/mailer.js";
import generateInvoice from "../utils/generateInvoice.js";
import { generateGoogleCalenderUrl, generateICS } from "../utils/generateCalenderEvent.js";

const router = express.Router();

/* =========================
   TEST STRIPE KEY
========================= */
router.get("/test-key", async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();

    res.json({
      ok: true,
      message: "Stripe key valid",
      balance,
    });
  } catch (error) {
    console.error("Stripe test-key error:", error);

    res.status(500).json({
      ok: false,
      message: "Stripe key invalid",
      error: error.message,
    });
  }
});

/* =========================
   CREATE CHECKOUT SESSION
========================= */
router.post("/create-checkout-session", protect, async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, totalPrice, phone } = req.body;

    const missingFields = [];
    if (!listingId) missingFields.push("listingId");
    if (!checkIn) missingFields.push("checkIn");
    if (!checkOut) missingFields.push("checkOut");
    if (!totalPrice && totalPrice !== 0) missingFields.push("totalPrice");
    if (!phone) missingFields.push("phone");

    if (missingFields.length > 0) {
      console.error("Missing booking details:", missingFields);
      return res.status(400).json({
        message: "Missing booking details",
        missingFields,
      });
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: listing.title,
              description: listing.location,
            },
            unit_amount: Math.round(Number(totalPrice) * 100),
          },
          quantity: 1,
        },
      ],

      success_url:
        "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/payment-cancel",

      metadata: {
        userId: req.user._id.toString(),
        listingId,
        checkIn,
        checkOut,
        totalPrice,
        phone,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);

    res.status(500).json({
      message: "Stripe session failed",
    });
  }
});

/* =========================
   CONFIRM PAYMENT + BOOKING
========================= */
router.get("/confirm-checkout-session", protect, async (req, res) => {
  try {
    const sessionId = req.query.session_id;

    if (!sessionId) {
      return res.status(400).json({ message: "Missing session id" });
    }

    const session = await stripe.checkout.sessions.retrieve(
      sessionId.toString()
    );

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const {
      listingId,
      checkIn,
      checkOut,
      totalPrice,
      phone,
    } = session.metadata || {};

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const existingBooking = await Booking.findOne({
      user: req.user._id,
      listing: listingId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      paymentStatus: "paid",
    });

    if (existingBooking) {
      return res.json({
        booking: existingBooking,
        message: "Booking already exists",
      });
    }

    /* =========================
       CREATE BOOKING
    ========================= */
    const booking = await Booking.create({
      user: req.user._id,
      listing: listingId,
      checkIn,
      checkOut,
      totalPrice,
      paymentStatus: "paid",
      phone,
    });

    /* =========================
       PDF INVOICE
    ========================= */
    let pdfBuffer;
    try {
      pdfBuffer = await generateInvoice(
        booking,
        req.user,
        listing
      );
      console.log("✅ PDF invoice generated successfully");
    } catch (pdfError) {
      console.error("❌ PDF generation failed:", pdfError);
      console.error("PDF error details:", pdfError.message);
      // Continue without PDF if generation fails
      pdfBuffer = null;
      console.log("⚠️  Proceeding without PDF invoice");
    }

    /* =========================
       CALENDAR FILE + LINK
    ========================= */
    const icsData = generateICS(booking, listing);
    const googleCalendarUrl = generateGoogleCalenderUrl(booking, listing);
    const icsFileUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(
      icsData
    )}`;

    /* =========================
       EMAIL USER
    ========================= */
    try {
      await transporter.verify();
      console.log("✅ Email transporter verified successfully");
      console.log("📧 Sending booking confirmation email to:", req.user.email);
      
      const attachments = [
        {
          filename: "booking.ics",
          content: icsData,
        },
      ];
      
      // Only attach PDF if it was generated successfully
      if (pdfBuffer) {
        attachments.push({
          filename: `invoice-${booking._id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        });
      }
      
      await transporter.sendMail({
        from: process.env.APP_EMAIL,
        to: req.user.email,
        subject: "Airbnb Booking Confirmation",

        html: `
          <h2>Booking Confirmed ✅</h2>

          <p>Hello ${req.user.name},</p>

          <p>Your booking is confirmed successfully.</p>

          <h3>Details</h3>

          <p><b>Property:</b> ${listing.title}</p>
          <p><b>Location:</b> ${listing.location}</p>

          <p><b>Check In:</b> ${new Date(checkIn).toLocaleDateString()}</p>
          <p><b>Check Out:</b> ${new Date(checkOut).toLocaleDateString()}</p>

          <p><b>Total Paid:</b> ₹${totalPrice}</p>

          <br/>

          <p>
            📅 Add to Calendar:
            <a href="${googleCalendarUrl}" target="_blank">
              Google Calendar
            </a>
          </p>

          <p>${pdfBuffer ? "Invoice + Calendar file attached." : "Calendar file attached. (Invoice generation failed)"}</p>

          <p>Thank you for using Airbnb ❤️</p>
        `,

        attachments,
      });
      
      console.log("✅ Booking confirmation email sent successfully to:", req.user.email);
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      console.error("Email error details:", {
        from: process.env.APP_EMAIL,
        to: req.user.email,
        error: emailError.message,
        code: emailError.code,
      });
      // Don't fail the booking if email fails
      console.log("⚠️  Booking created but email not sent");
    }

    /* =========================
       RESPONSE
    ========================= */
    res.json({
      message: "Payment successful & booking confirmed",
      booking,
      calendar: {
        googleCalendarUrl,
        icsFileUrl,
      },
    });
  } catch (error) {
    console.error("Confirm checkout error:", error);

    if (error.response) {
      console.error("Error response:", error.response);
    }

    res.status(500).json({
      message: "Failed to confirm booking",
      error: error.message,
    });
  }
});

export default router;