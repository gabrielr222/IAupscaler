// frontend/src/lib/firebaseAdmin.js
import admin from 'firebase-admin';

let serviceAccount;

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (e) {
  throw new Error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY: ' + e.message);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { admin, db };
