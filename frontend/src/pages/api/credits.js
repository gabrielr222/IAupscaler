import { db } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
  const { uid } = req.query;
  if (!uid) {
    return res.status(400).json({ error: 'Missing uid' });
  }

  try {
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      await userRef.set({ credits: 0, freeUsesLeft: 3 });
      return res.status(200).json({ credits: 0, freeUsesLeft: 3 });
    }

    const data = userSnap.data();
    res.status(200).json({
      credits: data.credits || 0,
      freeUsesLeft: data.freeUsesLeft || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
}
