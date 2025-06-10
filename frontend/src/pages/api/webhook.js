import { buffer } from 'micro';
import Stripe from 'stripe';
import { db } from '../../lib/firebaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const uid = session.metadata?.uid;
    if (uid) {
      try {
        const userRef = db.collection('users').doc(uid);
        const snap = await userRef.get();
        if (!snap.exists) {
          await userRef.set({ credits: 5.0, freeUsesLeft: 3 });
        } else {
          const current = snap.data();
          const updatedCredits = (current.credits || 0) + 5.0;
          await userRef.update({ credits: updatedCredits });
        }
      } catch (e) {
        console.error('Failed to update credits from webhook', e);
      }
    }
  }

  res.status(200).json({ received: true });
}
