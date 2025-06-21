import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert } from 'firebase-admin/app';

let app;

try {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE64');
  }

  const decodedServiceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf8')
  );

  if (!getAuth().app) {
    app = initializeApp({
      credential: cert(decodedServiceAccount),
    });
  } else {
    app = getAuth().app;
  }
} catch (err) {
  console.error('Failed to initialize Firebase Admin:', err.message);
}

export default async function handler(req, res) {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: 'Missing uid parameter' });
  }

  try {
    const user = await getAuth(app).getUser(uid);
    res.status(200).json(user);
  } catch (err) {
    console.error('Error verifying user:', err.message);
    res.status(500).json({ error: err.message });
  }
}
