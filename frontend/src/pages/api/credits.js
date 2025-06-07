import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

export default async function handler(req, res) {
  const { uid } = req.query;
  if (!uid) {
    return res.status(400).json({ error: 'Missing uid' });
  }

  try {
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(200).json({ credits: 0, freeUsesLeft: 0 });
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
