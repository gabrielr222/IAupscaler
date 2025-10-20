// frontend/src/pages/api/credit-user.js
import { db } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uid, amount = 5 } = req.body; // amount en dólares o créditos

  if (!uid) return res.status(400).json({ error: 'Missing uid' });

  try {
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      // Nuevo → se crea con los créditos comprados + 1 uso gratis
      await userRef.set({ credits: parseFloat(amount), freeUsesLeft: 1 });
    } else {
      const current = userSnap.data();
      const updatedCredits = (current.credits || 0) + parseFloat(amount);
      await userRef.update({ credits: updatedCredits });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to credit user' });
  }
}
