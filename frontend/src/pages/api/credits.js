// frontend/src/pages/api/credits.js
import { db } from '../../lib/firebaseAdmin';

console.log('DB:', db); // 👈 Este log

export default async function handler(req, res) {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: 'Missing uid' });
  }

  try {
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      const initialData = { credits: 0, freeUsesLeft: 3 };
      await userRef.set(initialData);
      return res.status(200).json(initialData);
    }

    const data = userSnap.data();
    return res.status(200).json({
      credits: typeof data.credits === 'number' ? data.credits : 0,
      freeUsesLeft: typeof data.freeUsesLeft === 'number' ? data.freeUsesLeft : 0,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch credits' });
  }
}
