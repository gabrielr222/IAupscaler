import { db } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: 'Missing uid' });
  }

  try {
    const historySnap = await db
      .collection('users')
      .doc(uid)
      .collection('history')
      .orderBy('timestamp', 'desc')
      .limit(3)
      .get();

    const history = historySnap.docs.map((doc) => doc.data());
    return res.status(200).json({ history });
  } catch (err) {
    console.error('History fetch error:', err);
    return res.status(500).json({ error: 'Failed to load history' });
  }
}
