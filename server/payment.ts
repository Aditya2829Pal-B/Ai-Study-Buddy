import express, { Router } from "express";
import Stripe from "stripe";
import { readDb, writeDb } from "./db";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_FALLBACK_KEY_2026";

// Initialize Stripe (if key exists)
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' as any }) : null;

// Middleware to authenticate user
const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Create a checkout session (Stripe)
router.post("/checkout/stripe", authenticate, async (req: any, res: any) => {
  if (!stripe) {
    return res.status(500).json({ error: "Stripe is not configured on the server." });
  }

  const { priceId } = req.body;
  const db = readDb();
  const user = db.users.find((u) => u.id === req.userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId || 'price_placeholder', // You would define this in Stripe Dashboard
          quantity: 1,
        },
      ],
      customer_email: user.email,
      success_url: `${req.headers.origin}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing?canceled=true`,
      metadata: {
        userId: user.id
      }
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create Customer Portal Session (Stripe)
router.post("/portal/stripe", authenticate, async (req: any, res: any) => {
  if (!stripe) {
    return res.status(500).json({ error: "Stripe is not configured" });
  }

  const db = readDb();
  const user = db.users.find((u) => u.id === req.userId);

  if (!user || !user.stripeCustomerId) {
    return res.status(404).json({ error: "Customer not found or not a premium user" });
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${req.headers.origin}/pricing`,
    });

    res.json({ url: portalSession.url });
  } catch (error: any) {
    console.error("Stripe Portal Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create checkout for PayPal (Placeholder)
router.post("/checkout/paypal", authenticate, async (req: any, res: any) => {
  if (!process.env.PAYPAL_CLIENT_ID) {
    return res.status(500).json({ error: "PayPal is not configured" });
  }
  // Integration logic for PayPal orders creation here
  res.json({ url: "/pricing?paypal_success=true" });
});

// Create checkout for Razorpay (Placeholder)
router.post("/checkout/razorpay", authenticate, async (req: any, res: any) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    return res.status(500).json({ error: "Razorpay is not configured" });
  }
  // Integration logic for Razorpay orders creation here
  res.json({ orderId: "order_MOCK123" });
});

// Webhook for Stripe
router.post("/webhook/stripe", express.raw({ type: 'application/json' }), async (req: any, res: any) => {
  // In a real application, you would verify the signature using req.headers['stripe-signature']
  // and process.env.STRIPE_WEBHOOK_SECRET
  
  const event = req.body; // Assuming parsing is handled or we parse it if we use express.raw correctly in server.ts

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    
    if (userId) {
       const db = readDb();
       const userIndex = db.users.findIndex(u => u.id === userId);
       if (userIndex !== -1) {
         db.users[userIndex].isPremium = true;
         db.users[userIndex].stripeCustomerId = session.customer;
         db.users[userIndex].stripeSubscriptionId = session.subscription;
         writeDb(db);
       }
    }
  }

  res.json({ received: true });
});

export default router;
