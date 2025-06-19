import { db } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
  try {
    const usersSnap = await db.collection('users').get();
    const logsSnap = await db.collection('logs').get();

    const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const logs = logsSnap.docs.map(doc => doc.data());

    res.status(200).json({ users, logs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load stats' });
  }
}
