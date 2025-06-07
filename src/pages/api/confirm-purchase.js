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

  const { sessionId } = req.body;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }
    const uid = session.metadata.uid;
    const amount = parseInt(session.metadata.amount, 10);
    const creditsToAdd = amount; // $1 per credit

    const userRef = db.collection('users').doc(uid);
    const snap = await userRef.get();
    const current = snap.data()?.credits || 0;
    await userRef.set({ credits: current + creditsToAdd }, { merge: true });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to confirm purchase' });
  }
}
