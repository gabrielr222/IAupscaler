import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

const app = initializeApp({
  credential: cert(serviceAccount),
});

export default async function handler(req, res) {
  const { uid } = req.query;
  try {
    const user = await getAuth(app).getUser(uid);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
