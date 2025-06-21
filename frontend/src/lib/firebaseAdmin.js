import admin from 'firebase-admin';

let serviceAccount;

try {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
  if (!base64) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE64');
  const decoded = Buffer.from(base64, 'base64').toString('utf-8');
  serviceAccount = JSON.parse(decoded);
} catch (e) {
  throw new Error(`❌ Failed to parse service account key: ${e.message}`);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };
