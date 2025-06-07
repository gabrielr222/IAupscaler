import Stripe from 'stripe';
import { getFirestore } from 'firebase-admin/firestore';
import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

if (!getApps().length) {
  initializeApp({ credential: applicationDefault() });
}
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, uid } = req.body;
  if (!amount || amount < 5) {
    return res.status(400).json({ error: 'Minimum amount is $5' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'PixUpscaler Credits' },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/app`,
      metadata: { uid, amount },
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create session' });
  }
}
