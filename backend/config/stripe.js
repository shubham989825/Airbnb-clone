import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error(
    "STRIPE_SECRET_KEY is required. Set it in backend/.env or in Render environment settings."
  );
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: "2023-08-16",
});
export default stripe;
