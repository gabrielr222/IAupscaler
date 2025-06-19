import { db } from '../../lib/firebaseAdmin';

export default async function handler(req, res) {
  try {
    const usersSnap = await db.collection('users').get();
    const logsSnap = await db.collection('logs').orderBy('timestamp', 'desc').limit(100).get();

    const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const logs = logsSnap.docs.map(doc => doc.data());

    res.status(200).json({ users, logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
}
