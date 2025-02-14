import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { stripe } from "./utils/stripe";
import { verifyAuth } from "./middlewares/authMiddleware";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.post("/api/create-payment-intent",verifyAuth ,async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    if (event.type === "payment_intent.succeeded") {
      console.log("Payment successful:", event.data.object);
      // TODO: Update database for successful payments
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook error: ${(err as Error).message}`);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
