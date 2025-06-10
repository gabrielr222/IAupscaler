import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!key) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY env var is not set');
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(key);
} catch (e) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY contains invalid JSON');
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore(app);

export { db };

