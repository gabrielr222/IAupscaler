import admin from 'firebase-admin';

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

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { db };

