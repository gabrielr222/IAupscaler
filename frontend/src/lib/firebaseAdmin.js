import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;

if (!base64) {
  throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE64');
}

const jsonStr = Buffer.from(base64, 'base64').toString('utf8');
const serviceAccount = JSON.parse(jsonStr);

const app = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0];

const db = getFirestore(app);

export { db };
