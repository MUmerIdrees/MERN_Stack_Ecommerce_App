import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";

// Stripe init with test secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;