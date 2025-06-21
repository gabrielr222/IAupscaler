import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app;
let db;

if (!getApps().length) {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY_BASE64');
  }

  const decodedServiceAccount = JSON.parse(
    Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64,
      'base64'
    ).toString('utf8')
  );

  app = initializeApp({
    credential: cert(decodedServiceAccount),
  });

  db = getFirestore(app);
} else {
  db = getFirestore(); // Usa la app ya inicializada
}

export { db };
